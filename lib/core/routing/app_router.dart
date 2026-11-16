import 'package:flutter/material.dart';
import 'route_names.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/attendance/screens/worker_check_in_screen.dart';
import '../../features/attendance/screens/admin_attendance_screen.dart';
import '../../features/dashboard/screens/admin_dashboard_screen.dart';
import '../../features/sites/screens/sites_screen.dart';
import '../../features/workers/screens/workers_screen.dart';
import '../../features/tools/screens/tools_screen.dart';
import '../../features/tools/screens/tool_detail_screen.dart';
import '../../features/handovers/screens/handovers_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/settings/screens/settings_screen.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RouteNames.login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case RouteNames.workerCheckIn:
        return MaterialPageRoute(builder: (_) => const WorkerCheckInScreen());
      case RouteNames.adminDashboard:
        return MaterialPageRoute(builder: (_) => const AdminDashboardScreen());
      case RouteNames.sites:
        return MaterialPageRoute(builder: (_) => const SitesScreen());
      case RouteNames.workers:
        return MaterialPageRoute(builder: (_) => const WorkersScreen());
      case RouteNames.tools:
        return MaterialPageRoute(builder: (_) => const ToolsScreen());
      case RouteNames.toolDetail:
        return MaterialPageRoute(builder: (_) => const ToolDetailScreen());
      case RouteNames.attendance:
        return MaterialPageRoute(builder: (_) => const AdminAttendanceScreen());
      case RouteNames.handovers:
        return MaterialPageRoute(builder: (_) => const HandoversScreen());
      case RouteNames.profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case RouteNames.settings:
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      default:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
    }
  }
}
