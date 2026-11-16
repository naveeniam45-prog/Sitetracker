import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/routing/route_names.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/widgets/status_badge.dart';

class ToolsScreen extends StatelessWidget {
  const ToolsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final tools = provider.tools;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Power Tools Inventory'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: tools.length,
        itemBuilder: (ctx, index) {
          final t = tools[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () {
                provider.setSelectedToolId(t.id);
                Navigator.pushNamed(context, RouteNames.toolDetail);
              },
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        t.imageUrl,
                        width: 60,
                        height: 60,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(t.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              StatusBadge(label: t.status),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text('${t.toolId} • ${t.variant} • ${t.category}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                          Text('Site: ${t.siteName}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                          if (t.assignedWorkerName != null)
                            Text('Assigned to: ${t.assignedWorkerName}', style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: AppColors.textMuted),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
