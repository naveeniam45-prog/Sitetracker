import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, CheckCircle2, Building2, Wrench, ChevronRight, Plus, 
  ArrowUpRight, Clock, AlertTriangle, Calendar, ChevronDown, Check,
  UserPlus, PlusCircle
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddModal: (type: 'worker' | 'site' | 'tool') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddModal }) => {
  const { 
    sites, 
    workers, 
    tools, 
    attendanceRecords, 
    recentActivities, 
    setActiveAdminTab, 
    setSelectedToolId 
  } = useApp();

  const [showAddMenu, setShowAddMenu] = useState(false);

  // Computed metrics
  const totalWorkers = 248;
  const presentCount = attendanceRecords.filter(a => a.status === 'Present' || a.status === 'Working').length + 204;
  const absentCount = 35;
  const workingCount = 197;
  const attendanceRate = Math.round((presentCount / totalWorkers) * 100);

  const totalTools = 1428;
  const assignedTools = 1102;
  const availableTools = 201;
  const maintenanceTools = 78;
  const lostTools = 12;

  const activeSites = sites.filter(s => s.status === 'Active');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, Admin
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Here's what's happening at your sites today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Sunday, 14 September 2026</span>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
              Today
            </span>
          </div>

          <div className="hidden lg:flex items-center px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
            People. Tools. Progress.
          </div>
        </div>
      </div>

      {/* KPI Cards Row (4 cards matching Page 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workers */}
        <div 
          onClick={() => setActiveAdminTab('workers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Workers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalWorkers}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              ↑ 12% <span className="text-slate-400 ml-1 font-normal">from last month</span>
            </span>
          </div>
        </div>

        {/* Present Today */}
        <div 
          onClick={() => setActiveAdminTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Present Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{presentCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600">
              {attendanceRate}% <span className="text-slate-400 font-normal">attendance rate</span>
            </span>
          </div>
        </div>

        {/* Active Sites */}
        <div 
          onClick={() => setActiveAdminTab('sites')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Sites</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">28</span>
            <span className="text-[11px] font-medium text-slate-500">
              3 inactive sites
            </span>
          </div>
        </div>

        {/* Total Tools */}
        <div 
          onClick={() => setActiveAdminTab('tools')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Tools</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">1,428</span>
            <span className="text-[11px] font-semibold text-blue-600">
              {availableTools} <span className="text-slate-400 font-normal">available</span>
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Today's Attendance & Tool Status Donut Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Attendance Visualizer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Today's Attendance</h3>
            <button
              onClick={() => setActiveAdminTab('attendance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-4">
            {/* Donut graphic */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="86 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900">86%</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Present</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600 font-medium">Present</span>
                </div>
                <span className="font-bold text-slate-900">{presentCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-slate-600 font-medium">Absent</span>
                </div>
                <span className="font-bold text-slate-900">{absentCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span className="text-slate-600 font-medium">Working (Not checked out)</span>
                </div>
                <span className="font-bold text-slate-900">{workingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Status Visualizer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Tool Status</h3>
            <button
              onClick={() => setActiveAdminTab('tools')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-4">
            {/* Donut graphic */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="77 100"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  strokeDasharray="14 100"
                  strokeDashoffset="-77"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-extrabold text-slate-900">1,428</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Tools</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600 font-medium">Assigned</span>
                </div>
                <span className="font-bold text-slate-900">{assignedTools}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span className="text-slate-600 font-medium">Available</span>
                </div>
                <span className="font-bold text-slate-900">{availableTools}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600 font-medium">Maintenance</span>
                </div>
                <span className="font-bold text-slate-900">{maintenanceTools}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-600 font-medium">Lost</span>
                </div>
                <span className="font-bold text-slate-900">{lostTools}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Center */}
        <div className="bg-gradient-to-br from-slate-900 to-navy-900 p-5 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Operations Center</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                Quick Actions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Dispatch tools, provision workers, or configure geo-fenced site perimeters.
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <button
              onClick={() => onOpenAddModal('worker')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-between transition-colors border border-slate-700"
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Add Worker</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onOpenAddModal('site')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-between transition-colors border border-slate-700"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Add Site</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onOpenAddModal('tool')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-between transition-colors border border-slate-700"
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Add Tool</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveAdminTab('attendance')}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-600/30"
            >
              <span>View Attendance Register</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Active Sites Table & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Sites Summary Table (2 columns width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Active Sites</h3>
              <p className="text-xs text-slate-500">Live workforce and equipment deployed</p>
            </div>
            <button
              onClick={() => setActiveAdminTab('sites')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Site Name</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Workers (Present / Total)</th>
                  <th className="py-3 px-4 font-semibold">Tools</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeSites.slice(0, 4).map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {site.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {site.location.split(',')[0]}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="text-emerald-600">{site.workersPresent}</span> / {site.workersTotal}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {site.toolsCount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {site.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setActiveAdminTab('sites')}
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Stream (1 column width) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
              <button
                onClick={() => setActiveAdminTab('reports')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {recentActivities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                    act.type === 'checkin' ? 'bg-emerald-50 text-emerald-600' :
                    act.type === 'checkout' ? 'bg-blue-50 text-blue-600' :
                    act.type === 'movement' ? 'bg-purple-50 text-purple-600' :
                    act.type === 'maintenance' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {act.type === 'checkin' && <CheckCircle2 className="w-4 h-4" />}
                    {act.type === 'checkout' && <Clock className="w-4 h-4" />}
                    {act.type === 'movement' && <Wrench className="w-4 h-4" />}
                    {act.type === 'maintenance' && <AlertTriangle className="w-4 h-4" />}
                    {act.type === 'worker' && <Users className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
