# Flask SQLite to Render PostgreSQL Migration — Executed Plan

The migration of the KrishiApp backend from a local file-based SQLite database (`krishiapp.db`) to a managed PostgreSQL database hosted on Render has been completed. The dev server startup error has also been resolved.

### User Review & Decisions Implemented

- **Database Access Layer**: `psycopg2-binary` with `ThreadedConnectionPool` and `RealDictCursor`. Keeps raw SQL performance without ORM overhead.
- **Initialization & Seeding**: Updated `init_database.py` with PostgreSQL DDL (`SERIAL PRIMARY KEY`, `NUMERIC(10,2)`, `%s` placeholders, and `psycopg2.extras.execute_batch`).
- **Render Configuration**: Updated `render.yaml` with the `krishiapp-postgres` managed database and wired `DATABASE_URL` via `fromDatabase: { name: krishiapp-postgres, property: connectionString }`.
- **Dev Server**: Fixed by adding `/src/main.tsx` and an interactive KrishiApp Migration & Operations Portal in `/src/App.tsx`.

---

### 1. Summary of Changes Completed

#### A. Dev Server & UI Portal
- **`/src/main.tsx` & `/src/App.tsx`**: Created full-featured migration hub and interactive dashboard running on port 3000. Includes side-by-side code diffs, live entity previews, SQL scripts, and Render deployment guides.

#### B. Driver & Dependencies
- **`artifacts/api-server/requirements.txt`**: Added `psycopg2-binary==2.9.9` alongside `Flask==3.0.3` and `gunicorn==22.0.0`.

#### C. Connection Pooling & Render Integration
- **`artifacts/api-server/api/db.py`**:
  - Replaced SQLite file connection with `ThreadedConnectionPool(minconn=1, maxconn=10, dsn=...)`.
  - Normalizes Render's `postgres://` prefix to `postgresql://`.
  - Configured `cursor_factory=RealDictCursor` so responses remain dict-like for seamless JSON serialization.
  - Implemented `get_db()` and `close_db()` lifecycle methods to acquire and return pool connections.

#### D. Schema & Seeding
- **`artifacts/api-server/init_database.py`**:
  - Converted table definitions from `INTEGER PRIMARY KEY AUTOINCREMENT` to `SERIAL PRIMARY KEY`.
  - Switched price values to `NUMERIC(10, 2)`.
  - Converted SQL parameter placeholders from `?` to `%s`.
  - Used `psycopg2.extras.execute_batch` for efficient bulk insertion of initial prices, pesticides, and extension offices.

#### E. Route Blueprints
- **`artifacts/api-server/api/prices.py`**: Converted `?` to `%s` and named bindings to `%(name)s`, `%(price)s`, etc. Added explicit `with db.cursor() as cur:` and `db.commit()`.
- **`artifacts/api-server/api/pesticides.py`**: Converted `?` to `%s` and upsert syntax to PostgreSQL `ON CONFLICT (crop, pest) DO UPDATE SET ... EXCLUDED.col`.
- **`artifacts/api-server/api/krishi_office.py`**: Converted `?` to `%s` and named inserts for bulk office records.

#### F. Render Deployment Blueprint
- **`artifacts/api-server/render.yaml`**:
  - Added `databases` block for `krishiapp-postgres` (region: Singapore, plan: free).
  - Injected `DATABASE_URL` into `krishiapp-api` web service using `fromDatabase.property: connectionString`.

---

### 2. Architecture & Data Flow

```
┌───────────────────────────────────────────────────────────────┐
│                    Render Cloud Platform                      │
│                                                               │
│   ┌────────────────────────────────────────────────────────┐  │
│   │               krishiapp-api (Web Service)              │  │
│   │                                                        │  │
│   │   ┌────────────────┐      ┌────────────────────────┐   │  │
│   │   │  Gunicorn (2w) │ ───> │ Flask App Factory      │   │  │
│   │   └────────────────┘      └───────────┬────────────┘   │  │
│   │                                       │                │  │
│   │     ┌─────────────────────────────────┴─────────────┐  │  │
│   │     │  Blueprints: prices, pesticides, offices      │  │  │
│   │     └───────────────────────┬───────────────────────┘  │  │
│   │                             │ get_db() / g.db          │  │
│   │     ┌───────────────────────▼───────────────────────┐  │  │
│   │     │  api/db.py: ThreadedConnectionPool            │  │  │
│   │     └───────────────────────┬───────────────────────┘  │  │
│   └─────────────────────────────┼──────────────────────────┘  │
│                                 │ SSL / TCP                   │
│                                 ▼                             │
│   ┌────────────────────────────────────────────────────────┐  │
│   │          krishiapp-postgres (Render Managed DB)        │  │
│   │                                                        │  │
│   │   ┌───────────────┐ ┌────────────────┐ ┌───────────┐  │  │
│   │   │    prices     │ │   pesticides   │ │  offices  │  │  │
│   │   └───────────────┘ └────────────────┘ └───────────┘  │  │
│   └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

### 3. Deploying to Render

1. **Push your code to GitHub** containing the updated `render.yaml`, `requirements.txt`, and `api/` files.
2. In the Render Dashboard, choose **New +** ➔ **Blueprint**.
3. Select your repository. Render will automatically provision:
   - The PostgreSQL instance (`krishiapp-postgres`)
   - The Flask web service (`krishiapp-api`) with `DATABASE_URL` linked
4. During build, `pip install -r requirements.txt && python init_database.py` will install `psycopg2-binary` and create/seed the database.
