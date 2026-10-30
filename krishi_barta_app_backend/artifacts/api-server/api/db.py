"""
api/db.py — Shared PostgreSQL database connection helpers and connection pool.
Configured for Render-hosted PostgreSQL using DATABASE_URL.
"""

import os
from flask import g
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor

_pool = None

# Automatically cast PostgreSQL NUMERIC/DECIMAL (OID 1700) to Python float
# This ensures prices are serialized as JSON numbers (30.0) instead of JSON strings ("30.00")
try:
    import psycopg2.extensions
    DEC2FLOAT = psycopg2.extensions.new_type(
        psycopg2.extensions.DECIMAL.values,
        'DEC2FLOAT',
        lambda val, cur: float(val) if val is not None else None
    )
    psycopg2.extensions.register_type(DEC2FLOAT)
except Exception:
    pass


def normalize_database_url(url: str) -> str:
    """Normalize legacy postgres:// prefix from Render to postgresql://."""
    if not url:
        return "postgresql://postgres:postgres@localhost:5432/krishiapp"
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def get_pool():
    """Lazily initialize the ThreadedConnectionPool."""
    global _pool
    if _pool is None:
        db_url = normalize_database_url(os.environ.get("DATABASE_URL", ""))
        # ThreadedConnectionPool maintains persistent connections across Gunicorn threads
        _pool = ThreadedConnectionPool(
            minconn=1,
            maxconn=int(os.environ.get("DB_MAX_CONNECTIONS", 10)),
            dsn=db_url,
            cursor_factory=RealDictCursor,
        )
    return _pool


def get_db():
    """Return a per-request PostgreSQL connection from the pool, stored on Flask's `g`."""
    if "db" not in g:
        g.db = get_pool().getconn()
    return g.db


def close_db(exception=None):
    """Return the per-request connection back to the connection pool."""
    db = g.pop("db", None)
    if db is not None and _pool is not None:
        try:
            # If an unhandled exception occurred, rollback the transaction
            if exception:
                db.rollback()
        finally:
            _pool.putconn(db)


def require_api_key():
    """
    Validate the X-API-KEY header against the API_KEY env variable.
    Returns a Flask error response tuple if invalid, or None if OK.
    """
    from flask import request, jsonify
    expected = os.environ.get("API_KEY", "changeme-dev-key")
    provided = request.headers.get("X-API-KEY", "")
    if provided != expected:
        return jsonify({"error": "অবৈধ API কী"}), 401
    return None
