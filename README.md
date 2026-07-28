# কৃষিঅ্যাপ — Complete Beginner's Guide
## How to Build a Flutter App + Flask REST API from Scratch

**By an experienced software developer & teacher**

---

> **Who this is for:** Someone who knows basic programming but has never built a mobile app or web API. By the end of this guide you will understand every single line of both projects — and know how to build something like this yourself from zero.

---

## TABLE OF CONTENTS

1. [The Big Picture — What Are We Building?](#1-the-big-picture)
2. [Core Concepts You Must Understand First](#2-core-concepts)
3. [How the Two Projects Talk to Each Other](#3-how-they-communicate)
4. [THE BACKEND — Flask API Deep Dive](#4-the-backend)
   - 4.1 `requirements.txt`
   - 4.2 `init_database.py`
   - 4.3 `api/db.py`
   - 4.4 `api/__init__.py`
   - 4.5 `api/prices.py`
   - 4.6 `api/pesticides.py`
   - 4.7 `api/krishi_office.py`
   - 4.8 `main.py`
5. [THE FLUTTER APP — Dart Deep Dive](#5-the-flutter-app)
   - 5.1 `pubspec.yaml`
   - 5.2 `lib/config.dart`
   - 5.3 `lib/main.dart`
   - 5.4 Models
   - 5.5 `lib/services/api_service.dart`
   - 5.6 `lib/utils/bangla_numbers.dart`
   - 5.7 Widgets
   - 5.8 Screens
6. [Build It From Scratch — Step by Step](#6-build-from-scratch)
7. [Mini Projects to Master Each Concept](#7-mini-projects)
8. [Common Mistakes and How to Avoid Them](#8-common-mistakes)

---

# 1. THE BIG PICTURE

## What Are We Building?

Imagine a smartphone app for a farmer in Bangladesh. They open the app and:
- See today's vegetable prices in Bangla
- Check the weather in their district
- Find which pesticide to use for their crop
- Find the phone number of their local agricultural office

This app has **two separate programs** working together:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   FLUTTER APP (runs on phone/tablet)                │
│   - Shows UI (screens, buttons, lists)             │
│   - Asks the backend for data                      │
│   - Displays the response                          │
│                                                     │
│   ──────── asks for data ────────►                 │
│   ◄─────── sends data back ───────                 │
│                                                     │
│   FLASK API (runs on a server / your laptop)       │
│   - Stores data in a database                      │
│   - Listens for requests from the app              │
│   - Returns data as JSON                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Analogy:** Think of it like a restaurant.
- The Flutter app is the **customer** (places orders, sees food).
- The Flask API is the **kitchen** (receives orders, prepares food, sends it back).
- The database is the **pantry** (stores all the ingredients/data).
- HTTP requests are the **waiter** (carries messages back and forth).

---

# 2. CORE CONCEPTS

Before reading any code, you need to understand these 8 concepts.

---

## Concept 1: What is an API?

API stands for **Application Programming Interface**. It is a way for two programs to talk to each other over the internet.

**Real-life analogy:** When you use a weather app, it doesn't store weather data itself. It *asks* a weather service (like Open-Meteo) for the data. That weather service is an API.

Our Flask backend IS an API. It sits on a server and waits for the Flutter app to ask it questions like:
- "Give me all vegetable prices"
- "Update the price of tomatoes"

---

## Concept 2: HTTP and REST

**HTTP** (HyperText Transfer Protocol) is the language used to send messages over the internet.

Every message has:
- A **method** (what you want to do)
- A **URL** (address of the resource)
- **Headers** (extra info, like a password)
- A **body** (optional data you are sending)

The four most important HTTP methods:

| Method | Meaning | Real-life equivalent |
|--------|---------|---------------------|
| GET | "Give me data" | Looking at a menu |
| POST | "Create new data" | Placing an order |
| PATCH | "Update existing data" | Asking to change your order |
| DELETE | "Remove data" | Cancelling your order |

**REST** is a design style for APIs that uses HTTP methods properly. Our Flask API is a REST API.

---

## Concept 3: JSON

JSON (JavaScript Object Notation) is the format used to send data between the app and the server. It is just text that looks like a Python dictionary.

```json
{
  "name": "আলু",
  "price": 30.0,
  "unit": "টাকা/কেজি",
  "category": "সবজি"
}
```

Both the app and the server know how to read and write JSON. The server *encodes* data into JSON before sending. The app *decodes* JSON back into usable objects.

---

## Concept 4: Databases and SQL

A **database** is where you store data permanently. We use **SQLite** — a simple database that saves everything into a single file (`krishiapp.db`).

You talk to a database using **SQL** (Structured Query Language).

```sql
-- Create a table (like creating a spreadsheet)
CREATE TABLE prices (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

-- Insert a row
INSERT INTO prices (name, price) VALUES ('আলু', 30.0);

-- Read all rows
SELECT * FROM prices;

-- Update a row
UPDATE prices SET price = 35.0 WHERE name = 'আলু';
```

Think of a database table as a spreadsheet:
- Each **column** is a field (name, price, unit)
- Each **row** is one record (one vegetable)

---

## Concept 5: Python and Flask

**Python** is a programming language. Easy to read, widely used.

**Flask** is a Python *library* (a collection of pre-written code) that helps you build APIs. It handles all the boring HTTP stuff so you can focus on your logic.

Minimal Flask example:
```python
from flask import Flask, jsonify

app = Flask(__name__)           # Create the app

@app.route('/hello')            # "When someone visits /hello..."
def say_hello():                # "...run this function"
    return jsonify({"message": "Hello!"})  # Return JSON

app.run(port=5000)              # Start listening on port 5000
```

That's it. Flask lets you build an entire API with very little code.

---

## Concept 6: Flutter and Dart

**Flutter** is Google's toolkit for building mobile apps (Android + iOS) from one codebase.

**Dart** is the programming language Flutter uses. It looks similar to Java or JavaScript.

Flutter builds your UI from **widgets** — small reusable pieces of UI. Everything is a widget. A button is a widget. A text label is a widget. The entire screen is a widget.

```dart
Text("Hello World")                 // A text widget
Icon(Icons.home)                    // An icon widget
ElevatedButton(                     // A button widget
  onPressed: () { print("Clicked!"); },
  child: Text("Click Me"),
)
```

Widgets are *nested* (placed inside each other) to build complex UIs:
```dart
Column(                             // Arrange children vertically
  children: [
    Text("Title"),
    Text("Subtitle"),
    ElevatedButton(...),
  ],
)
```

---

## Concept 7: Async/Await (Asynchronous Programming)

When the app asks the server for data, it takes time (network delay). We don't want the whole app to freeze while waiting. This is where **async/await** comes in.

**Synchronous** (bad for network calls):
```
App asks server → App FREEZES → Server responds → App continues
```

**Asynchronous** (good):
```
App asks server → App stays responsive → Server responds → App updates
```

In Dart:
```dart
// The 'async' keyword means "this function can pause and wait"
Future<void> loadData() async {
  // 'await' means "pause here until the server responds, but don't freeze the app"
  final data = await ApiService.instance.getAllPrices();
  setState(() {
    _prices = data;  // Update the UI when data arrives
  });
}
```

In Python (Flask handles this for you automatically).

---

## Concept 8: State Management in Flutter

**State** is any data that can change and should update the UI.

Example: When you type in a search box, the list below should filter. The "current search text" is *state*.

In Flutter, a `StatefulWidget` holds state. When you call `setState()`, Flutter redraws the relevant parts of the UI.

```dart
class MyScreen extends StatefulWidget { ... }

class _MyScreenState extends State<MyScreen> {
  String _searchText = "";    // This is STATE

  void _onSearch(String text) {
    setState(() {              // Tell Flutter: "something changed, redraw"
      _searchText = text;
    });
  }
}
```

---

# 3. HOW THEY COMMUNICATE

Here is the exact journey of one request — "Give me all vegetable prices":

```
Step 1: Flutter app calls ApiService.instance.getAllPrices()

Step 2: ApiService builds an HTTP GET request:
        URL: http://10.0.2.2/api/prices
        Header: X-API-KEY: changeme-dev-key

Step 3: The request travels over the network to the Flask server

Step 4: Flask receives it, matches the URL to the list_prices() function

Step 5: Flask queries SQLite: SELECT * FROM prices ORDER BY category, name

Step 6: SQLite returns 33 rows

Step 7: Flask converts rows to JSON and sends back:
        [{"id":1, "name":"আলু", "price":30.0, ...}, ...]

Step 8: Flutter receives the JSON, decodes it into List<PriceItem>

Step 9: Flutter calls setState() to update the UI

Step 10: The user sees the list on screen
```

---

# 4. THE BACKEND — FLASK API DEEP DIVE

## File Structure

```
artifacts/api-server/
├── main.py              ← Entry point. Start here.
├── init_database.py     ← Creates tables and seeds initial data
├── requirements.txt     ← List of Python libraries needed
└── api/
    ├── __init__.py      ← Creates the Flask app, registers blueprints
    ├── db.py            ← Shared database connection helpers
    ├── prices.py        ← /api/prices routes
    ├── pesticides.py    ← /api/pesticides routes
    └── krishi_office.py ← /api/krishi_offices routes
```

---

## 4.1 `requirements.txt`

```
Flask==3.0.3
gunicorn==22.0.0
```

**What this file does:** Lists the Python libraries your project needs. When someone downloads your project, they run `pip install -r requirements.txt` to install everything automatically.

**Flask==3.0.3** — The web framework. The `==3.0.3` pins the exact version so the project always uses the same version everywhere.

**gunicorn==22.0.0** — A production-grade web server. Flask's built-in server is only for development. For real deployments (like on Render or Railway), you use gunicorn to run the app.

**Teaching concept:** Dependency management. Every real project lists its dependencies. In Python: `requirements.txt`. In Node.js: `package.json`. In Flutter: `pubspec.yaml`.

---

## 4.2 `init_database.py` — Line by Line

```python
import os
import sqlite3
```
**`import`** brings in Python libraries.
- `os` — interact with the operating system (file paths, environment variables)
- `sqlite3` — Python's built-in library for SQLite databases. No installation needed.

```python
DB_PATH = os.path.join(os.path.dirname(__file__), "krishiapp.db")
```
- `__file__` — the path of the current Python file (`init_database.py`)
- `os.path.dirname(__file__)` — the folder that contains this file
- `os.path.join(...)` — joins folder path + filename into a complete path
- **Result:** The database file will be created in the same folder as `init_database.py`

**Why use `os.path.join` instead of just `"krishiapp.db"`?** Because the script might be run from a different folder. Relative paths break. Absolute paths built from `__file__` always work.

```python
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
```
- `sqlite3.connect(DB_PATH)` — opens the database file (creates it if it doesn't exist)
- `conn.row_factory = sqlite3.Row` — makes each database row behave like a dictionary. Without this, rows are just tuples. With this, you can do `row["name"]` instead of `row[0]`
- **This function is only used in `init_database.py`**, not in the Flask routes (they use a different connection from `api/db.py`)

```python
def init_db():
    conn = get_connection()
    cursor = conn.cursor()
```
- `conn.cursor()` — a cursor is what you use to run SQL queries. Think of it as a pen you use to write to the database.

```python
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            name_possessive TEXT NOT NULL,
            price REAL NOT NULL,
            unit TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'সবজি'
        )
        """
    )
```
This creates the `prices` table. Let's break down each column:
- `id INTEGER PRIMARY KEY AUTOINCREMENT` — unique number for each row, auto-increments (1, 2, 3...)
- `name TEXT NOT NULL UNIQUE` — the vegetable name. `NOT NULL` means it can't be empty. `UNIQUE` means no two rows can have the same name.
- `name_possessive TEXT NOT NULL` — Bangla possessive form (আলু → আলুর). Used to build natural sentences like "আলুর দাম ৩০ টাকা"
- `price REAL NOT NULL` — a decimal number (`REAL` in SQLite = float in Python)
- `unit TEXT NOT NULL` — e.g., "টাকা/কেজি"
- `category TEXT NOT NULL DEFAULT 'সবজি'` — if no category is given, default to 'সবজি'

**`IF NOT EXISTS`** — only creates the table if it doesn't already exist. Safe to run multiple times without destroying data.

```python
    if cursor.execute("SELECT COUNT(*) FROM prices").fetchone()[0] == 0:
```
- `SELECT COUNT(*) FROM prices` — counts how many rows are in the table
- `.fetchone()` — gets the first (and only) result row
- `[0]` — gets the first column value (the count)
- **Only seed data if the table is empty** — prevents overwriting real data every time you restart

```python
        prices = [
            ("আলু", "আলুর", 30.0, "টাকা/কেজি", "সবজি"),
            ...
        ]
        cursor.executemany(
            "INSERT INTO prices (name, name_possessive, price, unit, category) VALUES (?, ?, ?, ?, ?)",
            prices,
        )
```
- `executemany` — runs the same SQL statement multiple times with different values. Much faster than a loop of `execute()`.
- The `?` marks are **placeholders**. SQLite replaces them with the actual values from the tuple. This is called **parameterized queries** and is crucial for security (prevents SQL injection attacks).

**Never do this (SQL injection risk):**
```python
cursor.execute(f"INSERT INTO prices VALUES ('{name}', {price})")  # DANGEROUS!
```
**Always do this:**
```python
cursor.execute("INSERT INTO prices VALUES (?, ?)", (name, price))  # SAFE
```

```python
    conn.commit()
    conn.close()
    print(f"✅ Database initialized at: {DB_PATH}")
```
- `conn.commit()` — saves all changes permanently. Without this, changes are lost when the program exits.
- `conn.close()` — releases the database file. Good practice to always close connections.
- `f"..."` — an f-string: `{DB_PATH}` is replaced with the actual value at runtime.

```python
if __name__ == "__main__":
    init_db()
```
- This block only runs when you execute the file directly (`python init_database.py`)
- When other files `import` from this module, this block is skipped
- **Why?** Because importing a module shouldn't trigger side effects. Only explicit execution should.

---

## 4.3 `api/db.py` — Shared Database Helpers

```python
import os
import sqlite3
from flask import g
```
- `from flask import g` — `g` is Flask's **request context**. It's a special object that exists for one HTTP request and is thrown away after. Perfect for storing the database connection per-request.

```python
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "krishiapp.db")
```
- `".."` means "go up one folder". Since `db.py` is inside `api/`, we go up to the parent folder where `krishiapp.db` lives.

```python
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db
```
**Pattern: Connection per request.**
- The first time a route calls `get_db()`, it opens a connection and stores it in `g`.
- Subsequent calls in the same request return the same connection (don't open a new one).
- This is efficient. Opening a new connection for every query would be slow.

```python
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()
```
- `g.pop("db", None)` — removes `db` from `g` and returns it (or `None` if it wasn't there)
- This is called at the end of every request (see `teardown_app_request` below) to ensure connections are always closed, even if an error occurred.

```python
def require_api_key():
    from flask import request, jsonify
    expected = os.environ.get("API_KEY", "changeme-dev-key")
    provided = request.headers.get("X-API-KEY", "")
    if provided != expected:
        return jsonify({"error": "অবৈধ API কী"}), 401
    return None
```
- `os.environ.get("API_KEY", "changeme-dev-key")` — reads the `API_KEY` environment variable. If not set, defaults to the dev key. **In production, always set this to a random secret.**
- `request.headers.get("X-API-KEY", "")` — reads the `X-API-KEY` header from the incoming request
- Returns a 401 Unauthorized response if keys don't match, or `None` if they do
- **401** is the HTTP status code for "not authenticated" — like being told "wrong password"

**Why protect write endpoints?** Anyone can read prices, but only the admin should be able to update them. The API key is a simple password for the entire admin API.

---

## 4.4 `api/__init__.py` — The Application Factory

```python
from flask import Flask, jsonify
from .prices import prices_bp
from .pesticides import pesticides_bp
from .krishi_office import krishi_office_bp
```
- `from .prices import prices_bp` — the `.` means "from the same package" (the `api/` folder). This imports the Blueprint object from `prices.py`.

**What is a Blueprint?** A Blueprint is a collection of routes that you can register on a Flask app. Think of it as a "section" of your API. Instead of putting all 20 routes in one file, you split them into logical groups.

```python
def create_app():
    app = Flask(__name__)
```
- `Flask(__name__)` — creates the Flask application. `__name__` tells Flask the name of the current module, which it uses internally for config lookups.
- **Application Factory Pattern:** Instead of `app = Flask(__name__)` at the top level of a file, we wrap it in `create_app()`. Why? Testing: you can create a fresh app for each test. Configuration: you can pass different configs (dev, production, test) to the factory.

```python
    @app.after_request
    def add_cors(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-API-KEY"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
        return response
```
**CORS (Cross-Origin Resource Sharing):** Browsers have a security rule: a webpage from `https://myapp.com` cannot make API calls to `https://other-domain.com` unless the server explicitly allows it. This is to prevent malicious websites from stealing your data.

Adding these headers tells the browser: "It's OK, allow requests from any origin (`*`)."

For our Flutter mobile app (not a browser), CORS doesn't matter. But when running `flutter run -d chrome`, it does.

```python
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "app": "KrishiApp API"})
```
A health check endpoint. No API key required. Used by:
- Load balancers to check if the server is alive
- Developers to quickly test if the server is running (`curl http://localhost/api/health`)
- Monitoring tools

```python
    app.register_blueprint(prices_bp)
    app.register_blueprint(pesticides_bp)
    app.register_blueprint(krishi_office_bp)
```
Attaches each Blueprint's routes to the main app. After this, Flask knows about all the routes defined in those files.

---

## 4.5 `api/prices.py` — Price Routes

```python
from flask import Blueprint, jsonify, request
from .db import get_db, close_db, require_api_key

prices_bp = Blueprint("prices", __name__)
prices_bp.teardown_app_request(close_db)
```
- `Blueprint("prices", __name__)` — creates a Blueprint named "prices"
- `teardown_app_request(close_db)` — registers `close_db` to run after every request that goes through this blueprint, ensuring the database connection is always closed

```python
@prices_bp.route("/api/prices", methods=["GET"])
def list_prices():
    db = get_db()
    category = request.args.get("category")
```
- `@prices_bp.route(...)` — the `@` symbol is a **decorator**. It wraps the function below with extra behavior (in this case, registering it as a URL handler).
- `methods=["GET"]` — only respond to GET requests. If someone sends a POST to this URL, they get a 405 Method Not Allowed error.
- `request.args.get("category")` — reads a query parameter from the URL. For `GET /api/prices?category=সবজি`, this returns `"সবজি"`. For `GET /api/prices`, this returns `None`.

```python
    if category:
        rows = db.execute(
            "SELECT * FROM prices WHERE category = ? ORDER BY name", (category,)
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM prices ORDER BY category, name"
        ).fetchall()
    return jsonify([dict(r) for r in rows])
```
- `db.execute(...).fetchall()` — runs the SQL query and gets all result rows
- `[dict(r) for r in rows]` — **list comprehension**: converts every `sqlite3.Row` object into a plain Python dictionary. This is needed because `jsonify` can serialize dictionaries but not `sqlite3.Row` objects.

**The `(category,)` syntax:** Note the trailing comma. In Python, `(category)` is just `category` in parentheses. `(category,)` is a **tuple** with one element. SQLite's `?` replacement expects a tuple.

```python
@prices_bp.route("/api/prices/<path:name>", methods=["PATCH"])
def update_price(name):
    err = require_api_key()
    if err:
        return err
```
- `<path:name>` — a URL parameter. For `/api/prices/আলু`, Flask captures `"আলু"` and passes it as `name` to the function.
- `path:` converter allows slashes in the value (needed for names with special characters)
- The function first checks the API key. If `require_api_key()` returns anything (a response), we immediately return that error response.

```python
    body = request.get_json(force=True, silent=True) or {}
    price = body.get("price")
    if price is None:
        return jsonify({"error": "'price' ফিল্ড প্রয়োজন"}), 400
```
- `request.get_json(force=True, silent=True)` — parses the request body as JSON. `force=True` parses even if Content-Type header is wrong. `silent=True` returns `None` instead of raising an error if JSON is malformed.
- `or {}` — if `get_json` returns `None`, use an empty dictionary instead
- **400** is the HTTP status code for "bad request" — the client sent something invalid

```python
    result = db.execute(
        "UPDATE prices SET price = ? WHERE name = ?", (price, name)
    )
    if result.rowcount == 0:
        return jsonify({"error": f"'{name}' নামে কোনো পণ্য পাওয়া যায়নি"}), 404
    db.commit()
    return jsonify({"status": "ok", "name": name, "price": price})
```
- `result.rowcount` — how many rows were affected by the UPDATE. If 0, the name didn't exist.
- **404** = "Not Found". The resource they asked for doesn't exist.
- `db.commit()` — write-operations (INSERT, UPDATE, DELETE) must be committed. Reads (SELECT) don't need commits.

```python
@prices_bp.route("/api/prices/bulk", methods=["POST"])
def bulk_update_prices():
    ...
    for item in items:
        db.execute(
            """INSERT INTO prices (name, name_possessive, price, unit, category)
               VALUES (:name, :name_possessive, :price, :unit, :category)
               ON CONFLICT(name) DO UPDATE SET
                 price = excluded.price, ...""",
            item,
        )
```
**`ON CONFLICT ... DO UPDATE`** — This is an "upsert" (update + insert). If a row with this `name` already exists, update it. If not, insert it. This lets one endpoint handle both "add new item" and "update existing item."

`:name` syntax — named placeholders. Instead of positional `?`, you use column names. The `item` dictionary's keys match the placeholder names. More readable for complex queries.

---

## 4.6 `api/pesticides.py` — Pesticide Routes

The structure is identical to `prices.py`. Key difference: filtering by `crop` instead of `category`, and the unique constraint is `(crop, pest)` — a combination of two columns.

```python
@pesticides_bp.route("/api/pesticides/crops", methods=["GET"])
def list_crops():
    db = get_db()
    rows = db.execute(
        "SELECT DISTINCT crop FROM pesticides ORDER BY crop"
    ).fetchall()
    return jsonify([r["crop"] for r in rows])
```
- `SELECT DISTINCT crop` — returns only unique values. If "ধান" appears 5 times (for 5 pests), it's returned only once.
- `[r["crop"] for r in rows]` — a list comprehension that extracts just the crop string from each row (not the full dict)

---

## 4.7 `api/krishi_office.py` — Office Routes

Same structure. The `services` column stores multiple services as a single comma-separated string:
```
"ফসল উৎপাদন পরামর্শ, কৃষি প্রযুক্তি সহায়তা, বীজ বিতরণ"
```
The Flutter app later splits this by comma to display as a bullet list. A more advanced database design would use a separate `services` table, but for a small app, a comma-separated string is simpler.

---

## 4.8 `main.py` — Entry Point

```python
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
```
- `sys.path` is the list of folders Python searches when you `import` something
- We insert the `api-server/` folder at position 0 (highest priority) so `import init_database` and `from api import create_app` find their files

```python
from init_database import init_db
from api import create_app

init_db()
app = create_app()
```
- `init_db()` — creates and seeds the database if needed. Safe to call every time.
- `create_app()` — returns the configured Flask app

```python
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
```
- `PORT` — Replit injects this env variable. Our server reads it so it uses the right port. Default: 8080.
- `host="0.0.0.0"` — listen on all network interfaces (not just localhost). Required for Replit and Docker deployments. Without this, only the same machine could connect.
- `debug=True` — in development, auto-reloads the server when you change a file. **Never use in production!**

---

# 5. THE FLUTTER APP — DART DEEP DIVE

## File Structure

```
krishiapp/
├── pubspec.yaml                  ← Dependencies and metadata
└── lib/
    ├── main.dart                 ← App entry point
    ├── config.dart               ← API URL and key
    ├── models/
    │   ├── price_item.dart       ← PriceItem data class
    │   ├── pesticide_item.dart   ← PesticideItem data class
    │   └── krishi_office.dart    ← KrishiOffice data class
    ├── services/
    │   └── api_service.dart      ← All HTTP calls
    ├── utils/
    │   └── bangla_numbers.dart   ← Number formatting
    ├── widgets/
    │   ├── error_view.dart       ← Reusable error widget
    │   └── section_header.dart   ← Reusable header widget
    └── screens/
        ├── home_screen.dart      ← Main shell (4 tabs + drawer)
        ├── price_screen.dart     ← Tab 1: সবজির দাম
        ├── weather_screen.dart   ← Tab 2: আবহাওয়া
        ├── pesticide_screen.dart ← Tab 3: কীটনাশক তথ্য
        └── krishi_office_screen.dart ← Tab 4: কৃষি অফিস
```

---

## 5.1 `pubspec.yaml` — Project Config

```yaml
name: krishiapp
description: "কৃষিঅ্যাপ - ..."
publish_to: 'none'
version: 1.0.0+1
```
- `name` — the package name used internally
- `version: 1.0.0+1` — version `1.0.0`, build number `1`. The `+1` is the Android/iOS build number.

```yaml
environment:
  sdk: '>=3.0.0 <4.0.0'
```
The Dart SDK version range. `>=3.0.0 <4.0.0` means "any Dart 3.x version."

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.2
  cupertino_icons: ^1.0.8
```
- `http: ^1.2.2` — the HTTP library for making network requests. The `^` means "version 1.2.2 or higher, but less than 2.0.0" (compatible versions only).
- `cupertino_icons` — Apple-style icons (used by some Material widgets for iOS)

---

## 5.2 `lib/config.dart`

```dart
class AppConfig {
  static const String apiBaseUrl = 'http://10.0.2.2/api';
  static const String apiKey = 'changeme-dev-key';
}
```
- `static` — belongs to the class itself, not an instance. Access as `AppConfig.apiBaseUrl`, not `AppConfig().apiBaseUrl`.
- `const` — a compile-time constant. The value never changes while the app runs.
- **Why a separate config file?** You only need to change one file when switching between dev/production environments.

**`10.0.2.2`** — Android emulator's special IP address that points to your computer's localhost. The emulator is a virtual machine; it can't reach `localhost` (that's itself). `10.0.2.2` is the gateway back to your host machine.

---

## 5.3 `lib/main.dart` — Entry Point

```dart
void main() {
  runApp(const KrishiApp());
}
```
- `main()` — every Dart program starts here. Exactly like `main()` in C or Java.
- `runApp()` — Flutter's function that takes your root widget and starts the app.
- `const` — the widget can be created at compile time (optimization). Use `const` whenever you can.

```dart
class KrishiApp extends StatelessWidget {
  const KrishiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp( ... );
  }
}
```
- `StatelessWidget` — a widget with no mutable state. `KrishiApp` never changes; it just configures the app.
- `{super.key}` — passes a `key` parameter to the parent class. Keys help Flutter identify widgets when they move in the tree.
- `@override` — tells the compiler you're intentionally replacing the parent class's method.
- `build(BuildContext context)` — returns the widget tree for this widget. Called every time Flutter needs to draw this widget.

```dart
    return MaterialApp(
      title: 'কৃষিঅ্যাপ',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF2E7D32),
```
- `MaterialApp` — sets up Material Design scaffolding (navigation, themes, etc.)
- `debugShowCheckedModeBanner: false` — removes the red "DEBUG" banner in the top-right corner
- `colorSchemeSeed: Color(0xFF2E7D32)` — generates the entire color scheme from one seed color (deep green). `0xFF` = fully opaque, `2E7D32` = hex color code for dark green.

---

## 5.4 Models — Data Classes

Models are simple Dart classes that represent a single piece of data. They exist to replace raw `Map<String, dynamic>` (dictionary) with typed objects.

### Why Use Models?

**Without model:**
```dart
final price = priceData["price"];  // Could be anything, no autocompletion
```

**With model:**
```dart
final price = priceItem.price;     // Guaranteed to be a double, autocomplete works
```

### `lib/models/price_item.dart`

```dart
class PriceItem {
  final int id;
  final String name;
  final String namePossessive;
  final double price;
  final String unit;
  final String category;
```
- `final` — the field can only be set in the constructor and never changed afterwards (immutable). This is a best practice: data objects shouldn't change after creation.

```dart
  PriceItem({
    required this.id,
    required this.name,
    ...
  });
```
- **Named constructor parameters** with `{}`: `PriceItem(id: 1, name: "আলু", ...)`
- `required` — you must provide this argument. If you forget, Dart shows a compile error.

```dart
  factory PriceItem.fromJson(Map<String, dynamic> json) {
    return PriceItem(
      id: json['id'] as int,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      ...
    );
  }
```
- `factory` constructor — a special constructor that can return an already-existing instance or do complex construction logic
- `Map<String, dynamic>` — a dictionary where keys are strings and values can be anything (the JSON from the API)
- `as int` — type casting: tells Dart "I know this value is an int, treat it as one"
- `(json['price'] as num).toDouble()` — JSON numbers might come as int or double. Cast to `num` (parent of both) then call `.toDouble()` to always get a double.

---

## 5.5 `lib/services/api_service.dart` — All HTTP Calls

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
```
- `dart:convert` — built-in Dart library for encoding/decoding JSON
- `package:http/http.dart` — the HTTP library from `pubspec.yaml`. `as http` gives it an alias so we call `http.get(...)` instead of just `get(...)`.
- `../config.dart` — relative import. `..` means "go up one folder"

```dart
class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();
```
**Singleton Pattern:** Only one `ApiService` object ever exists. Why?
- Saves memory
- Consistent behavior throughout the app
- `ApiService._()` — a **private constructor** (the `_` prefix makes it private). No one outside can call `ApiService()`.
- `static final ApiService instance = ApiService._()` — the one and only instance, created when the class is first accessed.

Usage: `ApiService.instance.getAllPrices()` — you never create `new ApiService()`.

```dart
  Map<String, String> get _headers => {
        'X-API-KEY': AppConfig.apiKey,
        'Content-Type': 'application/json',
      };
```
- `get _headers` — a **getter**: looks like a property but executes code when accessed
- The `_` prefix makes it private (only usable within this file)
- `Map<String, String>` — a dictionary where both keys and values are Strings
- Returns a new map every time (so changes don't persist)

```dart
  Future<List<PriceItem>> getAllPrices({String? category}) async {
```
- `Future<List<PriceItem>>` — this function will eventually return a `List<PriceItem>`. The `Future` wraps it because the operation is asynchronous (takes time).
- `{String? category}` — optional named parameter. `String?` means it can be null (the `?` means nullable).
- `async` — marks this function as asynchronous. Allows using `await` inside.

```dart
    final uri = category != null
        ? Uri.parse('${AppConfig.apiBaseUrl}/prices?category=${Uri.encodeComponent(category)}')
        : Uri.parse('${AppConfig.apiBaseUrl}/prices');
```
- **Ternary operator**: `condition ? valueIfTrue : valueIfFalse`
- `Uri.parse(...)` — creates a `Uri` object from a string. Flutter's HTTP library requires `Uri` objects, not raw strings.
- `Uri.encodeComponent(category)` — URL-encodes the category (e.g., "সবজি" becomes "%E0%A6%B8%E0%A6%AC%E0%A6%9C%E0%A6%BF"). Necessary because URLs can only contain certain characters.

```dart
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.map((e) => PriceItem.fromJson(e as Map<String, dynamic>)).toList();
```
- `await http.get(...)` — sends the GET request and *waits* for the response. The `await` keyword pauses this function but doesn't block the UI.
- `_checkOk(res)` — throws an exception if the status code is not 2xx
- `utf8.decode(res.bodyBytes)` — decodes the response bytes as UTF-8. **Important for Bangla text!** If you used `res.body` directly, it might misinterpret the Bengali characters.
- `jsonDecode(...)` — converts JSON string to Dart objects (List, Map, String, int, etc.)
- `.map((e) => PriceItem.fromJson(...)).toList()` — transforms each item in the list from a `Map` to a `PriceItem` object

```dart
  void _checkOk(http.Response res) {
    if (res.statusCode == 401) {
      throw Exception('API কী সঠিক নয় — lib/config.dart চেক করুন');
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw Exception('API ত্রুটি ${res.statusCode}: ${res.body}');
    }
  }
```
- `throw Exception(...)` — stops execution and creates an error. The `catch` block in the screen will handle it.
- Status codes 200-299 mean success. Anything else is an error.

---

## 5.6 `lib/utils/bangla_numbers.dart`

```dart
const _englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const _banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
```
- `const` at the top level — module-level constants. The `_` prefix makes them private.
- Parallel arrays: index 0 maps `'0'` to `'০'`, index 5 maps `'5'` to `'৫'`, etc.

```dart
String toBanglaDigits(String input) {
  var result = input;
  for (var i = 0; i < _englishDigits.length; i++) {
    result = result.replaceAll(_englishDigits[i], _banglaDigits[i]);
  }
  return result;
}
```
Simple replacement loop. For each digit 0-9, replaces all occurrences in the string.

```dart
String formatPriceBangla(num price) {
  final s = (price == price.roundToDouble())
      ? price.toInt().toString()
      : price.toStringAsFixed(1);
  return toBanglaDigits(s);
}
```
- `price.roundToDouble()` — rounds to nearest integer as a double (e.g., `30.0`)
- If price equals its rounded value (it's a whole number), drop the decimal: `30.0` → `"30"` → `"৩০"`
- Otherwise keep one decimal place: `30.5` → `"30.5"` → `"৩০.৫"`

---

## 5.7 Reusable Widgets

### `lib/widgets/error_view.dart`

```dart
class ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const ErrorView({super.key, required this.message, required this.onRetry});
```
- `VoidCallback` — a Dart type alias for `void Function()`. A function that takes no arguments and returns nothing.
- This widget takes a message and a function to call when the retry button is pressed.
- **Why make this a separate widget?** All 3 data screens (price, pesticide, office) can show errors. Instead of copying the same error UI three times, we extract it into one reusable widget. **DRY principle: Don't Repeat Yourself.**

```dart
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.wifi_off_rounded, size: 52, color: Colors.red.shade300),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('আবার চেষ্টা করুন'),
            ),
          ],
        ),
      ),
    );
  }
```
- `Center` — centers its child on the screen
- `Padding` — adds space around its child
- `Column` — arranges children vertically
- `mainAxisSize: MainAxisSize.min` — the Column only takes up as much vertical space as its children need
- `SizedBox(height: 12)` — a blank box used for spacing. Better than `padding` when spacing between items.
- `ElevatedButton.icon` — a button with both an icon and a label. When pressed, calls `onRetry` (the function passed in from the parent).

---

## 5.8 Screens Deep Dive

### `lib/screens/home_screen.dart` — Main Shell

```dart
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}
```
- `StatefulWidget` — a widget that has mutable state (the current tab index can change)
- `State<HomeScreen>` — the state class associated with `HomeScreen`
- The convention: if the widget is `HomeScreen`, the state class is `_HomeScreenState` (prefixed with `_` to make it private)

```dart
class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
```
- `_currentIndex` — which tab is currently selected (0=prices, 1=weather, 2=pesticides, 3=offices)

```dart
  final List<_TabItem> _tabs = [
    _TabItem(
      icon: Icons.storefront_outlined,
      activeIcon: Icons.storefront,
      label: 'সবজির দাম',
      color: Colors.green,
      screen: const PriceScreen(),
    ),
    ...
  ];
```
- We define all 4 tabs as a list of `_TabItem` objects. This makes the `build` method cleaner — no hard-coded if/else for each tab.
- Each `_TabItem` stores everything needed: icon, label, color, and the actual screen widget.

```dart
  @override
  Widget build(BuildContext context) {
    final current = _tabs[_currentIndex];
    return Scaffold(
      appBar: AppBar(
        title: Text(current.label),
        backgroundColor: current.color,
        foregroundColor: Colors.white,
      ),
```
- `Scaffold` — the basic page structure in Material Design. Provides AppBar, body, drawer, bottom nav, FAB.
- `AppBar` — the top bar. Its color and title change dynamically based on `current` tab.

```dart
      drawer: _buildDrawer(context),
```
- Adding a `drawer` to the `Scaffold` automatically adds the hamburger menu icon (☰) to the AppBar. You don't have to do anything else — Flutter handles the open/close animation.

```dart
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs.map((t) => t.screen).toList(),
      ),
```
- `IndexedStack` — shows all 4 screens stacked on top of each other, but only the one at `index` is visible.
- **Why not just show the selected screen?** Because `IndexedStack` keeps all screens alive in memory. If you switched to Weather, searched for "ঢাকা", then switched to Prices and back, your search result would still be there. With a regular `if/else`, the screen would be destroyed and recreated (losing state).

```dart
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        type: BottomNavigationBarType.fixed,
```
- `onTap: (i) => setState(...)` — when a tab is tapped, `setState` is called with the new index. This triggers a rebuild, which updates the AppBar color, title, and visible screen.
- `BottomNavigationBarType.fixed` — all 4 tabs are always visible. The default behavior hides labels for more than 3 tabs.

```dart
  Drawer _buildDrawer(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
```
- `DrawerHeader` — the large banner at the top of the drawer
- `LinearGradient` — a smooth color transition from dark green to light green

```dart
          ..._tabs.asMap().entries.map(
                (e) => ListTile(
                  leading: Icon(e.value.activeIcon, color: e.value.color),
                  title: Text(e.value.label),
                  selected: _currentIndex == e.key,
                  onTap: () {
                    Navigator.pop(context);         // Close the drawer
                    setState(() => _currentIndex = e.key);  // Switch tab
                  },
                ),
              ),
```
- `..._tabs.asMap().entries.map(...)` — the `...` is the **spread operator**. It inserts all items of the iterable into the parent list.
- `.asMap()` gives `{0: _TabItem, 1: _TabItem, ...}`. `.entries` gives `[MapEntry(0, _TabItem), ...]`.
- `e.key` = tab index, `e.value` = `_TabItem` object
- `Navigator.pop(context)` — closes the drawer (it's treated as a route on the navigation stack)

---

### `lib/screens/price_screen.dart` — Tab 1: সবজির দাম

```dart
class PriceScreen extends StatefulWidget { ... }

class _PriceScreenState extends State<PriceScreen> {
  List<PriceItem> _allItems = [];
  List<PriceItem> _filteredItems = [];
  List<String> _categories = ['সব'];
  String _selectedCategory = 'সব';
  bool _loading = true;
  String? _error;
  final _searchCtrl = TextEditingController();
```
**State variables explained:**
- `_allItems` — the full list fetched from the API (never filtered)
- `_filteredItems` — what's currently shown (subset of `_allItems`)
- `_categories` — chip filter options
- `_selectedCategory` — which chip is active
- `_loading` — shows a spinner while fetching
- `_error` — shows an error message if fetch failed (`?` means nullable — can be null)
- `TextEditingController` — controls the search text field and lets us read its value

```dart
  @override
  void initState() {
    super.initState();
    _load();
  }
```
- `initState()` — called once when the widget is first inserted into the tree. Perfect for initial data loading.
- **Always call `super.initState()` first** — the parent class needs to initialize before you do.

```dart
  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final items = await ApiService.instance.getAllPrices();
      final cats = await ApiService.instance.getPriceCategories();
      setState(() {
        _allItems = items;
        _categories = ['সব', ...cats];
        _loading = false;
      });
      _applyFilter();
    } catch (e) {
      setState(() {
        _loading = false;
        _error = 'তথ্য লোড করতে সমস্যা হয়েছে।\n${e.toString()}';
      });
    }
  }
```
**The loading pattern:**
1. Set `_loading = true` (shows spinner)
2. Try to fetch data (async, may take time)
3. On success: set data, set `_loading = false`
4. On failure: set error message, set `_loading = false`

This `try/catch` pattern handles all network errors gracefully. Without it, an unhandled exception would crash the app.

```dart
  void _applyFilter() {
    final query = _searchCtrl.text.trim().toLowerCase();
    setState(() {
      _filteredItems = _allItems.where((item) {
        final matchCat = _selectedCategory == 'সব' || item.category == _selectedCategory;
        final matchQuery = query.isEmpty || item.name.contains(query);
        return matchCat && matchQuery;
      }).toList();
    });
  }
```
- `.where((item) { ... })` — filters a list. Returns only items where the function returns `true`.
- `.trim()` — removes leading/trailing whitespace
- `.toLowerCase()` — for case-insensitive search (less critical for Bangla, but good practice)
- `&&` — both conditions must be true

```dart
  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return ErrorView(message: _error!, onRetry: _load);
    }
```
**Guard clauses** at the top of `build` — handle special states first, then build the normal UI. The `!` after `_error` is the **null assertion operator** — we're telling Dart "I know this isn't null here."

```dart
    return Column(
      children: [
        // Search bar
        Padding(...TextField(controller: _searchCtrl, onChanged: (_) => _applyFilter()...)),
        // Category chips
        SizedBox(height: 44, child: ListView.builder(...)),
        // Price list
        Expanded(child: RefreshIndicator(onRefresh: _load, child: ListView.builder(...))),
      ],
    );
```
- `Column` with `Expanded` — the search bar and chips have fixed heights. `Expanded` makes the list take all remaining space.
- `RefreshIndicator` — wraps a scrollable widget and adds "pull to refresh" gesture. `onRefresh: _load` reloads data.

```dart
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: color.withValues(alpha: 0.15),
            child: Icon(Icons.eco, color: color, size: 20),
          ),
          title: Text(item.name, ...),
          subtitle: Text(item.category),
          trailing: Column(children: [
            Text('৳ ${formatPriceBangla(item.price)}', ...),
            Text(item.unit, ...),
          ]),
        ),
```
- `ListTile` — a standard list item with leading, title, subtitle, and trailing sections
- `CircleAvatar` — a circular container (used here for a colored icon badge)
- `.withValues(alpha: 0.15)` — creates a semi-transparent version of the color. `alpha: 0.0` = invisible, `alpha: 1.0` = fully opaque.

---

### `lib/screens/weather_screen.dart` — Tab 2: আবহাওয়া

This screen is different — it calls an **external** API (Open-Meteo), not our Flask backend.

```dart
  Future<void> _fetch() async {
    // Step 1: Geocode (city name → latitude/longitude)
    final geoUri = Uri.parse(
      'https://geocoding-api.open-meteo.com/v1/search'
      '?name=${Uri.encodeComponent(city)}&count=1&language=bn',
    );
    final geoRes = await http.get(geoUri);
```
- **Two API calls in sequence**: first geocode the city, then fetch weather for those coordinates.
- `language=bn` — requests Bangla names from Open-Meteo's geocoding API

```dart
    final geoData = jsonDecode(utf8.decode(geoRes.bodyBytes));
    final results = geoData['results'] as List?;
    if (results == null || results.isEmpty) {
      throw Exception('"$city" খুঁজে পাওয়া যায়নি।');
    }
    final loc = results.first as Map<String, dynamic>;
    final lat = loc['latitude'] as double;
    final lon = loc['longitude'] as double;
```
- `as List?` — cast to nullable List. If the key doesn't exist, it returns null (not a crash).
- `.first` — first element of the list

```dart
    final wxUri = Uri.parse(
      'https://api.open-meteo.com/v1/forecast'
      '?latitude=$lat&longitude=$lon'
      '&current=temperature_2m,relative_humidity_2m,weather_code,'
      'wind_speed_10m,apparent_temperature,precipitation'
    );
```
- Multiple string literals next to each other are concatenated at compile time. Better than `+` for long URLs.
- `current=temperature_2m,...` — asks Open-Meteo to return only current conditions (not hourly/daily forecast)

```dart
  String _weatherDesc(int code) {
    if (code == 0) return '☀️ পরিষ্কার আকাশ';
    if (code <= 3) return '⛅ আংশিক মেঘলা';
    ...
  }
```
Open-Meteo uses numeric weather codes (WMO standard). This function translates them to readable Bangla strings.

---

### `lib/screens/pesticide_screen.dart` and `krishi_office_screen.dart`

These follow the exact same pattern as `price_screen.dart`:
1. State: `_allItems`, `_filtered`, `_loading`, `_error`, filter values
2. `initState` → `_load()`
3. `_load()`: set loading → fetch → set data / set error
4. `_applyFilter()`: filter based on selected chip + search text
5. `build()`: guard clauses → Column(search, chips, list)

Understanding one screen means you understand all three.

**`krishi_office_screen.dart` special feature:**
```dart
...office.services
    .split(',')
    .map((s) => Padding(
          padding: const EdgeInsets.only(top: 2),
          child: Row(children: [
            const Text('• ', style: TextStyle(color: Colors.teal)),
            Expanded(child: Text(s.trim())),
          ]),
        )),
```
The `services` field from the API is a comma-separated string. `.split(',')` breaks it into a list of strings, then `.map()` creates a bullet point widget for each service.

---

# 6. BUILD IT FROM SCRATCH — STEP BY STEP

Follow these steps to build the entire project yourself, from zero.

---

## Phase 1: Set Up Your Environment

### Step 1.1: Install Python and Flask
```bash
# Check Python is installed
python3 --version        # Should be 3.8 or higher

# Install Flask
pip install flask gunicorn
```

### Step 1.2: Install Flutter
1. Download Flutter SDK from flutter.dev
2. Add Flutter to your PATH
3. Run `flutter doctor` — it tells you what's missing
4. Install Android Studio + emulator OR just use Chrome for testing

### Step 1.3: Install VS Code Extensions
- **Python** (by Microsoft)
- **Flutter** (by Dart Code)
- **REST Client** (for testing APIs without leaving VS Code)

---

## Phase 2: Build the Flask Backend

### Step 2.1: Create the Project Structure
```bash
mkdir krishiapp_backend
cd krishiapp_backend
mkdir api
touch main.py init_database.py requirements.txt
touch api/__init__.py api/db.py api/prices.py
```

### Step 2.2: Write `requirements.txt`
```
Flask==3.0.3
```

Install it:
```bash
pip install -r requirements.txt
```

### Step 2.3: Write `init_database.py`
Start simple. Just create one table with 3 columns:
```python
import sqlite3

def init_db():
    conn = sqlite3.connect("test.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price REAL NOT NULL
        )
    """)
    # Check if empty, then seed
    if conn.execute("SELECT COUNT(*) FROM prices").fetchone()[0] == 0:
        conn.execute("INSERT INTO prices (name, price) VALUES (?, ?)", ("আলু", 30.0))
        conn.execute("INSERT INTO prices (name, price) VALUES (?, ?)", ("টমেটো", 50.0))
        conn.commit()
    conn.close()
    print("Database ready!")

if __name__ == "__main__":
    init_db()
```
**Run it:** `python init_database.py` — creates `test.db`.

### Step 2.4: Write a minimal Flask API
```python
# main.py
import os, sqlite3
from flask import Flask, jsonify

app = Flask(__name__)

def get_prices():
    conn = sqlite3.connect("test.db")
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM prices").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.route("/api/prices")
def list_prices():
    return jsonify(get_prices())

if __name__ == "__main__":
    app.run(debug=True, port=8000)
```

**Run it:**
```bash
python init_database.py   # Create DB first
python main.py            # Start server
```

**Test it** (open in browser or use curl):
```
http://localhost:8000/api/prices
```

You should see: `[{"id": 1, "name": "আলু", "price": 30.0}, ...]`

### Step 2.5: Add Blueprints (code organization)
As your API grows, split routes into separate files:
```python
# api/prices.py
from flask import Blueprint, jsonify
from .db import get_db

prices_bp = Blueprint("prices", __name__)

@prices_bp.route("/api/prices")
def list_prices():
    db = get_db()
    rows = db.execute("SELECT * FROM prices").fetchall()
    return jsonify([dict(r) for r in rows])
```

```python
# api/__init__.py
from flask import Flask
from .prices import prices_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(prices_bp)
    return app
```

```python
# main.py
from init_database import init_db
from api import create_app

init_db()
app = create_app()
app.run(port=8000, debug=True)
```

### Step 2.6: Add API key protection
Wrap write endpoints with:
```python
from flask import request, jsonify
import os

def require_api_key():
    expected = os.environ.get("API_KEY", "dev-key")
    if request.headers.get("X-API-KEY") != expected:
        return jsonify({"error": "Unauthorized"}), 401
    return None

@prices_bp.route("/api/prices", methods=["POST"])
def create_price():
    err = require_api_key()
    if err: return err
    # ... create logic
```

---

## Phase 3: Build the Flutter App

### Step 3.1: Create the Flutter Project
```bash
flutter create krishiapp
cd krishiapp
```

### Step 3.2: Add the HTTP Package
Edit `pubspec.yaml`:
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.2
```
Then run:
```bash
flutter pub get
```

### Step 3.3: Test the API Connection First
Before building any UI, test the API connection. Edit `lib/main.dart` temporarily:

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Test API call
  final res = await http.get(Uri.parse('http://10.0.2.2:8000/api/prices'));
  print('Status: ${res.statusCode}');
  print('Body: ${res.body.substring(0, 100)}');
  
  runApp(const MaterialApp(home: Scaffold(body: Center(child: Text("Test")))));
}
```
If you see the response in the console, the connection works.

### Step 3.4: Create a Model
```dart
// lib/models/price_item.dart
class PriceItem {
  final String name;
  final double price;
  
  PriceItem({required this.name, required this.price});
  
  factory PriceItem.fromJson(Map<String, dynamic> json) {
    return PriceItem(
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
    );
  }
}
```

### Step 3.5: Create a Service
```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/price_item.dart';

class ApiService {
  static const baseUrl = 'http://10.0.2.2:8000/api';
  
  Future<List<PriceItem>> getPrices() async {
    final res = await http.get(Uri.parse('$baseUrl/prices'));
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.map((e) => PriceItem.fromJson(e)).toList();
  }
}
```

### Step 3.6: Build a Screen
```dart
// lib/screens/price_screen.dart
import 'package:flutter/material.dart';
import '../models/price_item.dart';
import '../services/api_service.dart';

class PriceScreen extends StatefulWidget {
  const PriceScreen({super.key});
  @override
  State<PriceScreen> createState() => _PriceScreenState();
}

class _PriceScreenState extends State<PriceScreen> {
  List<PriceItem> _items = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final items = await ApiService().getPrices();
    setState(() {
      _items = items;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    return ListView.builder(
      itemCount: _items.length,
      itemBuilder: (context, i) => ListTile(
        title: Text(_items[i].name),
        trailing: Text('৳${_items[i].price}'),
      ),
    );
  }
}
```

### Step 3.7: Add Tabs
```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'screens/price_screen.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: const HomeScreen());
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _index = 0;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('কৃষিঅ্যাপ')),
      body: [
        const PriceScreen(),
        const Center(child: Text('আবহাওয়া')),
        const Center(child: Text('কীটনাশক')),
        const Center(child: Text('কৃষি অফিস')),
      ][_index],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.storefront), label: 'দাম'),
          BottomNavigationBarItem(icon: Icon(Icons.wb_sunny), label: 'আবহাওয়া'),
          BottomNavigationBarItem(icon: Icon(Icons.eco), label: 'কীটনাশক'),
          BottomNavigationBarItem(icon: Icon(Icons.business), label: 'অফিস'),
        ],
      ),
    );
  }
}
```

### Step 3.8: Add the Drawer (hamburger menu)
Add `drawer: Drawer(child: ...)` to the `Scaffold`. As soon as a `Scaffold` has a `drawer`, Flutter automatically shows the ☰ icon.

### Step 3.9: Build APK
```bash
flutter build apk
```
APK location: `build/app/outputs/flutter-apk/app-release.apk`

For a debug build (easier to install without signing):
```bash
flutter build apk --debug
```

---

# 7. MINI PROJECTS TO MASTER EACH CONCEPT

Work through these in order. Each one builds on the previous.

---

## Level 1: Python + SQLite (1 week)

### Project A: Personal Diary CLI
Build a command-line diary that stores entries in SQLite.

```
Features:
- Add a new entry (date, title, text)
- List all entries
- Search entries by keyword
- Delete an entry by ID
```

**Concepts practiced:** `sqlite3`, `CREATE TABLE`, `INSERT`, `SELECT`, `DELETE`, parameterized queries, `if __name__ == "__main__"`.

### Project B: Contact Book CLI
```
Features:
- Add contact (name, phone, email)
- Search by name
- Update phone number
- Delete contact
```

---

## Level 2: Flask REST API (1 week)

### Project C: Todo API
Build an API with these endpoints:
```
GET    /todos          → list all todos
POST   /todos          → create a todo {"text": "...", "done": false}
PATCH  /todos/<id>     → mark as done {"done": true}
DELETE /todos/<id>     → delete a todo
```

Test with `curl` or VS Code REST Client. **Do NOT build a frontend yet.**

**Concepts practiced:** Blueprints, routes, URL parameters, request body, HTTP methods, status codes, CRUD.

### Project D: Simple Blog API
```
Endpoints: GET /posts, POST /posts, GET /posts/<id>, DELETE /posts/<id>
Tables: posts (id, title, content, created_at)
Protection: API key required for POST and DELETE
```

---

## Level 3: Flutter UI (1 week)

### Project E: Static To-Do App
Build a Flutter app with NO backend. All data is in a Dart list.
```
Features:
- Show list of todos
- Tap to mark done (strikethrough)
- Add new todo (TextField + button)
- Delete on long-press
```

**Concepts practiced:** StatefulWidget, setState, ListView.builder, TextEditingController, dismissible, basic UI widgets.

### Project F: Simple Calculator
```
Features:
- Number buttons 0-9
- Operations: + - * /
- Result display
- Clear button
```

---

## Level 4: Flutter + HTTP (1 week)

### Project G: Connect Your Todo API to Flutter
Take Project C (Todo API) and Project E (Todo UI) and connect them.
```
- PriceScreen now fetches from your Flask API
- Add todo sends POST request
- Mark done sends PATCH request
- Delete sends DELETE request
```

**Concepts practiced:** async/await, Future, http package, jsonDecode, setState after async, error handling with try/catch.

---

## Level 5: Complete Mini App (2 weeks)

### Project H: Weather App
```
- TextField to type a city name
- Button to fetch weather
- Display temperature, humidity, conditions
- Use Open-Meteo API (free, no key)
- Show loading spinner while fetching
- Show error if city not found
```

This is the exact same pattern as the weather screen in KrishiApp.

### Project I: Your Own Price App
Build a mini version of KrishiApp from scratch:
- Flask backend: one table, 2-3 routes
- Flutter app: one screen, fetches and displays data
- Bonus: Add a search field

---

# 8. COMMON MISTAKES AND HOW TO AVOID THEM

---

## Backend Mistakes

### Mistake 1: Forgetting to commit
```python
# WRONG
db.execute("UPDATE prices SET price = ? WHERE name = ?", (30.0, "আলু"))
# (changes are lost when connection closes)

# RIGHT
db.execute("UPDATE prices SET price = ? WHERE name = ?", (30.0, "আলু"))
db.commit()  # ← Always commit after writes
```

### Mistake 2: Building SQL strings with f-strings
```python
# WRONG — SQL injection attack possible
name = request.args.get("name")
db.execute(f"SELECT * FROM prices WHERE name = '{name}'")

# RIGHT — parameterized query
db.execute("SELECT * FROM prices WHERE name = ?", (name,))
```
If someone sends `name = "'; DROP TABLE prices; --"`, the second approach is safe, the first destroys your database.

### Mistake 3: Not handling None from request.get_json()
```python
# WRONG
body = request.get_json()
price = body["price"]     # Crashes if body is None (no JSON sent)

# RIGHT
body = request.get_json(silent=True) or {}
price = body.get("price")
if price is None:
    return jsonify({"error": "price required"}), 400
```

### Mistake 4: Hardcoding the port
```python
# WRONG
app.run(port=5000)  # Breaks on Replit, Railway, etc.

# RIGHT
port = int(os.environ.get("PORT", 5000))
app.run(port=port)
```

---

## Flutter Mistakes

### Mistake 1: Calling setState outside async context
```dart
// WRONG — might crash if widget is removed from tree
Future<void> _load() async {
  final data = await someApiCall();
  setState(() { _data = data; });  // Widget might be gone!
}

// RIGHT
Future<void> _load() async {
  final data = await someApiCall();
  if (!mounted) return;            // Check if widget is still alive
  setState(() { _data = data; });
}
```

### Mistake 2: Using res.body instead of utf8.decode for non-English text
```dart
// WRONG — may garble Bengali/Arabic/Chinese text
final text = res.body;

// RIGHT
final text = utf8.decode(res.bodyBytes);
```

### Mistake 3: Not handling errors in async functions
```dart
// WRONG — unhandled exception crashes the app
Future<void> _load() async {
  final data = await ApiService.instance.getAllPrices();
  setState(() { _items = data; });
}

// RIGHT
Future<void> _load() async {
  try {
    final data = await ApiService.instance.getAllPrices();
    setState(() { _items = data; _loading = false; });
  } catch (e) {
    setState(() { _error = e.toString(); _loading = false; });
  }
}
```

### Mistake 4: Forgetting to dispose controllers
```dart
class _MyState extends State<MyScreen> {
  final _ctrl = TextEditingController();

  @override
  void dispose() {
    _ctrl.dispose();  // ← ALWAYS dispose controllers, otherwise memory leak
    super.dispose();
  }
}
```

### Mistake 5: Using localhost on Android emulator
```dart
// WRONG on Android emulator — localhost is the emulator itself
static const apiBaseUrl = 'http://localhost:8000';

// RIGHT for Android emulator
static const apiBaseUrl = 'http://10.0.2.2:8000';

// RIGHT for real device on same WiFi (find your PC's IP with `ipconfig`)
static const apiBaseUrl = 'http://192.168.1.X:8000';
```

---

## Architecture Mistakes

### Mistake 1: Putting API calls directly in `build()`
```dart
// WRONG — runs on every rebuild (dozens of times per second)
@override
Widget build(BuildContext context) {
  final future = ApiService.getAllPrices();  // Called every frame!
  return FutureBuilder(...);
}

// RIGHT — call in initState or on user action
@override
void initState() {
  super.initState();
  _load();  // Called once
}
```

### Mistake 2: One giant file
Don't put all 4 screens in `main.dart`. One file = one responsibility.

```
lib/
  main.dart              ← Only app setup
  screens/               ← One file per screen
  services/              ← API calls
  models/                ← Data classes
  widgets/               ← Reusable UI pieces
```

### Mistake 3: Magic strings everywhere
```dart
// WRONG — URL appears 10 times in 10 files
await http.get(Uri.parse('http://10.0.2.2:8000/api/prices'));

// RIGHT — one place to change
// In config.dart:
static const apiBaseUrl = 'http://10.0.2.2:8000/api';
// Everywhere else:
await http.get(Uri.parse('${AppConfig.apiBaseUrl}/prices'));
```

---

## Summary: The Mental Model

```
BACKEND (Flask)
├── Think of it as a RESTAURANT KITCHEN
├── Routes are the MENU ITEMS
├── Database is the PANTRY
├── Blueprints are KITCHEN STATIONS (grill, salad, dessert)
└── API key is the STAFF ENTRANCE (admin only)

FLUTTER APP
├── Think of it as a CUSTOMER + WAITER
├── StatefulWidget = a form with fillable fields
├── setState() = eraser: redraw this section
├── async/await = "I'll wait for my food, but I'm not blocking the door"
├── Models = typed containers for server data
└── Services = the waiter who talks to the kitchen
```

---

*Happy building! The best way to learn is to break things and fix them.*
*Start with Project A and build your way up. You've got this. 🌱*
