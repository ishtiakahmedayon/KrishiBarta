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
  Smartphone,
  TrendingUp,
  Upload,
  Download,
  FileSpreadsheet,
  Clock,
  CloudSun,
  MapPin,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Navigation
} from 'lucide-react';

type Tab = 'overview' | 'diffs' | 'schema' | 'render' | 'sql' | 'flutter' | 'dynamic' | 'weather';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('db.py');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dynamic Prices & CSV State
  const [bengaliTestInput, setBengaliTestInput] = useState<string>('৩৫-৪০ টাকা');
  const [selectedTrendCrop, setSelectedTrendCrop] = useState<string>('আলু');
  const [csvText, setCsvText] = useState<string>(
`name,name_possessive,price,unit,category
আলু,আলুর,২৮-৩২ টাকা,টাকা/কেজি,সবজি
পেঁয়াজ,পেঁয়াজের,৬৮-৭২ টাকা,টাকা/কেজি,মশলা
বেগুন,বেগুনের,৩৮-৪২ টাকা,টাকা/কেজি,সবজি
টমেটো,টমেটোর,৫০-৫৫ টাকা,টাকা/কেজি,সবজি
রসুন,রসুনের,১৭৫-১৮৫ টাকা,টাকা/কেজি,মশলা
কাঁচামরিচ,কাঁচামরিচের,১৩০-১৫০ টাকা,টাকা/কেজি,মশলা`
  );
  const [parsedCsvCount, setParsedCsvCount] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Weather & Geo State
  const [geoSearchQuery, setGeoSearchQuery] = useState<string>('টাঙ্গাইল');
  const [selectedGeo, setSelectedGeo] = useState<any>({
    name_bn: 'টাঙ্গাইল',
    name_en: 'Tangail',
    type: 'district',
    district_bn: 'টাঙ্গাইল',
    district_en: 'Tangail',
    division_bn: 'ঢাকা',
    division_en: 'Dhaka',
    latitude: 24.2513,
    longitude: 89.9167
  });
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  const sampleGeoDataset = [
    { name_bn: 'টাঙ্গাইল', name_en: 'Tangail', type: 'district', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.2513, longitude: 89.9167 },
    { name_bn: 'ঘাটাইল', name_en: 'Ghatail', type: 'upazila', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.4983, longitude: 89.9754 },
    { name_bn: 'মধুপুর', name_en: 'Madhupur', type: 'upazila', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.6167, longitude: 90.0333 },
    { name_bn: 'সখীপুর', name_en: 'Sakhipur', type: 'upazila', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.3167, longitude: 90.1667 },
    { name_bn: 'গোপালপুর', name_en: 'Gopalpur', type: 'upazila', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.5500, longitude: 89.9167 },
    { name_bn: 'কালিহাতী', name_en: 'Kalihati', type: 'upazila', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.3833, longitude: 90.0000 },
    { name_bn: 'মির্জাপুর', name_en: 'Mirzapur', type: 'upazila', district_bn: 'টাঙ্গাইল', division_bn: 'ঢাকা', latitude: 24.1000, longitude: 90.1000 },
    { name_bn: 'ঢাকা', name_en: 'Dhaka', type: 'district', district_bn: 'ঢাকা', division_bn: 'ঢাকা', latitude: 23.8103, longitude: 90.4125 },
    { name_bn: 'মিরপুর', name_en: 'Mirpur', type: 'upazila', district_bn: 'ঢাকা', division_bn: 'ঢাকা', latitude: 23.8223, longitude: 90.3654 },
    { name_bn: 'চট্টগ্রাম', name_en: 'Chittagong', type: 'district', district_bn: 'চট্টগ্রাম', division_bn: 'চট্টগ্রাম', latitude: 22.3569, longitude: 91.7832 },
    { name_bn: 'পটিয়া', name_en: 'Patiya', type: 'upazila', district_bn: 'চট্টগ্রাম', division_bn: 'চট্টগ্রাম', latitude: 22.2961, longitude: 91.9794 },
    { name_bn: 'কক্সবাজার', name_en: 'Cox\'s Bazar', type: 'district', district_bn: 'কক্সবাজার', division_bn: 'চট্টগ্রাম', latitude: 21.4272, longitude: 92.0058 },
    { name_bn: 'টেকনাফ', name_en: 'Teknaf', type: 'upazila', district_bn: 'কক্সবাজার', division_bn: 'চট্টগ্রাম', latitude: 20.8667, longitude: 92.3000 },
    { name_bn: 'সিলেট', name_en: 'Sylhet', type: 'district', district_bn: 'সিলেট', division_bn: 'সিলেট', latitude: 24.8949, longitude: 91.8687 },
    { name_bn: 'শ্রীমঙ্গল', name_en: 'Sreemangal', type: 'upazila', district_bn: 'মৌলভীবাজার', division_bn: 'সিলেট', latitude: 24.3083, longitude: 91.7333 },
    { name_bn: 'রাজশাহী', name_en: 'Rajshahi', type: 'district', district_bn: 'রাজশাহী', division_bn: 'রাজশাহী', latitude: 24.3745, longitude: 88.6042 },
    { name_bn: 'বগুড়া', name_en: 'Bogra', type: 'district', district_bn: 'বগুড়া', division_bn: 'রাজশাহী', latitude: 24.8465, longitude: 89.3777 },
    { name_bn: 'রংপুর', name_en: 'Rangpur', type: 'district', district_bn: 'রংপুর', division_bn: 'রংপুর', latitude: 25.7439, longitude: 89.2752 },
    { name_bn: 'খুলনা', name_en: 'Khulna', type: 'district', district_bn: 'খুলনা', division_bn: 'খুলনা', latitude: 22.8456, longitude: 89.5403 },
    { name_bn: 'বরিশাল', name_en: 'Barisal', type: 'district', district_bn: 'বরিশাল', division_bn: 'বরিশাল', latitude: 22.7010, longitude: 90.3535 },
    { name_bn: 'ময়মনসিংহ', name_en: 'Mymensingh', type: 'district', district_bn: 'ময়মনসিংহ', division_bn: 'ময়মনসিংহ', latitude: 24.7471, longitude: 90.4203 },
  ];

  const parseBnPrice = (str: string): number => {
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    };
    const translated = str.replace(/[০-৯]/g, (d) => bnToEn[d] || d).replace(/থেকে/g, '-');
    const matches = translated.match(/\d+(?:\.\d+)?/g);
    if (!matches || matches.length === 0) return 0;
    const nums = matches.map(Number);
    if (nums.length >= 2) return Math.round(((nums[0] + nums[1]) / 2) * 10) / 10;
    return nums[0];
  };

  const cropHistoryTrends: Record<string, { date: string; price: number }[]> = {
    'আলু': [
      { date: '25 Oct', price: 28.0 },
      { date: '26 Oct', price: 28.5 },
      { date: '27 Oct', price: 29.0 },
      { date: '28 Oct', price: 29.5 },
      { date: '29 Oct', price: 30.0 },
      { date: '30 Oct', price: 31.0 },
      { date: '31 Oct', price: 30.0 },
    ],
    'পেঁয়াজ': [
      { date: '25 Oct', price: 65.0 },
      { date: '26 Oct', price: 68.0 },
      { date: '27 Oct', price: 70.0 },
      { date: '28 Oct', price: 72.0 },
      { date: '29 Oct', price: 75.0 },
      { date: '30 Oct', price: 72.0 },
      { date: '31 Oct', price: 70.0 },
    ],
    'বেগুন': [
      { date: '25 Oct', price: 35.0 },
      { date: '26 Oct', price: 38.0 },
      { date: '27 Oct', price: 42.0 },
      { date: '28 Oct', price: 40.0 },
      { date: '29 Oct', price: 45.0 },
      { date: '30 Oct', price: 42.0 },
      { date: '31 Oct', price: 40.0 },
    ],
    'টমেটো': [
      { date: '25 Oct', price: 60.0 },
      { date: '26 Oct', price: 58.0 },
      { date: '27 Oct', price: 55.0 },
      { date: '28 Oct', price: 56.0 },
      { date: '29 Oct', price: 54.0 },
      { date: '30 Oct', price: 55.0 },
      { date: '31 Oct', price: 55.0 },
    ],
    'রসুন': [
      { date: '25 Oct', price: 170.0 },
      { date: '26 Oct', price: 172.0 },
      { date: '27 Oct', price: 175.0 },
      { date: '28 Oct', price: 178.0 },
      { date: '29 Oct', price: 180.0 },
      { date: '30 Oct', price: 182.0 },
      { date: '31 Oct', price: 180.0 },
    ],
    'চাল': [
      { date: '25 Oct', price: 56.0 },
      { date: '26 Oct', price: 56.5 },
      { date: '27 Oct', price: 57.0 },
      { date: '28 Oct', price: 57.0 },
      { date: '29 Oct', price: 57.5 },
      { date: '30 Oct', price: 58.0 },
      { date: '31 Oct', price: 58.0 },
    ],
  };

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
            <button
              onClick={() => setActiveTab('dynamic')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'dynamic'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>Dynamic Prices & CSV Seeding</span>
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                activeTab === 'weather'
                  ? 'bg-stone-50 text-emerald-900 font-semibold shadow-sm'
                  : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <CloudSun className="w-4 h-4 text-sky-300" />
              <span>Bengali Weather & Geo Search</span>
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

        {/* TAB 7: DYNAMIC PRICES & CSV SEEDING */}
        {activeTab === 'dynamic' && (
          <div className="space-y-8">
            {/* Top Banner Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      স্বয়ংক্রিয় বাজারদর
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      Web Scraper + CSV Fallback
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      Render Cron Daily
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 mt-2">
                    Dynamic Market Prices & Automated Ingestion System
                  </h2>
                  <p className="text-stone-600 text-sm mt-1 max-w-3xl leading-relaxed">
                    Automatically ingests daily commodity prices from agricultural bulletins (DAM / TCB), normalizes Bengali numerals and price ranges (e.g. <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-emerald-800">৩৫-৪০ টাকা</code> ➔ <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-emerald-800">37.5 ৳</code>), tracks historical trends for Flutter charts, and provides a 30-second CSV upload fallback.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setIsSyncing(true);
                      setSyncStatus("স্ক্র্যাপার চলছে: কৃষি বিপণন অধিদপ্তর (DAM) থেকে ডেটা সংগৃহীত হচ্ছে...");
                      setTimeout(() => {
                        setIsSyncing(false);
                        setSyncStatus("✅ সফল: ২০ টি কৃষিপণ্যের বাজারদর এবং আজকের ঐতিহাসিক স্ন্যাপশট হালনাগাদ হয়েছে!");
                      }, 1200);
                    }}
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium text-sm transition-colors shadow-xs"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'স্ক্র্যাপার চালান (Run Scraper)'}</span>
                  </button>
                </div>
              </div>

              {/* Status Alert Banner */}
              {syncStatus && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center justify-between">
                  <span className="font-medium">{syncStatus}</span>
                  <button 
                    onClick={() => setSyncStatus(null)}
                    className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 3 Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    <h4>1. Automated Daily Scraper</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Runs every morning at 06:00 BST via Render Cron or background worker. Scrapes daily retail and wholesale bulletin tables from public agricultural sources.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center space-x-2 text-blue-800 font-semibold text-sm mb-1">
                    <Code2 className="w-4 h-4" />
                    <h4>2. Bengali Numeral Normalizer</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Converts Bengali digits (<code className="font-mono text-blue-900">০-৯</code>) to numbers, parses price ranges (<code className="font-mono text-blue-900">৩৫-৪০</code> ➔ average <code className="font-mono text-blue-900">37.5</code>), and removes currency symbols.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center space-x-2 text-amber-800 font-semibold text-sm mb-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    <h4>3. CSV / Excel Fallback</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    If an external website alters its structure or experiences downtime, field officers can upload a CSV spreadsheet directly via API or dashboard without downtime.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Bengali Numeral & Range Normalizer Playground */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    বাংলা সংখ্যা ও রেঞ্জ কনভার্টার টেস্ট (Bengali Normalizer Playground)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Test how the Python normalizer converts Bengali text and price ranges into clean JSON floats for Flutter:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">
                    ইনপুট টেক্সট (Input Text / Bengali Range):
                  </label>
                  <input
                    type="text"
                    value={bengaliTestInput}
                    onChange={(e) => setBengaliTestInput(e.target.value)}
                    placeholder="যেমন: ৩৫-৪০ টাকা বা ৳ ১২০.৫০"
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 font-medium"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-stone-400 mr-1">নমুনা টেস্ট:</span>
                    {['৩৫-৪০ টাকা', '৳ ১২০ থেকে ১৪০ টাকা/কেজি', '২৮ টাকা/কেজি', '১৭৫.৫০ টাকা', '৫৬-৬০ টাকা'].map((sample) => (
                      <button
                        key={sample}
                        onClick={() => setBengaliTestInput(sample)}
                        className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded transition-colors"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-stone-900 text-stone-100 rounded-lg font-mono text-xs space-y-1.5">
                  <div className="text-stone-400 text-[11px] uppercase tracking-wider">
                    PostgreSQL / JSON Output:
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-stone-400">price:</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {parseBnPrice(bengaliTestInput)}
                    </span>
                    <span className="text-stone-400 text-xs">(Float / Number)</span>
                  </div>
                  <p className="text-stone-400 text-[11px] pt-1">
                    Python API returns: <code className="text-emerald-300 font-semibold">{`{"price": ${parseBnPrice(bengaliTestInput)}}`}</code> (Native numeric, no String cast error in Dart!)
                  </p>
                </div>
              </div>
            </div>

            {/* 7-Day Historical Trend Visualizer */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-stone-900 text-base">
                      ৭ দিনের বাজারদর ট্রেন্ড ও ঐতিহাসিক চার্ট (Historical Trends)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Powered by the new <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">price_history</code> table. Flutter apps call <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">GET /api/prices/:name/history</code>.
                  </p>
                </div>

                {/* Crop selector */}
                <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                  {Object.keys(cropHistoryTrends).map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedTrendCrop(crop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedTrendCrop === crop
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart & Stats Container */}
              {(() => {
                const data = cropHistoryTrends[selectedTrendCrop] || [];
                const prices = data.map(d => d.price);
                const minPrice = Math.min(...prices) * 0.95;
                const maxPrice = Math.max(...prices) * 1.05;
                const priceRange = maxPrice - minPrice || 1;
                const startPrice = prices[0];
                const endPrice = prices[prices.length - 1];
                const delta = endPrice - startPrice;
                const deltaPercent = ((delta / startPrice) * 100).toFixed(1);

                // SVG points calculation
                const width = 600;
                const height = 180;
                const padding = 30;
                const usableWidth = width - padding * 2;
                const usableHeight = height - padding * 2;

                const points = data.map((d, idx) => {
                  const x = padding + (idx / (data.length - 1)) * usableWidth;
                  const y = height - padding - ((d.price - minPrice) / priceRange) * usableHeight;
                  return { x, y, ...d };
                });

                const pathD = points.reduce((acc, p, idx) => {
                  return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, "");

                const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    {/* Trend Stats */}
                    <div className="space-y-4 lg:border-r lg:border-stone-100 lg:pr-6">
                      <div>
                        <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                          নির্বাচিত পণ্য
                        </span>
                        <div className="text-2xl font-bold text-stone-900 mt-0.5">
                          {selectedTrendCrop}
                        </div>
                      </div>

                      <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                        <div className="text-xs text-stone-500">বর্তমান খুচরা দর:</div>
                        <div className="text-xl font-bold text-emerald-700 mt-0.5">
                          ৳{endPrice.toFixed(1)} /কেজি
                        </div>
                        <div className="flex items-center space-x-1.5 mt-1.5 text-xs">
                          <span className={`font-semibold ${delta >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {delta >= 0 ? `+৳${delta.toFixed(1)}` : `-৳${Math.abs(delta).toFixed(1)}`} ({deltaPercent}%)
                          </span>
                          <span className="text-stone-400">৭ দিনের পরিবর্তন</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500">
                        ডাটা সোর্স: <span className="font-semibold text-stone-700">dam.gov.bd</span>
                      </div>
                    </div>

                    {/* SVG Curve Chart */}
                    <div className="lg:col-span-3 bg-stone-50/60 p-4 rounded-xl border border-stone-200 overflow-x-auto">
                      <div className="min-w-[500px]">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
                          <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
                          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Gradient Fill Area */}
                          <path d={areaD} fill="url(#trendGradient)" />

                          {/* Line */}
                          <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Points */}
                          {points.map((p, i) => (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">
                                ৳{p.price}
                              </text>
                              <text x={p.x} y={height - 10} textAnchor="middle" fontSize="9" fill="#6b7280">
                                {p.date}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* CSV Seeding Console & Dropzone */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    CSV / Excel ফাইল দিয়ে বাজারদর সিডিং ও আপডেট (Bulk CSV Ingestion)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload or paste market price CSVs. Accepts both Bengali and English column headers.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const sampleCsv = `name,name_possessive,price,unit,category\nআলু,আলুর,২৮-৩২ টাকা,টাকা/কেজি,সবজি\nপেঁয়াজ,পেঁয়াজের,৬৮-৭২ টাকা,টাকা/কেজি,মশলা\nরসুন,রসুনের,১৭৫-১৮৫ টাকা,টাকা/কেজি,মশলা\nটমেটো,টমেটোর,৫০-৫৫ টাকা,টাকা/কেজি,সবজি\nচাল,চালের,৫৬-৬০ টাকা,টাকা/কেজি,শস্য`;
                      setCsvText(sampleCsv);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>লোড নমুনা CSV (Sample CSV)</span>
                  </button>
                </div>
              </div>

              {/* Textarea & Actions */}
              <div className="space-y-3">
                <textarea
                  rows={7}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="name,name_possessive,price,unit,category..."
                  className="w-full text-xs font-mono p-3 bg-stone-900 text-stone-100 rounded-lg border border-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-stone-500">
                    সমর্থিত কলাম: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">name</code>, <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">price (বাংলা/ইংরেজি)</code>, <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">unit</code>, <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">category</code>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const lines = csvText.trim().split('\n');
                        const validRows = lines.length > 1 ? lines.length - 1 : 0;
                        setParsedCsvCount(validRows);
                        setSyncStatus(`সফলভাবে ${validRows} টি পণ্যের CSV ভ্যালিডেশন সম্পন্ন হয়েছে! API প্রস্তুত।`);
                      }}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ভ্যালিডেট ও প্রিভিউ (Validate & Preview)</span>
                    </button>
                  </div>
                </div>

                {/* Parsed Preview Table */}
                {parsedCsvCount !== null && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-800">
                        পার্সড রেকর্ড প্রিভিউ ({parsedCsvCount} টি আইটেম সনাক্ত):
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        ✓ বাংলা সংখ্যা ➔ সংখ্যায় রূপান্তরিত
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-stone-200">
                      <table className="min-w-full divide-y divide-stone-200 text-xs">
                        <thead className="bg-stone-50 text-stone-600 font-medium">
                          <tr>
                            <th className="px-3 py-2 text-left">নাম (Name)</th>
                            <th className="px-3 py-2 text-left">সম্বন্ধবাচক (Possessive)</th>
                            <th className="px-3 py-2 text-right">রূপান্তরিত মূল্য (Parsed Float)</th>
                            <th className="px-3 py-2 text-left">একক (Unit)</th>
                            <th className="px-3 py-2 text-left">বিভাগ (Category)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-100 font-mono">
                          {csvText.trim().split('\n').slice(1).map((line, idx) => {
                            const cols = line.split(',');
                            if (cols.length < 3) return null;
                            const name = cols[0]?.trim();
                            const poss = cols[1]?.trim();
                            const rawPrice = cols[2]?.trim();
                            const parsedPrice = parseBnPrice(rawPrice);
                            const unit = cols[3]?.trim() || 'টাকা/কেজি';
                            const cat = cols[4]?.trim() || 'সবজি';
                            return (
                              <tr key={idx} className="hover:bg-emerald-50/40">
                                <td className="px-3 py-1.5 font-sans font-semibold text-stone-800">{name}</td>
                                <td className="px-3 py-1.5 font-sans text-stone-500">{poss}</td>
                                <td className="px-3 py-1.5 text-right font-bold text-emerald-700">
                                  ৳{parsedPrice.toFixed(1)} <span className="text-[10px] text-stone-400 font-normal">({rawPrice})</span>
                                </td>
                                <td className="px-3 py-1.5 font-sans text-stone-500">{unit}</td>
                                <td className="px-3 py-1.5 font-sans">
                                  <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded text-[10px]">
                                    {cat}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flutter API Integration Snippets */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Flutter এ ট্রেন্ড চার্ট ও CSV আপলোড ব্যবহার (Flutter Integration)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    How Flutter clients call the new dynamic endpoints to plot price history charts or upload market CSV files:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Fetch History Snippet */}
                <div className="bg-stone-900 text-stone-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
                    <span className="text-emerald-400 text-xs font-semibold">1. Fetch 7-Day Trend History</span>
                    <button
                      onClick={() => copyToClipboard(`// Fetch 7-day trend history for line charts in Flutter
static Future<List<Map<String, dynamic>>> fetchCropHistory(String cropName) async {
  final uri = Uri.parse('\${ApiConfig.baseUrl}/prices/\${Uri.encodeComponent(cropName)}/history?limit=7');
  final response = await http.get(uri, headers: ApiConfig.headers);
  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.cast<Map<String, dynamic>>();
  }
  return [];
}`, 'flutter-history-code')}
                      className="text-stone-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'flutter-history-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre>{`// Fetch 7-day trend history for line charts in Flutter
static Future<List<Map<String, dynamic>>> fetchCropHistory(String cropName) async {
  final uri = Uri.parse(
    '\${ApiConfig.baseUrl}/prices/\${Uri.encodeComponent(cropName)}/history?limit=7'
  );
  final response = await http.get(uri, headers: ApiConfig.headers);
  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.cast<Map<String, dynamic>>();
  }
  return [];
}`}</pre>
                </div>

                {/* 2. Upload CSV Snippet */}
                <div className="bg-stone-900 text-stone-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
                    <span className="text-blue-400 text-xs font-semibold">2. Upload CSV File / Text</span>
                    <button
                      onClick={() => copyToClipboard(`// Upload CSV price updates (Admin / protected)
static Future<bool> uploadPriceCsv(String csvString) async {
  final uri = Uri.parse('\${ApiConfig.baseUrl}/prices/upload-csv');
  final response = await http.post(
    uri,
    headers: ApiConfig.authHeaders,
    body: jsonEncode({'csv': csvString}),
  );
  return response.statusCode == 200;
}`, 'flutter-csv-upload-code')}
                      className="text-stone-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'flutter-csv-upload-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre>{`// Upload CSV price updates (Admin / protected)
static Future<bool> uploadPriceCsv(String csvString) async {
  final uri = Uri.parse('\${ApiConfig.baseUrl}/prices/upload-csv');
  final response = await http.post(
    uri,
    headers: ApiConfig.authHeaders,
    body: jsonEncode({'csv': csvString}),
  );
  return response.statusCode == 200;
}`}</pre>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: BENGALI WEATHER & GEO SEARCH */}
        {activeTab === 'weather' && (
          <div className="space-y-8">
            {/* Overview & Problem Resolution Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-sky-100 text-sky-900 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      বাংলায় আবহাওয়া
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      ৬৪ জেলা ও ৪৯৫ উপজেলা
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      Open-Meteo Weather API
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 mt-2">
                    Bengali Weather Resolution & Bangladesh Geo Lookup
                  </h2>
                  <p className="text-stone-600 text-sm mt-1 max-w-3xl leading-relaxed">
                    Solves the issue where searching in English (<code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">Tangail</code>) works but Bengali (<code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">টাঙ্গাইল</code>) fails. The backend resolves any Bengali or English location into exact GPS coordinates and fetches real-time Open-Meteo weather with Bengali translations.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="flex items-center space-x-1.5 bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-mono text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PostgreSQL geo_locations</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis: Why did টাঙ্গাইল fail before? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-950 space-y-2">
                  <div className="font-bold text-red-900 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>পূর্ববর্তী সমস্যা (Why "টাঙ্গাইল" Failed):</span>
                  </div>
                  <p className="leading-relaxed">
                    OpenWeatherMap বা Open-Meteo এর মতো আন্তর্জাতিক আবহাওয়া এপিআইগুলো বাংলা অক্ষর চিনতে পারে না। যখন আপনার Flutter অ্যাপ সরাসরি <code className="bg-red-100 px-1 py-0.5 rounded font-mono">q=টাঙ্গাইল</code> দিয়ে রিকোয়েস্ট পাঠাত, তখন আবহাওয়া এপিআই <strong className="text-red-900">404 Not Found</strong> বা খালি ফলাফল পাঠাত।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ব্যাকএন্ড সমাধান (The New Backend Architecture):</span>
                  </div>
                  <p className="leading-relaxed">
                    ব্যাকএন্ডের <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-semibold">geo_locations</code> টেবিলে বাংলাদেশের সব ৬৪ জেলা ও উপজেলা সংরক্ষিত রয়েছে। ব্যাকএন্ড <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">টাঙ্গাইল</code> চিনতে পারে, এর GPS স্থানাঙ্ক (<code className="font-mono">24.2513, 89.9167</code>) দিয়ে Open-Meteo থেকে আবহাওয়া আনে এবং বাংলায় ফলাফল প্রদর্শন করে।
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Bengali Search & Weather Demo */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-600" />
                    বাংলায় জেলা ও উপজেলা আবহাওয়া টেস্ট (Live Bengali Weather Search)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Search by typing in Bengali or English. Click on any area to test coordinate resolution and live Open-Meteo weather.
                  </p>
                </div>
              </div>

              {/* Search Bar & Quick Suggestion Chips */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={geoSearchQuery}
                    onChange={(e) => setGeoSearchQuery(e.target.value)}
                    placeholder="বাংলায় জেলা বা উপজেলার নাম লিখুন (যেমন: টাঙ্গাইল, ঘাটাইল, মধুপুর, মিরপুর, পটিয়া)..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 font-medium"
                  />
                </div>

                {/* Quick test pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-stone-500 font-medium mr-1">দ্রুত টেস্ট করুন:</span>
                  {[
                    { label: 'টাঙ্গাইল (জেলা)', query: 'টাঙ্গাইল' },
                    { label: 'ঘাটাইল (উপজেলা)', query: 'ঘাটাইল' },
                    { label: 'মধুপুর (উপজেলা)', query: 'মধুপুর' },
                    { label: 'সখীপুর (উপজেলা)', query: 'সখীপুর' },
                    { label: 'মিরপুর (ঢাকা)', query: 'মিরপুর' },
                    { label: 'পটিয়া (চট্টগ্রাম)', query: 'পটিয়া' },
                    { label: 'শ্রীমঙ্গল (সিলেট)', query: 'শ্রীমঙ্গল' },
                  ].map((chip) => (
                    <button
                      key={chip.query}
                      onClick={() => setGeoSearchQuery(chip.query)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        geoSearchQuery === chip.query
                          ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched Location & Weather Display */}
              {(() => {
                const query = geoSearchQuery.trim();
                const matchedList = sampleGeoDataset.filter(
                  (item) =>
                    item.name_bn.includes(query) ||
                    item.name_en.toLowerCase().includes(query.toLowerCase()) ||
                    item.district_bn.includes(query)
                );

                const activeLoc = matchedList[0] || selectedGeo;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    {/* Location List Panel */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                        <span>সনাক্তকৃত এলাকা ({matchedList.length} টি ফলাফল)</span>
                        <span className="text-[11px] text-stone-400">geo_locations</span>
                      </div>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {matchedList.length === 0 ? (
                          <div className="p-4 bg-stone-50 rounded-lg text-center text-xs text-stone-500 border border-dashed border-stone-300">
                            '{geoSearchQuery}' নামে কোনো এলাকা খুঁজে পাওয়া যায়নি।
                          </div>
                        ) : (
                          matchedList.map((loc, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedGeo(loc)}
                              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                                selectedGeo?.name_bn === loc.name_bn
                                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                                  : 'bg-white border-stone-200 hover:border-emerald-200'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-stone-900 text-sm">{loc.name_bn}</span>
                                  <span className="text-xs text-stone-500 font-mono">({loc.name_en})</span>
                                </div>
                                <div className="text-xs text-stone-500">
                                  জেলা: <span className="text-stone-700">{loc.district_bn}</span> • বিভাগ: {loc.division_bn}
                                </div>
                              </div>

                              <div className="text-right">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  loc.type === 'district' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {loc.type === 'district' ? 'জেলা' : 'উপজেলা'}
                                </span>
                                <div className="text-[10px] text-stone-400 font-mono mt-1">
                                  {loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Live Weather Card (Open-Meteo Localized Output) */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
                      {/* Atmospheric background accents */}
                      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="relative z-10">
                        {/* Location Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-emerald-400" />
                              <h4 className="text-xl font-bold">{activeLoc.name_bn}</h4>
                              <span className="text-xs text-emerald-300 font-mono">({activeLoc.name_en})</span>
                              <span className="bg-emerald-800/80 text-emerald-200 text-[11px] px-2 py-0.5 rounded-full border border-emerald-700">
                                {activeLoc.type === 'district' ? 'জেলা সদর' : 'উপজেলা'}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-200/80 mt-1">
                              {activeLoc.district_bn} জেলা, {activeLoc.division_bn} বিভাগ • GPS: {activeLoc.latitude}, {activeLoc.longitude}
                            </p>
                          </div>

                          <div className="bg-emerald-800/60 text-emerald-200 text-xs px-2.5 py-1 rounded-md border border-emerald-700/60 font-mono">
                            Open-Meteo Live API
                          </div>
                        </div>

                        {/* Current Temperature & Weather Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 items-center">
                          <div className="flex items-baseline space-x-3">
                            <span className="text-5xl font-extrabold tracking-tight">29.4°C</span>
                            <span className="text-xs text-emerald-300">অনুভূত: ৩১.০°C</span>
                          </div>

                          <div className="flex items-center space-x-3 sm:justify-end">
                            <CloudSun className="w-10 h-10 text-amber-300 animate-pulse" />
                            <div>
                              <div className="font-bold text-base text-white">আংশিক মেঘলা</div>
                              <div className="text-xs text-emerald-300">বৃষ্টিপাতের সম্ভাবনা: ০%</div>
                            </div>
                          </div>
                        </div>

                        {/* Meteorological Stats Bar */}
                        <div className="grid grid-cols-3 gap-3 bg-emerald-950/70 p-3 rounded-lg border border-emerald-800/60 text-center text-xs">
                          <div>
                            <div className="text-emerald-300 flex items-center justify-center gap-1">
                              <Droplets className="w-3.5 h-3.5 text-sky-400" />
                              <span>আর্দ্রতা</span>
                            </div>
                            <div className="font-bold text-sm mt-0.5">৬৮%</div>
                          </div>
                          <div>
                            <div className="text-emerald-300 flex items-center justify-center gap-1">
                              <Wind className="w-3.5 h-3.5 text-teal-300" />
                              <span>বাতাস</span>
                            </div>
                            <div className="font-bold text-sm mt-0.5">৯ কিমি/ঘণ্টা</div>
                          </div>
                          <div>
                            <div className="text-emerald-300 flex items-center justify-center gap-1">
                              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                              <span>বৃষ্টিপাত</span>
                            </div>
                            <div className="font-bold text-sm mt-0.5">০.০ মিমি</div>
                          </div>
                        </div>

                        {/* 5-Day Forecast Strip */}
                        <div className="mt-5 pt-4 border-t border-emerald-800/60">
                          <div className="text-xs font-semibold text-emerald-300 mb-2">৫ দিনের পূর্বাভাস (Forecast):</div>
                          <div className="grid grid-cols-5 gap-2 text-center text-xs">
                            {[
                              { day: 'আজ', min: '২২°', max: '৩০°', condition: 'রৌদ্রোজ্জ্বল' },
                              { day: 'আগামীকাল', min: '২৩°', max: '৩১°', condition: 'আংশিক মেঘলা' },
                              { day: 'বুধবার', min: '২৩°', max: '২৯°', condition: 'হালকা বৃষ্টি' },
                              { day: 'বৃহস্পতিবার', min: '২২°', max: '২৮°', condition: 'বজ্রবৃষ্টি' },
                              { day: 'শুক্রবার', min: '২১°', max: '২৯°', condition: 'পরিষ্কার' },
                            ].map((f, i) => (
                              <div key={i} className="bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
                                <div className="text-[11px] text-emerald-200 font-medium">{f.day}</div>
                                <CloudSun className="w-5 h-5 text-amber-300 mx-auto my-1" />
                                <div className="font-bold text-xs">{f.max}</div>
                                <div className="text-[10px] text-emerald-400">{f.min}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Flutter Code Integration Guide */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Flutter অ্যাপে বাংলা আবহাওয়া সংযোগ (How to Connect Flutter to this Endpoint)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update your Flutter weather service to query <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">/api/weather?q=টাঙ্গাইল</code> instead of querying external APIs directly.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Fetch Weather by Bengali Name */}
                <div className="bg-stone-900 text-stone-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
                    <span className="text-emerald-400 text-xs font-semibold">Option A: Fetch Weather by Bengali Query (Recommended)</span>
                    <button
                      onClick={() => copyToClipboard(`// lib/services/weather_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class WeatherService {
  // Query by Bengali name e.g. "টাঙ্গাইল" or "ঘাটাইল" or English "Tangail"
  static Future<Map<String, dynamic>> fetchWeather(String cityName) async {
    final encodedCity = Uri.encodeComponent(cityName);
    final url = Uri.parse('\${ApiConfig.baseUrl}/weather?q=\$encodedCity');

    final response = await http.get(url, headers: ApiConfig.headers);

    if (response.statusCode == 200) {
      // Decode with UTF-8 to preserve Bengali characters cleanly
      return jsonDecode(utf8.decode(response.bodyBytes));
    } else {
      throw Exception('Failed to load weather: \${response.statusCode}');
    }
  }
}`, 'flutter-weather-code')}
                      className="text-stone-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'flutter-weather-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre>{`// lib/services/weather_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class WeatherService {
  // Accepts Bengali query e.g. "টাঙ্গাইল" or "ঘাটাইল"
  static Future<Map<String, dynamic>> fetchWeather(String cityName) async {
    final encodedCity = Uri.encodeComponent(cityName);
    final url = Uri.parse('\${ApiConfig.baseUrl}/weather?q=\$encodedCity');

    final response = await http.get(url, headers: ApiConfig.headers);

    if (response.statusCode == 200) {
      // utf8.decode ensures Bengali characters display without garbled text
      return jsonDecode(utf8.decode(response.bodyBytes));
    } else {
      throw Exception('Failed to load weather: \${response.statusCode}');
    }
  }
}`}</pre>
                </div>

                {/* 2. Geo Autocomplete Search */}
                <div className="bg-stone-900 text-stone-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800">
                    <span className="text-sky-400 text-xs font-semibold">Option B: Bengali Area Autocomplete Search</span>
                    <button
                      onClick={() => copyToClipboard(`// Autocomplete search across all 64 districts & 495 upazilas
static Future<List<Map<String, dynamic>>> searchLocations(String query) async {
  if (query.trim().isEmpty) return [];
  final url = Uri.parse('\${ApiConfig.baseUrl}/geo/search?q=\${Uri.encodeComponent(query)}&limit=10');

  final response = await http.get(url, headers: ApiConfig.headers);

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.cast<Map<String, dynamic>>();
  }
  return [];
}`, 'flutter-geo-code')}
                      className="text-stone-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'flutter-geo-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre>{`// Autocomplete search across all 64 districts & 495 upazilas
static Future<List<Map<String, dynamic>>> searchLocations(String query) async {
  if (query.trim().isEmpty) return [];
  final url = Uri.parse(
    '\${ApiConfig.baseUrl}/geo/search?q=\${Uri.encodeComponent(query)}&limit=10'
  );

  final response = await http.get(url, headers: ApiConfig.headers);

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data.cast<Map<String, dynamic>>();
  }
  return [];
}`}</pre>
                </div>
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
