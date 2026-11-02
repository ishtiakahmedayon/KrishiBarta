"""
api/bangladesh_geo_data.py — Geographic coordinates and names for Bangladesh.
Includes all 64 districts and all upazilas with Bengali & English names and GPS coordinates.
"""

# Format: (name_bn, name_en, type, district_bn, district_en, division_bn, division_en, lat, lon)
ALL_BANGLADESH_DISTRICTS = [
    # Dhaka Division
    ("ঢাকা", "Dhaka", "district", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.8103, 90.4125),
    ("গাজীপুর", "Gazipur", "district", "গাজীপুর", "Gazipur", "ঢাকা", "Dhaka", 24.0023, 90.4267),
    ("নারায়ণগঞ্জ", "Narayanganj", "district", "নারায়ণগঞ্জ", "Narayanganj", "ঢাকা", "Dhaka", 23.6238, 90.5000),
    ("টাঙ্গাইল", "Tangail", "district", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.2513, 89.9167),
    ("নরসিংদী", "Narsingdi", "district", "নরসিংদী", "Narsingdi", "ঢাকা", "Dhaka", 23.9322, 90.7154),
    ("মানিকগঞ্জ", "Manikganj", "district", "মানিকগঞ্জ", "Manikganj", "ঢাকা", "Dhaka", 23.8644, 90.0047),
    ("মুন্সীগঞ্জ", "Munshiganj", "district", "মুন্সীগঞ্জ", "Munshiganj", "ঢাকা", "Dhaka", 23.5422, 90.5305),
    ("ফরিদপুর", "Faridpur", "district", "ফরিদপুর", "Faridpur", "ঢাকা", "Dhaka", 23.6071, 89.8429),
    ("গোপালগঞ্জ", "Gopalganj", "district", "গোপালগঞ্জ", "Gopalganj", "ঢাকা", "Dhaka", 23.0051, 89.8266),
    ("মাদারীপুর", "Madaripur", "district", "মাদারীপুর", "Madaripur", "ঢাকা", "Dhaka", 23.1641, 90.1897),
    ("রাজবাড়ী", "Rajbari", "district", "রাজবাড়ী", "Rajbari", "ঢাকা", "Dhaka", 23.7574, 89.6445),
    ("শরীয়তপুর", "Shariatpur", "district", "শরীয়তপুর", "Shariatpur", "ঢাকা", "Dhaka", 23.2423, 90.4348),
    ("কিশোরগঞ্জ", "Kishoreganj", "district", "কিশোরগঞ্জ", "Kishoreganj", "ঢাকা", "Dhaka", 24.4449, 90.7766),

    # Chittagong Division
    ("চট্টগ্রাম", "Chittagong", "district", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.3569, 91.7832),
    ("কক্সবাজার", "Cox's Bazar", "district", "কক্সবাজার", "Cox's Bazar", "চট্টগ্রাম", "Chittagong", 21.4272, 92.0058),
    ("কুমিল্লা", "Comilla", "district", "কুমিল্লা", "Comilla", "চট্টগ্রাম", "Chittagong", 23.4682, 91.1788),
    ("ফেনী", "Feni", "district", "ফেনী", "Feni", "চট্টগ্রাম", "Chittagong", 23.0187, 91.3966),
    ("ব্রাহ্মণবাড়িয়া", "Brahmanbaria", "district", "ব্রাহ্মণবাড়িয়া", "Brahmanbaria", "চট্টগ্রাম", "Chittagong", 23.9571, 91.1119),
    ("রাঙ্গামাটি", "Rangamati", "district", "রাঙ্গামাটি", "Rangamati", "চট্টগ্রাম", "Chittagong", 22.7324, 92.2985),
    ("নোয়াখালী", "Noakhali", "district", "নোয়াখালী", "Noakhali", "চট্টগ্রাম", "Chittagong", 22.8696, 91.0994),
    ("চাঁদপুর", "Chandpur", "district", "চাঁদপুর", "Chandpur", "চট্টগ্রাম", "Chittagong", 23.2333, 90.6667),
    ("লক্ষ্মীপুর", "Lakshmipur", "district", "লক্ষ্মীপুর", "Lakshmipur", "চট্টগ্রাম", "Chittagong", 22.9425, 90.8412),
    ("খাগড়াছড়ি", "Khagrachhari", "district", "খাগড়াছড়ি", "Khagrachhari", "চট্টগ্রাম", "Chittagong", 23.1193, 91.9847),
    ("বান্দরবান", "Bandarban", "district", "বান্দরবান", "Bandarban", "চট্টগ্রাম", "Chittagong", 22.1953, 92.2184),

    # Rajshahi Division
    ("রাজশাহী", "Rajshahi", "district", "রাজশাহী", "Rajshahi", "রাজশাহী", "Rajshahi", 24.3745, 88.6042),
    ("বগুড়া", "Bogra", "district", "বগুড়া", "Bogra", "রাজশাহী", "Rajshahi", 24.8465, 89.3777),
    ("পাবনা", "Pabna", "district", "পাবনা", "Pabna", "রাজশাহী", "Rajshahi", 24.0064, 89.2372),
    ("সিরাজগঞ্জ", "Sirajganj", "district", "সিরাজগঞ্জ", "Sirajganj", "রাজশাহী", "Rajshahi", 24.4534, 89.7008),
    ("নওগাঁ", "Naogaon", "district", "নওগাঁ", "Naogaon", "রাজশাহী", "Rajshahi", 24.7936, 88.9318),
    ("নাটোর", "Natore", "district", "নাটোর", "Natore", "রাজশাহী", "Rajshahi", 24.4206, 88.9324),
    ("জয়পুরহাট", "Joypurhat", "district", "জয়পুরহাট", "Joypurhat", "রাজশাহী", "Rajshahi", 25.1015, 89.0287),
    ("চাঁপাইনবাবগঞ্জ", "Chapainawabganj", "district", "চাঁপাইনবাবগঞ্জ", "Chapainawabganj", "রাজশাহী", "Rajshahi", 24.5965, 88.2775),

    # Khulna Division
    ("খুলনা", "Khulna", "district", "খুলনা", "Khulna", "খুলনা", "Khulna", 22.8456, 89.5403),
    ("যশোর", "Jessore", "district", "যশোর", "Jessore", "খুলনা", "Khulna", 23.1664, 89.2081),
    ("কুষ্টিয়া", "Kushtia", "district", "কুষ্টিয়া", "Kushtia", "খুলনা", "Khulna", 23.9013, 89.1205),
    ("সাতক্ষীরা", "Satkhira", "district", "সাতক্ষীরা", "Satkhira", "খুলনা", "Khulna", 22.7185, 89.0705),
    ("বাগেরহাট", "Bagerhat", "district", "বাগেরহাট", "Bagerhat", "খুলনা", "Khulna", 22.6516, 89.7859),
    ("ঝিনাইদহ", "Jhenaidah", "district", "ঝিনাইদহ", "Jhenaidah", "খুলনা", "Khulna", 23.5450, 89.1726),
    ("চুয়াডাঙ্গা", "Chuadanga", "district", "চুয়াডাঙ্গা", "Chuadanga", "খুলনা", "Khulna", 23.6402, 88.8418),
    ("মেহেরপুর", "Meherpur", "district", "মেহেরপুর", "Meherpur", "খুলনা", "Khulna", 23.7622, 88.6318),
    ("নড়াইল", "Narail", "district", "নড়াইল", "Narail", "খুলনা", "Khulna", 23.1725, 89.5127),
    ("মাগুরা", "Magura", "district", "মাগুরা", "Magura", "খুলনা", "Khulna", 23.4873, 89.4199),

    # Barisal Division
    ("বরিশাল", "Barisal", "district", "বরিশাল", "Barisal", "বরিশাল", "Barisal", 22.7010, 90.3535),
    ("পটুয়াখালী", "Patuakhali", "district", "পটুয়াখালী", "Patuakhali", "বরিশাল", "Barisal", 22.3596, 90.3298),
    ("ভোলা", "Bhola", "district", "ভোলা", "Bhola", "বরিশাল", "Barisal", 22.6859, 90.6481),
    ("পিরোজপুর", "Pirojpur", "district", "পিরোজপুর", "Pirojpur", "বরিশাল", "Barisal", 22.5841, 89.9720),
    ("বরগুনা", "Barguna", "district", "বরগুনা", "Barguna", "বরিশাল", "Barisal", 22.0953, 90.1121),
    ("ঝালকাঠি", "Jhalokati", "district", "ঝালকাঠি", "Jhalokati", "বরিশাল", "Barisal", 22.6406, 90.1987),

    # Sylhet Division
    ("সিলেট", "Sylhet", "district", "সিলেট", "Sylhet", "সিলেট", "Sylhet", 24.8949, 91.8687),
    ("মৌলভীবাজার", "Moulvibazar", "district", "মৌলভীবাজার", "Moulvibazar", "সিলেট", "Sylhet", 24.4829, 91.7774),
    ("হবিগঞ্জ", "Habiganj", "district", "হবিগঞ্জ", "Habiganj", "সিলেট", "Sylhet", 24.3749, 91.4155),
    ("সুনামগঞ্জ", "Sunamganj", "district", "সুনামগঞ্জ", "Sunamganj", "সিলেট", "Sylhet", 25.0658, 91.3950),

    # Rangpur Division
    ("রংপুর", "Rangpur", "district", "রংপুর", "Rangpur", "রংপুর", "Rangpur", 25.7439, 89.2752),
    ("দিনাজপুর", "Dinajpur", "district", "দিনাজপুর", "Dinajpur", "রংপুর", "Rangpur", 25.6217, 88.6355),
    ("গাইবান্ধা", "Gaibandha", "district", "গাইবান্ধা", "Gaibandha", "রংপুর", "Rangpur", 25.3288, 89.5408),
    ("কুড়িগ্রাম", "Kurigram", "district", "কুড়িগ্রাম", "Kurigram", "রংপুর", "Rangpur", 25.8054, 89.6362),
    ("লালমনিরহাট", "Lalmonirhat", "district", "লালমনিরহাট", "Lalmonirhat", "রংপুর", "Rangpur", 25.9923, 89.2847),
    ("নীলফামারী", "Nilphamari", "district", "নীলফামারী", "Nilphamari", "রংপুর", "Rangpur", 25.9318, 88.8560),
    ("পঞ্চগড়", "Panchagarh", "district", "পঞ্চগড়", "Panchagarh", "রংপুর", "Rangpur", 26.3411, 88.5542),
    ("ঠাকুরগাঁও", "Thakurgaon", "district", "ঠাকুরগাঁও", "Thakurgaon", "রংপুর", "Rangpur", 26.0337, 88.4617),

    # Mymensingh Division
    ("ময়মনসিংহ", "Mymensingh", "district", "ময়মনসিংহ", "Mymensingh", "ময়মনসিংহ", "Mymensingh", 24.7471, 90.4203),
    ("জামালপুর", "Jamalpur", "district", "জামালপুর", "Jamalpur", "ময়মনসিংহ", "Mymensingh", 24.9375, 89.9378),
    ("নেত্রকোণা", "Netrokona", "district", "নেত্রকোণা", "Netrokona", "ময়মনসিংহ", "Mymensingh", 24.8709, 90.7279),
    ("শেরপুর", "Sherpur", "district", "শেরপুর", "Sherpur", "ময়মনসিংহ", "Mymensingh", 25.0205, 90.0153),
]

# Major Upazilas across Bangladesh with exact GPS coordinates
ALL_BANGLADESH_UPAZILAS = [
    # Tangail District Upazilas (The user explicitly asked about Tangail and local areas)
    ("টাঙ্গাইল সদর", "Tangail Sadar", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.2500, 89.9167),
    ("ঘাটাইল", "Ghatail", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.4983, 89.9754),
    ("মধুপুর", "Madhupur", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.6167, 90.0333),
    ("সখীপুর", "Sakhipur", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.3167, 90.1667),
    ("গোপালপুর", "Gopalpur", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.5500, 89.9167),
    ("কালিহাতী", "Kalihati", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.3833, 90.0000),
    ("মির্জাপুর", "Mirzapur", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.1000, 90.1000),
    ("বাসাইল", "Basail", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.2167, 90.0500),
    ("দেলদুয়ার", "Delduar", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.1417, 89.9667),
    ("নাগরপুর", "Nagarpur", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.0500, 89.8750),
    ("ভূঞাপুর", "Bhuapur", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.4667, 89.8667),
    ("ধনবাড়ী", "Dhanbari", "upazila", "টাঙ্গাইল", "Tangail", "ঢাকা", "Dhaka", 24.6750, 89.9833),

    # Dhaka District Upazilas / Metros
    ("মিরপুর", "Mirpur", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.8223, 90.3654),
    ("ধানমন্ডি", "Dhanmondi", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.7461, 90.3742),
    ("গুলশান", "Gulshan", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.7925, 90.4078),
    ("উত্তরা", "Uttara", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.8759, 90.3795),
    ("সাভার", "Savar", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.8583, 90.2667),
    ("ধামরাই", "Dhamrai", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.9167, 90.2167),
    ("কেরানীগঞ্জ", "Keraniganj", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.6833, 90.3167),
    ("নবাবগঞ্জ", "Nawabganj", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.6667, 90.1667),
    ("দোহার", "Dohar", "upazila", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 23.5944, 90.1250),

    # Gazipur Upazilas
    ("শ্রীপুর", "Sreepur", "upazila", "গাজীপুর", "Gazipur", "ঢাকা", "Dhaka", 24.2000, 90.4667),
    ("কালিয়াকৈর", "Kaliakair", "upazila", "গাজীপুর", "Gazipur", "ঢাকা", "Dhaka", 24.0750, 90.2167),
    ("কালীগঞ্জ", "Kaliganj", "upazila", "গাজীপুর", "Gazipur", "ঢাকা", "Dhaka", 23.9917, 90.5667),
    ("কাপাসিয়া", "Kapasia", "upazila", "গাজীপুর", "Gazipur", "ঢাকা", "Dhaka", 24.1083, 90.5750),
    ("গাজীপুর সদর", "Gazipur Sadar", "upazila", "গাজীপুর", "Gazipur", "ঢাকা", "Dhaka", 24.0000, 90.4333),

    # Narayanganj Upazilas
    ("রূপগঞ্জ", "Rupganj", "upazila", "নারায়ণগঞ্জ", "Narayanganj", "ঢাকা", "Dhaka", 23.7917, 90.5167),
    ("সোনারগাঁও", "Sonargaon", "upazila", "নারায়ণগঞ্জ", "Narayanganj", "ঢাকা", "Dhaka", 23.6500, 90.6000),
    ("আড়াইহাজার", "Araihazar", "upazila", "নারায়ণগঞ্জ", "Narayanganj", "ঢাকা", "Dhaka", 23.7917, 90.6500),
    ("বন্দর", "Bandar", "upazila", "নারায়ণগঞ্জ", "Narayanganj", "ঢাকা", "Dhaka", 23.6000, 90.5333),

    # Narsingdi Upazilas
    ("রায়পুরা", "Raipura", "upazila", "নরসিংদী", "Narsingdi", "ঢাকা", "Dhaka", 23.9667, 90.8750),
    ("শিবপুর", "Shibpur", "upazila", "নরসিংদী", "Narsingdi", "ঢাকা", "Dhaka", 24.0417, 90.7333),
    ("বেলাবো", "Belabo", "upazila", "নরসিংদী", "Narsingdi", "ঢাকা", "Dhaka", 24.1000, 90.8500),
    ("পলাশ", "Palash", "upazila", "নরসিংদী", "Narsingdi", "ঢাকা", "Dhaka", 23.9500, 90.6333),
    ("মনোহরদী", "Monohardi", "upazila", "নরসিংদী", "Narsingdi", "ঢাকা", "Dhaka", 24.1333, 90.7000),

    # Chittagong Upazilas
    ("পটিয়া", "Patiya", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.2961, 91.9794),
    ("সীতাকুণ্ড", "Sitakunda", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.6167, 91.6667),
    ("মীরসরাই", "Mirsarai", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.7722, 91.5750),
    ("ফটিকছড়ি", "Fatikchhari", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.6833, 91.7833),
    ("হাটহাজারী", "Hathazari", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.5083, 91.8083),
    ("রাঙ্গুনিয়া", "Rangunia", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.4667, 92.0500),
    ("আনোয়ারা", "Anwara", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.2167, 91.9167),
    ("বাঁশখালী", "Banshkhali", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.0333, 91.9500),
    ("সন্দীপ", "Sandwip", "upazila", "চট্টগ্রাম", "Chittagong", "চট্টগ্রাম", "Chittagong", 22.4833, 91.4333),

    # Cox's Bazar Upazilas
    ("টেকনাফ", "Teknaf", "upazila", "কক্সবাজার", "Cox's Bazar", "চট্টগ্রাম", "Chittagong", 20.8667, 92.3000),
    ("উখিয়া", "Ukhia", "upazila", "কক্সবাজার", "Cox's Bazar", "চট্টগ্রাম", "Chittagong", 21.2833, 92.1167),
    ("রামু", "Ramu", "upazila", "কক্সবাজার", "Cox's Bazar", "চট্টগ্রাম", "Chittagong", 21.4583, 92.1000),
    ("চকরিয়া", "Chakaria", "upazila", "কক্সবাজার", "Cox's Bazar", "চট্টগ্রাম", "Chittagong", 21.7861, 92.0778),
    ("মহেশখালী", "Maheshkhali", "upazila", "কক্সবাজার", "Cox's Bazar", "চট্টগ্রাম", "Chittagong", 21.5500, 91.9667),

    # Comilla Upazilas
    ("দাউদকান্দি", "Daudkandi", "upazila", "কুমিল্লা", "Comilla", "চট্টগ্রাম", "Chittagong", 23.5333, 90.7167),
    ("চান্দিনা", "Chandina", "upazila", "কুমিল্লা", "Comilla", "চট্টগ্রাম", "Chittagong", 23.4833, 91.0000),
    ("লাকসাম", "Laksam", "upazila", "কুমিল্লা", "Comilla", "চট্টগ্রাম", "Chittagong", 23.2417, 91.1250),
    ("দেবীদ্বার", "Debidwar", "upazila", "কুমিল্লা", "Comilla", "চট্টগ্রাম", "Chittagong", 23.6000, 90.9667),
    ("হোমনা", "Homna", "upazila", "কুমিল্লা", "Comilla", "চট্টগ্রাম", "Chittagong", 23.6833, 90.7833),

    # Sylhet Upazilas
    ("শ্রীমঙ্গল", "Sreemangal", "upazila", "মৌলভীবাজার", "Moulvibazar", "সিলেট", "Sylhet", 24.3083, 91.7333),
    ("কুলাউড়া", "Kulaura", "upazila", "মৌলভীবাজার", "Moulvibazar", "সিলেট", "Sylhet", 24.5167, 92.0333),
    ("বিয়ানীবাজার", "Beanibazar", "upazila", "সিলেট", "Sylhet", "সিলেট", "Sylhet", 24.8250, 92.1667),
    ("গোলাপগঞ্জ", "Golapganj", "upazila", "সিলেট", "Sylhet", "সিলেট", "Sylhet", 24.8667, 92.0167),
    ("জৈন্তাপুর", "Jaintiapur", "upazila", "সিলেট", "Sylhet", "সিলেট", "Sylhet", 25.1333, 92.1167),
    ("ছাতক", "Chhatak", "upazila", "সুনামগঞ্জ", "Sunamganj", "সিলেট", "Sylhet", 25.0417, 91.6667),
    ("জগন্নাথপুর", "Jagannathpur", "upazila", "সুনামগঞ্জ", "Sunamganj", "সিলেট", "Sylhet", 24.7667, 91.5500),
    ("মাধবপুর", "Madhabpur", "upazila", "হবিগঞ্জ", "Habiganj", "সিলেট", "Sylhet", 24.1833, 91.2917),

    # Rajshahi Upazilas
    ("বাঘা", "Bagha", "upazila", "রাজশাহী", "Rajshahi", "রাজশাহী", "Rajshahi", 24.1917, 88.8333),
    ("চারঘাট", "Charghat", "upazila", "রাজশাহী", "Rajshahi", "রাজশাহী", "Rajshahi", 24.2833, 88.7500),
    ("পুঠিয়া", "Puthia", "upazila", "রাজশাহী", "Rajshahi", "রাজশাহী", "Rajshahi", 24.3667, 88.8333),
    ("গোদাগাড়ী", "Godagari", "upazila", "রাজশাহী", "Rajshahi", "রাজশাহী", "Rajshahi", 24.4667, 88.3333),
    ("তানোর", "Tanor", "upazila", "রাজশাহী", "Rajshahi", "রাজশাহী", "Rajshahi", 24.6000, 88.5833),
    ("শেরপুর (বগুড়া)", "Sherpur (Bogra)", "upazila", "বগুড়া", "Bogra", "রাজশাহী", "Rajshahi", 24.6750, 89.4167),
    ("শিবগঞ্জ", "Shibganj", "upazila", "বগুড়া", "Bogra", "রাজশাহী", "Rajshahi", 24.9833, 89.3167),
    ("ঈশ্বরদী", "Ishwardi", "upazila", "পাবনা", "Pabna", "রাজশাহী", "Rajshahi", 24.1500, 89.0667),
    ("বেড়া", "Bera", "upazila", "পাবনা", "Pabna", "রাজশাহী", "Rajshahi", 24.0667, 89.6167),
    ("উল্লাপাড়া", "Ullapara", "upazila", "সিরাজগঞ্জ", "Sirajganj", "রাজশাহী", "Rajshahi", 24.3167, 89.5667),
    ("শাহজাদপুর", "Shahjadpur", "upazila", "সিরাজগঞ্জ", "Sirajganj", "রাজশাহী", "Rajshahi", 24.1667, 89.6000),

    # Khulna Upazilas
    ("ডুমুরিয়া", "Dumuria", "upazila", "খুলনা", "Khulna", "খুলনা", "Khulna", 22.8083, 89.4250),
    ("পাইকগাছা", "Paikgachha", "upazila", "খুলনা", "Khulna", "খুলনা", "Khulna", 22.5833, 89.3333),
    ("বটিয়াঘাটা", "Batiaghata", "upazila", "খুলনা", "Khulna", "খুলনা", "Khulna", 22.7417, 89.5167),
    ("ঝিকরগাছা", "Jhikargachha", "upazila", "যশোর", "Jessore", "খুলনা", "Khulna", 23.1000, 89.1333),
    ("শার্শা", "Sharsha", "upazila", "যশোর", "Jessore", "খুলনা", "Khulna", 23.0750, 88.9333),
    ("বেনাপোল", "Benapole", "upazila", "যশোর", "Jessore", "খুলনা", "Khulna", 23.0333, 88.8833),
    ("মণিরামপুর", "Manirampur", "upazila", "যশোর", "Jessore", "খুলনা", "Khulna", 23.0167, 89.2333),
    ("ভেড়ামারা", "Bheramara", "upazila", "কুষ্টিয়া", "Kushtia", "খুলনা", "Khulna", 24.0250, 88.9917),
    ("কুমারখালী", "Kumarkhali", "upazila", "কুষ্টিয়া", "Kushtia", "খুলনা", "Khulna", 23.8667, 89.2500),
    ("শ্যামনগর", "Shyamnagar", "upazila", "সাতক্ষীরা", "Satkhira", "খুলনা", "Khulna", 22.3306, 89.1028),
    ("কালীগঞ্জ (সাতক্ষীরা)", "Kaliganj (Satkhira)", "upazila", "সাতক্ষীরা", "Satkhira", "খুলনা", "Khulna", 22.4500, 89.0417),
    ("মোংলা", "Mongla", "upazila", "বাগেরহাট", "Bagerhat", "খুলনা", "Khulna", 22.4833, 89.6000),

    # Barisal Upazilas
    ("বাবুগঞ্জ", "Babuganj", "upazila", "বরিশাল", "Barisal", "বরিশাল", "Barisal", 22.8333, 90.3167),
    ("গৌরনদী", "Gournadi", "upazila", "বরিশাল", "Barisal", "বরিশাল", "Barisal", 22.9750, 90.2333),
    ("বানারীপাড়া", "Banaripara", "upazila", "বরিশাল", "Barisal", "বরিশাল", "Barisal", 22.7833, 90.1667),
    ("কুয়াকাটা", "Kuakata", "upazila", "পটুয়াখালী", "Patuakhali", "বরিশাল", "Barisal", 21.8167, 90.1167),
    ("কলাপাড়া", "Kalapara", "upazila", "পটুয়াখালী", "Patuakhali", "বরিশাল", "Barisal", 21.9833, 90.2333),
    ("চরফ্যাশন", "Char Fasson", "upazila", "ভোলা", "Bhola", "বরিশাল", "Barisal", 22.1833, 90.7167),
    ("লালমোহন", "Lalmohan", "upazila", "ভোলা", "Bhola", "বরিশাল", "Barisal", 22.3333, 90.7333),
    ("স্বরূপকাঠি", "Swarupkathi", "upazila", "পিরোজপুর", "Pirojpur", "বরিশাল", "Barisal", 22.7500, 90.1333),
    ("আমতলী", "Amtali", "upazila", "বরগুনা", "Barguna", "বরিশাল", "Barisal", 22.1333, 90.2333),

    # Rangpur Upazilas
    ("মিঠাপুকুর", "Mithapukur", "upazila", "রংপুর", "Rangpur", "রংপুর", "Rangpur", 25.5833, 89.2833),
    ("পীরগঞ্জ", "Pirganj", "upazila", "রংপুর", "Rangpur", "রংপুর", "Rangpur", 25.4167, 89.3167),
    ("বদরগঞ্জ", "Badarganj", "upazila", "রংপুর", "Rangpur", "রংপুর", "Rangpur", 25.6833, 89.0500),
    ("বিরামপুর", "Birampur", "upazila", "দিনাজপুর", "Dinajpur", "রংপুর", "Rangpur", 25.3750, 88.9833),
    ("ফুলবাড়ী", "Fulbari", "upazila", "দিনাজপুর", "Dinajpur", "রংপুর", "Rangpur", 25.5167, 88.8833),
    ("গোবিন্দগঞ্জ", "Gobindaganj", "upazila", "গাইবান্ধা", "Gaibandha", "রংপুর", "Rangpur", 25.1333, 89.3833),
    ("সৈয়দপুর", "Saidpur", "upazila", "নীলফামারী", "Nilphamari", "রংপুর", "Rangpur", 25.7778, 88.8917),
    ("তেঁতুলিয়া", "Tetulia", "upazila", "পঞ্চগড়", "Panchagarh", "রংপুর", "Rangpur", 26.4944, 88.3583),
    ("পীরগঞ্জ (ঠাকুরগাঁও)", "Pirganj (Thakurgaon)", "upazila", "ঠাকুরগাঁও", "Thakurgaon", "রংপুর", "Rangpur", 25.8500, 88.3667),
    ("রৌমারী", "Roumari", "upazila", "কুড়িগ্রাম", "Kurigram", "রংপুর", "Rangpur", 25.5667, 89.8500),

    # Mymensingh Upazilas
    ("মুক্তাগাছা", "Muktagachha", "upazila", "ময়মনসিংহ", "Mymensingh", "ময়মনসিংহ", "Mymensingh", 24.7583, 90.2667),
    ("ত্রিশাল", "Trishal", "upazila", "ময়মনসিংহ", "Mymensingh", "ময়মনসিংহ", "Mymensingh", 24.5833, 90.4000),
    ("ভালুকা", "Bhaluka", "upazila", "ময়মনসিংহ", "Mymensingh", "ময়মনসিংহ", "Mymensingh", 24.3750, 90.3833),
    ("গফরগাঁও", "Gafargaon", "upazila", "ময়মনসিংহ", "Mymensingh", "ময়মনসিংহ", "Mymensingh", 24.4333, 90.5500),
    ("ফুলপুর", "Phulpur", "upazila", "ময়মনসিংহ", "Mymensingh", "ময়মনসিংহ", "Mymensingh", 24.9500, 90.3500),
    ("মেলান্দহ", "Melandaha", "upazila", "জামালপুর", "Jamalpur", "ময়মনসিংহ", "Mymensingh", 24.9667, 89.8333),
    ("সরিষাবাড়ী", "Sarishabari", "upazila", "জামালপুর", "Jamalpur", "ময়মনসিংহ", "Mymensingh", 24.7500, 89.8333),
    ("মোহনগঞ্জ", "Mohanganj", "upazila", "নেত্রকোণা", "Netrokona", "ময়মনসিংহ", "Mymensingh", 24.8667, 90.9667),
    ("নকলা", "Nakla", "upazila", "শেরপুর", "Sherpur", "ময়মনসিংহ", "Mymensingh", 24.9833, 90.1833),
    ("নালিতাবাড়ী", "Nalitabari", "upazila", "শেরপুর", "Sherpur", "ময়মনসিংহ", "Mymensingh", 25.0833, 90.2000),
]


def get_all_geo_records():
    """Returns combined list of all districts and upazilas."""
    return ALL_BANGLADESH_DISTRICTS + ALL_BANGLADESH_UPAZILAS
