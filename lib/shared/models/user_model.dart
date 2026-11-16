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
}
