import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/widgets/status_badge.dart';

class ToolDetailScreen extends StatelessWidget {
  const ToolDetailScreen({super.key});

  void _showMoveToolDialog(BuildContext context, String toolId) {
    final provider = context.read<AppStateProvider>();
    String targetSiteId = provider.sites.first.id;
    String? targetWorkerId;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setState) => AlertDialog(
          title: const Text('Move Tool / Initiate Handover'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Destination Site:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              DropdownButton<String>(
                isExpanded: true,
                value: targetSiteId,
                items: provider.sites.map((s) => DropdownMenuItem(value: s.id, child: Text(s.name))).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => targetSiteId = val);
                },
              ),
              const SizedBox(height: 12),
              const Text('Assign to Worker:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              DropdownButton<String?>(
                isExpanded: true,
                value: targetWorkerId,
                hint: const Text('Available Pool (No worker)'),
                items: [
                  const DropdownMenuItem<String?>(value: null, child: Text('Available Pool (No worker)')),
                  ...provider.workers.map((w) => DropdownMenuItem<String?>(value: w.id, child: Text('${w.name} (${w.role})'))),
                ],
                onChanged: (val) {
                  setState(() => targetWorkerId = val);
                },
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                provider.moveTool(
                  toolId: toolId,
                  toSiteId: targetSiteId,
                  toWorkerId: targetWorkerId,
                );
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Tool relocated successfully! Handover initiated.')),
                );
              },
              child: const Text('Confirm Move'),
            ),
          ],
        ),
      ),
    );
  }

  void _showQRDialog(BuildContext context, String toolId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Asset Tag: $toolId'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border, width: 2),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Center(
                child: Icon(Icons.qr_code_2, size: 120, color: AppColors.navy900),
              ),
            ),
            const SizedBox(height: 12),
            Text('Scan to view details or verify tool handover.', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final tool = provider.tools.firstWhere(
      (t) => t.id == provider.selectedToolId || t.toolId == provider.selectedToolId,
      orElse: () => provider.tools.first,
    );

    return Scaffold(
      appBar: AppBar(
        title: Text('${tool.toolId} - ${tool.name}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code),
            onPressed: () => _showQRDialog(context, tool.toolId),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Tool Image & Badge
            Center(
              child: Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  image: DecorationImage(
                    image: NetworkImage(tool.imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(tool.toolId, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                    Text('${tool.name} (${tool.variant})', style: const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                  ],
                ),
                StatusBadge(label: tool.status),
              ],
            ),

            const SizedBox(height: 16),

            // Action Buttons (Move Tool / Maintenance)
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showMoveToolDialog(context, tool.id),
                    icon: const Icon(Icons.swap_horiz, size: 16),
                    label: const Text('Move Tool'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      provider.setToolMaintenance(tool.id);
                    },
                    icon: const Icon(Icons.build, size: 16, color: AppColors.warning),
                    label: const Text('Maintenance'),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Information Cards
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Assignment Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 8),
                    Text('Current Site: ${tool.siteName}', style: const TextStyle(fontSize: 13)),
                    Text('Assigned To: ${tool.assignedWorkerName ?? "Available Pool"}', style: const TextStyle(fontSize: 13)),
                    Text('Serial Number: ${tool.serialNumber}', style: const TextStyle(fontSize: 13)),
                    Text('Condition: ${tool.condition}', style: const TextStyle(fontSize: 13, color: AppColors.success, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Movement History
            const Text('Movement History', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 8),
            ...tool.movementHistory.map((m) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                title: Text('${m.fromSite} ➔ ${m.toSite}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: Text('${m.date} • Assigned to ${m.assignedToName}\n${m.notes}', style: const TextStyle(fontSize: 11)),
                isThreeLine: true,
              ),
            )),
          ],
        ),
      ),
    );
  }
}
