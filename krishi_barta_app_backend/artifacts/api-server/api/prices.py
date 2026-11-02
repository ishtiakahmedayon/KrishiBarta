"""
api/prices.py — Routes for vegetable / product price data (PostgreSQL).

Endpoints:
  GET   /api/prices              list all prices (optionally filter by category)
  GET   /api/prices/summary      summary stats, last update timestamp, and sources
  GET   /api/prices/categories   list all distinct categories
  GET   /api/prices/<name>       get a single price by name
  GET   /api/prices/<name>/history get historical price points for 7d/30d trend charts
  PATCH /api/prices/<name>       update a single price (protected)
  POST  /api/prices/bulk         bulk insert/update (protected)
  POST  /api/prices/upload-csv   upload CSV file or text with automatic Bengali parsing (protected)
  POST  /api/prices/sync-scraper trigger automated market bulletin scraper (protected)
"""

from flask import Blueprint, jsonify, request
from .db import get_db, close_db, require_api_key
from .ingestion import (
    parse_csv_price_data,
    sync_price_records_to_db,
    fetch_and_parse_market_prices,
    parse_bengali_price_string,
)

prices_bp = Blueprint("prices", __name__)
prices_bp.teardown_app_request(close_db)


def format_price_row(row):
    """
    Ensure `price` is cast to a Python float and format timestamps.
    Prevents `type 'String' is not a subtype of type 'num'` errors in Dart/Flutter.
    """
    if row is None:
        return None
    d = dict(row)
    if "price" in d and d["price"] is not None:
        try:
            d["price"] = float(d["price"])
        except (ValueError, TypeError):
            pass
    if "last_updated" in d and d["last_updated"] is not None:
        d["last_updated"] = d["last_updated"].isoformat()
    return d


@prices_bp.route("/api/prices", methods=["GET"])
def list_prices():
    """
    Returns all prices.
    Optional query param: ?category=সবজি to filter by category.
    """
    db = get_db()
    category = request.args.get("category")
    with db.cursor() as cur:
        if category:
            cur.execute(
                "SELECT * FROM prices WHERE category = %s ORDER BY name",
                (category,),
            )
        else:
            cur.execute("SELECT * FROM prices ORDER BY category, name")
        rows = cur.fetchall()
    return jsonify([format_price_row(r) for r in rows])


@prices_bp.route("/api/prices/summary", methods=["GET"])
def get_price_summary():
    """Returns overview statistics on current prices and last sync timestamp."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute("SELECT COUNT(*) AS total, MAX(last_updated) AS latest, MAX(source) AS primary_source FROM prices")
        row = cur.fetchone()
        cur.execute("SELECT category, COUNT(*) as count FROM prices GROUP BY category ORDER BY count DESC")
        cats = cur.fetchall()

    latest_time = row["latest"].isoformat() if row and row.get("latest") else None
    return jsonify({
        "total_crops": row["total"] if row else 0,
        "last_updated": latest_time,
        "primary_source": row.get("primary_source", "system") if row else "system",
        "categories": [dict(c) for c in cats],
    })


@prices_bp.route("/api/prices/categories", methods=["GET"])
def list_categories():
    """Returns the distinct list of price categories."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute("SELECT DISTINCT category FROM prices ORDER BY category")
        rows = cur.fetchall()
    return jsonify([r["category"] for r in rows])


@prices_bp.route("/api/prices/<path:name>/history", methods=["GET"])
def get_price_history(name):
    """
    Returns the historical price points for a specific crop (ordered chronologically ASC).
    Used by Flutter line charts to plot 7-day or 30-day trends.
    """
    db = get_db()
    limit = int(request.args.get("limit", 30))
    with db.cursor() as cur:
        cur.execute(
            """
            SELECT crop_name, price, recorded_date, source
            FROM price_history
            WHERE crop_name = %s
            ORDER BY recorded_date DESC
            LIMIT %s
            """,
            (name, limit),
        )
        rows = cur.fetchall()

    formatted = []
    for r in reversed(rows):  # reverse so oldest -> newest for chart
        formatted.append({
            "crop_name": r["crop_name"],
            "price": float(r["price"]),
            "date": r["recorded_date"].isoformat(),
            "source": r["source"],
        })

    return jsonify(formatted)


@prices_bp.route("/api/prices/<path:name>", methods=["GET"])
def get_price(name):
    """Get a single price entry by exact name."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute("SELECT * FROM prices WHERE name = %s", (name,))
        row = cur.fetchone()
    if row is None:
        return jsonify({"error": f"'{name}' নামে কোনো পণ্য পাওয়া যায়নি"}), 404
    return jsonify(format_price_row(row))


@prices_bp.route("/api/prices/<path:name>", methods=["PATCH"])
def update_price(name):
    """Update the price of a single item by name. Protected by API key."""
    err = require_api_key()
    if err:
        return err

    body = request.get_json(force=True, silent=True) or {}
    raw_price = body.get("price")
    if raw_price is None:
        return jsonify({"error": "'price' ফিল্ড প্রয়োজন"}), 400
    try:
        price = parse_bengali_price_string(raw_price)
    except (TypeError, ValueError) as e:
        return jsonify({"error": f"মূল্য সঠিক নয়: {e}"}), 400

    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            """
            UPDATE prices 
            SET price = %s, last_updated = NOW(), source = 'manual_patch' 
            WHERE name = %s
            """,
            (price, name),
        )
        if cur.rowcount == 0:
            return jsonify({"error": f"'{name}' নামে কোনো পণ্য পাওয়া যায়নি"}), 404

        # Record snapshot in history
        import datetime
        cur.execute(
            """
            INSERT INTO price_history (crop_name, price, recorded_date, source)
            VALUES (%s, %s, CURRENT_DATE, 'manual_patch')
            ON CONFLICT (crop_name, recorded_date) DO UPDATE SET
                price = EXCLUDED.price,
                source = EXCLUDED.source
            """,
            (name, price),
        )

    db.commit()
    return jsonify({"status": "ok", "name": name, "price": float(price)})


@prices_bp.route("/api/prices/upload-csv", methods=["POST"])
def upload_csv_prices():
    """
    Upload and apply price updates from a CSV file or raw CSV text payload.
    Supports Bengali & English column names. Protected by API key.
    """
    err = require_api_key()
    if err:
        return err

    csv_content = None

    # Check for multipart file upload
    if "file" in request.files:
        uploaded_file = request.files["file"]
        if uploaded_file.filename != "":
            csv_content = uploaded_file.read().decode("utf-8-sig", errors="replace")

    # Or check for raw text/json body
    if not csv_content:
        if request.is_json:
            json_body = request.get_json(silent=True) or {}
            csv_content = json_body.get("csv")
        else:
            csv_content = request.get_data(as_text=True)

    if not csv_content or not csv_content.strip():
        return jsonify({"error": "CSV ফাইল অথবা টেক্সট ডেটা পাওয়া যায়নি"}), 400

    try:
        items = parse_csv_price_data(csv_content)
    except Exception as e:
        return jsonify({"error": f"CSV পার্সিং ত্রুটি: {str(e)}"}), 400

    db = get_db()
    try:
        result = sync_price_records_to_db(db, items, source="csv_upload")
        return jsonify({
            "status": "ok",
            "message": f"সফলভাবে {result['count']} টি পণ্যের বাজারদর হালনাগাদ করা হয়েছে",
            "count": result["count"],
            "source": "csv_upload",
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"ডেটাবেস সংরক্ষণে সমস্যা: {str(e)}"}), 500


@prices_bp.route("/api/prices/sync-scraper", methods=["POST"])
def trigger_scraper_sync():
    """
    Triggers automated market bulletin ingestion from DAM / agricultural feeds.
    Protected by API key or Render Cron trigger.
    """
    err = require_api_key()
    if err:
        return err

    try:
        records, source_name = fetch_and_parse_market_prices()
    except Exception as e:
        return jsonify({"error": f"স্ক্র্যাপার চালাতে ত্রুটি: {str(e)}"}), 500

    db = get_db()
    try:
        result = sync_price_records_to_db(db, records, source=source_name)
        return jsonify({
            "status": "ok",
            "message": f"স্ক্র্যাপারের মাধ্যমে {result['count']} টি পণ্যের বাজারদর হালনাগাদ হয়েছে",
            "count": result["count"],
            "source": source_name,
            "recorded_date": result["recorded_date"],
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"স্ক্র্যাপার ডেটাবেস সিঙ্কে সমস্যা: {str(e)}"}), 500


@prices_bp.route("/api/prices/bulk", methods=["POST"])
def bulk_update_prices():
    """
    Bulk insert/update prices from JSON array of objects.
    Protected by API key.
    """
    err = require_api_key()
    if err:
        return err

    items = request.get_json(force=True, silent=True)
    if not isinstance(items, list):
        return jsonify({"error": "রিকোয়েস্ট বডি অবশ্যই JSON লিস্ট হতে হবে"}), 400

    # Clean and parse prices
    cleaned = []
    for item in items:
        if "name" not in item:
            continue
        try:
            item["price"] = parse_bengali_price_string(item.get("price", 0))
            cleaned.append(item)
        except Exception as e:
            return jsonify({"error": f"আইটেম '{item.get('name')}' প্রক্রিয়া করতে সমস্যা: {e}"}), 400

    db = get_db()
    try:
        result = sync_price_records_to_db(db, cleaned, source="bulk_json")
        return jsonify({"status": "ok", "count": result["count"]})
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"ডেটাবেস প্রক্রিয়ায় সমস্যা: {e}"}), 400
