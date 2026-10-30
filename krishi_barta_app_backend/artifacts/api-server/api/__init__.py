"""
api/__init__.py — Flask application factory.
Registers all blueprints and configures CORS & error handlers.
"""

import os
from flask import Flask, jsonify
from .prices import prices_bp
from .pesticides import pesticides_bp
from .krishi_office import krishi_office_bp


def create_app():
    app = Flask(__name__)

    # ------------------------------------------------------------------
    # CORS — allow Flutter web / mobile clients from any origin
    # ------------------------------------------------------------------
    @app.after_request
    def add_cors(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-API-KEY"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
        return response

    @app.route("/api/<path:_any>", methods=["OPTIONS"])
    def cors_preflight(_any):
        return "", 204

    # ------------------------------------------------------------------
    # Health check (no API key required)
    # ------------------------------------------------------------------
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "app": "KrishiApp API"})

    # ------------------------------------------------------------------
    # Register blueprints
    # ------------------------------------------------------------------
    app.register_blueprint(prices_bp)
    app.register_blueprint(pesticides_bp)
    app.register_blueprint(krishi_office_bp)

    # ------------------------------------------------------------------
    # Generic error handlers
    # ------------------------------------------------------------------
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "এই পথটি পাওয়া যায়নি"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "সার্ভারে সমস্যা হয়েছে"}), 500

    return app
