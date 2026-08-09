import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart';
import '../utils/bangla_numbers.dart';

/// ChatService — very small intent router for the home-page chat card.
/// It reuses ApiService (prices / pesticides / krishi offices) and the same
/// free Open-Meteo weather API used by WeatherScreen, then formats a plain
/// Bangla sentence as the answer. If nothing matches, it says so.
class ChatService {
  ChatService._();
  static final ChatService instance = ChatService._();

  Future<String> ask(String rawQuery) async {
    final q = rawQuery.trim();
    if (q.isEmpty) return 'দয়া করে একটি প্রশ্ন লিখুন বা বলুন।';

    try {
      if (q.contains('আবহাওয়া')) {
        return await _answerWeather(q);
      }
      if (q.contains('দাম') || q.contains('মূল্য')) {
        return await _answerPrice(q);
      }
      if (q.contains('কীটনাশক') || q.contains('পোকা') || q.contains('রোগ')) {
        return await _answerPesticide(q);
      }
      if (q.contains('অফিস')) {
        return await _answerOffice(q);
      }
      // Fallback: try price match anyway (user may skip the word "দাম")
      final priceGuess = await _tryPriceGuess(q);
      if (priceGuess != null) return priceGuess;

      return 'দুঃখিত, এই প্রশ্নের উত্তর পাওয়া যায়নি। সবজির দাম, আবহাওয়া, '
          'কীটনাশক বা কৃষি অফিস সম্পর্কে জিজ্ঞাসা করে দেখুন।';
    } catch (e) {
      return 'দুঃখিত, তথ্য আনতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।';
    }
  }

  // ── Prices ────────────────────────────────────────────────────────────
  Future<String> _answerPrice(String q) async {
    final result = await _tryPriceGuess(q);
    if (result != null) return result;
    return 'দুঃখিত, আপনার জিজ্ঞাসিত পণ্যের দাম খুঁজে পাওয়া যায়নি। '
        '"সবজির দাম" পাতায় সম্পূর্ণ তালিকা দেখতে পারেন।';
  }

  Future<String?> _tryPriceGuess(String q) async {
    final items = await ApiService.instance.getAllPrices();
    for (final item in items) {
      if (q.contains(item.name) || q.contains(item.namePossessive)) {
        final unit = speakableUnit(item.unit);
        final unitPhrase = unit.isNotEmpty ? 'প্রতি $unit ' : '';
        return '${item.namePossessive} বর্তমান দাম $unitPhrase'
            '${formatPriceBangla(item.price)} টাকা।';
      }
    }
    return null;
  }

  // ── Pesticides ───────────────────────────────────────────────────────
  Future<String> _answerPesticide(String q) async {
    final items = await ApiService.instance.getAllPesticides();
    for (final item in items) {
      if (q.contains(item.crop) || q.contains(item.pest)) {
        return '${item.crop}-এ ${item.pest} দমনের জন্য "${item.pesticideName}" '
            'ব্যবহার করুন। মাত্রা: ${item.dosage}। সতর্কতা: ${item.precaution}';
      }
    }
    return 'দুঃখিত, এই ফসল বা পোকা সম্পর্কে কীটনাশকের তথ্য খুঁজে পাওয়া যায়নি।';
  }

  // ── Krishi offices ───────────────────────────────────────────────────
  Future<String> _answerOffice(String q) async {
    final items = await ApiService.instance.getAllOffices();
    for (final item in items) {
      if (q.contains(item.district)) {
        return '${item.district} কৃষি অফিস: ${item.name}, ঠিকানা: '
            '${item.address}। ফোন: ${item.phone}। সেবা: ${item.services}';
      }
    }
    return 'দুঃখিত, এই জেলার কৃষি অফিসের তথ্য খুঁজে পাওয়া যায়নি।';
  }

  // ── Weather (same free API as WeatherScreen) ────────────────────────

  /// Local coordinates for common Bangladeshi districts. Open-Meteo's
  /// geocoding API often fails to match Bangla-script names reliably
  /// (e.g. "ঢাকা" returns no results), so known districts are resolved
  /// locally first and the remote geocoder is only a fallback.
  static const Map<String, ({double lat, double lon, String label})>
      _districtCoords = {
    'ঢাকা': (lat: 23.8103, lon: 90.4125, label: 'ঢাকা'),
    'টাঙ্গাইল': (lat: 24.2513, lon: 89.9167, label: 'টাঙ্গাইল'),
    'চট্টগ্রাম': (lat: 22.3569, lon: 91.7832, label: 'চট্টগ্রাম'),
    'রাজশাহী': (lat: 24.3745, lon: 88.6042, label: 'রাজশাহী'),
    'খুলনা': (lat: 22.8456, lon: 89.5403, label: 'খুলনা'),
    'বরিশাল': (lat: 22.7010, lon: 90.3535, label: 'বরিশাল'),
    'সিলেট': (lat: 24.8949, lon: 91.8687, label: 'সিলেট'),
    'রংপুর': (lat: 25.7439, lon: 89.2752, label: 'রংপুর'),
    'ময়মনসিংহ': (lat: 24.7471, lon: 90.4203, label: 'ময়মনসিংহ'),
    'কুমিল্লা': (lat: 23.4607, lon: 91.1809, label: 'কুমিল্লা'),
    'নারায়ণগঞ্জ': (lat: 23.6238, lon: 90.5000, label: 'নারায়ণগঞ্জ'),
    'গাজীপুর': (lat: 23.9999, lon: 90.4203, label: 'গাজীপুর'),
    'জামালপুর': (lat: 24.9375, lon: 89.9372, label: 'জামালপুর'),
    'বগুড়া': (lat: 24.8465, lon: 89.3773, label: 'বগুড়া'),
    'দিনাজপুর': (lat: 25.6217, lon: 88.6354, label: 'দিনাজপুর'),
    'যশোর': (lat: 23.1665, lon: 89.2081, label: 'যশোর'),
    'কক্সবাজার': (lat: 21.4272, lon: 92.0058, label: 'কক্সবাজার'),
    'পাবনা': (lat: 24.0064, lon: 89.2372, label: 'পাবনা'),
    'ফরিদপুর': (lat: 23.6070, lon: 89.8429, label: 'ফরিদপুর'),
    'নোয়াখালী': (lat: 22.8696, lon: 91.0995, label: 'নোয়াখালী'),
  };

  Future<String> _answerWeather(String q) async {
    var city = q
        .replaceAll('আজকে', '')
        .replaceAll('আজকের', '')
        .replaceAll('আবহাওয়া', '')
        .replaceAll('কেমন', '')
        .replaceAll('কত', '')
        .replaceAll('কী', '')
        .replaceAll('কি', '')
        .replaceAll('?', '')
        .replaceAll('।', '')
        .trim();
    // Strip Bangla possessive suffixes so "ঢাকার" → "ঢাকা" before geocoding.
    if (city.endsWith('এর')) {
      city = city.substring(0, city.length - 2).trim();
    } else if (city.endsWith('র') && city.length > 1) {
      city = city.substring(0, city.length - 1).trim();
    }
    if (city.isEmpty) city = 'ঢাকা';

    // Try local district table first (reliable for Bangla names).
    double? lat, lon;
    String name = city;
    for (final entry in _districtCoords.entries) {
      if (city == entry.key || city.contains(entry.key)) {
        lat = entry.value.lat;
        lon = entry.value.lon;
        name = entry.value.label;
        break;
      }
    }

    // Fall back to remote geocoding for districts not in the local table.
    if (lat == null || lon == null) {
      final geoUri = Uri.parse(
        'https://geocoding-api.open-meteo.com/v1/search'
        '?name=${Uri.encodeComponent(city)}&count=1&language=bn',
      );
      final geoRes = await http.get(geoUri);
      if (geoRes.statusCode != 200) return 'আবহাওয়ার তথ্য আনা যায়নি।';
      final geoData = jsonDecode(utf8.decode(geoRes.bodyBytes));
      final results = geoData['results'] as List?;
      if (results == null || results.isEmpty) {
        return '"$city" এর আবহাওয়া তথ্য খুঁজে পাওয়া যায়নি।';
      }
      final loc = results.first as Map<String, dynamic>;
      lat = loc['latitude'] as double;
      lon = loc['longitude'] as double;
      name = loc['name'] as String? ?? city;
    }

    final wxUri = Uri.parse(
      'https://api.open-meteo.com/v1/forecast'
      '?latitude=$lat&longitude=$lon'
      '&current=temperature_2m,relative_humidity_2m,weather_code'
      '&timezone=Asia/Dhaka',
    );
    final wxRes = await http.get(wxUri);
    if (wxRes.statusCode != 200) return 'আবহাওয়ার তথ্য আনা যায়নি।';
    final wxData = jsonDecode(utf8.decode(wxRes.bodyBytes));
    final cur = wxData['current'] as Map<String, dynamic>;
    final code = cur['weather_code'] as int;

    return '$name-এর আবহাওয়া: ${_weatherDesc(code)}। তাপমাত্রা '
        '${toBanglaDigits(cur['temperature_2m'].toString())} ডিগ্রি সেলসিয়াস, '
        'আর্দ্রতা ${toBanglaDigits(cur['relative_humidity_2m'].toString())} শতাংশ।';
  }

  String _weatherDesc(int code) {
    if (code == 0) return 'পরিষ্কার আকাশ';
    if (code <= 3) return 'আংশিক মেঘলা';
    if (code <= 49) return 'কুয়াশাচ্ছন্ন';
    if (code <= 59) return 'গুঁড়ি গুঁড়ি বৃষ্টি';
    if (code <= 67) return 'বৃষ্টি';
    if (code <= 77) return 'তুষারপাত';
    if (code <= 82) return 'মুষলধারে বৃষ্টি';
    if (code <= 99) return 'বজ্রঝড়';
    return 'অজানা আবহাওয়া';
  }
}
