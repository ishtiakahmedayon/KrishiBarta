import 'package:flutter_tts/flutter_tts.dart';

/// TtsService — singleton wrapper around flutter_tts.
/// Call speak(text) to read aloud; stop() to silence immediately.
class TtsService {
  TtsService._();
  static final TtsService instance = TtsService._();

  final FlutterTts _tts = FlutterTts();
  bool _initialized = false;
  bool _speaking = false;

  bool get isSpeaking => _speaking;

  Future<void> _init() async {
    if (_initialized) return;
    await _tts.setLanguage('bn-BD');
    await _tts.setSpeechRate(0.45);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);
    _tts.setCompletionHandler(() => _speaking = false);
    _tts.setErrorHandler((_) => _speaking = false);
    _initialized = true;
  }

  Future<void> speak(String text) async {
    await _init();
    await _tts.stop();
    _speaking = true;
    await _tts.speak(text);
  }

  Future<void> stop() async {
    _speaking = false;
    await _tts.stop();
  }

  Future<void> toggle(String text) async {
    if (_speaking) {
      await stop();
    } else {
      await speak(text);
    }
  }
}
