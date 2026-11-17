import 'dart:typed_data';
import 'package:image_picker/image_picker.dart';

Future<Uint8List?> captureWorksitePhoto() async {
  try {
    final picker = ImagePicker();
    final photo = await picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
      maxWidth: 1280,
      maxHeight: 1280,
      imageQuality: 85,
    );
    if (photo != null) {
      return await photo.readAsBytes();
    }
    return null;
  } catch (e) {
    return null;
  }
}
