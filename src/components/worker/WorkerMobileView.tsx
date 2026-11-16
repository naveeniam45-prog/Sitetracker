import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CameraCapture } from './CameraCapture';
import { 
  HardHat, MapPin, Calendar, Clock, CheckCircle2, ArrowRight, 
  ChevronRight, Wrench, Shield, LogOut, Check, X, Bell, User as UserIcon,
  RefreshCw, Sparkles, AlertTriangle
} from 'lucide-react';

export const WorkerMobileView: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setViewMode, 
    sites, 
    tools,
    attendanceRecords,
    checkInWorker, 
    checkOutWorker,
    handoverRequests,
    acceptHandover,
    declineHandover
  } = useApp();

  const workerId = currentUser?.id || 'worker-1';
  const workerName = currentUser?.name || 'Raj Kumar';
  const workerRole = currentUser?.role || 'Operator';
  const [selectedSiteId, setSelectedSiteId] = useState(currentUser?.siteId || 'site-1');
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'tools' | 'history'>('attendance');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<{ title: string; message: string } | null>(null);

  // Time & Timer state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Find worker's current attendance today
  const todayRecord = attendanceRecords.find(
    a => (a.workerId === workerId || a.employeeId === currentUser?.employeeId) && a.date === '14 Sep 2026'
  );

  const isCheckedIn = !!(todayRecord && todayRecord.checkInTime && !todayRecord.checkOutTime);
  const isCheckedOut = !!(todayRecord && todayRecord.checkOutTime);

  // Tools assigned to this worker
  const myAssignedTools = tools.filter(
    t => t.assignedWorkerId === workerId || t.assignedWorkerName === workerName
  );

  // Pending handovers to this worker
  const myPendingHandovers = handoverRequests.filter(
    h => (h.toWorkerId === workerId || h.toWorkerName === workerName) && h.status === 'Pending'
  );

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleCheckIn = () => {
    // Generate snapshot or use captured photo
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
    }, 4500);
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
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start sm:py-6 p-0 sm:px-4">
      {/* Top Bar for Desktop Preview controls */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between pb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-300">SiteTrack Worker Check-In App</span>
        </div>
      </div>

      {/* Mobile Device Mockup Frame matching page 6 */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-slate-900 sm:rounded-[44px] border sm:border-slate-700/80 shadow-2xl overflow-hidden flex flex-col relative text-white">
        
        {/* iOS style notch/status bar */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-300 shrink-0 select-none">
          <span>9:41</span>
          <div className="w-24 h-4 bg-black/60 rounded-full mx-auto hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-slate-300 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* App Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">
                SiteTrack
              </span>
              <span className="text-[8px] uppercase tracking-widest text-blue-300 font-semibold">
                TOOLS. PEOPLE. PROGRESS.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('tools')}
              className="relative p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
              title="Assigned Tools & Handover"
            >
              <Wrench className="w-4 h-4" />
              {myPendingHandovers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black font-extrabold text-[9px] rounded-full flex items-center justify-center animate-bounce">
                  {myPendingHandovers.length}
                </span>
              )}
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch header pills */}
        <div className="px-5 pt-3 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all relative ${
              activeTab === 'tools'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tools & Handover
            {myPendingHandovers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-bold">
                {myPendingHandovers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            History
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          
          {/* Toast Alert */}
          {showSuccessToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{showSuccessToast.title}</h4>
                <p className="text-[11px] text-emerald-200/90">{showSuccessToast.message}</p>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <>
              {/* Greeting & Date Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isCheckedIn ? 'Good Evening,' : 'Good Morning,'}{' '}
                    <span className="text-blue-400">{workerName}</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium capitalize">
                    {workerRole}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>14 Sep 2026 Monday</span>
                </div>
              </div>

              {/* Worksite Selector Banner */}
              <div className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/80 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {selectedSite.name}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                        Active Site
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {selectedSite.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSiteModalOpen(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 shrink-0 pl-2"
                >
                  <span>Change Site</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Live Worksite Photograph / Camera Viewfinder */}
              <div className="space-y-1.5">
                <CameraCapture
                  onCapture={(dataUrl) => setCapturedPhoto(dataUrl)}
                  capturedImage={capturedPhoto || (isCheckedIn ? todayRecord?.checkInPhoto || null : null)}
                  onRetake={() => setCapturedPhoto(null)}
                  siteName={selectedSite.name}
                  locationAddress={selectedSite.location}
                  isWithinSite={true}
                />
              </div>

              {/* Action Section: Check In VS Check Out (Matching Page 6 Mockups) */}
              {!isCheckedIn && !isCheckedOut && (
                /* STATE 1: CHECK IN SCREEN */
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-full font-bold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-between active:scale-[0.98] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-center flex-1">
                      <span className="tracking-wide">Check In</span>
                      <span className="mx-2 opacity-60">•</span>
                      <span className="font-mono text-sm opacity-95">{formattedTime}</span>
                    </div>
                    <div className="w-9 h-9"></div>
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Live worksite photograph and GPS will be verified automatically
                  </p>
                </div>
              )}

              {isCheckedIn && (
                /* STATE 2: CHECK OUT SCREEN */
                <div className="space-y-3 pt-1">
                  {/* Status Metric Cards: Check In Time + Working Hours */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Check In
                        </p>
                        <p className="text-xs font-bold text-white">
                          {todayRecord?.checkInTime || '08:15 AM'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Total Hours
                        </p>
                        <p className="text-xs font-bold text-white">
                          9h 50m
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Red Check Out Button */}
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full font-bold text-base shadow-xl shadow-rose-600/30 flex items-center justify-between active:scale-[0.98] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-center flex-1">
                      <span className="tracking-wide">Check Out</span>
                      <span className="mx-2 opacity-60">•</span>
                      <span className="font-mono text-sm opacity-95">{formattedTime}</span>
                    </div>
                    <div className="w-9 h-9"></div>
                  </button>
                  <p className="text-center text-[11px] text-slate-400">
                    Captures shift end photo & logs working hours to Admin Attendance
                  </p>
                </div>
              )}

              {isCheckedOut && (
                /* STATE 3: SHIFT COMPLETED */
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Shift Completed Today</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Check-in: {todayRecord.checkInTime} • Check-out: {todayRecord.checkOutTime}
                    </p>
                    <p className="text-xs font-bold text-emerald-400 mt-1">
                      Total Working Hours: {todayRecord.workingHours || '9h 14m'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Reset for demo purposes
                      handleCheckIn();
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 underline font-medium pt-1"
                  >
                    Demo Check-In Again
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'tools' && (
            /* WORKER TOOLS & HANDOVER ACCEPTANCE TAB (PDF Page 2 & 5) */
            <div className="space-y-4">
              {/* Handover Requests Alert */}
              {myPendingHandovers.length > 0 ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span>Tool Handover Request Waiting</span>
                  </div>

                  {myPendingHandovers.map((req) => (
                    <div key={req.id} className="bg-slate-800 rounded-xl p-3.5 border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{req.toolName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                          Asset ID: {req.toolId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Handover initiated by <span className="text-slate-200 font-semibold">{req.fromWorkerName}</span> for work at {req.siteName}.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => acceptHandover(req.id)}
                          className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Tool</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => declineHandover(req.id)}
                          className="py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-xs flex items-center justify-center transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-800/60 rounded-xl text-center text-xs text-slate-400">
                  No pending handover requests
                </div>
              )}

              {/* Currently Assigned Tools */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  My Assigned Tools ({myAssignedTools.length})
                </h3>
                <div className="space-y-2.5">
                  {myAssignedTools.map((t) => (
                    <div
                      key={t.id}
                      className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 flex items-center gap-3.5"
                    >
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{t.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                            {t.toolId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {t.variant} • {t.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                            Condition: {t.condition}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Serial: {t.serialNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            /* ATTENDANCE HISTORY TAB */
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recent Attendance Logs
              </h3>

              {attendanceRecords
                .filter(a => a.workerId === workerId || a.employeeId === currentUser?.employeeId)
                .map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rec.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        {rec.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Check-in</span>
                        <span className="font-semibold">{rec.checkInTime || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Check-out</span>
                        <span className="font-semibold">{rec.checkOutTime || 'In Progress'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Working Hours</span>
                        <span className="font-bold text-blue-400">{rec.workingHours || '—'}</span>
                      </div>
                    </div>

                    {rec.checkInPhoto && (
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
                        <img
                          src={rec.checkInPhoto}
                          alt="Check-in verification"
                          className="w-8 h-8 rounded-lg object-cover border border-slate-600"
                        />
                        <span className="text-[10px] text-slate-400">
                          Live photo & GPS verified ({rec.siteName})
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Bottom Site Selector Modal */}
        {isSiteModalOpen && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end p-4 animate-in fade-in duration-200">
            <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-4 max-h-[80%] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Select Work Site</h3>
                  <p className="text-xs text-slate-400">Choose site to verify check-in location</p>
                </div>
                <button
                  onClick={() => setIsSiteModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {sites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      setSelectedSiteId(site.id);
                      setIsSiteModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      selectedSiteId === site.id
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {site.name}
                        {selectedSiteId === site.id && (
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{site.location}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Manager: {site.siteManager} • {site.workersPresent} workers present
                      </p>
                    </div>
                    {selectedSiteId === site.id && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
