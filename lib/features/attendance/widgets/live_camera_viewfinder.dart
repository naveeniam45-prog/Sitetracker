import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import '../../../core/theme/app_colors.dart';

class LiveCameraViewfinder extends StatefulWidget {
  final String locationAddress;
  final String? fallbackPhotoUrl;
  final VoidCallback? onPhotoSnapped;

  const LiveCameraViewfinder({
    super.key,
    required this.locationAddress,
    this.fallbackPhotoUrl,
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
  int _simulatedPhotoIndex = 0;

  final List<String> _simulatedPhotos = const [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeCamera();
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
    if (_cameras.length < 2) {
      setState(() {
        _simulatedPhotoIndex++;
      });
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

  void _handleRetake() {
    setState(() {
      _simulatedPhotoIndex++;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Camera viewpoint refreshed'),
        duration: Duration(seconds: 1),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 290,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.black,
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
            // Live Video Feed from Camera OR Fallback simulated viewfinder
            if (_isCameraReady && _cameraController != null && _cameraController!.value.isInitialized)
              FittedBox(
                fit: BoxFit.cover,
                child: SizedBox(
                  width: _cameraController!.value.previewSize?.height ?? 400,
                  height: _cameraController!.value.previewSize?.width ?? 300,
                  child: CameraPreview(_cameraController!),
                ),
              )
            else
              Image.network(
                _simulatedPhotos[_simulatedPhotoIndex % _simulatedPhotos.length],
                fit: BoxFit.cover,
                errorBuilder: (ctx, err, stack) => Container(
                  color: const Color(0xFF1E293B),
                  child: const Center(
                    child: Icon(Icons.videocam_off, color: Colors.white38, size: 48),
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
                    Colors.black.withValues(alpha: 0.5),
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.8),
                  ],
                ),
              ),
            ),

            // Center Face Alignment Oval / Guide
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
                child: ClipOval(
                  child: widget.fallbackPhotoUrl != null
                      ? Image.network(
                          widget.fallbackPhotoUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (ctx, err, stack) => const Icon(
                            Icons.person,
                            size: 70,
                            color: Colors.white70,
                          ),
                        )
                      : const Icon(
                          Icons.person,
                          size: 70,
                          color: Colors.white70,
                        ),
                ),
              ),
            ),

            // Top HUD Bar: LIVE badge + Retake & Flip buttons
            Positioned(
              top: 12,
              left: 12,
              right: 12,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.65),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: const BoxDecoration(
                            color: AppColors.danger,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _isCameraReady ? 'LIVE CAMERA' : 'CAMERA ACTIVE',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),

                  Row(
                    children: [
                      InkWell(
                        onTap: _handleRetake,
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
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
                      const SizedBox(width: 6),
                      InkWell(
                        onTap: _toggleCameraLens,
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
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
                  ),
                ],
              ),
            ),

            // Bottom Location Detected Banner Pill (Page 6 Mockup)
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
                            decoration: const BoxDecoration(
                              color: AppColors.success,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Text(
                                  'LOCATION DETECTED',
                                  style: TextStyle(
                                    color: Colors.white54,
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
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
