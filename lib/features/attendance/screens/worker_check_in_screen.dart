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
  int _currentBottomNavIndex = 0; // 0: Home, 1: Profile

  @override
  void initState() {
    super.initState();
    final provider = context.read<AppStateProvider>();
    _selectedSiteId = provider.currentUser?.siteId ?? provider.sites.first.id;

    // Real-time ticking clock for live button timestamps
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _showChangeSiteDialog(bool isDarkMode) {
    final provider = context.read<AppStateProvider>();
    showModalBottomSheet(
      context: context,
      backgroundColor: isDarkMode ? const Color(0xFF1E293B) : Colors.white,
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
                  Text(
                    'Select Work Site',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: isDarkMode ? Colors.white : const Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close, color: isDarkMode ? Colors.white60 : const Color(0xFF64748B)),
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
                      color: isSelected
                          ? AppColors.primary.withValues(alpha: 0.2)
                          : (isDarkMode ? Colors.white.withValues(alpha: 0.06) : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.location_on,
                      color: isSelected ? AppColors.primaryLight : (isDarkMode ? Colors.white60 : const Color(0xFF64748B)),
                      size: 20,
                    ),
                  ),
                  title: Text(
                    site.name,
                    style: TextStyle(
                      color: isDarkMode ? Colors.white : const Color(0xFF0F172A),
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                    ),
                  ),
                  subtitle: Text(
                    site.location,
                    style: TextStyle(
                      color: isDarkMode ? Colors.white54 : const Color(0xFF64748B),
                      fontSize: 12,
                    ),
                  ),
                  trailing: isSelected
                      ? const Icon(Icons.check_circle, color: AppColors.primaryLight)
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
    required bool isDarkMode,
  }) {
    final cardBg = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final border = isDarkMode ? Colors.white.withValues(alpha: 0.08) : const Color(0xFFE2E8F0);
    final textValColor = isDarkMode ? Colors.white : const Color(0xFF0F172A);
    final textLblColor = isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
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
                  style: TextStyle(
                    color: textLblColor,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    color: textValColor,
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

  // HOME TAB (Worker Attendance & Real-Time Tracking inside a Defined Box)
  Widget _buildHomeView({
    required AppStateProvider provider,
    required dynamic user,
    required String workerId,
    required String workerName,
    required String workerRole,
    required dynamic site,
    required dynamic todayAttendance,
    required bool isCheckedIn,
    required bool isCheckedOut,
    required String currentTimeStr,
    required bool isMobile,
    required bool isDarkMode,
  }) {
    final cardBg = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final cardBorder = isDarkMode ? Colors.white.withValues(alpha: 0.12) : const Color(0xFFE2E8F0);
    final textTitle = isDarkMode ? Colors.white : const Color(0xFF0F172A);
    final textMuted = isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final innerBg = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final innerBorder = isDarkMode ? Colors.white.withValues(alpha: 0.08) : const Color(0xFFE2E8F0);

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 18,
        vertical: 14,
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Container(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 16 : 20,
              vertical: isMobile ? 18 : 22,
            ),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: cardBorder, width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: isDarkMode
                      ? Colors.black.withValues(alpha: 0.45)
                      : const Color(0x100F172A),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
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
                    style: TextStyle(
                      fontSize: 13,
                      color: textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    workerName,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: textTitle,
                    ),
                  ),
                  Text(
                    workerRole.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryLight,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: innerBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: innerBorder),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.calendar_today_rounded, size: 13, color: AppColors.primaryLight),
                    const SizedBox(width: 6),
                    Text(
                      '14 Sep 2026 Monday',
                      style: TextStyle(
                        color: textTitle,
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
              color: innerBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: innerBorder),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.location_on_rounded, color: AppColors.primaryLight, size: 20),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        site.name,
                        style: TextStyle(
                          color: textTitle,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                      Text(
                        site.location,
                        style: TextStyle(
                          color: textMuted,
                          fontSize: 11,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () => _showChangeSiteDialog(isDarkMode),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 6),
                    minimumSize: Size.zero,
                  ),
                  child: const Row(
                    children: [
                      Text(
                        'Change Site',
                        style: TextStyle(
                          color: AppColors.primaryLight,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Icon(Icons.chevron_right, size: 14, color: AppColors.primaryLight),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // REAL LIVE CAMERA VIEWFINDER (Live video + Live GPS location detection)
          LiveCameraViewfinder(
            locationAddress: site.location,
            siteLat: site.latitude ?? 10.0159,
            siteLng: site.longitude ?? 76.3638,
            fallbackPhotoUrl: user?.avatarUrl ?? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
          ),

          const SizedBox(height: 14),

          // DUAL METRIC CARDS (Check In & Total Hours)
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
                  isDarkMode: isDarkMode,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildMetricCard(
                  icon: Icons.schedule_rounded,
                  iconColor: AppColors.primaryLight,
                  label: 'Total Hours',
                  value: isCheckedIn
                      ? (todayAttendance.workingHours ?? '9h 50m')
                      : '9h 50m',
                  isDarkMode: isDarkMode,
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // SINGLE UNIFIED SEQUENTIAL WORKFLOW: Check In -> Next is Check Out only
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
                  backgroundColor: const Color(0xFF16A34A),
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
            Center(
              child: Text(
                'Live worksite photograph and GPS will be verified automatically',
                style: TextStyle(color: textMuted, fontSize: 11),
                textAlign: TextAlign.center,
              ),
            ),
          ] else if (isCheckedIn) ...[
            // STATE 2: CHECK OUT ONLY (Directly follows Check In)
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
                  backgroundColor: const Color(0xFFDC2626),
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
            Center(
              child: Text(
                'Captures shift end photo & logs working hours to attendance records',
                style: TextStyle(color: textMuted, fontSize: 11),
                textAlign: TextAlign.center,
              ),
            ),
          ] else ...[
            // STATE 3: SHIFT COMPLETED TODAY
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: innerBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: innerBorder),
              ),
              child: Column(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF16A34A).withValues(alpha: 0.18),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.verified_rounded, color: Color(0xFF16A34A), size: 26),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Shift Completed Today',
                    style: TextStyle(
                      color: textTitle,
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Check-In: ${todayAttendance.checkInTime} • Check-Out: ${todayAttendance.checkOutTime}',
                    style: TextStyle(color: textMuted, fontSize: 12),
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
                      foregroundColor: AppColors.primaryLight,
                      side: const BorderSide(color: AppColors.primaryLight),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    ),
                    label: const Text('Start Next Shift'), // REMOVED "Demo Again" as requested
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 6),
        ],
      ),
    ),
  ),
),
);
  }

  // PROFILE TAB (With Just Name, Details, and Clean Log Out Button INSIDE THE BOX)
  Widget _buildProfileView({
    required AppStateProvider provider,
    required dynamic user,
    required String workerName,
    required String workerRole,
    required dynamic site,
    required bool isMobile,
    required bool isDarkMode,
  }) {
    final cardBg = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final cardBorder = isDarkMode ? Colors.white.withValues(alpha: 0.12) : const Color(0xFFE2E8F0);
    final textTitle = isDarkMode ? Colors.white : const Color(0xFF0F172A);
    final textMuted = isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final innerBg = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final innerBorder = isDarkMode ? Colors.white.withValues(alpha: 0.08) : const Color(0xFFE2E8F0);

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 12 : 18,
        vertical: 14,
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 18 : 24,
              vertical: isMobile ? 22 : 28,
            ),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: cardBorder, width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: isDarkMode
                      ? Colors.black.withValues(alpha: 0.45)
                      : const Color(0x100F172A),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                // Profile Header Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Worker Profile',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textTitle,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF16A34A).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'VERIFIED',
                        style: TextStyle(
                          color: Color(0xFF16A34A),
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Worker Avatar
                Container(
                  width: 86,
                  height: 86,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.primaryLight, width: 3),
                  ),
                  child: ClipOval(
                    child: Image.network(
                      user?.avatarUrl ?? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
                      fit: BoxFit.cover,
                      errorBuilder: (ctx, err, stack) => Icon(
                        Icons.person,
                        size: 48,
                        color: textMuted,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Name
                Text(
                  workerName,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: textTitle,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 4),

                // Role & ID
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${workerRole.toUpperCase()} • ${user?.employeeId ?? "EMP001"}',
                    style: const TextStyle(
                      color: AppColors.primaryLight,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),

                const SizedBox(height: 20),
                Divider(color: isDarkMode ? Colors.white10 : const Color(0xFFF1F5F9), height: 1),
                const SizedBox(height: 16),

                // Work Site Info Row
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: innerBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: innerBorder),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isDarkMode ? Colors.white.withValues(alpha: 0.08) : Colors.white,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(Icons.location_on_outlined, size: 18, color: AppColors.primaryLight),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Assigned Work Site',
                              style: TextStyle(color: textMuted, fontSize: 11, fontWeight: FontWeight.w500),
                            ),
                            Text(
                              site.name,
                              style: TextStyle(color: textTitle, fontSize: 13, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Clean Log Out Button INSIDE THE BOX (Never mixes with background)
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.logout_rounded, size: 18),
                    onPressed: () {
                      provider.logout();
                      Navigator.pushReplacementNamed(context, RouteNames.login);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isDarkMode ? const Color(0xFF450A0A) : const Color(0xFFFEF2F2),
                      foregroundColor: const Color(0xFFDC2626),
                      elevation: 0,
                      side: BorderSide(color: isDarkMode ? const Color(0xFF7F1D1D) : const Color(0xFFFECACA)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    label: const Text(
                      'Log Out',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
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

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppStateProvider>();
    final isDarkMode = provider.isDarkMode;
    final user = provider.currentUser;
    final workerId = user?.id ?? 'worker-1';
    final workerName = user?.name ?? 'Raj Kumar';
    final workerRole = user?.role ?? 'Operator';

    final site = provider.sites.firstWhere(
      (s) => s.id == _selectedSiteId,
      orElse: () => provider.sites.first,
    );

    final todayAttendance = provider.getTodayAttendance(workerId);
    final isCheckedIn = todayAttendance != null && 
        todayAttendance.checkInTime != null && 
        todayAttendance.checkOutTime == null;
    final isCheckedOut = todayAttendance != null && todayAttendance.checkOutTime != null;

    final currentTimeStr = DateFormat('hh:mm a').format(DateTime.now());
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isMobile = screenWidth < 500;

    // Themed Colors
    final bgColor = isDarkMode ? const Color(0xFF0A0F1D) : const Color(0xFFF8FAFC);
    final headerColor = isDarkMode ? const Color(0xFF0F172A) : Colors.white;
    final headerBorder = isDarkMode ? Colors.white.withValues(alpha: 0.1) : const Color(0xFFE2E8F0);
    final navBarColor = isDarkMode ? const Color(0xFF0F172A) : Colors.white;
    final navBorder = isDarkMode ? Colors.white.withValues(alpha: 0.1) : const Color(0xFFE2E8F0);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          color: bgColor,
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                children: [
                  // Top App Header: SiteTrack Logo + Theme Toggle + LIVE pill
                  Container(
                    color: headerColor,
                    padding: EdgeInsets.symmetric(
                      horizontal: isMobile ? 16 : 20,
                      vertical: 12,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // SiteTrack Official 3-Pillar Logo from PDF Page 6 (No tagline, clean)
                        SiteTrackLogo(
                          size: isMobile ? 30 : 34,
                          isDark: isDarkMode,
                          showTagline: false,
                        ),

                        // Right Controls: Dark/Light Mode Toggle + LIVE pill
                        Row(
                          children: [
                            // Dark & Light Mode Toggle Effect
                            Container(
                              padding: const EdgeInsets.all(3),
                              decoration: BoxDecoration(
                                color: isDarkMode
                                    ? Colors.white.withValues(alpha: 0.08)
                                    : Colors.black.withValues(alpha: 0.06),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isDarkMode
                                      ? Colors.white.withValues(alpha: 0.12)
                                      : Colors.black.withValues(alpha: 0.08),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  InkWell(
                                    onTap: () => provider.setDarkMode(false),
                                    borderRadius: BorderRadius.circular(16),
                                    child: AnimatedContainer(
                                      duration: const Duration(milliseconds: 180),
                                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: !isDarkMode ? Colors.white : Colors.transparent,
                                        borderRadius: BorderRadius.circular(16),
                                        boxShadow: !isDarkMode
                                            ? [
                                                BoxShadow(
                                                  color: Colors.black.withValues(alpha: 0.1),
                                                  blurRadius: 3,
                                                  offset: const Offset(0, 1),
                                                )
                                              ]
                                            : null,
                                      ),
                                      child: Icon(
                                        Icons.light_mode_rounded,
                                        size: 13,
                                        color: !isDarkMode ? AppColors.primary : Colors.white60,
                                      ),
                                    ),
                                  ),
                                  InkWell(
                                    onTap: () => provider.setDarkMode(true),
                                    borderRadius: BorderRadius.circular(16),
                                    child: AnimatedContainer(
                                      duration: const Duration(milliseconds: 180),
                                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: isDarkMode ? AppColors.primary : Colors.transparent,
                                        borderRadius: BorderRadius.circular(16),
                                        boxShadow: isDarkMode
                                            ? [
                                                BoxShadow(
                                                  color: AppColors.primary.withValues(alpha: 0.4),
                                                  blurRadius: 4,
                                                  offset: const Offset(0, 1),
                                                )
                                              ]
                                            : null,
                                      ),
                                      child: Icon(
                                        Icons.dark_mode_rounded,
                                        size: 13,
                                        color: isDarkMode ? Colors.white : Colors.black54,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(width: 8),

                            // Online / Live indicator pill
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF16A34A).withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: const Color(0xFF16A34A).withValues(alpha: 0.3)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFF16A34A),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  const Text(
                                    'LIVE',
                                    style: TextStyle(
                                      color: Color(0xFF16A34A),
                                      fontSize: 9,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  Divider(color: headerBorder, height: 1),

                  // Main Content: Home (Tab 0) OR Profile with Log Out (Tab 1)
                  Expanded(
                    child: _currentBottomNavIndex == 0
                        ? _buildHomeView(
                            provider: provider,
                            user: user,
                            workerId: workerId,
                            workerName: workerName,
                            workerRole: workerRole,
                            site: site,
                            todayAttendance: todayAttendance,
                            isCheckedIn: isCheckedIn,
                            isCheckedOut: isCheckedOut,
                            currentTimeStr: currentTimeStr,
                            isMobile: isMobile,
                            isDarkMode: isDarkMode,
                          )
                        : _buildProfileView(
                            provider: provider,
                            user: user,
                            workerName: workerName,
                            workerRole: workerRole,
                            site: site,
                            isMobile: isMobile,
                            isDarkMode: isDarkMode,
                          ),
                  ),

                  // Modern Native Bottom Navigation Bar: Home & Profile
                  Container(
                    decoration: BoxDecoration(
                      color: navBarColor,
                      border: Border(
                        top: BorderSide(color: navBorder, width: 1),
                      ),
                    ),
                    child: BottomNavigationBar(
                      currentIndex: _currentBottomNavIndex,
                      onTap: (index) {
                        setState(() {
                          _currentBottomNavIndex = index;
                        });
                      },
                      backgroundColor: navBarColor,
                      elevation: 0,
                      selectedItemColor: AppColors.primaryLight,
                      unselectedItemColor: isDarkMode ? Colors.white54 : const Color(0xFF64748B),
                      selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                      unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
                      type: BottomNavigationBarType.fixed,
                      items: const [
                        BottomNavigationBarItem(
                          icon: Icon(Icons.home_outlined),
                          activeIcon: Icon(Icons.home_rounded),
                          label: 'Home',
                        ),
                        BottomNavigationBarItem(
                          icon: Icon(Icons.person_outline_rounded),
                          activeIcon: Icon(Icons.person_rounded),
                          label: 'Profile',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
