import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../services/chat_service.dart';
import '../services/tts_service.dart';
import '../widgets/chat_hero_shuttle.dart';

class _ChatMessage {
  final String text;
  final bool isUser;
  _ChatMessage(this.text, this.isUser);
}

/// ChatScreen — opens with a Hero "expand from icon" animation (paired with
/// the chat card's Hero tag on HomeScreen). Mic input is the primary action,
/// sitting right next to the text field.
class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final _speech = stt.SpeechToText();
  final List<_ChatMessage> _messages = [];

  bool _listening = false;
  bool _speechAvailable = false;
  bool _sending = false;
  int? _speakingIndex;

  static const _suggestions = [
    'আজকে আলুর দাম কত?',
    'আজকে ঢাকার আবহাওয়া কেমন?',
    'টাঙ্গাইল আবহাওয়া?',
    'ধানের দাম?',
  ];

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  Future<void> _initSpeech() async {
    final ok = await _speech.initialize(
      onStatus: (status) {
        if (status == 'done' || status == 'notListening') {
          if (mounted) setState(() => _listening = false);
        }
      },
      onError: (_) {
        if (mounted) setState(() => _listening = false);
      },
    );
    if (mounted) setState(() => _speechAvailable = ok);
  }

  Future<void> _toggleMic() async {
    if (_listening) {
      await _speech.stop();
      setState(() => _listening = false);
      return;
    }
    if (!_speechAvailable) {
      await _initSpeech();
      if (!_speechAvailable) return;
    }
    setState(() => _listening = true);
    await TtsService.instance.stop();
    if (mounted) setState(() => _speakingIndex = null);
    await _speech.listen(
      localeId: 'bn_BD',
      onResult: (result) {
        setState(() => _controller.text = result.recognizedWords);
        if (result.finalResult && result.recognizedWords.trim().isNotEmpty) {
          _send(result.recognizedWords);
        }
      },
    );
  }

  Future<void> _send([String? text]) async {
    final query = (text ?? _controller.text).trim();
    if (query.isEmpty || _sending) return;
    setState(() {
      _messages.add(_ChatMessage(query, true));
      _controller.clear();
      _sending = true;
    });
    _scrollToBottom();

    final answer = await ChatService.instance.ask(query);

    if (!mounted) return;
    final botIndex = _messages.length;
    setState(() {
      _messages.add(_ChatMessage(answer, false));
      _sending = false;
    });
    _scrollToBottom();
    _speak(answer, botIndex);
  }

  Future<void> _speak(String text, int index) async {
    setState(() => _speakingIndex = index);
    await TtsService.instance.speak(text);
    if (mounted && _speakingIndex == index) {
      setState(() => _speakingIndex = null);
    }
  }

  Future<void> _toggleSpeak(String text, int index) async {
    if (_speakingIndex == index) {
      await TtsService.instance.stop();
      if (mounted) setState(() => _speakingIndex = null);
    } else {
      await TtsService.instance.stop();
      _speak(text, index);
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    _speech.stop();
    TtsService.instance.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F8E9),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeroHeader(context),
            Expanded(
              child: _messages.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: _messages.length + (_sending ? 1 : 0),
                      itemBuilder: (context, i) {
                        if (i >= _messages.length) {
                          return _buildTypingBubble();
                        }
                        return _buildBubble(_messages[i], i);
                      },
                    ),
            ),
            _buildInputBar(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context) {
    return Hero(
      tag: 'chatHero',
      flightShuttleBuilder: chatHeroFlightShuttle,
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(8, 10, 8, 16),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(24),
              bottomRight: Radius.circular(24),
            ),
          ),
          child: Row(
            children: [
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back, color: Colors.white),
              ),
              const Expanded(
                child: Text(
                  'কৃষিঅ্যাপ চ্যাট',
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 48),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SizedBox(height: 20),
        Icon(Icons.chat_bubble_outline, size: 56, color: Colors.green.shade300),
        const SizedBox(height: 12),
        const Text(
          'যা জানতে চান লিখুন বা মাইকে বলুন',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 15, color: Colors.black54),
        ),
        const SizedBox(height: 20),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          alignment: WrapAlignment.center,
          children: _suggestions
              .map((s) => ActionChip(
                    label: Text(s, style: const TextStyle(fontSize: 12)),
                    backgroundColor: Colors.white,
                    side: BorderSide(color: Colors.green.shade200),
                    onPressed: () => _send(s),
                  ))
              .toList(),
        ),
      ],
    );
  }

  Widget _buildBubble(_ChatMessage m, int index) {
    final speaking = _speakingIndex == index;
    return Align(
      alignment: m.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width * 0.78),
        decoration: BoxDecoration(
          color: m.isUser ? const Color(0xFF2E7D32) : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(m.isUser ? 16 : 4),
            bottomRight: Radius.circular(m.isUser ? 4 : 16),
          ),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 4,
                offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment:
              m.isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              m.text,
              style: TextStyle(
                color: m.isUser ? Colors.white : Colors.black87,
                fontSize: 14.5,
              ),
            ),
            if (!m.isUser) ...[
              const SizedBox(height: 4),
              InkWell(
                onTap: () => _toggleSpeak(m.text, index),
                borderRadius: BorderRadius.circular(20),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 4, vertical: 2),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        speaking ? Icons.stop_circle : Icons.volume_up,
                        size: 16,
                        color: const Color(0xFF2E7D32),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        speaking ? 'থামান' : 'শুনুন',
                        style: const TextStyle(
                            fontSize: 11, color: Color(0xFF2E7D32)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTypingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const SizedBox(
          width: 24,
          height: 12,
          child: Center(
            child: SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 8,
              offset: const Offset(0, -2)),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            // Mic — the primary, most prominent action alongside text input.
            GestureDetector(
              onTap: _toggleMic,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _listening ? Colors.red : const Color(0xFF2E7D32),
                  boxShadow: [
                    BoxShadow(
                      color: (_listening ? Colors.red : Colors.green)
                          .withValues(alpha: 0.4),
                      blurRadius: _listening ? 14 : 6,
                      spreadRadius: _listening ? 2 : 0,
                    ),
                  ],
                ),
                child: Icon(
                  _listening ? Icons.mic : Icons.mic_none,
                  color: Colors.white,
                  size: 28,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Container(
                constraints: const BoxConstraints(maxHeight: 120),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F8E9),
                  borderRadius: BorderRadius.circular(26),
                ),
                child: TextField(
                  controller: _controller,
                  minLines: 1,
                  maxLines: 4,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _send(),
                  decoration: const InputDecoration(
                    hintText: 'প্রশ্ন লিখুন... (যেমনঃ আলুর দাম কত?)',
                    border: InputBorder.none,
                    isCollapsed: true,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              onPressed: _sending ? null : () => _send(),
              icon: const Icon(Icons.send, color: Color(0xFF2E7D32)),
            ),
          ],
        ),
      ),
    );
  }
}
