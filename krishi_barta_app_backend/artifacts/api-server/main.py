"""
main.py — KrishiApp Flask API entry point.

Run locally:
    pip install -r requirements.txt
    export API_KEY="your-secret-key"
    python main.py

The server reads PORT from the environment (default 8080) so it works
seamlessly with Replit's managed workflow which injects PORT automatically.
"""

import os
import sys

# Ensure the project root is on the path so `api` package is importable
sys.path.insert(0, os.path.dirname(__file__))

from init_database import init_db
from api import create_app

# Initialise DB (no-op if already seeded)
init_db()

app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    print(f"🌱 KrishiApp API starting on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
