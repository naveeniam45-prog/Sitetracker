import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/models/attendance_model.dart';
import '../../../shared/widgets/status_badge.dart';

class AdminAttendanceScreen extends StatelessWidget {
  const AdminAttendanceScreen({super.key});

  void _showPhotoDialog(BuildContext context, AttendanceModel record) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('${record.workerName} (${record.employeeId})'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (record.checkInPhoto != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  record.checkInPhoto!,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            const SizedBox(height: 12),
            Text('Site: ${record.siteName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            Text('Check-In Time: ${record.checkInTime ?? "—"}', style: const TextStyle(fontSize: 12)),
            Text('Check-Out Time: ${record.checkOutTime ?? "In Progress"}', style: const TextStyle(fontSize: 12)),
            Text('Working Hours: ${record.workingHours ?? "—"}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary)),
            const SizedBox(height: 6),
            const Row(
              children: [
                Icon(Icons.verified_user, color: AppColors.success, size: 16),
                SizedBox(width: 4),
                Text('GPS Coordinates Verified', style: TextStyle(color: AppColors.success, fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
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
    final records = provider.attendanceRecords;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Register'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: records.length,
        itemBuilder: (ctx, index) {
          final r = records[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundImage: NetworkImage(r.workerAvatar),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(r.workerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            StatusBadge(label: r.status),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text('${r.employeeId} • ${r.siteName}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                        Text('In: ${r.checkInTime ?? "—"} • Out: ${r.checkOutTime ?? "—"} • ${r.workingHours ?? "—"}', style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                  if (r.checkInPhoto != null)
                    IconButton(
                      icon: const Icon(Icons.photo_camera, color: AppColors.primary, size: 20),
                      tooltip: 'View live verification photo',
                      onPressed: () => _showPhotoDialog(context, r),
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
