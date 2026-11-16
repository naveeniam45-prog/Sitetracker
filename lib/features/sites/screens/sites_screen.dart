import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/models/site_model.dart';
import '../../../shared/widgets/status_badge.dart';

class SitesScreen extends StatelessWidget {
  const SitesScreen({super.key});

  void _showAddSiteDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final locationCtrl = TextEditingController();
    final managerCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add New Work Site'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Site Name')),
            const SizedBox(height: 10),
            TextField(controller: locationCtrl, decoration: const InputDecoration(labelText: 'Location')),
            const SizedBox(height: 10),
            TextField(controller: managerCtrl, decoration: const InputDecoration(labelText: 'Site Manager')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                context.read<AppStateProvider>().addSite(SiteModel(
                  id: 'site-${DateTime.now().millisecondsSinceEpoch}',
                  name: nameCtrl.text,
                  location: locationCtrl.text,
                  siteManager: managerCtrl.text,
                  siteManagerInitials: managerCtrl.text.isNotEmpty ? managerCtrl.text[0].toUpperCase() : 'SM',
                  workersPresent: 0,
                  workersTotal: 0,
                  toolsCount: 0,
                  status: 'Active',
                  state: 'Kerala',
                  latitude: 10.0159,
                  longitude: 76.3638,
                  radiusMeters: 500,
                ));
                Navigator.pop(ctx);
              }
            },
            child: const Text('Add Site'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final sites = provider.sites;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sites Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddSiteDialog(context),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: sites.length,
        itemBuilder: (ctx, index) {
          final s = sites[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(s.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      StatusBadge(label: s.status),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(s.location, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Manager: ${s.siteManager}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      Text('${s.workersPresent}/${s.workersTotal} workers', style: const TextStyle(fontSize: 12, color: AppColors.success, fontWeight: FontWeight.bold)),
                      Text('${s.toolsCount} tools', style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
