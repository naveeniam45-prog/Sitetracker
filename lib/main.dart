import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/routing/route_names.dart';
import 'core/routing/app_router.dart';
import 'shared/providers/app_state_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SiteTrackApp());
}

class SiteTrackApp extends StatelessWidget {
  const SiteTrackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppStateProvider()),
      ],
      child: MaterialApp(
        title: 'SiteTrack',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        initialRoute: RouteNames.login,
        onGenerateRoute: AppRouter.generateRoute,
      ),
    );
  }
}
