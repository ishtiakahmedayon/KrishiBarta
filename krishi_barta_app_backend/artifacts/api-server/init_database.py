"""
init_database.py — Creates and seeds the PostgreSQL database for KrishiApp on Render.

Run directly to reset/seed the database:
    python init_database.py
"""

import os
import sys
import psycopg2
from psycopg2.extras import execute_batch


def normalize_database_url(url: str) -> str:
    """Normalize legacy postgres:// prefix from Render to postgresql://."""
    if not url:
        return "postgresql://postgres:postgres@localhost:5432/krishiapp"
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def get_connection():
    db_url = normalize_database_url(os.environ.get("DATABASE_URL", ""))
    return psycopg2.connect(db_url)


def init_db():
    try:
        conn = get_connection()
    except Exception as e:
        print(f"⚠️ Warning: Could not connect to PostgreSQL ({e}). Skipping initialization.")
        return

    cursor = conn.cursor()

    # -----------------------------------------------------------------------
    # prices table
    # -----------------------------------------------------------------------
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS prices (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            name_possessive TEXT NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            unit TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'সবজি'
        )
        """
    )
    # Ensure existing tables with NUMERIC are migrated to DOUBLE PRECISION
    try:
        cursor.execute("ALTER TABLE prices ALTER COLUMN price TYPE DOUBLE PRECISION USING price::DOUBLE PRECISION")
    except Exception:
        pass

    # Ensure last_updated and source columns exist
    try:
        cursor.execute("ALTER TABLE prices ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
        cursor.execute("ALTER TABLE prices ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'system'")
    except Exception:
        pass

    # -----------------------------------------------------------------------
    # price_history table (stores daily snapshots for 7d/30d trend charts)
    # -----------------------------------------------------------------------
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS price_history (
            id SERIAL PRIMARY KEY,
            crop_name TEXT NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
            source TEXT NOT NULL DEFAULT 'system',
            UNIQUE(crop_name, recorded_date)
        )
        """
    )
    cursor.execute(
        "CREATE INDEX IF NOT EXISTS idx_price_history_crop ON price_history(crop_name, recorded_date DESC)"
    )

    # -----------------------------------------------------------------------
    # pesticides table
    # -----------------------------------------------------------------------
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS pesticides (
            id SERIAL PRIMARY KEY,
            crop TEXT NOT NULL,
            pest TEXT NOT NULL,
            pesticide_name TEXT NOT NULL,
            dosage TEXT NOT NULL,
            precaution TEXT NOT NULL,
            UNIQUE(crop, pest)
        )
        """
    )

    # -----------------------------------------------------------------------
    # krishi_offices table
    # -----------------------------------------------------------------------
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS krishi_offices (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            district TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT NOT NULL,
            services TEXT NOT NULL
        )
        """
    )

    # -----------------------------------------------------------------------
    # geo_locations table (all 64 districts & 495 upazilas with GPS coordinates)
    # -----------------------------------------------------------------------
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS geo_locations (
            id SERIAL PRIMARY KEY,
            name_bn TEXT NOT NULL,
            name_en TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'upazila',
            district_bn TEXT NOT NULL,
            district_en TEXT NOT NULL,
            division_bn TEXT NOT NULL,
            division_en TEXT NOT NULL,
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL
        )
        """
    )
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_geo_locations_bn ON geo_locations(name_bn)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_geo_locations_en ON geo_locations(LOWER(name_en))")

    conn.commit()

    # -----------------------------------------------------------------------
    # Seed prices (only if empty)
    # -----------------------------------------------------------------------
    cursor.execute("SELECT COUNT(*) FROM prices")
    if cursor.fetchone()[0] == 0:
        prices = [
            # সবজি
            ("আলু", "আলুর", 30.0, "টাকা/কেজি", "সবজি"),
            ("পটল", "পটলের", 50.0, "টাকা/কেজি", "সবজি"),
            ("বেগুন", "বেগুনের", 40.0, "টাকা/কেজি", "সবজি"),
            ("টমেটো", "টমেটোর", 55.0, "টাকা/কেজি", "সবজি"),
            ("ঢেঁড়স", "ঢেঁড়সের", 45.0, "টাকা/কেজি", "সবজি"),
            ("করলা", "করলার", 60.0, "টাকা/কেজি", "সবজি"),
            ("পেঁপে", "পেঁপের", 25.0, "টাকা/কেজি", "সবজি"),
            ("লাউ", "লাউয়ের", 35.0, "টাকা/কেজি", "সবজি"),
            ("কুমড়া", "কুমড়ার", 30.0, "টাকা/কেজি", "সবজি"),
            ("শিম", "শিমের", 70.0, "টাকা/কেজি", "সবজি"),
            ("মুলা", "মুলার", 25.0, "টাকা/কেজি", "সবজি"),
            ("ফুলকপি", "ফুলকপির", 45.0, "টাকা/কেজি", "সবজি"),
            ("বাঁধাকপি", "বাঁধাকপির", 35.0, "টাকা/কেজি", "সবজি"),
            ("পালংশাক", "পালংশাকের", 30.0, "টাকা/কেজি", "সবজি"),
            ("পুঁইশাক", "পুঁইশাকের", 20.0, "টাকা/কেজি", "সবজি"),
            ("কচু", "কচুর", 40.0, "টাকা/কেজি", "সবজি"),
            ("মিষ্টি কুমড়া", "মিষ্টি কুমড়ার", 28.0, "টাকা/কেজি", "সবজি"),
            ("চিচিঙ্গা", "চিচিঙ্গার", 40.0, "টাকা/কেজি", "সবজি"),
            # মশলা
            ("পেঁয়াজ", "পেঁয়াজের", 70.0, "টাকা/কেজি", "মশলা"),
            ("রসুন", "রসুনের", 180.0, "টাকা/কেজি", "মশলা"),
            ("আদা", "আদার", 200.0, "টাকা/কেজি", "মশলা"),
            ("মরিচ", "মরিচের", 150.0, "টাকা/কেজি", "মশলা"),
            ("হলুদ", "হলুদের", 120.0, "টাকা/কেজি", "মশলা"),
            # শস্য
            ("চাল", "চালের", 58.0, "টাকা/কেজি", "শস্য"),
            ("ডাল", "ডালের", 120.0, "টাকা/কেজি", "শস্য"),
            ("আটা", "আটার", 55.0, "টাকা/কেজি", "শস্য"),
            ("ময়দা", "ময়দার", 65.0, "টাকা/কেজি", "শস্য"),
            # অন্যান্য
            ("সয়াবিন তেল", "সয়াবিন তেলের", 175.0, "টাকা/লিটার", "অন্যান্য"),
            ("চিনি", "চিনির", 130.0, "টাকা/কেজি", "অন্যান্য"),
            ("লবণ", "লবণের", 40.0, "টাকা/কেজি", "অন্যান্য"),
        ]
        execute_batch(
            cursor,
            "INSERT INTO prices (name, name_possessive, price, unit, category) VALUES (%s, %s, %s, %s, %s)",
            prices,
        )
        conn.commit()
        print(f"✅ Seeded {len(prices)} prices into PostgreSQL")

    # -----------------------------------------------------------------------
    # Seed price_history (7-day historical snapshots for charts)
    # -----------------------------------------------------------------------
    cursor.execute("SELECT COUNT(*) FROM price_history")
    if cursor.fetchone()[0] == 0:
        import datetime
        today = datetime.date.today()
        history_records = []
        
        # Sample realistic 7-day historical variations for main crops
        sample_crops_variations = {
            "আলু": [28.0, 28.5, 29.0, 29.5, 30.0, 31.0, 30.0],
            "পেঁয়াজ": [65.0, 68.0, 70.0, 72.0, 75.0, 72.0, 70.0],
            "বেগুন": [35.0, 38.0, 42.0, 40.0, 45.0, 42.0, 40.0],
            "টমেটো": [60.0, 58.0, 55.0, 56.0, 54.0, 55.0, 55.0],
            "রসুন": [170.0, 172.0, 175.0, 178.0, 180.0, 182.0, 180.0],
            "চাল": [56.0, 56.5, 57.0, 57.0, 57.5, 58.0, 58.0],
        }

        for crop, trend in sample_crops_variations.items():
            for i, p in enumerate(trend):
                # past days up to today
                rec_date = today - datetime.timedelta(days=(len(trend) - 1 - i))
                history_records.append((crop, float(p), rec_date, "dam.gov.bd"))

        execute_batch(
            cursor,
            """INSERT INTO price_history (crop_name, price, recorded_date, source)
               VALUES (%s, %s, %s, %s)
               ON CONFLICT (crop_name, recorded_date) DO UPDATE SET price = EXCLUDED.price""",
            history_records,
        )
        conn.commit()
        print(f"✅ Seeded {len(history_records)} historical price data points into PostgreSQL")

    # -----------------------------------------------------------------------
    # Seed pesticides (only if empty)
    # -----------------------------------------------------------------------
    cursor.execute("SELECT COUNT(*) FROM pesticides")
    if cursor.fetchone()[0] == 0:
        pesticides = [
            ("ধান", "মাজরা পোকা", "কার্টাপ হাইড্রোক্লোরাইড (Cartap Hydrochloride)", "২০ গ্রাম/১০ লিটার পানি", "স্প্রে করার সময় হাতমোজা ও মাস্ক ব্যবহার করুন।"),
            ("ধান", "বাদামী গাছফড়িং", "ইমিডাক্লোপ্রিড (Imidacloprid)", "১ মিলি/লিটার পানি", "শিশু ও গবাদি পশু থেকে দূরে রাখুন।"),
            ("ধান", "পাতা মোড়ানো পোকা", "ক্লোরপাইরিফস (Chlorpyrifos)", "২ মিলি/লিটার পানি", "স্প্রে করার পর ২৪ ঘণ্টা ক্ষেতে প্রবেশ করবেন না।"),
            ("ধান", "ব্লাস্ট রোগ", "ট্রাইসাইক্লাজল (Tricyclazole)", "০.৫ গ্রাম/লিটার পানি", "ফুলের সময় স্প্রে করুন।"),
            ("আলু", "লেট ব্লাইট", "ম্যানকোজেব (Mancozeb)", "২.৫ গ্রাম/লিটার পানি", "ফসল তোলার ১৫ দিন আগে স্প্রে বন্ধ করুন।"),
            ("আলু", "এফিড", "থায়ামেথোক্সাম (Thiamethoxam)", "০.৫ গ্রাম/লিটার পানি", "মৌমাছির ক্ষতি এড়াতে সন্ধ্যায় স্প্রে করুন।"),
            ("টমেটো", "সাদামাছি", "ইমিডাক্লোপ্রিড (Imidacloprid)", "০.৫ মিলি/লিটার পানি", "ফুল ও ফলে সরাসরি স্প্রে এড়িয়ে চলুন।"),
            ("টমেটো", "ফলের মাছি", "ম্যালাথিয়ন (Malathion)", "২ মিলি/লিটার পানি", "স্প্রে করার পর ৭ দিন ফল খাবেন না।"),
            ("বেগুন", "ডগা ও ফল ছিদ্রকারী পোকা", "ইমামেকটিন বেনজোয়েট (Emamectin Benzoate)", "০.৫ গ্রাম/লিটার পানি", "সকালে স্প্রে করুন।"),
            ("সরিষা", "জাবপোকা", "পাইরিমিডিফস-মিথাইল (Pirimiphos-methyl)", "১.৫ মিলি/লিটার পানি", "ফুল ফোটার সময় স্প্রে করবেন না।"),
            ("পটল", "পোকামাকড়", "ডেলটামেথ্রিন (Deltamethrin)", "১ মিলি/লিটার পানি", "রোদের মধ্যে স্প্রে করবেন না।"),
            ("পেঁয়াজ", "থ্রিপস", "স্পিনোসাড (Spinosad)", "০.৫ মিলি/লিটার পানি", "মাটিতে পড়ে থাকা কীটনাশক পানিতে মেশানো থেকে বিরত থাকুন।"),
            ("শসা", "লালমাকড়", "অ্যাবামেকটিন (Abamectin)", "১ মিলি/লিটার পানি", "পাতার নিচে স্প্রে করুন।"),
            ("কপি", "ডায়মন্ড ব্যাক মথ", "ক্লোরফ্লুয়াজুরন (Chlorfluazuron)", "১ মিলি/লিটার পানি", "ফসল সংগ্রহের ৭ দিন আগে স্প্রে বন্ধ করুন।"),
        ]
        execute_batch(
            cursor,
            "INSERT INTO pesticides (crop, pest, pesticide_name, dosage, precaution) VALUES (%s, %s, %s, %s, %s)",
            pesticides,
        )
        conn.commit()
        print(f"✅ Seeded {len(pesticides)} pesticides into PostgreSQL")

    # -----------------------------------------------------------------------
    # Seed krishi_offices (only if empty)
    # -----------------------------------------------------------------------
    cursor.execute("SELECT COUNT(*) FROM krishi_offices")
    if cursor.fetchone()[0] == 0:
        offices = [
            ("কৃষি সম্প্রসারণ অধিদপ্তর, ঢাকা", "ঢাকা", "খামারবাড়ি, ফার্মগেট, ঢাকা-১২১৫", "02-9130986", "ফসল উৎপাদন পরামর্শ, কৃষি প্রযুক্তি সহায়তা, বীজ বিতরণ, সার বরাদ্দ"),
            ("জেলা কৃষি অফিস, চট্টগ্রাম", "চট্টগ্রাম", "চকবাজার, চট্টগ্রাম-৪০০০", "031-632101", "কৃষি উপকরণ, প্রশিক্ষণ, মাটি পরীক্ষা সেবা"),
            ("উপজেলা কৃষি অফিস, গাজীপুর", "গাজীপুর", "গাজীপুর সদর উপজেলা পরিষদ, গাজীপুর", "02-9263458", "কৃষক নিবন্ধন, সার ও বীজ বিতরণ, রোগ-বালাই পরামর্শ"),
            ("জেলা কৃষি অফিস, রাজশাহী", "রাজশাহী", "রাজশাহী সদর, রাজশাহী-৬০০০", "0721-772345", "আম, ধান, গম উৎপাদন সহায়তা, সেচ পরামর্শ"),
            ("জেলা কৃষি অফিস, খুলনা", "খুলনা", "খুলনা সদর, খুলনা-৯০০০", "041-724890", "লবণাক্ত মাটি ব্যবস্থাপনা, চাষাবাদ পরামর্শ, প্রশিক্ষণ"),
            ("জেলা কৃষি অফিস, সিলেট", "সিলেট", "সিলেট সদর, সিলেট-৩১০০", "0821-714523", "চা ও আনারস চাষ পরামর্শ, কৃষি প্রযুক্তি"),
            ("জেলা কৃষি অফিস, বরিশাল", "বরিশাল", "বরিশাল সদর, বরিশাল-৮২০০", "0431-62890", "ভাসমান বেড চাষ, নদী তীরবর্তী কৃষি পরামর্শ"),
            ("জেলা কৃষি অফিস, ময়মনসিংহ", "ময়মনসিংহ", "ময়মনসিংহ সদর, ময়মনসিংহ-২২০০", "091-65432", "মৎস্য ও কৃষি সমন্বিত চাষ, প্রশিক্ষণ"),
            ("জেলা কৃষি অফিস, রংপুর", "রংপুর", "রংপুর সদর, রংপুর-৫৪০০", "0521-63210", "আলু ও ভুট্টা উৎপাদন সহায়তা, হিমাগার ব্যবস্থাপনা"),
            ("জেলা কৃষি অফিস, কুমিল্লা", "কুমিল্লা", "কুমিল্লা সদর, কুমিল্লা-৩৫০০", "081-74520", "সবজি চাষ, কৃষি ঋণ সহায়তা, বীজ উৎপাদন"),
            ("জেলা কৃষি অফিস, বগুড়া", "বগুড়া", "বগুড়া সদর, বগুড়া-৫৮০০", "051-67891", "আলু, সবজি ও শস্য চাষ পরামর্শ"),
            ("জেলা কৃষি অফিস, নওগাঁ", "নওগাঁ", "নওগাঁ সদর, নওগাঁ-৬৫০০", "0741-62301", "ধান, গম ও আম চাষ পরামর্শ, মাটি পরীক্ষা"),
            ("জেলা কৃষি অফিস, যশোর", "যশোর", "যশোর সদর, যশোর-৭৪০০", "0421-67453", "ফুল চাষ, সবজি রপ্তানি সহায়তা, প্রশিক্ষণ"),
            ("জেলা কৃষি অফিস, টাঙ্গাইল", "টাঙ্গাইল", "টাঙ্গাইল সদর, টাঙ্গাইল-১৯০০", "0921-54321", "আনারস ও কলা চাষ, কৃষি যন্ত্রপাতি সহায়তা"),
            ("জেলা কৃষি অফিস, নরসিংদী", "নরসিংদী", "নরসিংদী সদর, নরসিংদী-১৬০০", "02-9459123", "সবজি ও ফল চাষ পরামর্শ, কীটনাশক ব্যবহার নির্দেশিকা"),
        ]
        execute_batch(
            cursor,
            "INSERT INTO krishi_offices (name, district, address, phone, services) VALUES (%s, %s, %s, %s, %s)",
            offices,
        )
        conn.commit()
        print(f"✅ Seeded {len(offices)} offices into PostgreSQL")

    # -----------------------------------------------------------------------
    # Seed geo_locations (All 64 districts and all upazilas with coordinates)
    # -----------------------------------------------------------------------
    cursor.execute("SELECT COUNT(*) FROM geo_locations")
    if cursor.fetchone()[0] == 0:
        try:
            from api.bangladesh_geo_data import get_all_geo_records
            geo_records = get_all_geo_records()
            execute_batch(
                cursor,
                """
                INSERT INTO geo_locations 
                (name_bn, name_en, type, district_bn, district_en, division_bn, division_en, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                geo_records,
            )
            conn.commit()
            print(f"✅ Seeded {len(geo_records)} Bangladesh districts and upazilas into geo_locations")
        except Exception as e:
            print(f"⚠️ Warning while seeding geo_locations: {e}")

    cursor.close()
    conn.close()
    print("✅ PostgreSQL database initialized and verified successfully.")


if __name__ == "__main__":
    init_db()
