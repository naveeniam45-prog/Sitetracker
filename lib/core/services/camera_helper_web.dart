// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use
import 'dart:html' as html;
import 'dart:typed_data';

Future<Uint8List?> captureWorksitePhoto() async {
  try {
    final input = html.FileUploadInputElement()..accept = 'image/*';
    input.setAttribute('capture', 'user');
    input.click();

    await input.onChange.first;
    final files = input.files;
    if (files == null || files.isEmpty) return null;

    final reader = html.FileReader();
    reader.readAsArrayBuffer(files[0]);
    await reader.onLoadEnd.first;

    final result = reader.result;
    if (result is Uint8List) {
      return result;
    } else if (result is ByteBuffer) {
      return result.asUint8List();
    } else if (result is List<int>) {
      return Uint8List.fromList(result);
    }
    return null;
  } catch (e) {
    return null;
  }
}
