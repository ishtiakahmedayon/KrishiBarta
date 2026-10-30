import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Layers, 
  FileCode, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  Globe, 
  Terminal, 
  AlertTriangle,
  RefreshCw,
  Search,
  Sprout,
  Smartphone
} from 'lucide-react';

type Tab = 'overview' | 'diffs' | 'schema' | 'render' | 'sql' | 'flutter';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('db.py');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const samplePrices = [
    { id: 1, name: "আলু", name_possessive: "আলুর", price: 30.0, unit: "টাকা/কেজি", category: "সবজি" },
    { id: 2, name: "পটল", name_possessive: "পটলের", price: 50.0, unit: "টাকা/কেজি", category: "সবজি" },
    { id: 3, name: "বেগুন", name_possessive: "বেগুনের", price: 40.0, unit: "টাকা/কেজি", category: "সবজি" },
    { id: 4, name: "টমেটো", name_possessive: "টমেটোর", price: 55.0, unit: "টাকা/কেজি", category: "সবজি" },
    { id: 5, name: "পেঁয়াজ", name_possessive: "পেঁয়াজের", price: 70.0, unit: "টাকা/কেজি", category: "মশলা" },
    { id: 6, name: "রসুন", name_possessive: "রসুনের", price: 180.0, unit: "টাকা/কেজি", category: "মশলা" },
    { id: 7, name: "চাল", name_possessive: "চালের", price: 58.0, unit: "টাকা/কেজি", category: "শস্য" },
    { id: 8, name: "ডাল", name_possessive: "ডালের", price: 120.0, unit: "টাকা/কেজি", category: "শস্য" },
    { id: 9, name: "সয়াবিন তেল", name_possessive: "সয়াবিন তেলের", price: 175.0, unit: "টাকা/লিটার", category: "অন্যান্য" },
  ];

  const samplePesticides = [
    { id: 1, crop: "ধান", pest: "মাজরা পোকা", pesticide_name: "কার্টাপ হাইড্রোক্লোরাইড (Cartap Hydrochloride)", dosage: "২০ গ্রাম/১০ লিটার পানি", precaution: "স্প্রে করার সময় হাতমোজা ও মাস্ক ব্যবহার করুন।" },
    { id: 2, crop: "ধান", pest: "বাদামী গাছফড়িং", pesticide_name: "ইমিডাক্লোপ্রিড (Imidacloprid)", dosage: "১ মিলি/লিটার পানি", precaution: "শিশু ও গবাদি পশু থেকে দূরে রাখুন।" },
    { id: 3, crop: "আলু", pest: "লেট ব্লাইট", pesticide_name: "ম্যানকোজেব (Mancozeb)", dosage: "২.৫ গ্রাম/লিটার পানি", precaution: "ফসল তোলার ১৫ দিন আগে স্প্রে বন্ধ করুন।" },
    { id: 4, crop: "টমেটো", pest: "সাদামাছি", pesticide_name: "ইমিডাক্লোপ্রিড (Imidacloprid)", dosage: "০.৫ মিলি/লিটার পানি", precaution: "ফুল ও ফলে সরাসরি স্প্রে এড়িয়ে চলুন।" },
  ];

  const sampleOffices = [
    { id: 1, name: "কৃষি সম্প্রসারণ অধিদপ্তর, ঢাকা", district: "ঢাকা", address: "খামারবাড়ি, ফার্মগেট, ঢাকা-১২১৫", phone: "02-9130986", services: "ফসল উৎপাদন পরামর্শ, কৃষি প্রযুক্তি সহায়তা, বীজ বিতরণ, সার বরাদ্দ" },
    { id: 2, name: "জেলা কৃষি অফিস, চট্টগ্রাম", district: "চট্টগ্রাম", address: "চকবাজার, চট্টগ্রাম-৪০০০", phone: "031-632101", services: "কৃষি উপকরণ, প্রশিক্ষণ, মাটি পরীক্ষা সেবা" },
    { id: 3, name: "উপজেলা কৃষি অফিস, গাজীপুর", district: "গাজীপুর", address: "গাজীপুর সদর উপজেলা পরিষদ, গাজীপুর", phone: "02-9263458", services: "কৃষক নিবন্ধন, সার ও বীজ বিতরণ, রোগ-বালাই পরামর্শ" },
    { id: 4, name: "জেলা কৃষি অফিস, রাজশাহী", district: "রাজশাহী", address: "রাজশাহী সদর, রাজশাহী-৬০০০", phone: "0721-772345", services: "আম, ধান, গম উৎপাদন সহায়তা, সেচ পরামর্শ" },
  ];

  const fileDiffs: Record<string, { title: string; sqlite: string; postgres: string; explanation: string }> = {
    'db.py': {
      title: 'api/db.py — Connection Management & Pooling',
      sqlite: `# SQLite: File-based single connection per request
import os
import sqlite3
from flask import g

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "krishiapp.db")

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()`,
      postgres: `# PostgreSQL: Threaded Connection Pool via Render DATABASE_URL
import os
from flask import g
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor

_pool = None

def get_pool():
    global _pool
    if _pool is None:
        raw_url = os.environ.get("DATABASE_URL", "postgresql://krishi:password@localhost:5432/krishiapp")
        # Handle Render postgres:// legacy prefix
        if raw_url.startswith("postgres://"):
            raw_url = raw_url.replace("postgres://", "postgresql://", 1)
        
        _pool = ThreadedConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=raw_url,
            cursor_factory=RealDictCursor
        )
    return _pool

def get_db():
    """Retrieve connection from pool for current request."""
    if "db" not in g:
        g.db = get_pool().getconn()
    return g.db

def close_db(exception=None):
    """Return connection back to pool."""
    db = g.pop("db", None)
    if db is not None and _pool is not None:
        _pool.putconn(db)`,
      explanation: 'Replaced ephemeral SQLite file locks with a thread-safe connection pool using Render\'s DATABASE_URL. RealDictCursor ensures returned rows continue behaving like Python dicts with column names.'
    },
    'init_database.py': {
      title: 'init_database.py — Schema DDL & Data Seeding',
      sqlite: `# SQLite table definition & inserts
cursor.execute("""
    CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        name_possessive TEXT NOT NULL,
        price REAL NOT NULL,
        unit TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'সবজি'
    )
""")

# SQLite ? placeholder
cursor.executemany(
    "INSERT INTO prices (name, name_possessive, price, unit, category) VALUES (?, ?, ?, ?, ?)",
    prices,
)`,
      postgres: `# PostgreSQL table definition & inserts
cursor.execute("""
    CREATE TABLE IF NOT EXISTS prices (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        name_possessive TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        unit TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'সবজি'
    )
""")

# PostgreSQL %s placeholder & execute_batch
from psycopg2.extras import execute_batch
execute_batch(
    cursor,
    "INSERT INTO prices (name, name_possessive, price, unit, category) VALUES (%s, %s, %s, %s, %s)",
    prices,
)`,
      explanation: 'Replaced INTEGER PRIMARY KEY AUTOINCREMENT with SERIAL PRIMARY KEY, REAL with high-precision NUMERIC(10,2), and SQLite ? placeholders with PostgreSQL %s placeholders.'
    },
    'prices.py': {
      title: 'api/prices.py — Route Queries & Parameter Substitution',
      sqlite: `# SQLite positional and named parameters
@prices_bp.route("/api/prices", methods=["GET"])
def list_prices():
    db = get_db()
    category = request.args.get("category")
    if category:
        rows = db.execute(
            "SELECT * FROM prices WHERE category = ? ORDER BY name", (category,)
        ).fetchall()
    return jsonify([dict(r) for r in rows])

# SQLite :name named parameters
db.execute("""INSERT INTO prices (...) VALUES (:name, :price)
              ON CONFLICT(name) DO UPDATE SET price = excluded.price""", item)`,
      postgres: `# PostgreSQL %s and %(name)s syntax
@prices_bp.route("/api/prices", methods=["GET"])
def list_prices():
    db = get_db()
    category = request.args.get("category")
    with db.cursor() as cur:
        if category:
            cur.execute(
                "SELECT * FROM prices WHERE category = %s ORDER BY name", (category,)
            )
        else:
            cur.execute("SELECT * FROM prices ORDER BY category, name")
        rows = cur.fetchall()
    return jsonify(rows)

# PostgreSQL %(name)s named dictionary binding
cur.execute("""INSERT INTO prices (name, price) VALUES (%(name)s, %(price)s)
               ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price""", item)
db.commit()`,
      explanation: 'Migrated cursor execution to context managers (`with db.cursor() as cur:`), changed `?` to `%s`, changed named bindings from `:key` to `%(key)s`, and added explicit `db.commit()` calls.'
    },
    'render.yaml': {
      title: 'render.yaml — Infrastructure as Code',
      sqlite: `# Previous config: Web Service only with SQLite file
services:
  - type: web
    name: krishiapp-api
    runtime: python
    region: singapore
    plan: free
    buildCommand: pip install -r requirements.txt && python init_database.py
    startCommand: gunicorn "api:create_app()" --bind "0.0.0.0:$PORT" --workers 2
    envVars:
      - key: API_KEY
        generateValue: true`,
      postgres: `# New config: Managed PostgreSQL + Web Service connected via Blueprint
databases:
  - name: krishiapp-postgres
    databaseName: krishiapp
    user: krishi
    plan: free
    region: singapore

services:
  - type: web
    name: krishiapp-api
    runtime: python
    region: singapore
    plan: free
    buildCommand: pip install -r requirements.txt && python init_database.py
    startCommand: gunicorn "api:create_app()" --bind "0.0.0.0:$PORT" --workers 2 --timeout 60
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: krishiapp-postgres
          property: connectionString
      - key: FLASK_DEBUG
        value: "0"
      - key: PYTHON_VERSION
        value: "3.11.0"
      - key: API_KEY
        generateValue: true`,
      explanation: 'Added managed `databases` block for Render PostgreSQL and injected `DATABASE_URL` directly into the web service via `fromDatabase.property: connectionString`.'
    },
    'requirements.txt': {
      title: 'requirements.txt — Python Packages',
      sqlite: `Flask==3.0.3
gunicorn==22.0.0`,
      postgres: `Flask==3.0.3
gunicorn==22.0.0
psycopg2-binary==2.9.9`,
      explanation: 'Added `psycopg2-binary==2.9.9`, the official pre-compiled PostgreSQL client library for Python on Linux environments.'
    }
  };

  const filteredPrices = samplePrices.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.includes(searchQuery) || p.category.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Banner & Header */}
      <header className="bg-emerald-900 text-white border-b border-emerald-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-700/80 p-2.5 rounded-lg border border-emerald-600/50 shadow-inner">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight">KrishiApp API</h1>
                <span className="bg-emerald-800 text-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-700">
                  কৃষি সেবা
                </span>
                <span className="bg-amber-400/20 text-amber-200 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">
                  SQLite ➔ Render PostgreSQL
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Flask Backend Migration & Render Cloud Architecture Hub
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-emerald-200">PostgreSQL Ready</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60">
              <Server className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-mono text-emerald-200">Render Blueprint</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 border-t border-emerald-800/80 pt-1 -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Migration Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('diffs')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'diffs'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Code Diffs & Changes</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'schema'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>PostgreSQL Schema & Data</span>
            </button>
            <button
              onClick={() => setActiveTab('render')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'render'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Render Deployment Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'sql'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>SQL DDL & Queries</span>
            </button>
            <button
              onClick={() => setActiveTab('flutter')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'flutter'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Flutter App Connection</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Summary Card */}
            <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">
                    What Changed to Migrate SQLite ➔ PostgreSQL on Render
                  </h2>
                  <p className="text-stone-600 mt-1.5 max-w-3xl leading-relaxed">
                    Migrated KrishiApp's agricultural API from an ephemeral single-file SQLite database (<code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono">krishiapp.db</code>) 
                    into a robust, multi-worker PostgreSQL database managed by Render, retaining raw SQL speed and zero-downtime connection pooling.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('diffs')}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors shadow-xs"
                  >
                    <span>View Code Diffs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('render')}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    <span>Render Setup</span>
                  </button>
                </div>
              </div>

              {/* 4 Pillars of Change */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                <div className="bg-stone-50 rounded-lg p-5 border border-stone-200/80">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-3">
                    1
                  </div>
                  <h3 className="font-semibold text-stone-900">Python Driver</h3>
                  <p className="text-xs text-stone-500 mt-1 mb-3">requirements.txt</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Added <span className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">psycopg2-binary</span>. Replaces built-in SQLite driver with high-performance C-extensions for PostgreSQL.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border border-stone-200/80">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-3">
                    2
                  </div>
                  <h3 className="font-semibold text-stone-900">Connection Pooling</h3>
                  <p className="text-xs text-stone-500 mt-1 mb-3">api/db.py</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Implemented <span className="font-mono text-blue-800 bg-blue-50 px-1 py-0.5 rounded">ThreadedConnectionPool</span> with Render's <span className="font-mono text-xs">DATABASE_URL</span> and <span className="font-mono text-xs">RealDictCursor</span>.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border border-stone-200/80">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-3">
                    3
                  </div>
                  <h3 className="font-semibold text-stone-900">SQL Placeholders</h3>
                  <p className="text-xs text-stone-500 mt-1 mb-3">api/*.py & init_database.py</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Converted <code className="bg-amber-50 text-amber-900 px-1 rounded">?</code> to <code className="bg-amber-50 text-amber-900 px-1 rounded">%s</code> and named bindings from <code className="text-xs">:key</code> to <code className="text-xs">%(key)s</code> with <code className="text-xs">SERIAL PRIMARY KEY</code>.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border border-stone-200/80">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg mb-3">
                    4
                  </div>
                  <h3 className="font-semibold text-stone-900">Render Blueprint</h3>
                  <p className="text-xs text-stone-500 mt-1 mb-3">render.yaml</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Declared managed database <span className="font-mono text-purple-800 bg-purple-50 px-1 py-0.5 rounded">krishiapp-postgres</span> and linked <span className="font-mono text-xs">DATABASE_URL</span> automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Previous SQLite State */}
              <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-stone-400"></span>
                    <h3 className="font-bold text-stone-800">Previous Architecture (SQLite)</h3>
                  </div>
                  <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">Local File</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-stone-600">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <p className="font-semibold text-stone-800 mb-1">Single File Storage</p>
                    <p className="text-xs text-stone-600">
                      Stored in <code className="text-xs font-mono bg-stone-200/70 px-1 py-0.5 rounded">krishiapp.db</code> on the container disk.
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-red-900 text-xs">
                    <p className="font-semibold mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Ephemeral Disk Vulnerability on Render
                    </p>
                    Render free instances spin down or restart on new deploys. Any data written to SQLite disk during runtime would be reset to initial state.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600">
                    <p className="font-semibold text-stone-800 mb-1">Concurrency Limitations</p>
                    SQLite table-level locks cause concurrency bottlenecks when multiple Gunicorn workers perform updates simultaneously.
                  </div>
                </div>
              </div>

              {/* New PostgreSQL State */}
              <div className="bg-white rounded-xl shadow-xs border border-emerald-200 p-6">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-emerald-950">New Architecture (Render PostgreSQL)</h3>
                  </div>
                  <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Cloud Managed</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-stone-600">
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/70">
                    <p className="font-semibold text-emerald-900 mb-1">Dedicated Cloud Database</p>
                    <p className="text-xs text-emerald-800">
                      Data resides on Render's managed PostgreSQL server in Singapore with automated persistent disk backups and connection encryption.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/70 text-xs text-emerald-900">
                    <p className="font-semibold mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Persistent & Multi-Worker Safe
                    </p>
                    Deployments and restarts preserve all price updates and office directory changes across any number of web service instances.
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/70 text-xs text-emerald-900">
                    <p className="font-semibold mb-1">Threaded Connection Pooling</p>
                    Minimizes round-trip connection overhead with 1-10 persistent connections shared across HTTP worker threads.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CODE DIFFS & FILE EXPLORER */}
        {activeTab === 'diffs' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center space-x-2 overflow-x-auto py-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-2">Files:</span>
                {Object.keys(fileDiffs).map(fileName => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      selectedFile === fileName
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              <div className="text-xs text-stone-500">
                Comparing <span className="font-mono text-stone-800">{fileDiffs[selectedFile].title}</span>
              </div>
            </div>

            {/* Explanation callout */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-start space-x-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Why this change is required:</p>
                <p className="text-emerald-800 text-xs mt-0.5">{fileDiffs[selectedFile].explanation}</p>
              </div>
            </div>

            {/* Side by side diff */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SQLite version */}
              <div className="bg-stone-900 text-stone-100 rounded-xl overflow-hidden border border-stone-800 shadow-md">
                <div className="bg-stone-950 px-4 py-3 flex items-center justify-between border-b border-stone-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="text-xs font-mono text-stone-300">SQLite (Before)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(fileDiffs[selectedFile].sqlite, `sqlite-${selectedFile}`)}
                    className="text-stone-400 hover:text-stone-200 transition-colors p-1"
                    title="Copy SQLite snippet"
                  >
                    {copiedKey === `sqlite-${selectedFile}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-stone-300 max-h-[500px]">
                  <pre>{fileDiffs[selectedFile].sqlite}</pre>
                </div>
              </div>

              {/* PostgreSQL version */}
              <div className="bg-stone-900 text-stone-100 rounded-xl overflow-hidden border border-emerald-900/60 shadow-md">
                <div className="bg-emerald-950/80 px-4 py-3 flex items-center justify-between border-b border-emerald-900/60">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-mono text-emerald-200 font-semibold">PostgreSQL (After)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(fileDiffs[selectedFile].postgres, `postgres-${selectedFile}`)}
                    className="text-stone-400 hover:text-stone-200 transition-colors p-1"
                    title="Copy PostgreSQL snippet"
                  >
                    {copiedKey === `postgres-${selectedFile}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-100/90 max-h-[500px]">
                  <pre>{fileDiffs[selectedFile].postgres}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POSTGRESQL SCHEMA & DATA */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">PostgreSQL Live Data & Entities</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Preview of agricultural data seeded into the Render PostgreSQL database.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="পণ্য খুঁজুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs pl-8 pr-3 py-1.5 border border-stone-200 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex space-x-1 bg-stone-100 p-1 rounded-lg text-xs">
                    {['all', 'সবজি', 'মশলা', 'শস্য', 'অন্যান্য'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          activeCategory === cat
                            ? 'bg-white font-medium text-emerald-900 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {cat === 'all' ? 'সব' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prices Table Preview */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    টেবিল: <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded text-xs">prices</code>
                  </h3>
                  <span className="text-xs text-stone-500">
                    Showing {filteredPrices.length} items
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-stone-200">
                  <table className="min-w-full divide-y divide-stone-200 text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-medium">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-mono">id (SERIAL)</th>
                        <th className="px-4 py-2.5 text-left">name (TEXT UNIQUE)</th>
                        <th className="px-4 py-2.5 text-left">name_possessive</th>
                        <th className="px-4 py-2.5 text-right font-mono">price (NUMERIC)</th>
                        <th className="px-4 py-2.5 text-left">unit</th>
                        <th className="px-4 py-2.5 text-left">category</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-100">
                      {filteredPrices.map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="px-4 py-2.5 font-mono text-stone-400">{item.id}</td>
                          <td className="px-4 py-2.5 font-semibold text-stone-800">{item.name}</td>
                          <td className="px-4 py-2.5 text-stone-600">{item.name_possessive}</td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-emerald-700">
                            ৳{item.price.toFixed(1)}
                          </td>
                          <td className="px-4 py-2.5 text-stone-500">{item.unit}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium text-[11px]">
                              {item.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pesticides Preview */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    টেবিল: <code className="font-mono text-blue-800 bg-blue-50 px-1 py-0.5 rounded text-xs">pesticides</code> (কীটনাশক নির্দেশিকা)
                  </h3>
                  <span className="text-xs text-stone-500">
                    UNIQUE(crop, pest)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {samplePesticides.map((pest) => (
                    <div key={pest.id} className="bg-stone-50 rounded-lg p-3.5 border border-stone-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-stone-900 text-sm">{pest.crop} — {pest.pest}</span>
                        <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">ID: {pest.id}</span>
                      </div>
                      <p className="text-xs font-medium text-emerald-800 mb-1">কীটনাশক: {pest.pesticide_name}</p>
                      <p className="text-xs text-stone-600 mb-1.5"><span className="font-medium">মাত্রা:</span> {pest.dosage}</p>
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200/60">
                        <span className="font-medium">সতর্কতা:</span> {pest.precaution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Krishi Offices Preview */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    টেবিল: <code className="font-mono text-amber-800 bg-amber-50 px-1 py-0.5 rounded text-xs">krishi_offices</code> (কৃষি অফিস ডিরেক্টরি)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleOffices.map((office) => (
                    <div key={office.id} className="bg-stone-50 rounded-lg p-3.5 border border-stone-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-stone-900 text-sm">{office.name}</span>
                        <span className="text-xs font-medium bg-amber-100 text-amber-900 px-2 py-0.5 rounded">{office.district}</span>
                      </div>
                      <p className="text-xs text-stone-600 mb-1">{office.address}</p>
                      <p className="text-xs font-mono text-emerald-700 mb-1">📞 {office.phone}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1"><span className="font-medium">সেবাসমূহ:</span> {office.services}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: RENDER DEPLOYMENT GUIDE */}
        {activeTab === 'render' && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Render Deployment Checklist</h2>
                <p className="text-stone-600 text-sm mt-1">
                  Step-by-step instructions for deploying this Flask + PostgreSQL app on Render using the automated blueprint.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-stone-900 text-sm">Commit & Push to GitHub</h4>
                    <p className="text-xs text-stone-600">
                      Ensure your repository includes the updated <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">render.yaml</code>, <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">requirements.txt</code>, and modified <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">api/</code> directory.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-stone-900 text-sm">Create Blueprint on Render</h4>
                    <p className="text-xs text-stone-600">
                      Log into your Render dashboard, click <strong>New +</strong> ➔ <strong>Blueprint</strong>, and select your GitHub repository.
                      Render will automatically parse <code className="font-mono bg-stone-200 px-1 rounded">render.yaml</code> and create both:
                    </p>
                    <ul className="text-xs text-stone-600 list-disc list-inside mt-1 space-y-0.5">
                      <li>The managed PostgreSQL database (<code className="font-mono">krishiapp-postgres</code>)</li>
                      <li>The Gunicorn Flask web service (<code className="font-mono">krishiapp-api</code>)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-stone-900 text-sm">Automatic Seeding During Build</h4>
                    <p className="text-xs text-stone-600">
                      Render executes the build command:
                    </p>
                    <div className="bg-stone-900 text-stone-200 p-2.5 rounded font-mono text-xs mt-1.5">
                      pip install -r requirements.txt && python init_database.py
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      Because <code className="font-mono">DATABASE_URL</code> is connected via the Blueprint, <code className="font-mono">init_database.py</code> runs PostgreSQL DDL and seeds Bengali prices, pesticides, and extension offices automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-stone-900 text-sm">Verify API Key & Endpoints</h4>
                    <p className="text-xs text-stone-600">
                      Copy the generated <code className="font-mono">API_KEY</code> from Render Web Service Environment settings, and test using curl:
                    </p>
                    <div className="bg-stone-900 text-stone-200 p-2.5 rounded font-mono text-xs mt-1.5 overflow-x-auto">
                      curl -H "X-API-KEY: YOUR_RENDER_KEY" https://krishiappbackend.onrender.com/api/prices
                    </div>
                  </div>
                </div>
              </div>

              {/* Render Gotchas */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Important Render PostgreSQL Gotchas & Tips</span>
                </div>
                <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
                  <li><strong>URL Scheme:</strong> Render injects <code className="font-mono">postgres://...</code>, whereas some libraries require <code className="font-mono">postgresql://...</code>. Our <code className="font-mono">api/db.py</code> automatically converts this.</li>
                  <li><strong>Free Plan Hibernation:</strong> Render free databases expire after 30 days unless upgraded, and free web services sleep after 15 min of inactivity. Keep that in mind for production mobile apps.</li>
                  <li><strong>Connection Limit:</strong> Render's free tier has a max of 20 connections. Our pool sets <code className="font-mono">maxconn=10</code>, leaving plenty of headroom.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SQL DDL & QUERIES */}
        {activeTab === 'sql' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">PostgreSQL DDL Statements</h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    The exact PostgreSQL DDL executed by <code className="font-mono">init_database.py</code> on Render.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(`-- Prices Table
CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_possessive TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'সবজি'
);

-- Pesticides Table
CREATE TABLE IF NOT EXISTS pesticides (
    id SERIAL PRIMARY KEY,
    crop TEXT NOT NULL,
    pest TEXT NOT NULL,
    pesticide_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    precaution TEXT NOT NULL,
    UNIQUE(crop, pest)
);

-- Krishi Extension Offices Table
CREATE TABLE IF NOT EXISTS krishi_offices (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    services TEXT NOT NULL
);`, 'ddl-all')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedKey === 'ddl-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy DDL Script</span>
                </button>
              </div>

              <div className="bg-stone-950 text-stone-200 p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto">
                <pre>{`-- 1. Vegetable & Commodity Prices Table
CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_possessive TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'সবজি'
);

-- 2. Crop Protection & Pesticides Table
CREATE TABLE IF NOT EXISTS pesticides (
    id SERIAL PRIMARY KEY,
    crop TEXT NOT NULL,
    pest TEXT NOT NULL,
    pesticide_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    precaution TEXT NOT NULL,
    UNIQUE(crop, pest)
);

-- 3. Krishi Extension Offices Directory Table
CREATE TABLE IF NOT EXISTS krishi_offices (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    services TEXT NOT NULL
);

-- PostgreSQL Upsert Pattern Used in API:
INSERT INTO prices (name, name_possessive, price, unit, category)
VALUES (%(name)s, %(name_possessive)s, %(price)s, %(unit)s, %(category)s)
ON CONFLICT (name) DO UPDATE SET
    name_possessive = EXCLUDED.name_possessive,
    price = EXCLUDED.price,
    unit = EXCLUDED.unit,
    category = EXCLUDED.category;`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FLUTTER APP CONNECTION */}
        {activeTab === 'flutter' && (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      Flutter + Dart
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      Render Blueprint API
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 mt-2">
                    Connecting Your Existing Flutter App to Render
                  </h2>
                  <p className="text-stone-600 text-sm mt-1">
                    Follow these 4 simple steps to point your Flutter client to the newly deployed Render backend service.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href="https://dashboard.render.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <span>Render Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 1: Environment / Config File */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Configure <code className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">lib/config/api_config.dart</code>
                  </h3>
                </div>
                <p className="text-xs text-stone-600 pl-8">
                  Create or update your API configuration file. Replace <code className="font-mono bg-stone-100 px-1 rounded">krishiapp-api.onrender.com</code> with your actual Render service URL and paste your generated <code className="font-mono bg-stone-100 px-1 rounded">API_KEY</code>:
                </p>
                <div className="ml-8 bg-stone-900 text-stone-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative">
                  <button
                    onClick={() => copyToClipboard(`// lib/config/api_config.dart
class ApiConfig {
  // Replace with your actual Render web service URL (without trailing slash)
  static const String baseUrl = 'https://krishiappbackend.onrender.com/api';

  // The API key auto-generated by Render blueprint (from Environment settings)
  static const String apiKey = 'YOUR_RENDER_API_KEY';

  // Render Free Tier sleep timeout: allow up to 60s for cold starts
  static const Duration timeout = Duration(seconds: 45);

  static Map<String, String> get headers => {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
  };

  static Map<String, String> get authHeaders => {
    ...headers,
    'X-API-KEY': apiKey,
  };
}`, 'flutter-config')}
                    className="absolute top-3 right-3 text-stone-400 hover:text-white bg-stone-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'flutter-config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'flutter-config' ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <pre>{`// lib/config/api_config.dart
class ApiConfig {
  // Replace with your actual Render web service URL (without trailing slash)
  static const String baseUrl = 'https://krishiappbackend.onrender.com/api';

  // The API key auto-generated by Render blueprint (from Environment settings)
  static const String apiKey = 'YOUR_RENDER_API_KEY';

  // Render Free Tier sleep timeout: allow up to 45s for initial cold start
  static const Duration timeout = Duration(seconds: 45);

  static Map<String, String> get headers => {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
  };

  static Map<String, String> get authHeaders => {
    ...headers,
    'X-API-KEY': apiKey,
  };
}`}</pre>
                </div>
              </div>

              {/* Step 2: HTTP Service with UTF-8 Bengali Decoding */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Implement the API Service (<code className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">lib/services/krishi_api_service.dart</code>)
                  </h3>
                </div>
                <p className="text-xs text-stone-600 pl-8">
                  Using <code className="font-mono bg-stone-100 px-1 rounded">package:http</code>. <span className="font-semibold text-emerald-900">Critical:</span> use <code className="font-mono bg-stone-100 px-1 rounded text-emerald-800">utf8.decode(response.bodyBytes)</code> so Bengali text is parsed cleanly without character corruption.
                </p>
                <div className="ml-8 bg-stone-900 text-stone-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative max-h-[380px]">
                  <button
                    onClick={() => copyToClipboard(`import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class KrishiApiService {
  // 1. Fetch Prices (optional category filter)
  static Future<List<Map<String, dynamic>>> fetchPrices({String? category}) async {
    final uri = Uri.parse(category != null
        ? '\${ApiConfig.baseUrl}/prices?category=\${Uri.encodeComponent(category)}'
        : '\${ApiConfig.baseUrl}/prices');

    final response = await http.get(uri, headers: ApiConfig.headers).timeout(ApiConfig.timeout);

    if (response.statusCode == 200) {
      // Decode with utf8.decode to preserve Bengali characters
      final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load prices: \${response.statusCode}');
    }
  }

  // 2. Fetch Pesticides Guide (optional crop filter)
  static Future<List<Map<String, dynamic>>> fetchPesticides({String? crop}) async {
    final uri = Uri.parse(crop != null
        ? '\${ApiConfig.baseUrl}/pesticides?crop=\${Uri.encodeComponent(crop)}'
        : '\${ApiConfig.baseUrl}/pesticides');

    final response = await http.get(uri, headers: ApiConfig.headers).timeout(ApiConfig.timeout);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load pesticides: \${response.statusCode}');
    }
  }

  // 3. Fetch Krishi Extension Offices
  static Future<List<Map<String, dynamic>>> fetchOffices({String? district}) async {
    final uri = Uri.parse(district != null
        ? '\${ApiConfig.baseUrl}/krishi_offices?district=\${Uri.encodeComponent(district)}'
        : '\${ApiConfig.baseUrl}/krishi_offices');

    final response = await http.get(uri, headers: ApiConfig.headers).timeout(ApiConfig.timeout);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load offices: \${response.statusCode}');
    }
  }

  // 4. Update Single Price (Admin / Protected by X-API-KEY)
  static Future<bool> updatePrice(String name, double newPrice) async {
    final uri = Uri.parse('\${ApiConfig.baseUrl}/prices/\${Uri.encodeComponent(name)}');
    final response = await http.patch(
      uri,
      headers: ApiConfig.authHeaders,
      body: jsonEncode({'price': newPrice}),
    ).timeout(ApiConfig.timeout);

    return response.statusCode == 200;
  }
}`, 'flutter-service')}
                    className="absolute top-3 right-3 text-stone-400 hover:text-white bg-stone-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'flutter-service' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'flutter-service' ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <pre>{`import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class KrishiApiService {
  // 1. Fetch Prices (optional category filter)
  static Future<List<Map<String, dynamic>>> fetchPrices({String? category}) async {
    final uri = Uri.parse(category != null
        ? '\${ApiConfig.baseUrl}/prices?category=\${Uri.encodeComponent(category)}'
        : '\${ApiConfig.baseUrl}/prices');

    final response = await http.get(uri, headers: ApiConfig.headers).timeout(ApiConfig.timeout);

    if (response.statusCode == 200) {
      // Decode with utf8.decode to preserve Bengali characters
      final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load prices: \${response.statusCode}');
    }
  }

  // 2. Fetch Pesticides Guide (optional crop filter)
  static Future<List<Map<String, dynamic>>> fetchPesticides({String? crop}) async {
    final uri = Uri.parse(crop != null
        ? '\${ApiConfig.baseUrl}/pesticides?crop=\${Uri.encodeComponent(crop)}'
        : '\${ApiConfig.baseUrl}/pesticides');

    final response = await http.get(uri, headers: ApiConfig.headers).timeout(ApiConfig.timeout);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load pesticides: \${response.statusCode}');
    }
  }

  // 3. Fetch Krishi Extension Offices
  static Future<List<Map<String, dynamic>>> fetchOffices({String? district}) async {
    final uri = Uri.parse(district != null
        ? '\${ApiConfig.baseUrl}/krishi_offices?district=\${Uri.encodeComponent(district)}'
        : '\${ApiConfig.baseUrl}/krishi_offices');

    final response = await http.get(uri, headers: ApiConfig.headers).timeout(ApiConfig.timeout);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to load offices: \${response.statusCode}');
    }
  }

  // 4. Update Single Price (Admin / Protected by X-API-KEY)
  static Future<bool> updatePrice(String name, double newPrice) async {
    final uri = Uri.parse('\${ApiConfig.baseUrl}/prices/\${Uri.encodeComponent(name)}');
    final response = await http.patch(
      uri,
      headers: ApiConfig.authHeaders,
      body: jsonEncode({'price': newPrice}),
    ).timeout(ApiConfig.timeout);

    return response.statusCode == 200;
  }
}`}</pre>
                </div>
              </div>

              {/* Step 3: Handling Render Free Tier Cold-Starts in Flutter */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Handling Render Free Tier Cold Starts
                  </h3>
                </div>
                <div className="ml-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Render Free Tier Sleep Mode:
                  </p>
                  <p>
                    On Render's free tier, the web service sleeps after 15 minutes of inactivity. The <strong>very first request</strong> after sleeping takes about <strong>30–50 seconds</strong> while the container boots up. Subsequent requests respond in milliseconds.
                  </p>
                  <p className="font-medium">Flutter Best Practices for Cold Starts:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Set the HTTP request timeout to at least <strong>45 seconds</strong>.</li>
                    <li>Display a friendly loading indicator: <em>"সার্ভার চালু হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..."</em> (Starting server, please wait...).</li>
                    <li>Or add an initial ping to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/api/health</code> when the app launches (e.g. in your Splash Screen) so the server is awake by the time the user reaches the main screen.</li>
                  </ul>
                </div>
              </div>

              {/* Step 4: Network Permissions */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Android & iOS Permissions
                  </h3>
                </div>
                <p className="text-xs text-stone-600 pl-8">
                  Verify internet permission in <code className="font-mono bg-stone-100 px-1 rounded">android/app/src/main/AndroidManifest.xml</code>:
                </p>
                <div className="ml-8 bg-stone-900 text-stone-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <pre>{`<uses-permission android:name="android.permission.INTERNET"/>`}</pre>
                </div>
                <p className="text-xs text-stone-600 pl-8 mt-1">
                  Render serves all traffic over trusted HTTPS with valid SSL certificates, so no plaintext HTTP or network security exceptions are needed.
                </p>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500">
        KrishiApp Flask + PostgreSQL Migration Hub • Prepared for Render Deployment (Singapore Region)
      </footer>
    </div>
  );
}
