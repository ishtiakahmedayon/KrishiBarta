"""
api/pesticides.py — Routes for pesticide information (PostgreSQL).

Endpoints:
  GET  /api/pesticides           list all (optional ?crop= filter)
  GET  /api/pesticides/crops     list distinct crop names
  POST /api/pesticides/bulk      bulk insert/update (protected)
"""

from flask import Blueprint, jsonify, request
from .db import get_db, close_db, require_api_key

pesticides_bp = Blueprint("pesticides", __name__)
pesticides_bp.teardown_app_request(close_db)


@pesticides_bp.route("/api/pesticides", methods=["GET"])
def list_pesticides():
    """
    Returns all pesticide records.
    Optional query param: ?crop=ধান to filter by crop.
    """
    db = get_db()
    crop = request.args.get("crop")
    with db.cursor() as cur:
        if crop:
            cur.execute(
                "SELECT * FROM pesticides WHERE crop = %s ORDER BY pest",
                (crop,),
            )
        else:
            cur.execute("SELECT * FROM pesticides ORDER BY crop, pest")
        rows = cur.fetchall()
    return jsonify(rows)


@pesticides_bp.route("/api/pesticides/crops", methods=["GET"])
def list_crops():
    """Returns the distinct list of crop names."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute("SELECT DISTINCT crop FROM pesticides ORDER BY crop")
        rows = cur.fetchall()
    return jsonify([r["crop"] for r in rows])


@pesticides_bp.route("/api/pesticides/bulk", methods=["POST"])
def bulk_update_pesticides():
    """
    Bulk insert/update pesticide info. Body: JSON list of objects:
      [{"crop": "ধান", "pest": "...", "pesticide_name": "...",
        "dosage": "...", "precaution": "..."}, ...]
    Matched by (crop, pest).
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
                cur.execute(
                    """INSERT INTO pesticides (crop, pest, pesticide_name, dosage, precaution)
                       VALUES (%(crop)s, %(pest)s, %(pesticide_name)s, %(dosage)s, %(precaution)s)
                       ON CONFLICT (crop, pest) DO UPDATE SET
                         pesticide_name = EXCLUDED.pesticide_name,
                         dosage = EXCLUDED.dosage,
                         precaution = EXCLUDED.precaution""",
                    item,
                )
                updated += 1
            except Exception as e:
                db.rollback()
                return jsonify({"error": f"আইটেম প্রক্রিয়া করতে সমস্যা: {e}"}), 400
    db.commit()
    return jsonify({"status": "ok", "count": updated})
