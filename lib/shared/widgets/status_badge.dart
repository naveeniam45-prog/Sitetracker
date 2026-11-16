import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class StatusBadge extends StatelessWidget {
  final String label;
  final Color? color;

  const StatusBadge({
    super.key,
    required this.label,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color text;
    Color border;

    switch (label.toLowerCase()) {
      case 'active':
      case 'assigned':
      case 'present':
      case 'good':
        bg = AppColors.successBg;
        text = AppColors.success;
        border = AppColors.successBorder;
        break;
      case 'working':
      case 'available':
        bg = AppColors.infoBg;
        text = AppColors.info;
        border = const Color(0xFFA5F3FC);
        break;
      case 'maintenance':
      case 'pending':
      case 'requires service':
        bg = AppColors.warningBg;
        text = AppColors.warning;
        border = AppColors.warningBorder;
        break;
      case 'absent':
      case 'inactive':
      case 'lost':
      case 'declined':
        bg = AppColors.dangerBg;
        text = AppColors.danger;
        border = AppColors.dangerBorder;
        break;
      default:
        bg = const Color(0xFFF1F5F9);
        text = const Color(0xFF475569);
        border = const Color(0xFFCBD5E1);
    }

    if (color != null) {
      text = color!;
      bg = color!.withValues(alpha: 0.12);
      border = color!.withValues(alpha: 0.3);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: border),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: text,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
