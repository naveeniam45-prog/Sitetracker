class AttendanceModel {
  final String id;
  final String workerId;
  final String workerName;
  final String workerAvatar;
  final String employeeId;
  final String siteId;
  final String siteName;
  final String date;
  final String? checkInTime;
  final String? checkOutTime;
  final String? workingHours;
  final String status; // 'Present' | 'Working' | 'Absent'
  final String? checkInPhoto;
  final String? checkOutPhoto;
  final bool locationVerified;
  final double? latitude;
  final double? longitude;

  const AttendanceModel({
    required this.id,
    required this.workerId,
    required this.workerName,
    required this.workerAvatar,
    required this.employeeId,
    required this.siteId,
    required this.siteName,
    required this.date,
    this.checkInTime,
    this.checkOutTime,
    this.workingHours,
    required this.status,
    this.checkInPhoto,
    this.checkOutPhoto,
    required this.locationVerified,
    this.latitude,
    this.longitude,
  });

  AttendanceModel copyWith({
    String? checkInTime,
    String? checkOutTime,
    String? workingHours,
    String? status,
    String? checkInPhoto,
    String? checkOutPhoto,
    bool? locationVerified,
  }) {
    return AttendanceModel(
      id: id,
      workerId: workerId,
      workerName: workerName,
      workerAvatar: workerAvatar,
      employeeId: employeeId,
      siteId: siteId,
      siteName: siteName,
      date: date,
      checkInTime: checkInTime ?? this.checkInTime,
      checkOutTime: checkOutTime ?? this.checkOutTime,
      workingHours: workingHours ?? this.workingHours,
      status: status ?? this.status,
      checkInPhoto: checkInPhoto ?? this.checkInPhoto,
      checkOutPhoto: checkOutPhoto ?? this.checkOutPhoto,
      locationVerified: locationVerified ?? this.locationVerified,
      latitude: latitude,
      longitude: longitude,
    );
  }
}
