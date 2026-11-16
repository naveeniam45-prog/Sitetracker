import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import { 
  Users, CheckCircle2, Clock, XCircle, Search, Download, 
  RotateCcw, MapPin, Camera, Check, ExternalLink, Calendar,
  MoreHorizontal, Smartphone
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { attendanceRecords, sites, setViewMode, switchUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPhotoRecord, setSelectedPhotoRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = attendanceRecords.filter((rec) => {
    const matchesSearch = 
      rec.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = siteFilter === 'All' || rec.siteName === siteFilter;
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesSite && matchesStatus;
  });

  const handleReset = () => {
    setSearchTerm('');
    setSiteFilter('All');
    setStatusFilter('All');
  };

  const handleExportCSV = () => {
    const headers = "Worker,Employee ID,Site,Check In,Check Out,Working Hours,Status,Location Verified\n";
    const rows = filteredRecords.map(r => 
      `"${r.workerName}","${r.employeeId}","${r.siteName}","${r.checkInTime || '—'}","${r.checkOutTime || '—'}","${r.workingHours || '—'}","${r.status}","${r.locationVerified ? 'Yes' : 'No'}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitetrack-attendance-14sep2026.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily attendance, check-in/out time and site presence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>14 Sep 2026 (Today)</span>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row (Page 6 Top) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Workers</p>
              <p className="text-xl font-extrabold text-slate-900">248</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Present</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">213</span>
                <span className="text-[11px] text-emerald-600 font-semibold">86%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Working (Checked In)</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">197</span>
                <span className="text-[11px] text-cyan-600 font-semibold">79%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Absent</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">35</span>
                <span className="text-[11px] text-rose-600 font-semibold">14%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by worker name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="text-[11px]">Site:</span>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Sites</option>
              {sites.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Working">Working</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Attendance Records Table (Page 6 Top) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-10 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Worker</th>
                <th className="py-3 px-4 font-semibold">Employee ID</th>
                <th className="py-3 px-4 font-semibold">Site</th>
                <th className="py-3 px-4 font-semibold">Check In</th>
                <th className="py-3 px-4 font-semibold">Check Out</th>
                <th className="py-3 px-4 font-semibold">Working Hours</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Verification Photo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec, idx) => (
                <tr 
                  key={rec.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-3 font-medium text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rec.workerAvatar}
                        alt={rec.workerName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{rec.workerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                    {rec.employeeId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    {rec.siteName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {rec.checkInTime || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {rec.checkOutTime || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {rec.workingHours || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      rec.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : rec.status === 'Working'
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {rec.checkInPhoto ? (
                      <button
                        onClick={() => setSelectedPhotoRecord(rec)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-[11px] font-semibold transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Photo</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No Photo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredRecords.length} of 248 workers</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400">‹</button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">3</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">4</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">5</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">25</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400">›</button>
          </div>
        </div>
      </div>

      {/* Verification Photo Modal */}
      {selectedPhotoRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Worksite Check-In Verification
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPhotoRecord.workerName} ({selectedPhotoRecord.employeeId})
                </p>
              </div>
              <button 
                onClick={() => setSelectedPhotoRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Photo */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative">
              <img
                src={selectedPhotoRecord.checkInPhoto}
                alt="Captured at worksite"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md rounded-xl p-2 text-white text-[11px] flex items-center justify-between">
                <span>Timestamp: {selectedPhotoRecord.checkInTime}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> GPS Verified
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Worksite</span>
                <span className="font-bold text-slate-800">{selectedPhotoRecord.siteName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">GPS Coordinates</span>
                <span className="font-mono text-slate-700">
                  {selectedPhotoRecord.latitude || '10.0159'}° N, {selectedPhotoRecord.longitude || '76.3638'}° E
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600">{selectedPhotoRecord.status}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPhotoRecord(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
