import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CameraCapture } from './CameraCapture';
import { 
  MapPin, Calendar, Clock, CheckCircle2, ArrowRight, 
  ChevronRight, LogOut, Check, User as UserIcon,
  Home, Sun, Moon
} from 'lucide-react';

export const WorkerMobileView: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    sites, 
    attendanceRecords,
    checkInWorker, 
    checkOutWorker,
  } = useApp();

  const workerId = currentUser?.id || 'worker-1';
  const workerName = currentUser?.name || 'Raj Kumar';
  const workerRole = currentUser?.role || 'Operator';
  const [selectedSiteId, setSelectedSiteId] = useState(currentUser?.siteId || 'site-1');
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<{ title: string; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  // Dark & Light Mode Toggle (defaults to Dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Real device GPS detection
  const [detectedCoords, setDetectedCoords] = useState<string | null>(null);

  // Live ticking clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setDetectedCoords(`${lat}° N, ${lng}° E`);
        },
        () => {
          setDetectedCoords('10.0159° N, 76.3638° E');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setDetectedCoords('10.0159° N, 76.3638° E');
    }
  }, []);

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Attendance state for today
  const todayRecord = attendanceRecords.find(
    a => (a.workerId === workerId || a.employeeId === currentUser?.employeeId) && a.date === '14 Sep 2026'
  );

  const isCheckedIn = !!(todayRecord && todayRecord.checkInTime && !todayRecord.checkOutTime);
  const isCheckedOut = !!(todayRecord && todayRecord.checkOutTime);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleCheckIn = () => {
    const photoToSave = capturedPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
    checkInWorker(workerId, selectedSite.id, photoToSave, {
      lat: selectedSite.latitude,
      lng: selectedSite.longitude
    });

    setShowSuccessToast({
      title: 'Checked In Successfully!',
      message: `Verified at ${selectedSite.name} at ${formattedTime}`
    });
    setCapturedPhoto(null);

    setTimeout(() => {
      setShowSuccessToast(null);
    }, 4000);
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    const photoToSave = capturedPhoto || todayRecord.checkInPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
    checkOutWorker(todayRecord.id, photoToSave);

    setShowSuccessToast({
      title: 'Checked Out Successfully!',
      message: `Recorded at ${formattedTime}. Shift total logged.`
    });
    setCapturedPhoto(null);

    setTimeout(() => {
      setShowSuccessToast(null);
    }, 4000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start sm:py-6 p-0 sm:px-4 transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Mobile Device Mockup Frame */}
      <div className={`w-full max-w-md min-h-screen sm:min-h-[844px] sm:rounded-[40px] border shadow-2xl overflow-hidden flex flex-col relative transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200/90'
      }`}>
        
        {/* App Header: 3-Pillar SiteTrack Logo + Dark/Light Toggle + LIVE indicator */}
        <div className={`px-5 py-3 flex items-center justify-between border-b shrink-0 transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center gap-2.5">
            {/* 3-Pillar Geometric Brand Logo */}
            <svg width="28" height="30" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
              <rect x="12" y="1" width="7.5" height="28" rx="3" fill="#2563EB" />
              <rect x="23" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
            </svg>
            <div>
              <span className={`font-extrabold text-base tracking-tight block leading-none ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                SiteTrack
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Dark & Light Toggle on Header */}
            <div className={`inline-flex items-center p-0.5 rounded-full border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setIsDarkMode(false)}
                className={`p-1 rounded-full transition-colors ${
                  !isDarkMode ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-white'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsDarkMode(true)}
                className={`p-1 rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-900'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* LIVE pill */}
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 text-[10px] font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE</span>
            </div>
          </div>
        </div>

        {/* Scrollable Main Area: Attendance OR Profile */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
          
          {/* Toast Alert */}
          {showSuccessToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{showSuccessToast.title}</h4>
                <p className="text-[11px] text-emerald-300/90">{showSuccessToast.message}</p>
              </div>
            </div>
          )}

          {activeTab === 'home' ? (
            /* HOME TAB: WORKER ATTENDANCE & TRACKING INSIDE A DEFINED BOX */
            <div className={`border rounded-3xl p-5 space-y-4 shadow-xl ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Greeting & Date Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isCheckedIn ? 'Good Evening,' : 'Good Morning,'}
                  </p>
                  <h2 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {workerName}
                  </h2>
                  <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wide">
                    {workerRole}
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-xs ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>14 Sep 2026 Monday</span>
                </div>
              </div>

              {/* Worksite Selector Banner */}
              <div className={`rounded-2xl p-3.5 border flex items-center justify-between shadow-xs ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="truncate">
                    <h3 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {selectedSite.name}
                    </h3>
                    <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {selectedSite.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSiteModalOpen(true)}
                  className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-0.5 shrink-0 pl-2"
                >
                  <span>Change Site</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Real Live Camera Viewfinder with Webcam Access */}
              <div className="space-y-1.5">
                <CameraCapture
                  onCapture={(dataUrl) => setCapturedPhoto(dataUrl)}
                  capturedImage={capturedPhoto}
                  onRetake={() => setCapturedPhoto(null)}
                  siteName={selectedSite.name}
                  locationAddress={`${selectedSite.location} ${detectedCoords ? `(${detectedCoords})` : ''}`}
                  isWithinSite={true}
                />
              </div>

              {/* Dual Metric Cards (Check In & Total Hours) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className={`border rounded-2xl p-3 flex items-center gap-3 shadow-xs ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      Check In
                    </p>
                    <p className={`text-xs font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {todayRecord?.checkInTime || '08:15 AM'}
                    </p>
                  </div>
                </div>

                <div className={`border rounded-2xl p-3 flex items-center gap-3 shadow-xs ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      Total Hours
                    </p>
                    <p className={`text-xs font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {todayRecord?.workingHours || '9h 50m'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Single Sequential Workflow: Check In -> Next is Check Out only */}
              {!isCheckedIn && !isCheckedOut && (
                /* STATE 1: CHECK IN ONLY */
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-between active:scale-[0.98] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-center flex-1">
                      <span className="tracking-wide">Check In</span>
                      <span className="mx-2 opacity-60">•</span>
                      <span className="font-mono text-sm opacity-95">{formattedTime}</span>
                    </div>
                    <div className="w-8 h-8"></div>
                  </button>
                  <p className="text-center text-[11px] text-slate-400">
                    Live worksite photograph and GPS will be verified automatically
                  </p>
                </div>
              )}

              {isCheckedIn && (
                /* STATE 2: CHECK OUT ONLY (Directly follows Check In) */
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-base shadow-lg shadow-rose-600/25 flex items-center justify-between active:scale-[0.98] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-center flex-1">
                      <span className="tracking-wide">Check Out</span>
                      <span className="mx-2 opacity-60">•</span>
                      <span className="font-mono text-sm opacity-95">{formattedTime}</span>
                    </div>
                    <div className="w-8 h-8"></div>
                  </button>
                  <p className="text-center text-[11px] text-slate-400">
                    Captures shift end photo & logs working hours to attendance records
                  </p>
                </div>
              )}

              {isCheckedOut && (
                /* STATE 3: SHIFT COMPLETED */
                <div className={`border rounded-2xl p-5 text-center space-y-3 shadow-xs ${
                  isDarkMode ? 'bg-slate-950/60 border-emerald-500/40' : 'bg-slate-50 border-emerald-300'
                }`}>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Shift Completed Today
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Check-in: {todayRecord.checkInTime} • Check-out: {todayRecord.checkOutTime}
                    </p>
                    <p className="text-xs font-bold text-emerald-400 mt-1">
                      Total Working Hours: {todayRecord.workingHours || '9h 50m'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleCheckIn();
                    }}
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl text-xs font-bold transition-colors"
                  >
                    Start Next Shift
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* PROFILE TAB: JUST NAME, DETAILS, AND LOG OUT INSIDE A DEFINED BOX */
            <div className={`border rounded-3xl p-6 text-center shadow-xl space-y-5 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Worker Profile
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-extrabold text-[10px] tracking-wide">
                  VERIFIED
                </span>
              </div>

              <div className="w-20 h-20 rounded-full border-4 border-blue-600 mx-auto overflow-hidden shadow-md">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                  alt={workerName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {workerName}
                </h3>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-500/15 text-blue-400 rounded-full text-xs font-bold">
                  {workerRole.toUpperCase()} • {currentUser?.employeeId || 'EMP001'}
                </span>
              </div>

              <div className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-semibold truncate">
                  {selectedSite.name}
                </span>
              </div>

              {/* Clean Prominent Log Out Button INSIDE THE BOX */}
              <button
                onClick={logout}
                className="w-full py-3.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar: Home & Profile */}
        <div className={`border-t py-2 px-6 flex items-center justify-around shrink-0 transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'home' ? 'text-blue-500 font-bold' : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600') + ' font-medium'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'profile' ? 'text-blue-500 font-bold' : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600') + ' font-medium'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>

      {/* Change Site Modal */}
      {isSiteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-3 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200 ${
            isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDarkMode ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className="font-bold text-base">Select Work Site</h3>
              <button 
                onClick={() => setIsSiteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {sites.map(site => (
                <button
                  key={site.id}
                  onClick={() => {
                    setSelectedSiteId(site.id);
                    setIsSiteModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between transition-all ${
                    selectedSiteId === site.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : (isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50')
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm">{site.name}</h4>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{site.location}</p>
                  </div>
                  {selectedSiteId === site.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
