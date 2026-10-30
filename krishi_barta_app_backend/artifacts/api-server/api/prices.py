"""
api/prices.py — Routes for vegetable / product price data (PostgreSQL).

Endpoints:
  GET   /api/prices              list all prices (optionally filter by category)
  GET   /api/prices/categories   list all distinct categories
  GET   /api/prices/<name>       get a single price by name
  PATCH /api/prices/<name>       update a single price (protected)
  POST  /api/prices/bulk         bulk insert/update (protected)
"""

from flask import Blueprint, jsonify, request
from .db import get_db, close_db, require_api_key

prices_bp = Blueprint("prices", __name__)
prices_bp.teardown_app_request(close_db)


def format_price_row(row):
    """
    Ensure `price` is cast to a Python float so Flask's jsonify serializes it
    as a JSON numeric (e.g. 30.0) instead of a JSON string (e.g. "30.00").
    This prevents `type 'String' is not a subtype of type 'num'` errors in Dart/Flutter.
    """
    if row is None:
        return None
    d = dict(row)
    if "price" in d and d["price"] is not None:
        try:
            d["price"] = float(d["price"])
        except (ValueError, TypeError):
            pass
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


@prices_bp.route("/api/prices/categories", methods=["GET"])
def list_categories():
    """Returns the distinct list of price categories."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute("SELECT DISTINCT category FROM prices ORDER BY category")
        rows = cur.fetchall()
    return jsonify([r["category"] for r in rows])


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
    price = body.get("price")
    if price is None:
        return jsonify({"error": "'price' ফিল্ড প্রয়োজন"}), 400
    try:
        price = float(price)
    except (TypeError, ValueError):
        return jsonify({"error": "'price' অবশ্যই সংখ্যা হতে হবে"}), 400

    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            "UPDATE prices SET price = %s WHERE name = %s",
            (price, name),
        )
        if cur.rowcount == 0:
            return jsonify({"error": f"'{name}' নামে কোনো পণ্য পাওয়া যায়নি"}), 404
    db.commit()
    return jsonify({"status": "ok", "name": name, "price": float(price)})


@prices_bp.route("/api/prices/bulk", methods=["POST"])
def bulk_update_prices():
    """
    Bulk insert/update prices. Body: JSON list of objects:
      [{"name": "আলু", "name_possessive": "আলুর", "price": 30.0,
        "unit": "টাকা/কেজি", "category": "সবজি"}, ...]
    Matched by unique `name`.
    """
    err = require_api_key()
    if err:
        return err

    items = request.get_json(force=True, silent=True)
    if not isinstance(items, list):
        return jsonify({"error": "রিকোয়েস্ট বডি অবশ্যই JSON লিস্ট হতে হবে"}), 400

    db = get_db()
    updated = 0
    with db.cursor() as cur:
        for item in items:
            try:
                # Ensure price is float
                if "price" in item and item["price"] is not None:
                    item["price"] = float(item["price"])

                cur.execute(
                    """INSERT INTO prices (name, name_possessive, price, unit, category)
                       VALUES (%(name)s, %(name_possessive)s, %(price)s, %(unit)s, %(category)s)
                       ON CONFLICT (name) DO UPDATE SET
                         name_possessive = EXCLUDED.name_possessive,
                         price = EXCLUDED.price,
                         unit = EXCLUDED.unit,
                         category = EXCLUDED.category""",
                    item,
                )
                updated += 1
            except Exception as e:
                db.rollback()
                return jsonify({"error": f"আইটেম প্রক্রিয়া করতে সমস্যা: {e}"}), 400
    db.commit()
    return jsonify({"status": "ok", "count": updated})
