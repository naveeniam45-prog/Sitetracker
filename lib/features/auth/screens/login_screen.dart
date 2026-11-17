import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/routing/route_names.dart';
import '../../../core/widgets/sitetrack_logo.dart';
import '../../../shared/providers/app_state_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = true;
  String? _errorMessage;
  bool _isLoading = false;
  bool _isCardHovered = false;

  // Dark & Light Mode Toggle (defaults to Dark background as requested)
  bool _isDarkMode = true;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final provider = context.read<AppStateProvider>();
    final result = await provider.loginWithApi(
      _usernameController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    if (result.isSuccess) {
      Navigator.pushReplacementNamed(context, RouteNames.workerCheckIn);
    } else {
      setState(() {
        _errorMessage = result.errorMessage ?? 'Invalid username or password. Please verify your credentials.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isMobile = screenWidth < 500;

    // Theme Colors based on Dark / Light toggle
    final bgColor = _isDarkMode ? const Color(0xFF0A0F1D) : const Color(0xFFF1F5F9);
    final cardBgColor = _isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final cardBorderColor = _isDarkMode
        ? (_isCardHovered ? AppColors.primaryLight.withValues(alpha: 0.6) : Colors.white.withValues(alpha: 0.1))
        : (_isCardHovered ? AppColors.primaryLight.withValues(alpha: 0.6) : const Color(0xFFE2E8F0));
    final textColor = _isDarkMode ? Colors.white : const Color(0xFF0F172A);
    final textSecondaryColor = _isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final fieldBgColor = _isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final fieldBorderColor = _isDarkMode ? Colors.white.withValues(alpha: 0.12) : const Color(0xFFE2E8F0);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          color: bgColor,
          child: Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: EdgeInsets.symmetric(
                horizontal: isMobile ? 18 : 24,
                vertical: isMobile ? 16 : 24,
              ),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // TOP BAR: Dark & Light Mode Toggle Effect
                    Align(
                      alignment: Alignment.centerRight,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: _isDarkMode
                              ? Colors.white.withValues(alpha: 0.08)
                              : Colors.black.withValues(alpha: 0.06),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: _isDarkMode
                                ? Colors.white.withValues(alpha: 0.14)
                                : Colors.black.withValues(alpha: 0.08),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            InkWell(
                              onTap: () => setState(() => _isDarkMode = false),
                              borderRadius: BorderRadius.circular(20),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: !_isDarkMode ? Colors.white : Colors.transparent,
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: !_isDarkMode
                                      ? [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.08),
                                            blurRadius: 4,
                                            offset: const Offset(0, 1),
                                          )
                                        ]
                                      : null,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.light_mode_rounded,
                                      size: 14,
                                      color: !_isDarkMode ? AppColors.primary : Colors.white60,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Light',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: !_isDarkMode ? const Color(0xFF0F172A) : Colors.white60,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            InkWell(
                              onTap: () => setState(() => _isDarkMode = true),
                              borderRadius: BorderRadius.circular(20),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: _isDarkMode ? AppColors.primary : Colors.transparent,
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: _isDarkMode
                                      ? [
                                          BoxShadow(
                                            color: AppColors.primary.withValues(alpha: 0.4),
                                            blurRadius: 6,
                                            offset: const Offset(0, 2),
                                          )
                                        ]
                                      : null,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.dark_mode_rounded,
                                      size: 14,
                                      color: _isDarkMode ? Colors.white : Colors.black54,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Dark',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: _isDarkMode ? Colors.white : Colors.black54,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // ==========================================
                    // OUTSIDE THE BOX: SITETRACK BRAND & APP HEADING
                    // (Tagline "TOOLS. PEOPLE. PROGRESS." removed as requested)
                    // ==========================================
                    Center(
                      child: SiteTrackLogo(
                        size: isMobile ? 38 : 44,
                        isDark: _isDarkMode,
                        showTagline: false, // REMOVED tools, people, progress tagline
                      ),
                    ),

                    const SizedBox(height: 10),

                    Center(
                      child: Text(
                        'Worker Attendance App',
                        style: TextStyle(
                          color: textSecondaryColor,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ==========================================
                    // LOGIN BOX (Elevated Card with Hover Effect)
                    // Contains ONLY Username, Password, Remember Me,
                    // Forgot Password, and Sign In
                    // ==========================================
                    MouseRegion(
                      onEnter: (_) => setState(() => _isCardHovered = true),
                      onExit: (_) => setState(() => _isCardHovered = false),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 220),
                        curve: Curves.easeOut,
                        padding: EdgeInsets.symmetric(
                          horizontal: isMobile ? 20 : 28,
                          vertical: isMobile ? 24 : 32,
                        ),
                        decoration: BoxDecoration(
                          color: cardBgColor,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: cardBorderColor,
                            width: _isCardHovered ? 1.5 : 1,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: _isDarkMode
                                  ? Colors.black.withValues(alpha: _isCardHovered ? 0.55 : 0.35)
                                  : const Color(0x100F172A),
                              blurRadius: _isCardHovered ? 28 : 16,
                              offset: Offset(0, _isCardHovered ? 12 : 6),
                            ),
                          ],
                        ),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Error Banner
                              if (_errorMessage != null) ...[
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEF4444).withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: const Color(0xFFEF4444).withValues(alpha: 0.4),
                                    ),
                                  ),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Icon(Icons.error_outline, size: 16, color: Color(0xFFEF4444)),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          _errorMessage!,
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: _isDarkMode ? Colors.white : const Color(0xFF991B1B),
                                            height: 1.3,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 18),
                              ],

                              // Username / Employee ID Field
                              Text(
                                'Username or Employee ID',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: textColor,
                                ),
                              ),
                              const SizedBox(height: 6),
                              TextFormField(
                                controller: _usernameController,
                                textInputAction: TextInputAction.next,
                                style: TextStyle(color: textColor, fontSize: 14, fontWeight: FontWeight.w500),
                                validator: (value) {
                                  if (value == null || value.trim().isEmpty) {
                                    return 'Please enter your username or employee ID';
                                  }
                                  return null;
                                },
                                decoration: InputDecoration(
                                  hintText: 'e.g. EMP001',
                                  hintStyle: TextStyle(
                                    color: _isDarkMode ? Colors.white30 : const Color(0xFF94A3B8),
                                    fontSize: 13,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.person_outline,
                                    size: 19,
                                    color: textSecondaryColor,
                                  ),
                                  filled: true,
                                  fillColor: fieldBgColor,
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide(color: fieldBorderColor),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide(color: fieldBorderColor),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: const BorderSide(color: AppColors.primary, width: 2),
                                  ),
                                  errorStyle: const TextStyle(color: Color(0xFFEF4444), fontSize: 11),
                                ),
                              ),

                              const SizedBox(height: 18),

                              // Password Field
                              Text(
                                'Password',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: textColor,
                                ),
                              ),
                              const SizedBox(height: 6),
                              TextFormField(
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                textInputAction: TextInputAction.done,
                                onFieldSubmitted: (_) => _handleLogin(),
                                style: TextStyle(color: textColor, fontSize: 14, fontWeight: FontWeight.w500),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your password';
                                  }
                                  return null;
                                },
                                decoration: InputDecoration(
                                  hintText: '••••••••',
                                  hintStyle: TextStyle(
                                    color: _isDarkMode ? Colors.white30 : const Color(0xFF94A3B8),
                                    fontSize: 13,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.lock_outline,
                                    size: 19,
                                    color: textSecondaryColor,
                                  ),
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                      size: 19,
                                      color: textSecondaryColor,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        _obscurePassword = !_obscurePassword;
                                      });
                                    },
                                  ),
                                  filled: true,
                                  fillColor: fieldBgColor,
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide(color: fieldBorderColor),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide(color: fieldBorderColor),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: const BorderSide(color: AppColors.primary, width: 2),
                                  ),
                                  errorStyle: const TextStyle(color: Color(0xFFEF4444), fontSize: 11),
                                ),
                              ),

                              const SizedBox(height: 14),

                              // ==========================================
                              // REMEMBER ME & FORGOT PASSWORD
                              // (Prominently displayed right below password)
                              // ==========================================
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  // Remember Me
                                  InkWell(
                                    onTap: () {
                                      setState(() {
                                        _rememberMe = !_rememberMe;
                                      });
                                    },
                                    borderRadius: BorderRadius.circular(6),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        SizedBox(
                                          width: 18,
                                          height: 18,
                                          child: Checkbox(
                                            value: _rememberMe,
                                            activeColor: AppColors.primary,
                                            checkColor: Colors.white,
                                            side: BorderSide(
                                              color: _isDarkMode ? Colors.white38 : const Color(0xFF94A3B8),
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            onChanged: (val) {
                                              setState(() {
                                                _rememberMe = val ?? true;
                                              });
                                            },
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          'Remember me',
                                          style: TextStyle(
                                            color: _isDarkMode ? Colors.white70 : const Color(0xFF475569),
                                            fontSize: 12,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // Forgot Password Link
                                  TextButton(
                                    onPressed: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(
                                          content: Text('Please contact your site administrator to reset your password.'),
                                          behavior: SnackBarBehavior.floating,
                                        ),
                                      );
                                    },
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    child: Text(
                                      'Forgot password?',
                                      style: TextStyle(
                                        color: _isDarkMode ? AppColors.primaryLight : AppColors.primary,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 24),

                              // Sign In Button
                              SizedBox(
                                height: 52,
                                child: ElevatedButton(
                                  onPressed: _isLoading ? null : _handleLogin,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.primary,
                                    foregroundColor: Colors.white,
                                    elevation: 2,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                  ),
                                  child: _isLoading
                                      ? const SizedBox(
                                          width: 22,
                                          height: 22,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2.2,
                                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                          ),
                                        )
                                      : const Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              'Sign In',
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                letterSpacing: 0.2,
                                              ),
                                            ),
                                            SizedBox(width: 8),
                                            Icon(Icons.arrow_forward_rounded, size: 18),
                                          ],
                                        ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
