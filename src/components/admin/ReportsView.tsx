import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, Download, Calendar, FileText, CheckCircle2, 
  Wrench, Users, Building2, ArrowRightLeft, TrendingUp
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { tools, workers, sites, attendanceRecords } = useApp();
  const [reportType, setReportType] = useState<'attendance' | 'inventory' | 'movement' | 'utilization'>('attendance');

  const exportAllData = () => {
    const summary = {
      generatedAt: new Date().toISOString(),
      totalSites: sites.length,
      totalWorkers: workers.length,
      totalTools: tools.length,
      todayAttendanceRate: '86%',
      toolsAssignedRate: '77%',
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitetrack-operations-report-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate audit trails, attendance logs and tool movement statistics.
          </p>
        </div>

        <button
          onClick={exportAllData}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Comprehensive Report</span>
        </button>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setReportType('attendance')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            reportType === 'attendance'
              ? 'bg-blue-50/70 border-blue-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Attendance Log</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Daily check-in/out timestamps & photos</p>
        </button>

        <button
          onClick={() => setReportType('inventory')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            reportType === 'inventory'
              ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <Wrench className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Tool Inventory</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Asset registers, variants & health status</p>
        </button>

        <button
          onClick={() => setReportType('movement')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            reportType === 'movement'
              ? 'bg-purple-50/70 border-purple-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Movement History</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Transfers between sites and workers</p>
        </button>

        <button
          onClick={() => setReportType('utilization')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            reportType === 'utilization'
              ? 'bg-amber-50/70 border-amber-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Asset Utilization</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Days on site, idle time & ROI</p>
        </button>
      </div>

      {/* Report Preview Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 capitalize">
              {reportType} Summary Overview
            </h3>
          </div>
          <span className="text-xs text-slate-400">Generated: 14 Sep 2026</span>
        </div>

        {reportType === 'attendance' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-500 block">Total Work Shift Hours Logged</span>
                <span className="text-base font-bold text-slate-900">1,820 hrs</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-500 block">Average Punctuality</span>
                <span className="text-base font-bold text-emerald-600">98.4%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-500 block">GPS Geofence Match Rate</span>
                <span className="text-base font-bold text-blue-600">100% Verified</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Attendance records show 213 workers present today across all 28 sites. Check-ins are strictly validated using real-time worksite photographs and device GPS coordinates.
            </p>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-500 block">Active Equipment Assets</span>
                <span className="text-base font-bold text-slate-900">1,428 tools</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-500 block">Equipment Availability</span>
                <span className="text-base font-bold text-cyan-600">201 Available</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <span className="text-slate-500 block">Under Maintenance</span>
                <span className="text-base font-bold text-amber-600">78 Tools (5%)</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Demolition tools and Drilling equipment make up 62% of all heavy machinery deployed. All tools have unique QR codes for instant mobile inspection.
            </p>
          </div>
        )}

        {reportType === 'movement' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Inter-site transfers this month: 48 tools successfully relocated with zero lost asset incidents.
            </p>
          </div>
        )}

        {reportType === 'utilization' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Average tool deployment duration is 18.4 days per site before maintenance check.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
