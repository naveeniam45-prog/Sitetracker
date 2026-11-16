class SiteModel {
  final String id;
  final String name;
  final String location;
  final String siteManager;
  final String siteManagerInitials;
  final int workersPresent;
  final int workersTotal;
  final int toolsCount;
  final String status; // 'Active' | 'Inactive'
  final String state;
  final double latitude;
  final double longitude;
  final double radiusMeters;

  const SiteModel({
    required this.id,
    required this.name,
    required this.location,
    required this.siteManager,
    required this.siteManagerInitials,
    required this.workersPresent,
    required this.workersTotal,
    required this.toolsCount,
    required this.status,
    required this.state,
    required this.latitude,
    required this.longitude,
    required this.radiusMeters,
  });

  SiteModel copyWith({
    int? workersPresent,
    int? workersTotal,
    int? toolsCount,
    String? status,
  }) {
    return SiteModel(
      id: id,
      name: name,
      location: location,
      siteManager: siteManager,
      siteManagerInitials: siteManagerInitials,
      workersPresent: workersPresent ?? this.workersPresent,
      workersTotal: workersTotal ?? this.workersTotal,
      toolsCount: toolsCount ?? this.toolsCount,
      status: status ?? this.status,
      state: state,
      latitude: latitude,
      longitude: longitude,
      radiusMeters: radiusMeters,
    );
  }
}
