import 'package:flutter/material.dart';
import 'price_screen.dart';
import 'weather_screen.dart';
import 'pesticide_screen.dart';
import 'krishi_office_screen.dart';
import 'chat_screen.dart';
import '../widgets/chat_hero_shuttle.dart';

/// HomeScreen — dashboard with 4 icon cards + hamburger Drawer.
/// Tapping a card pushes the corresponding full page.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _cards = [
    _CardData(
      icon: Icons.storefront,
      label: 'সবজির দাম',
      subtitle: 'আজকের বাজার মূল্য',
      color: Color(0xFF2E7D32),
      lightColor: Color(0xFFE8F5E9),
    ),
    _CardData(
      icon: Icons.wb_sunny,
      label: 'আবহাওয়া',
      subtitle: 'আজকের আবহাওয়া',
      color: Color(0xFF1565C0),
      lightColor: Color(0xFFE3F2FD),
    ),
    _CardData(
      icon: Icons.eco,
      label: 'কীটনাশক',
      subtitle: 'ফসল রক্ষার তথ্য',
      color: Color(0xFFE65100),
      lightColor: Color(0xFFFFF3E0),
    ),
    _CardData(
      icon: Icons.business,
      label: 'কৃষি অফিস',
      subtitle: 'নিকটস্থ অফিসের তথ্য',
      color: Color(0xFF00695C),
      lightColor: Color(0xFFE0F2F1),
    ),
  ];

  void _navigate(BuildContext context, int index) {
    final Widget page;
    switch (index) {
      case 0:
        page = const PriceScreen();
        break;
      case 1:
        page = const WeatherScreen();
        break;
      case 2:
        page = const PesticideScreen();
        break;
      default:
        page = const KrishiOfficeScreen();
    }
    Navigator.push(context, MaterialPageRoute(builder: (_) => page));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F8E9),
      appBar: AppBar(
        title: const Text(
          'কৃষিঅ্যাপ',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      drawer: _buildDrawer(context),
      body: Stack(
        children: [
          // ── Background image, cropped to fill the whole page ────────────
          Positioned.fill(
            child: Image.asset(
              'assets/images/app_bg.jpg',
              fit: BoxFit.cover,
              alignment: Alignment.topCenter,
            ),
          ),
          // ── Soft scrim so cards/text stay readable over the photo ───────
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    const Color(0xFFF1F8E9).withValues(alpha: 0.93),
                    const Color(0xFFF1F8E9).withValues(alpha: 0.35),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: const [0.0, 0.55, 0.85],
                ),
              ),
            ),
          ),
          _buildForeground(context),
        ],
      ),
    );
  }

  Widget _buildForeground(BuildContext context) {
    return Column(
        children: [
          // Header banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF2E7D32).withValues(alpha: 0.55),
                  const Color(0xFF66BB6A).withValues(alpha: 0.45),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(28),
                bottomRight: Radius.circular(28),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.grass,
                          color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 14),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'বাংলাদেশ কৃষি তথ্য সেবা',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              shadows: [
                                Shadow(color: Colors.black45, blurRadius: 6),
                              ]),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'কৃষকের বিশ্বস্ত সঙ্গী',
                          style: TextStyle(
                              color: Colors.white70,
                              fontSize: 13,
                              shadows: [
                                Shadow(color: Colors.black45, blurRadius: 6),
                              ]),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          // Chat card — the app's main feature, above the 4 cards.
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: _ChatCard(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ChatScreen()),
                );
              },
            ),
          ),
          // Section label
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 12, 20, 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'কী জানতে চান?',
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1B5E20)),
              ),
            ),
          ),
          // 2×2 grid of cards
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 14,
                  childAspectRatio: 1.05,
                ),
                itemCount: _cards.length,
                itemBuilder: (context, i) => _NavCard(
                  data: _cards[i],
                  onTap: () => _navigate(context, i),
                ),
              ),
            ),
          ),
        ],
    );
  }

  Drawer _buildDrawer(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          // Drawer header — background photo cropped landscape (16:9-ish)
          SizedBox(
            height: 190,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(
                  'assets/images/app_bg.jpg',
                  fit: BoxFit.cover,
                  alignment: Alignment.center,
                ),
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF1B5E20).withValues(alpha: 0.75),
                        const Color(0xFF1B5E20).withValues(alpha: 0.15),
                      ],
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                    ),
                  ),
                ),
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 16,
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.22),
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: Colors.white54, width: 1.4),
                        ),
                        child: const Icon(Icons.grass,
                            color: Colors.white, size: 28),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'কৃষিঅ্যাপ',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 21,
                              fontWeight: FontWeight.bold,
                              shadows: [
                                Shadow(color: Colors.black87, blurRadius: 6),
                              ],
                            ),
                          ),
                          Text(
                            'বাংলাদেশ কৃষি তথ্য সেবা',
                            style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.9),
                                fontSize: 12),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                ..._cards.asMap().entries.map(
                      (e) => ListTile(
                        leading: Icon(e.value.icon, color: e.value.color),
                        title: Text(e.value.label),
                        subtitle: Text(e.value.subtitle,
                            style: const TextStyle(fontSize: 11)),
                        onTap: () {
                          Navigator.pop(context);
                          _navigate(context, e.key);
                        },
                      ),
                    ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.info_outline, color: Colors.grey),
                  title: const Text('সম্পর্কে'),
                  onTap: () {
                    Navigator.pop(context);
                    showAboutDialog(
                      context: context,
                      applicationName: 'কৃষিঅ্যাপ',
                      applicationVersion: '১.০.০',
                      applicationIcon: const Icon(Icons.grass,
                          color: Colors.green, size: 36),
                      children: const [
                        Text(
                          'এই অ্যাপটি বাংলাদেশের কৃষকদের জন্য তৈরি। '
                          'এখানে সবজির বাজার দর, আবহাওয়া, কীটনাশক '
                          'ও কৃষি অফিসের তথ্য পাওয়া যাবে।',
                        ),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Chat card (main feature) ─────────────────────────────────────────────────

class _ChatCard extends StatelessWidget {
  final VoidCallback onTap;
  const _ChatCard({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'chatHero',
      flightShuttleBuilder: chatHeroFlightShuttle,
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(22),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(22),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2E7D32).withValues(alpha: 0.35),
                  blurRadius: 14,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: Colors.white24,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.chat_bubble_rounded,
                      color: Colors.white, size: 26),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'কৃষি চ্যাট',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 17,
                            fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'লিখে বা বলে জিজ্ঞাসা করুন — দাম, আবহাওয়া ও আরও অনেক কিছু',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.mic, color: Color(0xFF2E7D32), size: 22),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Card widget ──────────────────────────────────────────────────────────────

class _NavCard extends StatelessWidget {
  final _CardData data;
  final VoidCallback onTap;
  const _NavCard({required this.data, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.90),
      borderRadius: BorderRadius.circular(22),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: data.color.withValues(alpha: 0.28),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: data.color.withValues(alpha: 0.22),
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [data.color, data.color.withValues(alpha: 0.7)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: data.color.withValues(alpha: 0.4),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Icon(data.icon, color: Colors.white, size: 30),
              ),
              const SizedBox(height: 12),
              Text(
                data.label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: data.color,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                data.subtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 11, color: Colors.grey.shade600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CardData {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final Color lightColor;
  const _CardData({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.lightColor,
  });
}
