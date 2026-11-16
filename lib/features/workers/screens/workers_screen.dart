import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/routing/route_names.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/models/worker_model.dart';
import '../../../shared/widgets/status_badge.dart';

class WorkersScreen extends StatelessWidget {
  const WorkersScreen({super.key});

  void _showAddWorkerDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final roleCtrl = TextEditingController(text: 'Operator');
    final phoneCtrl = TextEditingController(text: '+91 98765 ');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add Worker'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Worker Name')),
            const SizedBox(height: 10),
            TextField(controller: roleCtrl, decoration: const InputDecoration(labelText: 'Role')),
            const SizedBox(height: 10),
            TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Phone')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                final provider = context.read<AppStateProvider>();
                provider.addWorker(WorkerModel(
                  id: 'worker-${DateTime.now().millisecondsSinceEpoch}',
                  name: nameCtrl.text,
                  employeeId: 'EMP0${provider.workers.length + 1}',
                  phone: phoneCtrl.text,
                  role: roleCtrl.text,
                  siteId: provider.sites.first.id,
                  siteName: provider.sites.first.name,
                  status: 'Working',
                  toolsAssignedCount: 0,
                  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
                ));
                Navigator.pop(ctx);
              }
            },
            child: const Text('Save Worker'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final workers = provider.workers;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Worker Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add),
            onPressed: () => _showAddWorkerDialog(context),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: workers.length,
        itemBuilder: (ctx, index) {
          final w = workers[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundImage: NetworkImage(w.avatarUrl),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(w.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            StatusBadge(label: w.status),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text('${w.employeeId} • ${w.role}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                        Text('${w.siteName} • ${w.toolsAssignedCount} tools assigned', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.phone_android, color: AppColors.primary, size: 20),
                    tooltip: 'Simulate mobile check-in as this worker',
                    onPressed: () {
                      provider.switchUser(w.id);
                      Navigator.pushNamed(context, RouteNames.workerCheckIn);
                    },
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
