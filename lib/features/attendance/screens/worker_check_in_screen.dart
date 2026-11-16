import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/routing/route_names.dart';
import '../../../shared/providers/app_state_provider.dart';
import '../../../shared/models/site_model.dart';

class WorkerCheckInScreen extends StatefulWidget {
  const WorkerCheckInScreen({super.key});

  @override
  State<WorkerCheckInScreen> createState() => _WorkerCheckInScreenState();
}

class _WorkerCheckInScreenState extends State<WorkerCheckInScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late String _selectedSiteId;
  bool _cameraFront = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    final provider = context.read<AppStateProvider>();
    _selectedSiteId = provider.currentUser?.siteId ?? provider.sites.first.id;
  }

  void _showChangeSiteDialog() {
    final provider = context.read<AppStateProvider>();
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.navy800,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Select Work Site',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white54),
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
                      color: isSelected ? AppColors.primary : Colors.white10,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.location_on, color: Colors.white, size: 18),
                  ),
                  title: Text(site.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  subtitle: Text(site.location, style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  trailing: isSelected ? const Icon(Icons.check_circle, color: AppColors.primaryLight) : null,
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

    final todayAttendance = provider.getTodayAttendance(workerId);
    final isCheckedIn = todayAttendance != null && 
        todayAttendance.checkInTime != null && 
        todayAttendance.checkOutTime == null;
    final isCheckedOut = todayAttendance != null && todayAttendance.checkOutTime != null;

    final myHandovers = provider.handoverRequests
        .where((h) => h.toWorkerId == workerId && h.status == 'Pending')
        .toList();

    return Scaffold(
      backgroundColor: AppColors.navy950,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: Column(
              children: [
                // Top App Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.engineering, color: Colors.white, size: 18),
                          ),
                          const SizedBox(width: 8),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'SiteTrack',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
                              ),
                              Text(
                                'TOOLS. PEOPLE. PROGRESS.',
                                style: TextStyle(color: AppColors.primaryLight, fontSize: 8, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ],
                      ),

                      Row(
                        children: [
                          // Switch to Admin Portal quick button
                          TextButton.icon(
                            onPressed: () {
                              Navigator.pushReplacementNamed(context, RouteNames.adminDashboard);
                            },
                            icon: const Icon(Icons.admin_panel_settings, size: 14, color: AppColors.primaryLight),
                            label: const Text('Admin', style: TextStyle(color: AppColors.primaryLight, fontSize: 11)),
                            style: TextButton.styleFrom(
                              backgroundColor: AppColors.primary.withOpacity(0.15),
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                          ),
                          const SizedBox(width: 6),
                          IconButton(
                            icon: const Icon(Icons.logout, color: Colors.white54, size: 20),
                            onPressed: () {
                              provider.logout();
                              Navigator.pushReplacementNamed(context, RouteNames.login);
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Navigation Tabs
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: AppColors.navy800,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicatorSize: TabBarIndicatorSize.tab,
                    indicator: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    labelColor: Colors.white,
                    unselectedLabelColor: Colors.white54,
                    labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    tabs: [
                      const Tab(text: 'Attendance'),
                      Tab(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Tools'),
                            if (myHandovers.isNotEmpty) ...[
                              const SizedBox(width: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                decoration: BoxDecoration(
                                  color: AppColors.warning,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${myHandovers.length}',
                                  style: const TextStyle(color: Colors.black, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const Tab(text: 'History'),
                    ],
                  ),
                ),

                const SizedBox(height: 10),

                // Main Tab View
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      // TAB 1: ATTENDANCE CHECK-IN / CHECK-OUT (Page 6 of PDF)
                      _buildAttendanceCheckInOutView(
                        context,
                        provider,
                        site,
                        workerName,
                        workerRole,
                        workerId,
                        isCheckedIn,
                        isCheckedOut,
                        todayAttendance,
                      ),

                      // TAB 2: TOOLS & HANDOVERS (Page 2 & 5 of PDF)
                      _buildToolsAndHandoversView(provider, workerId, workerName),

                      // TAB 3: ATTENDANCE HISTORY
                      _buildHistoryView(provider, workerId),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAttendanceCheckInOutView(
    BuildContext context,
    AppStateProvider provider,
    SiteModel site,
    String workerName,
    String workerRole,
    String workerId,
    bool isCheckedIn,
    bool isCheckedOut,
    dynamic todayAttendance,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
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
                    style: const TextStyle(fontSize: 14, color: Colors.white70),
                  ),
                  Text(
                    workerName,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  Text(
                    workerRole.toUpperCase(),
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primaryLight),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.navy800,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.calendar_today, size: 13, color: AppColors.primaryLight),
                    SizedBox(width: 6),
                    Text(
                      '14 Sep 2026 Monday',
                      style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Selected Worksite Card
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.navy800,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.location_on, color: AppColors.primaryLight, size: 20),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        site.name,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        site.location,
                        style: const TextStyle(color: Colors.white54, fontSize: 11),
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
                      Text('Change Site', style: TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.bold)),
                      Icon(Icons.chevron_right, size: 14, color: AppColors.primaryLight),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // LIVE WORKSITE PHOTOGRAPH VIEWFINDER (Page 6 Mockup)
          Container(
            height: 280,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white12, width: 2),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Simulated camera background
                  Image.network(
                    isCheckedIn && todayAttendance?.checkInPhoto != null
                        ? todayAttendance!.checkInPhoto!
                        : 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
                    fit: BoxFit.cover,
                  ),

                  // Darkened camera vignette
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.5),
                          Colors.transparent,
                          Colors.black.withOpacity(0.8),
                        ],
                      ),
                    ),
                  ),

                  // Worker face guide in center
                  Center(
                    child: Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.success,
                          width: 2.5,
                        ),
                      ),
                      child: ClipOval(
                        child: Image.network(
                          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),

                  // Top Camera Controls (Retake & Switch)
                  Positioned(
                    top: 12,
                    left: 12,
                    right: 12,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Row(
                            children: [
                              CircleAvatar(radius: 3, backgroundColor: AppColors.danger),
                              SizedBox(width: 5),
                              Text('LIVE CAMERA', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Row(
                          children: [
                            InkWell(
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Photo preview refreshed')),
                                );
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.white24,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.refresh, size: 12, color: Colors.white),
                                    SizedBox(width: 4),
                                    Text('Retake', style: TextStyle(color: Colors.white, fontSize: 11)),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            InkWell(
                              onTap: () {
                                setState(() {
                                  _cameraFront = !_cameraFront;
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.white24,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.flip_camera_ios, size: 12, color: Colors.white),
                                    SizedBox(width: 4),
                                    Text('Switch', style: TextStyle(color: Colors.white, fontSize: 11)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Bottom Location Detected Banner Pill
                  Positioned(
                    bottom: 12,
                    left: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.85),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                const CircleAvatar(radius: 3, backgroundColor: AppColors.success),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Text(
                                        'LOCATION DETECTED',
                                        style: TextStyle(color: Colors.white54, fontSize: 8, fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        site.location,
                                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.success.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.success.withOpacity(0.4)),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.check, size: 12, color: AppColors.success),
                                SizedBox(width: 4),
                                Text(
                                  'Within Site',
                                  style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // ACTION BUTTON AREA: CHECK IN VS CHECK OUT (Matching Page 6 Mockups)
          if (!isCheckedIn && !isCheckedOut) ...[
            // STATE 1: CHECK IN BUTTON
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
                      backgroundColor: AppColors.success,
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.success,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  elevation: 6,
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
                      child: const Icon(Icons.arrow_forward, size: 18),
                    ),
                    Row(
                      children: [
                        const Text(
                          'Check In',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          DateFormat('hh:mm a').format(DateTime.now()),
                          style: const TextStyle(fontSize: 13, color: Colors.white70),
                        ),
                      ],
                    ),
                    const SizedBox(width: 24),
                  ],
                ),
              ),
            ),
          ] else if (isCheckedIn) ...[
            // STATE 2: CHECK OUT SCREEN
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.navy800,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle, size: 18, color: AppColors.success),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Check In', style: TextStyle(color: Colors.white54, fontSize: 10)),
                            Text(
                              todayAttendance?.checkInTime ?? '08:15 AM',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.navy800,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.schedule, size: 18, color: AppColors.primaryLight),
                        SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Total Hours', style: TextStyle(color: Colors.white54, fontSize: 10)),
                            Text(
                              '9h 50m',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Red Check Out Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  if (todayAttendance != null) {
                    provider.checkOutWorker(todayAttendance.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('✓ Checked Out successfully. Shift recorded.'),
                        backgroundColor: AppColors.danger,
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.danger,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  elevation: 6,
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
                      child: const Icon(Icons.arrow_forward, size: 18),
                    ),
                    Row(
                      children: [
                        const Text(
                          'Check Out',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          DateFormat('hh:mm a').format(DateTime.now()),
                          style: const TextStyle(fontSize: 13, color: Colors.white70),
                        ),
                      ],
                    ),
                    const SizedBox(width: 24),
                  ],
                ),
              ),
            ),
          ] else ...[
            // Shift Complete
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.navy800,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.success.withOpacity(0.3)),
              ),
              child: Center(
                child: Column(
                  children: [
                    const Icon(Icons.verified, color: AppColors.success, size: 36),
                    const SizedBox(height: 6),
                    const Text(
                      'Shift Completed Today',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    Text(
                      'Hours Logged: ${todayAttendance?.workingHours ?? '9h 14m'}',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildToolsAndHandoversView(AppStateProvider provider, String workerId, String workerName) {
    final assignedTools = provider.tools
        .where((t) => t.assignedWorkerId == workerId || t.assignedWorkerName == workerName)
        .toList();

    final pendingHandovers = provider.handoverRequests
        .where((h) => h.toWorkerId == workerId && h.status == 'Pending')
        .toList();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (pendingHandovers.isNotEmpty) ...[
          const Text(
            'PENDING HANDOVER REQUESTS',
            style: TextStyle(color: AppColors.warning, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 0.8),
          ),
          const SizedBox(height: 8),
          ...pendingHandovers.map((h) => Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.navy800,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.warning.withOpacity(0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(h.toolName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.warning.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(h.toolId, style: const TextStyle(color: AppColors.warning, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Sent by ${h.fromWorkerName} for use at ${h.siteName}. Review and accept through app.',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          provider.acceptHandover(h.id);
                        },
                        icon: const Icon(Icons.check, size: 16),
                        label: const Text('Accept Tool'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: () {
                        provider.declineHandover(h.id);
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white70,
                        side: const BorderSide(color: Colors.white24),
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
                      ),
                      child: const Text('Decline'),
                    ),
                  ],
                ),
              ],
            ),
          )),
          const SizedBox(height: 16),
        ],

        const Text(
          'CURRENTLY ASSIGNED TOOLS',
          style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),

        ...assignedTools.map((t) => Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.navy800,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  t.imageUrl,
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(t.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text(t.toolId, style: const TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Text('${t.variant} • ${t.category}', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                    Text('Condition: ${t.condition}', style: const TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        )),
      ],
    );
  }

  Widget _buildHistoryView(AppStateProvider provider, String workerId) {
    final myAttendance = provider.attendanceRecords
        .where((a) => a.workerId == workerId)
        .toList();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'ATTENDANCE LOGS',
          style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 0.8),
        ),
        const SizedBox(height: 8),
        ...myAttendance.map((a) => Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.navy800,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(a.date, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.success.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(a.status, style: const TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('In: ${a.checkInTime ?? "—"}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  Text('Out: ${a.checkOutTime ?? "In Progress"}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  Text('Hours: ${a.workingHours ?? "—"}', style: const TextStyle(color: AppColors.primaryLight, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        )),
      ],
    );
  }
}
