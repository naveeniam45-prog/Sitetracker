import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_endpoints.dart';
import '../storage/local_storage.dart';

class ApiResponse {
  final bool isSuccess;
  final int statusCode;
  final dynamic data;
  final String? errorMessage;

  const ApiResponse({
    required this.isSuccess,
    required this.statusCode,
    this.data,
    this.errorMessage,
  });

  factory ApiResponse.success(dynamic data, int statusCode) {
    return ApiResponse(
      isSuccess: true,
      statusCode: statusCode,
      data: data,
    );
  }

  factory ApiResponse.error(String message, int statusCode) {
    return ApiResponse(
      isSuccess: false,
      statusCode: statusCode,
      errorMessage: message,
    );
  }
}

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  Future<Map<String, String>> _getHeaders() async {
    final token = await LocalStorage.getString('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  Future<ApiResponse> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final uri = Uri.parse('${ApiEndpoints.baseUrl}$endpoint');
      final headers = await _getHeaders();

      final response = await http
          .post(
            uri,
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 10));

      final responseData = response.body.isNotEmpty ? jsonDecode(response.body) : {};

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse.success(responseData, response.statusCode);
      } else {
        final message = responseData is Map && responseData.containsKey('message')
            ? responseData['message']
            : 'Request failed with status ${response.statusCode}';
        return ApiResponse.error(message, response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error(e.toString(), 500);
    }
  }

  Future<ApiResponse> get(String endpoint) async {
    try {
      final uri = Uri.parse('${ApiEndpoints.baseUrl}$endpoint');
      final headers = await _getHeaders();

      final response = await http
          .get(uri, headers: headers)
          .timeout(const Duration(seconds: 10));

      final responseData = response.body.isNotEmpty ? jsonDecode(response.body) : {};

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse.success(responseData, response.statusCode);
      } else {
        return ApiResponse.error('Request failed with status ${response.statusCode}', response.statusCode);
      }
    } catch (e) {
      return ApiResponse.error(e.toString(), 500);
    }
  }
}
