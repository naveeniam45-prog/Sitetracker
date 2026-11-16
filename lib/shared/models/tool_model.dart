class ToolMovementModel {
  final String id;
  final String toolId;
  final String date;
  final String fromSite;
  final String toSite;
  final String assignedToName;
  final String byUser;
  final String notes;

  const ToolMovementModel({
    required this.id,
    required this.toolId,
    required this.date,
    required this.fromSite,
    required this.toSite,
    required this.assignedToName,
    required this.byUser,
    required this.notes,
  });
}

class ToolModel {
  final String id;
  final String toolId;
  final String name;
  final String category;
  final String variant;
  final String serialNumber;
  final String siteId;
  final String siteName;
  final String? assignedWorkerId;
  final String? assignedWorkerName;
  final String? assignedWorkerRole;
  final String status; // 'Assigned' | 'Available' | 'Maintenance' | 'Lost'
  final String purchaseDate;
  final String condition; // 'Good' | 'Fair' | 'Requires Service'
  final String imageUrl;
  final String addedOn;
  final int daysAtCurrentSite;
  final int totalUsageDays;
  final String description;
  final List<ToolMovementModel> movementHistory;

  const ToolModel({
    required this.id,
    required this.toolId,
    required this.name,
    required this.category,
    required this.variant,
    required this.serialNumber,
    required this.siteId,
    required this.siteName,
    this.assignedWorkerId,
    this.assignedWorkerName,
    this.assignedWorkerRole,
    required this.status,
    required this.purchaseDate,
    required this.condition,
    required this.imageUrl,
    required this.addedOn,
    required this.daysAtCurrentSite,
    required this.totalUsageDays,
    required this.description,
    required this.movementHistory,
  });

  ToolModel copyWith({
    String? siteId,
    String? siteName,
    String? assignedWorkerId,
    String? assignedWorkerName,
    String? assignedWorkerRole,
    String? status,
    int? daysAtCurrentSite,
    List<ToolMovementModel>? movementHistory,
  }) {
    return ToolModel(
      id: id,
      toolId: toolId,
      name: name,
      category: category,
      variant: variant,
      serialNumber: serialNumber,
      siteId: siteId ?? this.siteId,
      siteName: siteName ?? this.siteName,
      assignedWorkerId: assignedWorkerId ?? this.assignedWorkerId,
      assignedWorkerName: assignedWorkerName ?? this.assignedWorkerName,
      assignedWorkerRole: assignedWorkerRole ?? this.assignedWorkerRole,
      status: status ?? this.status,
      purchaseDate: purchaseDate,
      condition: condition,
      imageUrl: imageUrl,
      addedOn: addedOn,
      daysAtCurrentSite: daysAtCurrentSite ?? this.daysAtCurrentSite,
      totalUsageDays: totalUsageDays,
      description: description,
      movementHistory: movementHistory ?? this.movementHistory,
    );
  }
}
