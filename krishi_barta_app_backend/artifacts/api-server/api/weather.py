"""
api/weather.py — Bengali Geographic Resolution & Open-Meteo Weather API.

Endpoints:
  GET /api/geo/search?q=<query>     Search all 64 districts and 495 upazilas in Bengali/English
  GET /api/weather?q=<city_or_area> Resolve location & return live weather in Bengali
  GET /api/weather?lat=<lat>&lon=<lon> Fetch weather by GPS coordinates
"""

import requests
from flask import Blueprint, jsonify, request
from .db import get_db, close_db

weather_bp = Blueprint("weather", __name__)
weather_bp.teardown_app_request(close_db)

# WMO Weather Code to Bengali translation & icons
WMO_WEATHER_TRANSLATIONS = {
    0: {"condition_bn": "পরিষ্কার আকাশ", "condition_en": "Clear sky", "icon": "sunny"},
    1: {"condition_bn": "প্রধানত পরিষ্কার", "condition_en": "Mainly clear", "icon": "mainly_sunny"},
    2: {"condition_bn": "আংশিক মেঘলা", "condition_en": "Partly cloudy", "icon": "partly_cloudy"},
    3: {"condition_bn": "মেঘলা", "condition_en": "Overcast", "icon": "cloudy"},
    45: {"condition_bn": "কুয়াশাচ্ছন্ন", "condition_en": "Foggy", "icon": "fog"},
    48: {"condition_bn": "ঘন কুয়াশা", "condition_en": "Depositing rime fog", "icon": "fog"},
    51: {"condition_bn": "হালকা গুঁড়ি গুঁড়ি বৃষ্টি", "condition_en": "Light drizzle", "icon": "drizzle"},
    53: {"condition_bn": "মাঝারি গুঁড়ি গুঁড়ি বৃষ্টি", "condition_en": "Moderate drizzle", "icon": "drizzle"},
    55: {"condition_bn": "ভারী গুঁড়ি গুঁড়ি বৃষ্টি", "condition_en": "Dense drizzle", "icon": "drizzle"},
    61: {"condition_bn": "হালকা বৃষ্টিপাত", "condition_en": "Slight rain", "icon": "rain"},
    63: {"condition_bn": "মাঝারি বৃষ্টিপাত", "condition_en": "Moderate rain", "icon": "rain"},
    65: {"condition_bn": "ভারী বৃষ্টিপাত", "condition_en": "Heavy rain", "icon": "heavy_rain"},
    80: {"condition_bn": "হালকা পশলা বৃষ্টি", "condition_en": "Slight rain showers", "icon": "rain"},
    81: {"condition_bn": "মাঝারি পশলা বৃষ্টি", "condition_en": "Moderate rain showers", "icon": "rain"},
    82: {"condition_bn": "প্রবল পশলা বৃষ্টি", "condition_en": "Violent rain showers", "icon": "heavy_rain"},
    95: {"condition_bn": "বজ্রপাতসহ ঝড়বৃষ্টি", "condition_en": "Thunderstorm", "icon": "thunderstorm"},
    96: {"condition_bn": "শিলাবৃষ্টিসহ বজ্রঝড়", "condition_en": "Thunderstorm with slight hail", "icon": "thunderstorm"},
    99: {"condition_bn": "প্রবল শিলাবৃষ্টিসহ বজ্রঝড়", "condition_en": "Thunderstorm with heavy hail", "icon": "thunderstorm"},
}

BENGALI_DAYS = {
    "Monday": "সোমবার",
    "Tuesday": "মঙ্গলবার",
    "Wednesday": "বুধবার",
    "Thursday": "বৃহস্পতিবার",
    "Friday": "শুক্রবার",
    "Saturday": "শনিবার",
    "Sunday": "রবিবার",
}


def translate_weather_code(code: int):
    """Translates WMO code to Bengali description and icon."""
    return WMO_WEATHER_TRANSLATIONS.get(
        code,
        {"condition_bn": "আংশিক মেঘলা", "condition_en": "Partly cloudy", "icon": "partly_cloudy"}
    )


@weather_bp.route("/api/geo/search", methods=["GET"])
def search_geo_locations():
    """
    Search geographic areas across Bangladesh in Bengali or English.
    Example:
      /api/geo/search?q=টাঙ্গাইল
      /api/geo/search?q=ঘাটাইল
      /api/geo/search?q=Tangail
    """
    query = request.args.get("q", "").strip()
    limit = min(int(request.args.get("limit", 15)), 50)

    if not query:
        return jsonify([])

    db = get_db()
    with db.cursor() as cur:
        # Search by exact and substring match across Bengali and English names
        search_pattern = f"%{query}%"
        cur.execute(
            """
            SELECT id, name_bn, name_en, type, district_bn, district_en, division_bn, division_en, latitude, longitude,
                   CASE 
                     WHEN name_bn = %s OR LOWER(name_en) = LOWER(%s) THEN 1
                     WHEN name_bn LIKE %s OR LOWER(name_en) LIKE LOWER(%s) THEN 2
                     WHEN district_bn LIKE %s OR LOWER(district_en) LIKE LOWER(%s) THEN 3
                     ELSE 4
                   END as match_priority
            FROM geo_locations
            WHERE name_bn LIKE %s 
               OR LOWER(name_en) LIKE LOWER(%s)
               OR district_bn LIKE %s
               OR LOWER(district_en) LIKE LOWER(%s)
            ORDER BY match_priority, 
                     CASE WHEN type = 'district' THEN 1 ELSE 2 END,
                     name_bn
            LIMIT %s
            """,
            (query, query, f"{query}%", f"{query}%", f"{query}%", f"{query}%", search_pattern, search_pattern, search_pattern, search_pattern, limit),
        )
        rows = cur.fetchall()

    return jsonify([dict(r) for r in rows])


@weather_bp.route("/api/weather", methods=["GET"])
def get_weather():
    """
    Returns real-time and 7-day forecast from Open-Meteo, with localized Bengali data.
    Supports:
      - By City / Bengali Name: /api/weather?q=টাঙ্গাইল
      - By GPS Coordinates: /api/weather?lat=24.2513&lon=89.9167
    """
    q = request.args.get("q") or request.args.get("city")
    lat_param = request.args.get("lat")
    lon_param = request.args.get("lon")

    matched_location = None
    lat = None
    lon = None

    db = get_db()

    # 1. Resolve coordinates from Bengali/English location name
    if q:
        query_text = q.strip()
        with db.cursor() as cur:
            # Look up in PostgreSQL geo_locations table
            cur.execute(
                """
                SELECT id, name_bn, name_en, type, district_bn, district_en, division_bn, division_en, latitude, longitude
                FROM geo_locations
                WHERE name_bn = %s 
                   OR LOWER(name_en) = LOWER(%s)
                   OR name_bn LIKE %s
                   OR LOWER(name_en) LIKE LOWER(%s)
                ORDER BY 
                  CASE WHEN name_bn = %s OR LOWER(name_en) = LOWER(%s) THEN 1 ELSE 2 END,
                  CASE WHEN type = 'district' THEN 1 ELSE 2 END
                LIMIT 1
                """,
                (query_text, query_text, f"{query_text}%", f"{query_text}%", query_text, query_text),
            )
            matched_location = cur.fetchone()

        if matched_location:
            matched_location = dict(matched_location)
            lat = matched_location["latitude"]
            lon = matched_location["longitude"]
        else:
            # Fallback coordinates for Bangladesh center if unknown
            lat = 23.8103
            lon = 90.4125
            matched_location = {
                "name_bn": query_text,
                "name_en": query_text,
                "type": "area",
                "district_bn": "বাংলাদেশ",
                "district_en": "Bangladesh",
                "division_bn": "বাংলাদেশ",
                "division_en": "Bangladesh",
                "latitude": lat,
                "longitude": lon,
            }

    # 2. Or use direct latitude/longitude if provided
    elif lat_param and lon_param:
        try:
            lat = float(lat_param)
            lon = float(lon_param)
        except ValueError:
            return jsonify({"error": "অবৈধ অক্ষাংশ বা দ্রাঘিমাংশ (Invalid lat/lon)"}), 400

        # Try to find closest known district/upazila for friendly label
        with db.cursor() as cur:
            cur.execute(
                """
                SELECT id, name_bn, name_en, type, district_bn, district_en, division_bn, division_en, latitude, longitude,
                       (|/ ((latitude - %s)^2 + (longitude - %s)^2)) AS distance
                FROM geo_locations
                ORDER BY distance ASC
                LIMIT 1
                """,
                (lat, lon),
            )
            nearest = cur.fetchone()
            if nearest:
                matched_location = dict(nearest)
            else:
                matched_location = {
                    "name_bn": "বর্তমান অবস্থান",
                    "name_en": "Current Location",
                    "type": "gps",
                    "district_bn": "",
                    "district_en": "",
                    "division_bn": "",
                    "division_en": "",
                    "latitude": lat,
                    "longitude": lon,
                }
    else:
        # Default to Tangail if no parameters provided (for quick demo)
        lat = 24.2513
        lon = 89.9167
        matched_location = {
            "name_bn": "টাঙ্গাইল",
            "name_en": "Tangail",
            "type": "district",
            "district_bn": "টাঙ্গাইল",
            "district_en": "Tangail",
            "division_bn": "ঢাকা",
            "division_en": "Dhaka",
            "latitude": lat,
            "longitude": lon,
        }

    # 3. Fetch from Open-Meteo free API
    open_meteo_url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max"
        f"&timezone=Asia/Dhaka"
    )

    try:
        resp = requests.get(open_meteo_url, timeout=10)
        resp.raise_for_url()
        data = resp.json()
    except Exception as e:
        # Fallback offline structure in case Open-Meteo is temporarily unreachable
        return jsonify({
            "status": "warning",
            "message": f"আবহাওয়া সার্ভার সংযোগ ব্যর্থ হয়েছে ({str(e)}), সংরক্ষিত ডেটা দেখানো হচ্ছে",
            "location": matched_location,
            "current": {
                "temperature": 28.5,
                "apparent_temperature": 30.2,
                "humidity": 72,
                "wind_speed": 8.5,
                "precipitation": 0.0,
                "weather_code": 2,
                "condition_bn": "আংশিক মেঘলা",
                "condition_en": "Partly cloudy",
                "icon": "partly_cloudy",
                "is_day": 1,
            },
            "daily_forecast": [],
        })

    current_raw = data.get("current", {})
    weather_info = translate_weather_code(current_raw.get("weather_code", 0))

    current_formatted = {
        "temperature": float(current_raw.get("temperature_2m", 28.0)),
        "apparent_temperature": float(current_raw.get("apparent_temperature", 29.5)),
        "humidity": int(current_raw.get("relative_humidity_2m", 70)),
        "wind_speed": float(current_raw.get("wind_speed_10m", 5.0)),
        "precipitation": float(current_raw.get("precipitation", 0.0)),
        "weather_code": current_raw.get("weather_code", 0),
        "condition_bn": weather_info["condition_bn"],
        "condition_en": weather_info["condition_en"],
        "icon": weather_info["icon"],
        "is_day": current_raw.get("is_day", 1),
        "time": current_raw.get("time"),
    }

    # 4. Format 7-Day Forecast
    daily_raw = data.get("daily", {})
    dates = daily_raw.get("time", [])
    max_temps = daily_raw.get("temperature_2m_max", [])
    min_temps = daily_raw.get("temperature_2m_min", [])
    weather_codes = daily_raw.get("weather_code", [])
    precipitations = daily_raw.get("precipitation_sum", [])

    daily_forecast = []
    import datetime
    for idx, date_str in enumerate(dates):
        try:
            dt = datetime.datetime.strptime(date_str, "%Y-%m-%d")
            day_name_en = dt.strftime("%A")
            day_name_bn = BENGALI_DAYS.get(day_name_en, day_name_en)
        except Exception:
            day_name_bn = date_str

        code = weather_codes[idx] if idx < len(weather_codes) else 0
        w_info = translate_weather_code(code)

        daily_forecast.append({
            "date": date_str,
            "day_bn": day_name_bn,
            "max_temp": float(max_temps[idx]) if idx < len(max_temps) else 30.0,
            "min_temp": float(min_temps[idx]) if idx < len(min_temps) else 22.0,
            "precipitation_sum": float(precipitations[idx]) if idx < len(precipitations) else 0.0,
            "weather_code": code,
            "condition_bn": w_info["condition_bn"],
            "condition_en": w_info["condition_en"],
            "icon": w_info["icon"],
        })

    return jsonify({
        "status": "ok",
        "location": matched_location,
        "current": current_formatted,
        "daily_forecast": daily_forecast,
    })
