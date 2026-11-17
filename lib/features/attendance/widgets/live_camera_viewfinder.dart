import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/services/location_service.dart';
import '../../../core/services/camera_helper.dart';

class LiveCameraViewfinder extends StatefulWidget {
  final String locationAddress;
  final double siteLat;
  final double siteLng;
  final VoidCallback? onPhotoSnapped;
  final ValueChanged<Uint8List?>? onPhotoBytesCaptured;
  final Uint8List? initialPhotoBytes;

  const LiveCameraViewfinder({
    super.key,
    required this.locationAddress,
    this.siteLat = 10.0159,
    this.siteLng = 76.3638,
    this.onPhotoSnapped,
    this.onPhotoBytesCaptured,
    this.initialPhotoBytes,
  });

  @override
  State<LiveCameraViewfinder> createState() => _LiveCameraViewfinderState();
}

class _LiveCameraViewfinderState extends State<LiveCameraViewfinder> with WidgetsBindingObserver {
  List<CameraDescription> _cameras = [];
  CameraController? _cameraController;
  bool _isCameraReady = false;
  CameraLensDirection _currentLens = CameraLensDirection.front;
  Uint8List? _snappedBytes;
  bool _isCapturing = false;

  // Real GPS State
  LocationResult? _locationResult;
  bool _isLocating = true;

  @override
  void initState() {
    super.initState();
    _snappedBytes = widget.initialPhotoBytes;
    WidgetsBinding.instance.addObserver(this);
    if (_snappedBytes == null) {
      _initializeCamera();
    }
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
      debugPrint('Camera controller init error (will use direct camera capture): $e');
      if (mounted) {
        setState(() {
          _isCameraReady = false;
        });
      }
    }
  }

  Future<void> _toggleCameraLens() async {
    if (_cameras.length < 2) {
      await _handleCapture();
      return;
    }

    final nextLens = _currentLens == CameraLensDirection.front
        ? CameraLensDirection.back
        : CameraLensDirection.front;

    _currentLens = nextLens;
    await _cameraController?.dispose();
    _cameraController = null;
    setState(() => _isCameraReady = false);
    await _initializeCamera();
  }

  // Unified camera capture that works seamlessly across all devices and web
  Future<void> _handleCapture() async {
    if (_isCapturing) return;

    // 1. If camera controller is active, snap via controller
    final controller = _cameraController;
    if (controller != null && controller.value.isInitialized) {
      try {
        setState(() => _isCapturing = true);
        final photo = await controller.takePicture();
        final bytes = await photo.readAsBytes();
        setState(() {
          _snappedBytes = bytes;
          _isCapturing = false;
        });
        widget.onPhotoSnapped?.call();
        widget.onPhotoBytesCaptured?.call(bytes);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✓ Worksite photo captured successfully'),
              duration: Duration(seconds: 1),
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
        return;
      } catch (e) {
        debugPrint('Controller takePicture error: $e');
        setState(() => _isCapturing = false);
      }
    }

    // 2. Direct worksite photo capture (Web HTML5 capture / native picker)
    try {
      setState(() => _isCapturing = true);
      final bytes = await captureWorksitePhoto();
      if (bytes != null) {
        setState(() {
          _snappedBytes = bytes;
          _isCapturing = false;
        });
        widget.onPhotoSnapped?.call();
        widget.onPhotoBytesCaptured?.call(bytes);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✓ Worksite photo captured successfully'),
              duration: Duration(seconds: 1),
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      } else {
        setState(() => _isCapturing = false);
      }
    } catch (e) {
      debugPrint('Direct capture error: $e');
      setState(() => _isCapturing = false);
    }
  }

  void _handleRetake() {
    setState(() {
      _snappedBytes = null;
    });
    widget.onPhotoBytesCaptured?.call(null);
    _fetchLiveLocation();
    _initializeCamera();
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
            // 1. Live Video Feed from Camera OR Captured Photo OR Standby Tap Area
            if (_snappedBytes != null)
              Image.memory(
                _snappedBytes!,
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
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
              GestureDetector(
                onTap: _handleCapture,
                behavior: HitTestBehavior.opaque,
                child: Container(
                  color: const Color(0xFF1E293B),
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Standby circular guide
                        Container(
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white24, width: 2),
                            color: Colors.white.withValues(alpha: 0.05),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.camera_alt_rounded,
                              size: 40,
                              color: Colors.white70,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Live Camera Viewfinder',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Tap anywhere to take worksite photo',
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
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

            // Center Face Alignment Oval Guide (When camera is live and no photo captured)
            if (_isCameraReady && _snappedBytes == null)
              Center(
                child: Container(
                  width: 142,
                  height: 142,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.success,
                      width: 2.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.success.withValues(alpha: 0.3),
                        blurRadius: 14,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                ),
              ),

            // Top HUD Bar: Location on top-left (only when location is on) & Retake / Camera on top-right
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

                  // Top-Right: Retake & Lens Flip / Open Camera
                  Row(
                    children: [
                      if (_snappedBytes != null)
                        InkWell(
                          onTap: _handleRetake,
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.refresh, size: 13, color: Colors.white),
                                SizedBox(width: 4),
                                Text(
                                  'Retake',
                                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                        )
                      else ...[
                        InkWell(
                          onTap: _isCameraReady ? _toggleCameraLens : _handleCapture,
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  _isCameraReady ? Icons.flip_camera_ios : Icons.camera_alt,
                                  size: 13,
                                  color: Colors.white,
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  _isCameraReady
                                      ? (_currentLens == CameraLensDirection.front ? 'Rear' : 'Front')
                                      : 'Camera',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
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

            // Camera Shutter Button (Shown ONLY when camera controller is actively running live feed)
            if (_isCameraReady && _snappedBytes == null)
              Positioned(
                bottom: 56,
                left: 0,
                right: 0,
                child: Center(
                  child: InkWell(
                    onTap: _handleCapture,
                    borderRadius: BorderRadius.circular(25),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.35),
                            blurRadius: 8,
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
                              fontSize: 12,
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
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                const SizedBox(height: 1),
                                Text(
                                  widget.locationAddress,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
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
                    if (hasLocation)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.success.withValues(alpha: 0.4)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check, size: 11, color: AppColors.success),
                            SizedBox(width: 3),
                            Text(
                              'Within Site',
                              style: TextStyle(
                                color: AppColors.success,
                                fontSize: 9.5,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
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
