"""
api/krishi_office.py — Routes for agricultural office (কৃষি অফিস) information (PostgreSQL).

Endpoints:
  GET  /api/krishi_offices              list all offices (optional ?district= filter)
  GET  /api/krishi_offices/districts    list distinct districts
  GET  /api/krishi_offices/<id>         get single office by ID
  POST /api/krishi_offices/bulk         bulk insert (protected)
"""

from flask import Blueprint, jsonify, request
from .db import get_db, close_db, require_api_key

krishi_office_bp = Blueprint("krishi_office", __name__)
krishi_office_bp.teardown_app_request(close_db)


@krishi_office_bp.route("/api/krishi_offices", methods=["GET"])
def list_offices():
    """
    Returns all krishi offices.
    Optional query param: ?district=ঢাকা to filter by district.
    """
    db = get_db()
    district = request.args.get("district")
    with db.cursor() as cur:
        if district:
            cur.execute(
                "SELECT * FROM krishi_offices WHERE district = %s ORDER BY name",
                (district,),
            )
        else:
            cur.execute("SELECT * FROM krishi_offices ORDER BY district, name")
        rows = cur.fetchall()
    return jsonify(rows)


@krishi_office_bp.route("/api/krishi_offices/districts", methods=["GET"])
def list_districts():
    """Returns the distinct list of district names."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute("SELECT DISTINCT district FROM krishi_offices ORDER BY district")
        rows = cur.fetchall()
    return jsonify([r["district"] for r in rows])


@krishi_office_bp.route("/api/krishi_offices/<int:office_id>", methods=["GET"])
def get_office(office_id):
    """Get a single office by its ID."""
    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            "SELECT * FROM krishi_offices WHERE id = %s",
            (office_id,),
        )
        row = cur.fetchone()
    if row is None:
        return jsonify({"error": f"ID {office_id} সহ কোনো অফিস পাওয়া যায়নি"}), 404
    return jsonify(row)


@krishi_office_bp.route("/api/krishi_offices/bulk", methods=["POST"])
def bulk_update_offices():
    """
    Bulk insert krishi offices. Body: JSON list of objects:
      [{"name": "...", "district": "...", "address": "...",
        "phone": "...", "services": "..."}, ...]
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
                    """INSERT INTO krishi_offices (name, district, address, phone, services)
                       VALUES (%(name)s, %(district)s, %(address)s, %(phone)s, %(services)s)""",
                    item,
                )
                updated += 1
            except Exception as e:
                db.rollback()
                return jsonify({"error": f"আইটেম প্রক্রিয়া করতে সমস্যা: {e}"}), 400
    db.commit()
    return jsonify({"status": "ok", "count": updated})
