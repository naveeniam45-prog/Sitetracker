import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/constants.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.location_on, color: AppColors.primary),
                  title: Text('Geofence Verification Radius'),
                  subtitle: Text('Default 500 meters perimeter for check-in'),
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.camera_alt, color: AppColors.primary),
                  title: Text('Live Photo Requirement'),
                  subtitle: Text('Enforced for all mobile check-ins/outs'),
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.info_outline, color: AppColors.textSecondary),
                  title: Text('Platform Version'),
                  subtitle: Text('${AppConstants.appName} v1.0.0 (Heapvue)'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
