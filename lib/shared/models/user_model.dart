class UserModel {
  final String id;
  final String name;
  final String username;
  final String employeeId;
  final String role; // 'admin' | 'operator' | 'worker' | 'technician'
  final String phone;
  final String siteId;
  final String siteName;
  final String avatarUrl;

  const UserModel({
    required this.id,
    required this.name,
    required this.username,
    required this.employeeId,
    required this.role,
    required this.phone,
    required this.siteId,
    required this.siteName,
    required this.avatarUrl,
  });

  bool get isAdmin => role.toLowerCase() == 'admin';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? 'worker-1',
      name: json['name'] ?? json['fullName'] ?? 'Raj Kumar',
      username: json['username'] ?? json['employeeId'] ?? 'EMP001',
      employeeId: json['employeeId'] ?? json['id']?.toString() ?? 'EMP001',
      role: json['role'] ?? 'operator',
      phone: json['phone'] ?? json['phoneNumber'] ?? '+91 98765 43210',
      siteId: json['siteId'] ?? json['assignedSiteId'] ?? 'site-1',
      siteName: json['siteName'] ?? json['assignedSiteName'] ?? 'Kochi Project',
      avatarUrl: json['avatarUrl'] ?? json['avatar'] ?? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'username': username,
      'employeeId': employeeId,
      'role': role,
      'phone': phone,
      'siteId': siteId,
      'siteName': siteName,
      'avatarUrl': avatarUrl,
    };
  }
}
