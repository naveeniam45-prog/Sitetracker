class LocalStorage {
  static final Map<String, dynamic> _memoryCache = {};

  static Future<void> setString(String key, String value) async {
    _memoryCache[key] = value;
  }

  static Future<String?> getString(String key) async {
    return _memoryCache[key] as String?;
  }

  static Future<void> clear() async {
    _memoryCache.clear();
  }
}
