import 'package:flutter/material.dart';
import '../screens/chat_screen.dart';
import 'chat_hero_shuttle.dart';

/// ChatFab — floating chat-bot launcher used on every tab screen.
/// Shares the `chatHero` tag with HomeScreen's chat card and ChatScreen's
/// header, so tapping it from any screen expands into the chat the same way.
class ChatFab extends StatelessWidget {
  const ChatFab({super.key});

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'chatHero',
      flightShuttleBuilder: chatHeroFlightShuttle,
      child: Material(
        color: Colors.transparent,
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ChatScreen()),
            );
          },
          child: Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2E7D32).withValues(alpha: 0.45),
                  blurRadius: 14,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: const Icon(Icons.chat_bubble_rounded,
                color: Colors.white, size: 26),
          ),
        ),
      ),
    );
  }
}
