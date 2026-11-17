import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../features/auth/services/auth_service.dart';
import '../models/user_model.dart';
import '../models/site_model.dart';
import '../models/worker_model.dart';
import '../models/tool_model.dart';
import '../models/attendance_model.dart';
import '../models/handover_model.dart';

class AppStateProvider extends ChangeNotifier {
  // Current Logged-in User
  UserModel? _currentUser;
  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;

  // Selected tool for detail view
  String _selectedToolId = 'tool-1';
  String get selectedToolId => _selectedToolId;

  void setSelectedToolId(String id) {
    _selectedToolId = id;
    notifyListeners();
  }

  // Pre-configured Demo Users
  final List<UserModel> demoUsers = const [
    UserModel(
      id: 'worker-1',
      name: 'Raj Kumar',
      username: 'raj.kumar',
      employeeId: 'EMP001',
      role: 'operator',
      phone: '+91 98765 43210',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    ),
    UserModel(
      id: 'admin-1',
      name: 'Operations Admin',
      username: 'admin',
      employeeId: 'ADM001',
      role: 'admin',
      phone: '+91 98000 00001',
      siteId: 'site-1',
      siteName: 'Headquarters',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ),
    UserModel(
      id: 'worker-2',
      name: 'Suresh P',
      username: 'suresh.p',
      employeeId: 'EMP002',
      role: 'worker',
      phone: '+91 98765 43211',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ),
  ];

  // Sites list (from Page 3 of PDF)
  List<SiteModel> _sites = [
    const SiteModel(
      id: 'site-1',
      name: 'Kochi Project',
      location: 'Infopark, Kakkanad, Kochi, Kerala',
      siteManager: 'Suresh K',
      siteManagerInitials: 'SK',
      workersPresent: 32,
      workersTotal: 38,
      toolsCount: 126,
      status: 'Active',
      state: 'Kerala',
      latitude: 10.0159,
      longitude: 76.3638,
      radiusMeters: 500,
    ),
    const SiteModel(
      id: 'site-2',
      name: 'Aluva Project',
      location: 'Railway Station Road, Aluva, Kerala',
      siteManager: 'Arun S',
      siteManagerInitials: 'AS',
      workersPresent: 24,
      workersTotal: 29,
      toolsCount: 81,
      status: 'Active',
      state: 'Kerala',
      latitude: 10.1076,
      longitude: 76.3516,
      radiusMeters: 400,
    ),
    const SiteModel(
      id: 'site-3',
      name: 'Kakkanad Project',
      location: 'Civil Station Road, Kakkanad, Kerala',
      siteManager: 'Manoj K',
      siteManagerInitials: 'MK',
      workersPresent: 35,
      workersTotal: 38,
      toolsCount: 92,
      status: 'Active',
      state: 'Kerala',
      latitude: 10.0270,
      longitude: 76.3450,
      radiusMeters: 450,
    ),
    const SiteModel(
      id: 'site-4',
      name: 'Kozhikode Site',
      location: 'Beach Road, Kozhikode, Kerala',
      siteManager: 'Ramesh P',
      siteManagerInitials: 'RP',
      workersPresent: 18,
      workersTotal: 24,
      toolsCount: 67,
      status: 'Active',
      state: 'Kerala',
      latitude: 11.2588,
      longitude: 75.7804,
      radiusMeters: 600,
    ),
    const SiteModel(
      id: 'site-5',
      name: 'Thrissur Project',
      location: 'Round North, Thrissur, Kerala',
      siteManager: 'Vijay T',
      siteManagerInitials: 'VT',
      workersPresent: 41,
      workersTotal: 45,
      toolsCount: 143,
      status: 'Active',
      state: 'Kerala',
      latitude: 10.5276,
      longitude: 76.2144,
      radiusMeters: 500,
    ),
    const SiteModel(
      id: 'site-6',
      name: 'Trivandrum Site',
      location: 'Technopark Phase 3, Trivandrum, Kerala',
      siteManager: 'Shibu J',
      siteManagerInitials: 'SJ',
      workersPresent: 28,
      workersTotal: 32,
      toolsCount: 94,
      status: 'Inactive',
      state: 'Kerala',
      latitude: 8.5566,
      longitude: 76.8821,
      radiusMeters: 550,
    ),
  ];
  List<SiteModel> get sites => _sites;

  // Workers list (from Page 4 top of PDF)
  List<WorkerModel> _workers = [
    const WorkerModel(
      id: 'worker-1',
      name: 'Raj Kumar',
      employeeId: 'EMP001',
      phone: '+91 98765 43210',
      role: 'Operator',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      status: 'Working',
      toolsAssignedCount: 3,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    ),
    const WorkerModel(
      id: 'worker-2',
      name: 'Suresh P',
      employeeId: 'EMP002',
      phone: '+91 98765 43211',
      role: 'Worker',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      status: 'Working',
      toolsAssignedCount: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ),
    const WorkerModel(
      id: 'worker-3',
      name: 'Arun K',
      employeeId: 'EMP003',
      phone: '+91 98765 43212',
      role: 'Technician',
      siteId: 'site-2',
      siteName: 'Aluva Project',
      status: 'Working',
      toolsAssignedCount: 4,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ),
    const WorkerModel(
      id: 'worker-4',
      name: 'Manoj M',
      employeeId: 'EMP004',
      phone: '+91 98765 43213',
      role: 'Worker',
      siteId: 'site-5',
      siteName: 'Thrissur Project',
      status: 'Absent',
      toolsAssignedCount: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    ),
    const WorkerModel(
      id: 'worker-5',
      name: 'Vijay T',
      employeeId: 'EMP005',
      phone: '+91 98765 43214',
      role: 'Supervisor',
      siteId: 'site-3',
      siteName: 'Kakkanad Project',
      status: 'Working',
      toolsAssignedCount: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    ),
    const WorkerModel(
      id: 'worker-6',
      name: 'Ramesh P',
      employeeId: 'EMP006',
      phone: '+91 98765 43215',
      role: 'Worker',
      siteId: 'site-4',
      siteName: 'Kozhikode Site',
      status: 'On Leave',
      toolsAssignedCount: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ),
  ];
  List<WorkerModel> get workers => _workers;

  // Tools list (from Page 4 bottom & Page 5 of PDF)
  List<ToolModel> _tools = [
    const ToolModel(
      id: 'tool-1',
      toolId: 'GM-001',
      name: 'Gilty Machine',
      category: 'Demolition Tools',
      variant: '10 KG',
      serialNumber: 'BOSCH-00123',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      assignedWorkerId: 'worker-1',
      assignedWorkerName: 'Raj Kumar',
      assignedWorkerRole: 'Operator',
      status: 'Assigned',
      purchaseDate: '12 Jan 2024',
      condition: 'Good',
      imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80',
      addedOn: '12 Aug 2026',
      daysAtCurrentSite: 12,
      totalUsageDays: 120,
      description: 'Heavy duty demolition tool for concrete and masonry work.',
      movementHistory: [
        ToolMovementModel(
          id: 'mov-1',
          toolId: 'GM-001',
          date: '14 Sep 2026',
          fromSite: 'Aluva Project',
          toSite: 'Kochi Project',
          assignedToName: 'Raj Kumar',
          byUser: 'Admin',
          notes: 'Site requirement for core demolition',
        ),
        ToolMovementModel(
          id: 'mov-2',
          toolId: 'GM-001',
          date: '05 Sep 2026',
          fromSite: 'Kochi Project',
          toSite: 'Aluva Project',
          assignedToName: 'Suresh P',
          byUser: 'Admin',
          notes: 'Transferred to Aluva for bridge work',
        ),
      ],
    ),
    const ToolModel(
      id: 'tool-2',
      toolId: 'GM-002',
      name: 'Gilty Machine',
      category: 'Demolition Tools',
      variant: '10 KG',
      serialNumber: 'BOSCH-00124',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      assignedWorkerId: 'worker-2',
      assignedWorkerName: 'Suresh P',
      assignedWorkerRole: 'Worker',
      status: 'Assigned',
      purchaseDate: '15 Jan 2024',
      condition: 'Good',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      addedOn: '12 Aug 2026',
      daysAtCurrentSite: 20,
      totalUsageDays: 95,
      description: 'Heavy duty demolition tool for concrete slab chipping.',
      movementHistory: [],
    ),
    const ToolModel(
      id: 'tool-3',
      toolId: 'DR-001',
      name: 'Drill Machine',
      category: 'Drilling Tools',
      variant: '750W',
      serialNumber: 'DEWALT-8841',
      siteId: 'site-2',
      siteName: 'Aluva Project',
      assignedWorkerId: 'worker-3',
      assignedWorkerName: 'Arun K',
      assignedWorkerRole: 'Technician',
      status: 'Assigned',
      purchaseDate: '20 Feb 2024',
      condition: 'Good',
      imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=80',
      addedOn: '14 Aug 2026',
      daysAtCurrentSite: 18,
      totalUsageDays: 140,
      description: 'Variable speed impact hammer drill with metal gear housing.',
      movementHistory: [],
    ),
    const ToolModel(
      id: 'tool-4',
      toolId: 'GR-001',
      name: 'Grinder',
      category: 'Grinding Tools',
      variant: '5 Inch',
      serialNumber: 'MAKITA-992',
      siteId: 'site-5',
      siteName: 'Thrissur Project',
      assignedWorkerId: 'worker-4',
      assignedWorkerName: 'Manoj M',
      assignedWorkerRole: 'Worker',
      status: 'Maintenance',
      purchaseDate: '10 Mar 2024',
      condition: 'Requires Service',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80',
      addedOn: '16 Aug 2026',
      daysAtCurrentSite: 25,
      totalUsageDays: 88,
      description: 'Angle grinder with dust ejection system.',
      movementHistory: [],
    ),
  ];
  List<ToolModel> get tools => _tools;

  // Attendance records (from Page 6 of PDF)
  List<AttendanceModel> _attendanceRecords = [
    const AttendanceModel(
      id: 'att-1-prev',
      workerId: 'worker-1',
      workerName: 'Raj Kumar',
      workerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      employeeId: 'EMP001',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      date: '13 Sep 2026',
      checkInTime: '08:15 AM',
      checkOutTime: '06:05 PM',
      workingHours: '9h 50m',
      status: 'Present',
      locationVerified: true,
      latitude: 10.0159,
      longitude: 76.3638,
      checkInPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    ),
    const AttendanceModel(
      id: 'att-2',
      workerId: 'worker-2',
      workerName: 'Suresh P',
      workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      employeeId: 'EMP002',
      siteId: 'site-1',
      siteName: 'Kochi Project',
      date: '14 Sep 2026',
      checkInTime: '09:12 AM',
      workingHours: 'In Progress (7h 35m)',
      status: 'Working',
      locationVerified: true,
      latitude: 10.0162,
      longitude: 76.3640,
      checkInPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    ),
  ];
  List<AttendanceModel> get attendanceRecords => _attendanceRecords;

  // Tool Handover Requests (Page 2 & 5 of PDF)
  List<HandoverModel> _handoverRequests = [
    const HandoverModel(
      id: 'ho-1',
      toolId: 'DR-001',
      toolName: 'Drill Machine (750W)',
      variant: '750W',
      fromWorkerName: 'Central Admin',
      toWorkerId: 'worker-1',
      toWorkerName: 'Raj Kumar',
      siteName: 'Kochi Project',
      status: 'Pending',
      requestDate: '14 Sep 2026, 11:15 AM',
    ),
  ];
  List<HandoverModel> get handoverRequests => _handoverRequests;

  // AUTH ACTIONS
  final AuthService _authService = AuthService();

  Future<AuthResult> loginWithApi(String username, String password) async {
    final result = await _authService.login(
      username: username,
      password: password,
    );
    if (result.isSuccess && result.user != null) {
      _currentUser = result.user;
      notifyListeners();
    }
    return result;
  }

  bool login(String usernameOrId) {
    final query = usernameOrId.trim().toLowerCase();
    
    // Find matching user
    for (final user in demoUsers) {
      if (user.username.toLowerCase() == query ||
          user.employeeId.toLowerCase() == query ||
          user.name.toLowerCase() == query) {
        _currentUser = user;
        notifyListeners();
        return true;
      }
    }

    // Default admin fallback
    if (query == 'admin') {
      _currentUser = demoUsers[1];
      notifyListeners();
      return true;
    }

    // Default worker fallback
    if (query.startsWith('emp') || query.contains('raj')) {
      _currentUser = demoUsers[0];
      notifyListeners();
      return true;
    }

    return false;
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }

  void switchUser(String userId) {
    final found = demoUsers.firstWhere((u) => u.id == userId, orElse: () => demoUsers[0]);
    _currentUser = found;
    notifyListeners();
  }

  // WORKER ATTENDANCE ACTIONS (Check-In & Check-Out)
  AttendanceModel? getTodayAttendance(String workerId) {
    try {
      return _attendanceRecords.firstWhere(
        (a) => a.workerId == workerId && a.date == '14 Sep 2026',
      );
    } catch (_) {
      return null;
    }
  }

  void checkInWorker({
    required String workerId,
    required String siteId,
    String? photoUrl,
  }) {
    final worker = _workers.firstWhere((w) => w.id == workerId, orElse: () => _workers[0]);
    final site = _sites.firstWhere((s) => s.id == siteId, orElse: () => _sites[0]);
    final timeStr = DateFormat('hh:mm a').format(DateTime.now());

    final newRecord = AttendanceModel(
      id: 'att-${DateTime.now().millisecondsSinceEpoch}',
      workerId: workerId,
      workerName: worker.name,
      workerAvatar: worker.avatarUrl,
      employeeId: worker.employeeId,
      siteId: siteId,
      siteName: site.name,
      date: '14 Sep 2026',
      checkInTime: timeStr,
      workingHours: 'In Progress (0h 01m)',
      status: 'Working',
      checkInPhoto: photoUrl ?? worker.avatarUrl,
      locationVerified: true,
      latitude: site.latitude,
      longitude: site.longitude,
    );

    _attendanceRecords = [newRecord, ..._attendanceRecords];
    notifyListeners();
  }

  void checkOutWorker(String attendanceId) {
    final timeStr = DateFormat('hh:mm a').format(DateTime.now());
    _attendanceRecords = _attendanceRecords.map((a) {
      if (a.id == attendanceId) {
        return a.copyWith(
          checkOutTime: timeStr,
          workingHours: '9h 50m',
          status: 'Present',
        );
      }
      return a;
    }).toList();
    notifyListeners();
  }

  void resetWorkerAttendance(String workerId) {
    _attendanceRecords = _attendanceRecords.where((a) => !(a.workerId == workerId && a.date == '14 Sep 2026')).toList();
    notifyListeners();
  }

  // TOOL HANDOVER ACTIONS
  void acceptHandover(String handoverId) {
    final timeStr = DateFormat('14 Sep 2026, hh:mm a').format(DateTime.now());
    _handoverRequests = _handoverRequests.map((h) {
      if (h.id == handoverId) {
        return h.copyWith(status: 'Accepted', acceptedDate: timeStr);
      }
      return h;
    }).toList();
    notifyListeners();
  }

  void declineHandover(String handoverId) {
    _handoverRequests = _handoverRequests.map((h) {
      if (h.id == handoverId) {
        return h.copyWith(status: 'Declined');
      }
      return h;
    }).toList();
    notifyListeners();
  }

  // SITE MANAGEMENT
  void addSite(SiteModel newSite) {
    _sites = [newSite, ..._sites];
    notifyListeners();
  }

  // WORKER MANAGEMENT
  void addWorker(WorkerModel newWorker) {
    _workers = [newWorker, ..._workers];
    notifyListeners();
  }

  // TOOL MANAGEMENT
  void addTool(ToolModel newTool) {
    _tools = [newTool, ..._tools];
    notifyListeners();
  }

  void moveTool({
    required String toolId,
    required String toSiteId,
    String? toWorkerId,
    String? notes,
  }) {
    final site = _sites.firstWhere((s) => s.id == toSiteId);
    final worker = toWorkerId != null 
        ? _workers.firstWhere((w) => w.id == toWorkerId) 
        : null;

    _tools = _tools.map((t) {
      if (t.id == toolId || t.toolId == toolId) {
        final newMov = ToolMovementModel(
          id: 'mov-${DateTime.now().millisecondsSinceEpoch}',
          toolId: t.toolId,
          date: '14 Sep 2026',
          fromSite: t.siteName,
          toSite: site.name,
          assignedToName: worker?.name ?? 'Unassigned',
          byUser: _currentUser?.name ?? 'Admin',
          notes: notes ?? 'Site reallocation',
        );
        return t.copyWith(
          siteId: site.id,
          siteName: site.name,
          assignedWorkerId: worker?.id,
          assignedWorkerName: worker?.name,
          assignedWorkerRole: worker?.role,
          status: worker != null ? 'Assigned' : 'Available',
          daysAtCurrentSite: 0,
          movementHistory: [newMov, ...t.movementHistory],
        );
      }
      return t;
    }).toList();

    notifyListeners();
  }

  void setToolMaintenance(String toolId) {
    _tools = _tools.map((t) {
      if (t.id == toolId || t.toolId == toolId) {
        return t.copyWith(status: 'Maintenance');
      }
      return t;
    }).toList();
    notifyListeners();
  }
}
