import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/providers/app_state_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AppStateProvider>().currentUser;

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              CircleAvatar(
                radius: 40,
                backgroundImage: NetworkImage(user?.avatarUrl ?? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'),
              ),
              const SizedBox(height: 16),
              Text(user?.name ?? 'Raj Kumar', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              Text('${user?.employeeId ?? "EMP001"} • ${user?.role.toUpperCase() ?? "OPERATOR"}', style: const TextStyle(color: AppColors.textSecondary)),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      ListTile(
                        leading: const Icon(Icons.apartment),
                        title: const Text('Assigned Site'),
                        subtitle: Text(user?.siteName ?? 'Kochi Project'),
                      ),
                      ListTile(
                        leading: const Icon(Icons.phone),
                        title: const Text('Phone Number'),
                        subtitle: Text(user?.phone ?? '+91 98765 43210'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
