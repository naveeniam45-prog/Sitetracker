# Sitetrack

A clean, modern worker attendance and worksite tracking application with live photo capture, location verification, and real-time shift tracking.

---

## Features

- **Authentication**: Simple login with username/employee ID and password, remember me, and forgot password options.
- **Live Camera Capture**: Real camera access to snap worksite verification photos during check-in and check-out.
- **Location Verification**: Automatic worksite detection and verification.
- **Exact Time & Shift Tracking**:
  - Live check-in and check-out timestamp recording.
  - Real-time dynamic working hours counter.
  - Accurate worked duration calculation on checkout.
- **Worker Profile**: Displays worker details, assigned site, and dynamically updates with the latest captured worksite photo.
- **Theme Support**: Seamless Dark Mode and Light Mode with theme inheritance.
- **Cross-Platform**: Responsive design optimized for mobile and web screens.

---

## Getting Started

### React (Web)

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`.

---

### Flutter (Mobile / Web)

```bash
# Get Flutter dependencies
flutter pub get

# Run on Chrome / Web
flutter run -d chrome

# Or run web server on port 8080
flutter run -d web-server --web-port 8080
```

---

## Tech Stack

- **Flutter / Dart**: Native mobile & web app
- **React / TypeScript**: Modern web frontend with Tailwind CSS
- **Vite**: Frontend tooling & development server
