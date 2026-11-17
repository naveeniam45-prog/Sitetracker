class ApiEndpoints {
  /// Base URL of your backend REST API.
  /// Change this to your server's host, e.g. 'https://api.yourdomain.com'
  static String baseUrl = 'https://api.sitetrack.heapvue.com/v1';

  // Auth endpoints
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';

  // Attendance endpoints
  static const String attendance = '/attendance';
  static const String checkIn = '/attendance/check-in';
  static const String checkOut = '/attendance/check-out';
  static const String todayStatus = '/attendance/today';

  // Sites & Tools endpoints
  static const String sites = '/sites';
  static const String tools = '/tools';
  static const String handovers = '/handovers';
}
