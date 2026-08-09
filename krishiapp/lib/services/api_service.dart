import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../models/price_item.dart';
import '../models/pesticide_item.dart';
import '../models/krishi_office.dart';

/// Singleton service that talks to the KrishiApp Flask backend.
class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  Map<String, String> get _headers => {
        'X-API-KEY': AppConfig.apiKey,
        'Content-Type': 'application/json',
      };

  // -----------------------------------------------------------------------
  // Prices
  // -----------------------------------------------------------------------

  Future<List<PriceItem>> getAllPrices({String? category}) async {
    final uri = category != null
        ? Uri.parse('${AppConfig.apiBaseUrl}/prices?category=${Uri.encodeComponent(category)}')
        : Uri.parse('${AppConfig.apiBaseUrl}/prices');
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.map((e) => PriceItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<String>> getPriceCategories() async {
    final uri = Uri.parse('${AppConfig.apiBaseUrl}/prices/categories');
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.cast<String>();
  }

  // -----------------------------------------------------------------------
  // Pesticides
  // -----------------------------------------------------------------------

  Future<List<PesticideItem>> getAllPesticides({String? crop}) async {
    final uri = crop != null
        ? Uri.parse('${AppConfig.apiBaseUrl}/pesticides?crop=${Uri.encodeComponent(crop)}')
        : Uri.parse('${AppConfig.apiBaseUrl}/pesticides');
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.map((e) => PesticideItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<String>> getPesticideCrops() async {
    final uri = Uri.parse('${AppConfig.apiBaseUrl}/pesticides/crops');
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.cast<String>();
  }

  // -----------------------------------------------------------------------
  // Krishi Offices
  // -----------------------------------------------------------------------

  Future<List<KrishiOffice>> getAllOffices({String? district}) async {
    final uri = district != null
        ? Uri.parse('${AppConfig.apiBaseUrl}/krishi_offices?district=${Uri.encodeComponent(district)}')
        : Uri.parse('${AppConfig.apiBaseUrl}/krishi_offices');
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.map((e) => KrishiOffice.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<String>> getOfficeDistricts() async {
    final uri = Uri.parse('${AppConfig.apiBaseUrl}/krishi_offices/districts');
    final res = await http.get(uri, headers: _headers);
    _checkOk(res);
    final list = jsonDecode(utf8.decode(res.bodyBytes)) as List;
    return list.cast<String>();
  }

  // -----------------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------------

  void _checkOk(http.Response res) {
    if (res.statusCode == 401) {
      throw Exception('API কী সঠিক নয় — lib/config.dart চেক করুন');
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw Exception('API ত্রুটি ${res.statusCode}: ${res.body}');
    }
  }
}
