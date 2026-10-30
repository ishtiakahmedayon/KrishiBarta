import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

/// MicButton — a compact, animated (pulsing while listening) mic button
/// that any screen can drop next to a search field. Recognized Bengali
/// speech is returned via [onResult].
class MicButton extends StatefulWidget {
  final ValueChanged<String> onResult;
  final Color color;

  /// Called once the listening session ends (final speech result, manual
  /// stop, or error) — screens use this to auto-read the result aloud.
  final VoidCallback? onDone;

  const MicButton({
    super.key,
    required this.onResult,
    this.color = const Color(0xFF2E7D32),
    this.onDone,
  });

  @override
  State<MicButton> createState() => _MicButtonState();
}

class _MicButtonState extends State<MicButton>
    with SingleTickerProviderStateMixin {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _listening = false;
  bool _available = false;
  late final AnimationController _pulseController;
  late final Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _pulse = Tween<double>(begin: 1.0, end: 1.18).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _speech.stop();
    super.dispose();
  }

  Future<void> _toggle() async {
    if (_listening) {
      await _speech.stop();
      _pulseController.stop();
      _pulseController.reset();
      if (mounted) setState(() => _listening = false);
      widget.onDone?.call();
      return;
    }

    if (!_available) {
      _available = await _speech.initialize(
        onStatus: (status) {
          if (status == 'done' || status == 'notListening') {
            _pulseController.stop();
            _pulseController.reset();
            if (mounted) setState(() => _listening = false);
          }
        },
        onError: (_) {
          _pulseController.stop();
          _pulseController.reset();
          if (mounted) setState(() => _listening = false);
        },
      );
    }
    if (!_available) return;

    setState(() => _listening = true);
    _pulseController.repeat(reverse: true);
    await _speech.listen(
      localeId: 'bn_BD',
      onResult: (result) {
        if (result.recognizedWords.trim().isEmpty) return;
        widget.onResult(result.recognizedWords.trim());
        if (result.finalResult) {
          _pulseController.stop();
          _pulseController.reset();
          if (mounted) setState(() => _listening = false);
          widget.onDone?.call();
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _listening ? _pulse : const AlwaysStoppedAnimation(1.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: _toggle,
          borderRadius: BorderRadius.circular(14),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: _listening
                    ? [Colors.red.shade600, Colors.red.shade800]
                    : [widget.color, widget.color.withValues(alpha: 0.75)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: (_listening ? Colors.red : widget.color)
                      .withValues(alpha: _listening ? 0.45 : 0.3),
                  blurRadius: _listening ? 12 : 6,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Icon(
              _listening ? Icons.mic : Icons.mic_none_rounded,
              color: Colors.white,
              size: 22,
            ),
          ),
        ),
      ),
    );
  }
}
