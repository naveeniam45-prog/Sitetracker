import 'package:flutter_test/flutter_test.dart';
import 'package:sitetrack/main.dart';

void main() {
  testWidgets('Sitetrack app launches test', (WidgetTester tester) async {
    await tester.pumpWidget(const SiteTrackApp());
    expect(find.text('Sitetrack'), findsWidgets);
  });
}
