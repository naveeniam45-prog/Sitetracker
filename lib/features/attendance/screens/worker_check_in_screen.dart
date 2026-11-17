import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/routing/route_names.dart';
import '../../../core/widgets/sitetrack_logo.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../widgets/live_camera_viewfinder.dart';

class WorkerCheckInScreen extends StatefulWidget {
  const WorkerCheckInScreen({super.key});

  @override
  State<WorkerCheckInScreen> createState() => _WorkerCheckInScreenState();
}

class _WorkerCheckInScreenState extends State<WorkerCheckInScreen> {
  late String _selectedSiteId;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    final provider = context.read<AppStateProvider>();
    _selectedSiteId = provider.currentUser?.siteId ?? provider.sites.first.id;

    // Real-time ticking clock every second for live button timestamps
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _showChangeSiteDialog() {
    final provider = context.read<AppStateProvider>();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Select Work Site',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...provider.sites.map((site) {
                final isSelected = site.id == _selectedSiteId;
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primaryBg : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.location_on,
                      color: isSelected ? AppColors.primary : const Color(0xFF64748B),
                      size: 20,
                    ),
                  ),
                  title: Text(
                    site.name,
                    style: TextStyle(
                      color: const Color(0xFF0F172A),
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                    ),
                  ),
                  subtitle: Text(
                    site.location,
                    style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                  ),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle, color: AppColors.primary)
                      : null,
                  onTap: () {
                    setState(() {
                      _selectedSiteId = site.id;
                    });
                    Navigator.pop(ctx);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x080F172A),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    color: Color(0xFF0F172A),
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final user = provider.currentUser;
    final workerId = user?.id ?? 'worker-1';
    final workerName = user?.name ?? 'Raj Kumar';
    final workerRole = user?.role ?? 'Operator';

    final site = provider.sites.firstWhere(
      (s) => s.id == _selectedSiteId,
      orElse: () => provider.sites.first,
    );

    // Natural Check-In / Check-Out single sequential flow
    final todayAttendance = provider.getTodayAttendance(workerId);
    final isCheckedIn = todayAttendance != null && 
        todayAttendance.checkInTime != null && 
        todayAttendance.checkOutTime == null;
    final isCheckedOut = todayAttendance != null && todayAttendance.checkOutTime != null;

    final currentTimeStr = DateFormat('hh:mm a').format(DateTime.now());
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isMobile = screenWidth < 500;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // Modern Light Slate App Background (matching PDF Page 6)
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: Column(
              children: [
                // Top App Header: PDF Logo + Sign Out Button
                Container(
                  color: Colors.white,
                  padding: EdgeInsets.symmetric(
                    horizontal: isMobile ? 16 : 20,
                    vertical: 12,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // SiteTrack Logo with 3 pillars matching PDF Page 6
                      SiteTrackLogo(
                        size: isMobile ? 32 : 36,
                        isDark: false,
                        showTagline: true,
                      ),

                      // Sign Out button
                      IconButton(
                        tooltip: 'Sign Out',
                        icon: const Icon(Icons.logout_rounded, color: Color(0xFF64748B), size: 22),
                        onPressed: () {
                          provider.logout();
                          Navigator.pushReplacementNamed(context, RouteNames.login);
                        },
                      ),
                    ],
                  ),
                ),

                const Divider(color: Color(0xFFE2E8F0), height: 1),

                // Main Attendance Area
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: EdgeInsets.symmetric(
                      horizontal: isMobile ? 16 : 20,
                      vertical: 14,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Greeting & Date Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  isCheckedIn ? 'Good Evening,' : 'Good Morning,',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Text(
                                  workerName,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                Text(
                                  workerRole.toUpperCase(),
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.primary,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Color(0x050F172A),
                                    blurRadius: 4,
                                    offset: Offset(0, 1),
                                  ),
                                ],
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.calendar_today_rounded, size: 13, color: AppColors.primary),
                                  SizedBox(width: 6),
                                  Text(
                                    '14 Sep 2026 Monday',
                                    style: TextStyle(
                                      color: Color(0xFF0F172A),
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 14),

                        // Selected Worksite Card
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x060F172A),
                                blurRadius: 8,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.primaryBg,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.location_on_rounded, color: AppColors.primary, size: 20),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      site.name,
                                      style: const TextStyle(
                                        color: Color(0xFF0F172A),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                      ),
                                    ),
                                    Text(
                                      site.location,
                                      style: const TextStyle(
                                        color: Color(0xFF64748B),
                                        fontSize: 11,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                              TextButton(
                                onPressed: _showChangeSiteDialog,
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 6),
                                  minimumSize: Size.zero,
                                ),
                                child: const Row(
                                  children: [
                                    Text(
                                      'Change Site',
                                      style: TextStyle(
                                        color: AppColors.primary,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    Icon(Icons.chevron_right, size: 14, color: AppColors.primary),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 14),

                        // REAL LIVE CAMERA VIEWFINDER (With device camera access, location detected HUD)
                        LiveCameraViewfinder(
                          locationAddress: site.location,
                          fallbackPhotoUrl: user?.avatarUrl ?? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
                        ),

                        const SizedBox(height: 14),

                        // DUAL METRIC CARDS (Exact match for both Check In & Check Out)
                        Row(
                          children: [
                            Expanded(
                              child: _buildMetricCard(
                                icon: isCheckedIn ? Icons.check_circle_rounded : Icons.login_rounded,
                                iconColor: AppColors.success,
                                label: 'Check In',
                                value: isCheckedIn
                                    ? (todayAttendance.checkInTime ?? '08:15 AM')
                                    : '08:15 AM',
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildMetricCard(
                                icon: Icons.schedule_rounded,
                                iconColor: AppColors.primary,
                                label: 'Total Hours',
                                value: isCheckedIn
                                    ? (todayAttendance.workingHours ?? '9h 50m')
                                    : '9h 50m',
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 14),

                        // SINGLE UNIFIED WORKFLOW: CHECK IN -> NEXT IS CHECK OUT ONLY
                        if (!isCheckedIn && !isCheckedOut) ...[
                          // STATE 1: CHECK IN
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: () {
                                provider.checkInWorker(
                                  workerId: workerId,
                                  siteId: site.id,
                                );
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('✓ Checked In successfully at ${site.name}'),
                                    backgroundColor: const Color(0xFF16A34A),
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF16A34A), // Vibrant Emerald Green
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                elevation: 4,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: const BoxDecoration(
                                      color: Colors.white24,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.arrow_forward_rounded, size: 20),
                                  ),
                                  Row(
                                    children: [
                                      const Text(
                                        'Check In',
                                        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        currentTimeStr,
                                        style: const TextStyle(fontSize: 13, color: Colors.white70),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 24),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Center(
                            child: Text(
                              'Live worksite photograph and GPS will be verified automatically',
                              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ] else if (isCheckedIn) ...[
                          // STATE 2: CHECK OUT ONLY (Immediately follows Check In)
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: () {
                                provider.checkOutWorker(todayAttendance.id);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('✓ Checked Out successfully. Shift recorded.'),
                                    backgroundColor: Color(0xFFDC2626),
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFDC2626), // Vibrant Red
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                elevation: 4,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: const BoxDecoration(
                                      color: Colors.white24,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.arrow_forward_rounded, size: 20),
                                  ),
                                  Row(
                                    children: [
                                      const Text(
                                        'Check Out',
                                        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        currentTimeStr,
                                        style: const TextStyle(fontSize: 13, color: Colors.white70),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 24),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Center(
                            child: Text(
                              'Captures shift end photo & logs working hours to attendance records',
                              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ] else ...[
                          // STATE 3: SHIFT COMPLETED TODAY
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(22),
                              border: Border.all(color: const Color(0xFF86EFAC)),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x0A0F172A),
                                  blurRadius: 10,
                                  offset: Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFFDCFCE7),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.verified_rounded, color: Color(0xFF16A34A), size: 26),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Shift Completed Today',
                                  style: TextStyle(
                                    color: Color(0xFF0F172A),
                                    fontWeight: FontWeight.w800,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Check-In: ${todayAttendance.checkInTime} • Check-Out: ${todayAttendance.checkOutTime}',
                                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Total Working Hours: ${todayAttendance.workingHours ?? "9h 50m"}',
                                  style: const TextStyle(
                                    color: Color(0xFF16A34A),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                                const SizedBox(height: 14),
                                OutlinedButton.icon(
                                  icon: const Icon(Icons.refresh_rounded, size: 16),
                                  onPressed: () {
                                    provider.resetWorkerAttendance(workerId);
                                  },
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: AppColors.primary,
                                    side: const BorderSide(color: AppColors.primary),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                  ),
                                  label: const Text('Start Next Shift / Demo Again'),
                                ),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
