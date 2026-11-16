# SiteTrack — Construction Worksite, Workforce & Asset Management Platform

An enterprise platform inspired by **SiteTrack** (by Heapvue) for centralized tracking of construction work sites, workers, power tools, tool handovers, and attendance with live mobile check-in/out verification.

---

## 🌟 Key Features & PDF Implementation

### 1. 🔐 Authentication & Role-Based Entry
- **Worker Login**: Logging in with employee credentials (e.g. `EMP001` or `raj.kumar`, password `password123`) takes you **straight to the Worker Mobile Check-In / Check-Out screen** (as specified in the PDF's last page).
- **Admin Login**: Logging in with `admin` / `password123` opens the full operational command center.
- **One-Click Quick Logins**: Provided on the sign-in screen for instant testing.
- **Instant Role Switcher**: Floating pill at the bottom right allows toggling between Worker Mobile View and Admin Dashboard anytime.

---

### 2. 📱 Worker Check-In / Check-Out (Page 6 of PDF)
- **Status & Top Bar**: Exact iOS status bar, worker greeting (*"Good Morning, Raj Kumar - Operator"*), and date pill (*"14 Sep 2026 Monday"*).
- **Assigned Worksite Card**: Shows *Kochi Project (Infopark, Kakkanad, Kochi, Kerala)* with an interactive **Change Site >** picker.
- **Live Worksite Photograph / Camera**:
  - Direct integration with device webcam via `navigator.mediaDevices.getUserMedia` with fallback simulated construction feed.
  - Viewfinder overlay with alignment guidelines.
  - Top controls: **Snap Photo**, **Retake**, and **Switch Camera** (front/rear).
  - Bottom Location Pill: **"Location detected: Infopark, Kakkanad, Kochi, Kerala • Within Site ✓"**.
- **Check-In Flow**:
  - Big green button: `Check In • [Current Time] →`.
  - Captures live worksite photo, verifies GPS coordinates, logs server timestamp, updates database.
- **Check-Out Flow**:
  - Greeting transitions to *"Good Evening, Raj Kumar"*.
  - Metric summary cards: Check-In time (e.g. `08:15 AM`) & Live Total Hours worked (e.g. `9h 50m`).
  - Big red button: `Check Out • [Current Time] →`.
  - Calculates working hours and syncs with the Admin Attendance Register.
- **Tool Handover Acceptance Tab** (Page 2 & 5 of PDF):
  - Workers receive pending handover requests (e.g., `GM-002 Gilty Machine`).
  - Reviews and clicks **Accept Tool** or **Decline** directly inside the app, recording acceptance date, time, and worker ID.
- **Attendance History**: Past check-in/out records with captured photos and timestamps.

---

### 3. 🛡️ Admin Dashboard (Pages 3, 4, 5, 6 of PDF)
- **Central Overview (Page 3)**:
  - 4 Key KPI cards: Total Workers (248), Present Today (213 / 86%), Active Sites (28), Total Tools (1,428).
  - Donut Visualizers: Today's Attendance breakdown & Tool Status (Assigned, Available, Maintenance, Lost).
  - Operations Center quick actions (`+ Add Worker`, `+ Add Site`, `+ Add Tool`, `View Attendance`).
  - Active Sites summary table & Live Recent Activity stream.
- **Site Management (Page 3 bottom)**:
  - Multi-site registry with managers, active worker counts, allocated tools, and geofence radius.
  - Interactive Add Site modal with GPS coordinate configuration.
- **Worker Management (Page 4 top)**:
  - Workforce list with employee IDs (`EMP001` - `EMP010`), phone numbers, roles, site assignments, status badges, and tool counts.
  - One-click button to simulate check-in as any worker.
- **Tool Inventory (Page 4 bottom)**:
  - Detailed asset table with thumbnails, categories (Demolition, Drilling, Grinding, Cutting, etc.), variants (`10 KG`, `750W`, `5 Inch`, `14 Inch`), current site, assigned worker, and status.
  - Search, filter by category/site/status, and CSV export.
- **Tool Details & Movement (Page 5)**:
  - Drill-down view for assets like `GM-001 Gilty Machine (10 KG)`.
  - Barcode / QR Code generator with printable and downloadable asset tags.
  - Move Tool modal to relocate equipment between sites/workers and initiate handover.
  - Complete Movement History audit trail.
- **Attendance Management (Page 6 top)**:
  - Real-time daily attendance register with check-in, check-out, working hours, and status.
  - **View Photo Modal**: Click any worker's record to inspect their verified live worksite photograph and GPS coordinates.
- **Reports & History (Page 2)**:
  - Summary views and one-click JSON/CSV exports.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open your browser at [http://localhost:5173/](http://localhost:5173/).

### Demo Credentials:
- **Worker (Raj Kumar)**:
  - Username: `EMP001` or `raj.kumar`
  - Password: `password123`
- **Admin (Operations Manager)**:
  - Username: `admin`
  - Password: `password123`
