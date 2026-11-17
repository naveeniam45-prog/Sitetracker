import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CameraCapture } from './CameraCapture';
import { 
  MapPin, Calendar, Clock, CheckCircle2, ArrowRight, 
  ChevronRight, LogOut, Check
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

  // Live ticking clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:py-6 p-0 sm:px-4">
      {/* Mobile Device Mockup Frame matching page 6 */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-slate-50 sm:rounded-[40px] border sm:border-slate-200/90 shadow-2xl overflow-hidden flex flex-col relative text-slate-900">
        
        {/* App Header with 3-Pillar SiteTrack Logo from PDF Page 6 */}
        <div className="px-5 py-3 flex items-center justify-between bg-white border-b border-slate-200/90 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* 3-Pillar Geometric Brand Logo */}
            <svg width="28" height="30" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
              <rect x="12" y="1" width="7.5" height="28" rx="3" fill="#2563EB" />
              <rect x="23" y="4" width="7.5" height="20" rx="3" fill="#2563EB" />
            </svg>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">
                SiteTrack
              </span>
              <span className="text-[8px] uppercase tracking-widest text-blue-600 font-bold">
                TOOLS. PEOPLE. PROGRESS.
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
          
          {/* Toast Alert */}
          {showSuccessToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{showSuccessToast.title}</h4>
                <p className="text-[11px] text-emerald-700">{showSuccessToast.message}</p>
              </div>
            </div>
          )}

          {/* Greeting & Date Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {isCheckedIn ? 'Good Evening,' : 'Good Morning,'}
              </p>
              <h2 className="text-lg font-extrabold text-slate-900">
                {workerName}
              </h2>
              <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wide">
                {workerRole}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>14 Sep 2026 Monday</span>
            </div>
          </div>

          {/* Worksite Selector Banner */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {selectedSite.name}
                </h3>
                <p className="text-[11px] text-slate-500 truncate">
                  {selectedSite.location}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSiteModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 shrink-0 pl-2"
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
              locationAddress={selectedSite.location}
              isWithinSite={true}
            />
          </div>

          {/* Dual Metric Cards (Check In & Total Hours) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Check In
                </p>
                <p className="text-xs font-extrabold text-slate-900">
                  {todayRecord?.checkInTime || '08:15 AM'}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Total Hours
                </p>
                <p className="text-xs font-extrabold text-slate-900">
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
            <div className="bg-white border border-emerald-300 rounded-3xl p-5 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Shift Completed Today</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check-in: {todayRecord.checkInTime} • Check-out: {todayRecord.checkOutTime}
                </p>
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  Total Working Hours: {todayRecord.workingHours || '9h 50m'}
                </p>
              </div>
              <button
                onClick={() => {
                  handleCheckIn();
                }}
                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
              >
                Start Next Shift / Demo Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Site Modal */}
      {isSiteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-3 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Select Work Site</h3>
              <button 
                onClick={() => setIsSiteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
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
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{site.name}</h4>
                    <p className="text-xs text-slate-500">{site.location}</p>
                  </div>
                  {selectedSiteId === site.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
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
