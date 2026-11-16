class WorkerModel {
  final String id;
  final String name;
  final String employeeId;
  final String phone;
  final String role;
  final String siteId;
  final String siteName;
  final String status; // 'Working' | 'Absent' | 'On Leave' | 'Inactive'
  final int toolsAssignedCount;
  final String avatarUrl;

  const WorkerModel({
    required this.id,
    required this.name,
    required this.employeeId,
    required this.phone,
    required this.role,
    required this.siteId,
    required this.siteName,
    required this.status,
    required this.toolsAssignedCount,
    required this.avatarUrl,
  });

  WorkerModel copyWith({
    String? status,
    String? siteId,
    String? siteName,
    int? toolsAssignedCount,
  }) {
    return WorkerModel(
      id: id,
      name: name,
      employeeId: employeeId,
      phone: phone,
      role: role,
      siteId: siteId ?? this.siteId,
      siteName: siteName ?? this.siteName,
      status: status ?? this.status,
      toolsAssignedCount: toolsAssignedCount ?? this.toolsAssignedCount,
      avatarUrl: avatarUrl,
    );
  }
}
