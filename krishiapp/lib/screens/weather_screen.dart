import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../services/tts_service.dart';
import '../widgets/mic_button.dart';
import '../widgets/chat_fab.dart';
import '../utils/bangla_numbers.dart';

/// আবহাওয়া — fetches live weather via Open-Meteo (free, no API key needed).
class WeatherScreen extends StatefulWidget {
  const WeatherScreen({super.key});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  final _cityCtrl = TextEditingController(text: 'ঢাকা');
  bool _loading = false;
  String? _error;
  Map<String, dynamic>? _weather;
  String? _resolvedCity;
  bool _speaking = false;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  @override
  void dispose() {
    _cityCtrl.dispose();
    TtsService.instance.stop();
    super.dispose();
  }

  Future<void> _fetch() async {
    final city = _cityCtrl.text.trim();
    if (city.isEmpty) return;
    setState(() {
      _loading = true;
      _error = null;
      _weather = null;
    });

    try {
      // Step 1: Geocode
      final geoUri = Uri.parse(
        'https://geocoding-api.open-meteo.com/v1/search'
        '?name=${Uri.encodeComponent(city)}&count=1&language=bn',
      );
      final geoRes = await http.get(geoUri);
      if (geoRes.statusCode != 200) throw Exception('জিওকোডিং ব্যর্থ হয়েছে');
      final geoData = jsonDecode(utf8.decode(geoRes.bodyBytes));
      final results = geoData['results'] as List?;
      if (results == null || results.isEmpty) {
        throw Exception(
            '"$city" খুঁজে পাওয়া যায়নি। অন্য নাম দিয়ে চেষ্টা করুন।');
      }
      final loc = results.first as Map<String, dynamic>;
      final lat = loc['latitude'] as double;
      final lon = loc['longitude'] as double;
      final name = loc['name'] as String? ?? city;
      final country = loc['country'] as String? ?? '';

      // Step 2: Weather
      final wxUri = Uri.parse(
        'https://api.open-meteo.com/v1/forecast'
        '?latitude=$lat&longitude=$lon'
        '&current=temperature_2m,relative_humidity_2m,weather_code,'
        'wind_speed_10m,apparent_temperature,precipitation'
        '&wind_speed_unit=kmh&timezone=Asia/Dhaka',
      );
      final wxRes = await http.get(wxUri);
      if (wxRes.statusCode != 200) {
        throw Exception('আবহাওয়া ডেটা আনা ব্যর্থ হয়েছে');
      }
      final wxData = jsonDecode(utf8.decode(wxRes.bodyBytes));

      setState(() {
        _loading = false;
        _weather = wxData['current'] as Map<String, dynamic>;
        _resolvedCity = '$name, $country';
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    }
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

  String _weatherEmoji(int code) {
    if (code == 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 49) return '🌫️';
    if (code <= 59) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌧️';
    if (code <= 99) return '⛈️';
    return '🌡️';
  }

  String _buildTtsText() {
    if (_weather == null) return 'আবহাওয়ার তথ্য পাওয়া যায়নি।';
    final code = _weather!['weather_code'] as int;
    String num(dynamic v) => toBanglaDigits(v.toString());
    return '${_resolvedCity ?? ''} এর আবহাওয়া। '
        '${_weatherDesc(code)}। '
        'তাপমাত্রা ${num(_weather!['temperature_2m'])} ডিগ্রি সেলসিয়াস। '
        'অনুভূত তাপমাত্রা ${num(_weather!['apparent_temperature'])} ডিগ্রি। '
        'আর্দ্রতা ${num(_weather!['relative_humidity_2m'])} শতাংশ। '
        'বাতাসের গতি ${num(_weather!['wind_speed_10m'])} কিলোমিটার প্রতি ঘণ্টা। '
        'বৃষ্টিপাত ${num(_weather!['precipitation'])} মিলিমিটার।';
  }

  Future<void> _toggleTts() async {
    if (_speaking) {
      await TtsService.instance.stop();
      setState(() => _speaking = false);
    } else {
      setState(() => _speaking = true);
      await TtsService.instance.speak(_buildTtsText());
      if (mounted) setState(() => _speaking = false);
    }
  }

  Widget _infoTile(
      IconData icon, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey.shade600)),
                Text(value,
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final green = Theme.of(context).colorScheme.primary;
    return Scaffold(
      appBar: AppBar(
        title: const Text('আবহাওয়া'),
        centerTitle: true,
        backgroundColor: const Color(0xFF1565C0),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (_weather != null)
            IconButton(
              tooltip: _speaking ? 'পড়া বন্ধ করুন' : 'পড়ে শোনান',
              icon: Icon(_speaking ? Icons.stop_circle : Icons.volume_up),
              onPressed: _toggleTts,
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Search row
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _cityCtrl,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _fetch(),
                    decoration: InputDecoration(
                      hintText: 'জেলার নাম লিখুন (যেমন: ঢাকা)',
                      prefixIcon:
                          const Icon(Icons.location_on_outlined),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                      filled: true,
                      fillColor: Colors.grey.shade100,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _loading ? null : _fetch,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('খুঁজুন'),
                ),
                const SizedBox(width: 8),
                MicButton(
                  color: const Color(0xFF1565C0),
                  onResult: (text) {
                    _cityCtrl.text = text;
                  },
                  onDone: () async {
                    await _fetch();
                    if (mounted && !_speaking && _weather != null) {
                      _toggleTts();
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),
            if (_loading)
              const Center(child: CircularProgressIndicator())
            else if (_error != null)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                        child: Text(_error!,
                            style:
                                const TextStyle(color: Colors.red))),
                  ],
                ),
              )
            else if (_weather != null) ...[
              // City name
              Text(
                _resolvedCity ?? '',
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                '${_weatherEmoji(_weather!['weather_code'] as int)} '
                '${_weatherDesc(_weather!['weather_code'] as int)}',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 16, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 16),
              // Big temperature display
              Container(
                padding: const EdgeInsets.symmetric(vertical: 24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      green.withValues(alpha: 0.8),
                      green.withValues(alpha: 0.5)
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  children: [
                    Text(
                      '${_weather!['temperature_2m']}°সে',
                      style: const TextStyle(
                          fontSize: 60,
                          fontWeight: FontWeight.w200,
                          color: Colors.white),
                    ),
                    Text(
                      'অনুভূত: ${_weather!['apparent_temperature']}°সে',
                      style:
                          const TextStyle(color: Colors.white70),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              // Info grid
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 2.2,
                children: [
                  _infoTile(
                      Icons.water_drop_outlined,
                      'আর্দ্রতা',
                      '${_weather!['relative_humidity_2m']}%',
                      Colors.blue),
                  _infoTile(
                      Icons.air,
                      'বাতাসের গতি',
                      '${_weather!['wind_speed_10m']} কিমি/ঘণ্টা',
                      Colors.cyan),
                  _infoTile(
                      Icons.umbrella_outlined,
                      'বৃষ্টিপাত',
                      '${_weather!['precipitation']} মিমি',
                      Colors.indigo),
                  _infoTile(
                      Icons.wb_sunny_outlined,
                      'আবহাওয়া কোড',
                      '${_weather!['weather_code']}',
                      Colors.orange),
                ],
              ),
            ],
          ],
        ),
      ),
      floatingActionButton: const ChatFab(),
    );
  }
}
