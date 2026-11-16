import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/widgets/status_badge.dart';

class HandoversScreen extends StatelessWidget {
  const HandoversScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final handovers = provider.handoverRequests;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tool Handovers & Acceptance'),
      ),
      body: handovers.isEmpty
          ? const Center(child: Text('No handover requests recorded.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: handovers.length,
              itemBuilder: (ctx, index) {
                final h = handovers[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    title: Text('${h.toolName} (${h.toolId})', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('From: ${h.fromWorkerName} ➔ To: ${h.toWorkerName}\nSite: ${h.siteName} • ${h.requestDate}'),
                    trailing: StatusBadge(label: h.status),
                    isThreeLine: true,
                  ),
                );
              },
            ),
    );
  }
}
