import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/services/location_service.dart';

class LiveCameraViewfinder extends StatefulWidget {
  final String locationAddress;
  final double siteLat;
  final double siteLng;
  final VoidCallback? onPhotoSnapped;

  const LiveCameraViewfinder({
    super.key,
    required this.locationAddress,
    this.siteLat = 10.0159,
    this.siteLng = 76.3638,
    this.onPhotoSnapped,
  });

  @override
  State<LiveCameraViewfinder> createState() => _LiveCameraViewfinderState();
}

class _LiveCameraViewfinderState extends State<LiveCameraViewfinder> with WidgetsBindingObserver {
  List<CameraDescription> _cameras = [];
  CameraController? _cameraController;
  bool _isCameraReady = false;
  CameraLensDirection _currentLens = CameraLensDirection.front;
  XFile? _snappedPhoto;
  bool _isCapturing = false;

  // Real GPS State
  LocationResult? _locationResult;
  bool _isLocating = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeCamera();
    _fetchLiveLocation();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final CameraController? controller = _cameraController;
    if (controller == null || !controller.value.isInitialized) {
      return;
    }

    if (state == AppLifecycleState.inactive) {
      controller.dispose();
    } else if (state == AppLifecycleState.resumed) {
      _initializeCamera();
      _fetchLiveLocation();
    }
  }

  Future<void> _fetchLiveLocation() async {
    setState(() => _isLocating = true);
    final result = await LocationService.getCurrentLocation(
      siteLat: widget.siteLat,
      siteLng: widget.siteLng,
    );
    if (mounted) {
      setState(() {
        _locationResult = result;
        _isLocating = false;
      });
    }
  }

  Future<void> _initializeCamera() async {
    try {
      _cameras = await availableCameras();
      if (_cameras.isEmpty) {
        if (mounted) setState(() => _isCameraReady = false);
        return;
      }

      final camera = _cameras.firstWhere(
        (c) => c.lensDirection == _currentLens,
        orElse: () => _cameras.first,
      );

      final controller = CameraController(
        camera,
        ResolutionPreset.medium,
        enableAudio: false,
      );

      _cameraController = controller;
      await controller.initialize();

      if (mounted) {
        setState(() {
          _isCameraReady = true;
        });
      }
    } catch (e) {
      debugPrint('Camera initialization error: $e');
      if (mounted) {
        setState(() {
          _isCameraReady = false;
        });
      }
    }
  }

  Future<void> _toggleCameraLens() async {
    if (_cameras.length < 2) return;

    final nextLens = _currentLens == CameraLensDirection.front
        ? CameraLensDirection.back
        : CameraLensDirection.front;

    _currentLens = nextLens;
    await _cameraController?.dispose();
    _cameraController = null;
    setState(() => _isCameraReady = false);
    await _initializeCamera();
  }

  Future<void> _takePhoto() async {
    final controller = _cameraController;
    if (controller == null || !controller.value.isInitialized || _isCapturing) {
      return;
    }

    try {
      setState(() => _isCapturing = true);
      final photo = await controller.takePicture();
      setState(() {
        _snappedPhoto = photo;
        _isCapturing = false;
      });
      widget.onPhotoSnapped?.call();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✓ Photo captured successfully'),
            duration: Duration(seconds: 1),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      debugPrint('Error taking photo: $e');
      setState(() => _isCapturing = false);
    }
  }

  void _handleRetake() {
    setState(() {
      _snappedPhoto = null;
    });
    _fetchLiveLocation();
  }

  @override
  Widget build(BuildContext context) {
    final hasLocation = _locationResult != null && _locationResult!.isWithinSite;

    return Container(
      height: 290,
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white12, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.25),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // 1. Live Video Feed from Camera OR Captured Photo OR Camera Access Prompt
            if (_snappedPhoto != null)
              Image.network(
                _snappedPhoto!.path,
                fit: BoxFit.cover,
                errorBuilder: (ctx, err, stack) => const Center(
                  child: Icon(Icons.check_circle, color: AppColors.success, size: 64),
                ),
              )
            else if (_isCameraReady && _cameraController != null && _cameraController!.value.isInitialized)
              FittedBox(
                fit: BoxFit.cover,
                child: SizedBox(
                  width: _cameraController!.value.previewSize?.height ?? 400,
                  height: _cameraController!.value.previewSize?.width ?? 300,
                  child: CameraPreview(_cameraController!),
                ),
              )
            else
              Container(
                color: const Color(0xFF1E293B),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.camera_alt_outlined, color: Colors.white38, size: 48),
                      const SizedBox(height: 10),
                      const Text(
                        'Camera Viewfinder',
                        style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      TextButton.icon(
                        icon: const Icon(Icons.videocam, size: 16),
                        label: const Text('Enable Camera'),
                        onPressed: _initializeCamera,
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.primaryLight,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // Subtle Vignette Gradient
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.4),
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.75),
                  ],
                ),
              ),
            ),

            // Center Face Alignment Oval Guide (No static fallback pictures)
            if (_snappedPhoto == null)
              Center(
                child: Container(
                  width: 142,
                  height: 142,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: _isCameraReady ? AppColors.success : Colors.white30,
                      width: 2.5,
                    ),
                    boxShadow: _isCameraReady
                        ? [
                            BoxShadow(
                              color: AppColors.success.withValues(alpha: 0.3),
                              blurRadius: 14,
                              spreadRadius: 2,
                            ),
                          ]
                        : null,
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.person_outline_rounded,
                      size: 64,
                      color: Colors.white54,
                    ),
                  ),
                ),
              ),

            // Top HUD Bar: Location on top-left (only when location is on) & Lens Flip / Retake on top-right
            Positioned(
              top: 12,
              left: 12,
              right: 12,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Top-Left: Shown ONLY when location is ON / verified (no LIVE pill)
                  if (hasLocation)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.success.withValues(alpha: 0.5)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.location_on, size: 13, color: AppColors.success),
                          SizedBox(width: 4),
                          Text(
                            'Within Site',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    const SizedBox.shrink(),

                  // Top-Right: Retake & Lens Flip
                  Row(
                    children: [
                      if (_snappedPhoto != null)
                        InkWell(
                          onTap: _handleRetake,
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.refresh, size: 13, color: Colors.white),
                                SizedBox(width: 4),
                                Text('Retake', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ),
                      if (_isCameraReady && _cameras.length > 1 && _snappedPhoto == null) ...[
                        const SizedBox(width: 6),
                        InkWell(
                          onTap: _toggleCameraLens,
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.flip_camera_ios, size: 13, color: Colors.white),
                                const SizedBox(width: 4),
                                Text(
                                  _currentLens == CameraLensDirection.front ? 'Rear' : 'Front',
                                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),

            // Camera Shutter Button (Allows worker to take picture)
            if (_isCameraReady && _snappedPhoto == null)
              Positioned(
                bottom: 58,
                left: 0,
                right: 0,
                child: Center(
                  child: InkWell(
                    onTap: _isCapturing ? null : _takePhoto,
                    borderRadius: BorderRadius.circular(25),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.85),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.3),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.camera_alt, size: 16, color: AppColors.primary),
                          const SizedBox(width: 6),
                          const Text(
                            'Take Photo',
                            style: TextStyle(
                              color: Color(0xFF0F172A),
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

            // Bottom Location Banner (NO coordinates, clean address and verification badge)
            Positioned(
              bottom: 12,
              left: 12,
              right: 12,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.85),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: _isLocating ? Colors.amber : (hasLocation ? AppColors.success : Colors.white38),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  _isLocating ? 'DETECTING LOCATION...' : (hasLocation ? 'VERIFIED LOCATION' : 'WORK SITE'),
                                  style: TextStyle(
                                    color: _isLocating ? Colors.amber : Colors.white70,
                                    fontSize: 8,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                Text(
                                  widget.locationAddress,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (hasLocation) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.success.withValues(alpha: 0.4)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check, size: 12, color: AppColors.success),
                            SizedBox(width: 4),
                            Text(
                              'Within Site',
                              style: TextStyle(
                                color: AppColors.success,
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
