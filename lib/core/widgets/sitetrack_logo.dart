import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// The official SiteTrack Logo matching Page 6 of the project PDF specification.
/// Features the 3-pillar geometric chevron/shield brand mark, bold "SiteTrack" wordmark,
/// and the tagline "TOOLS. PEOPLE. PROGRESS."
class SiteTrackLogo extends StatelessWidget {
  final double size;
  final bool isDark;
  final bool showTagline;

  const SiteTrackLogo({
    super.key,
    this.size = 36,
    this.isDark = false,
    this.showTagline = true,
  });

  @override
  Widget build(BuildContext context) {
    final titleColor = isDark ? Colors.white : AppColors.textPrimary;
    final taglineColor = isDark ? AppColors.primaryLight : AppColors.primary;

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // 3-Pillar Geometric Brand Mark
        CustomPaint(
          size: Size(size * 0.95, size),
          painter: _SiteTrackIconPainter(),
        ),
        SizedBox(width: size * 0.28),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Sitetrack',
              style: TextStyle(
                color: titleColor,
                fontSize: size * 0.58,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
                height: 1.0,
              ),
            ),
            if (showTagline) ...[
              SizedBox(height: size * 0.08),
              Text(
                'TOOLS. PEOPLE. PROGRESS.',
                style: TextStyle(
                  color: taglineColor,
                  fontSize: size * 0.22,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.1,
                  height: 1.0,
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }
}

class _SiteTrackIconPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFF38BDF8), Color(0xFF2563EB)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.fill;

    final w = size.width;
    final h = size.height;

    // Bar dimensions
    final barW = w * 0.26;
    final gap = w * 0.09;
    final r = barW * 0.35;

    // Left Pillar (tapers slightly on inner bottom)
    final leftRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, h * 0.08, barW, h * 0.68),
      Radius.circular(r),
    );
    canvas.drawRRect(leftRect, paint);

    // Center Pillar (tallest, descends furthest forming V/shield apex)
    final centerRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(barW + gap, 0, barW, h),
      Radius.circular(r),
    );
    canvas.drawRRect(centerRect, paint);

    // Right Pillar (tapers slightly on inner bottom)
    final rightRect = RRect.fromRectAndRadius(
      Rect.fromLTWH((barW + gap) * 2, h * 0.08, barW, h * 0.68),
      Radius.circular(r),
    );
    canvas.drawRRect(rightRect, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
