class ApiClient {
  Future<Map<String, dynamic>> get(String endpoint) async {
    // Simulated network client
    return {'status': 'success'};
  }

  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    // Simulated network client
    return {'status': 'success', 'data': data};
  }
}
