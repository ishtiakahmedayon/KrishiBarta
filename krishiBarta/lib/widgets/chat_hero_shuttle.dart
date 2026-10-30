import 'package:flutter/material.dart';

/// Used as the `flightShuttleBuilder` for every Hero with tag 'chatHero'
/// (home card, tab-screen FAB, chat screen header). Rendering the real
/// Row/Text content mid-flight causes RenderFlex overflow because Hero
/// interpolates through intermediate sizes that are too small/large for
/// that content. A plain gradient box has no children to overflow, so it
/// morphs cleanly; the real content just fades in once the flight ends.
Widget chatHeroFlightShuttle(
  BuildContext flightContext,
  Animation<double> animation,
  HeroFlightDirection flightDirection,
  BuildContext fromHeroContext,
  BuildContext toHeroContext,
) {
  final borderRadiusTween = BorderRadiusTween(
    begin: BorderRadius.circular(22),
    end: BorderRadius.circular(22),
  );
  return AnimatedBuilder(
    animation: animation,
    builder: (context, child) {
      return Material(
        color: Colors.transparent,
        child: Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: borderRadiusTween.evaluate(animation),
          ),
        ),
      );
    },
  );
}
