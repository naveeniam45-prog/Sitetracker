import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Worker } from '../../types';
import { 
  Users, UserCheck, UserX, Clock, Plus, Search, MoreHorizontal, 
  Phone, Building2, Wrench, RotateCcw, Smartphone
} from 'lucide-react';

interface WorkersViewProps {
  onAddWorker: () => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({ onAddWorker }) => {
  const { workers, sites, setViewMode, switchUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedWorkerDetail, setSelectedWorkerDetail] = useState<Worker | null>(null);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone.includes(searchTerm);
    const matchesSite = siteFilter === 'All' || worker.siteName === siteFilter;
    const matchesRole = roleFilter === 'All' || worker.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || worker.status === statusFilter;
    return matchesSearch && matchesSite && matchesRole && matchesStatus;
  });

  const handleReset = () => {
    setSearchTerm('');
    setSiteFilter('All');
    setRoleFilter('All');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your workforce, assign them to sites and track their attendance.
          </p>
        </div>

        <button
          onClick={onAddWorker}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Worker</span>
        </button>
      </div>

      {/* Stats Cards Row (Page 4 Top) */}
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
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Active Workers</p>
              <p className="text-xl font-extrabold text-slate-900">236</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Inactive Workers</p>
              <p className="text-xl font-extrabold text-slate-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Workers at Site Today</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">213</span>
                <span className="text-[11px] text-emerald-600 font-semibold">86% rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar (Page 4) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
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
            <span className="text-[11px]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Roles</option>
              <option value="Operator">Operator</option>
              <option value="Worker">Worker</option>
              <option value="Technician">Technician</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All</option>
              <option value="Working">Working</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
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

      {/* Workers Table (Page 4 Top) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="py-3 px-3 w-10 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Employee ID</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Current Site</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Tools</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((worker, idx) => (
                <tr 
                  key={worker.id}
                  onClick={() => setSelectedWorkerDetail(worker)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{worker.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                    {worker.employeeId}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {worker.phone}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {worker.role}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {worker.siteName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      worker.status === 'Working'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : worker.status === 'Absent'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : worker.status === 'On Leave'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {worker.toolsAssignedCount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Simulate check-in as this worker"
                        onClick={() => {
                          switchUser(worker.id);
                          setViewMode('worker-mobile');
                        }}
                        className="p-1 rounded hover:bg-blue-50 text-blue-600"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setSelectedWorkerDetail(worker)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredWorkers.length} of 248 workers</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400">‹</button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">3</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">4</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">5</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">31</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400">›</button>
          </div>
        </div>
      </div>

      {/* Worker Profile Detail Modal */}
      {selectedWorkerDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorkerDetail.avatar}
                  alt={selectedWorkerDetail.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedWorkerDetail.name}</h3>
                  <p className="text-xs text-slate-500">{selectedWorkerDetail.role} • {selectedWorkerDetail.employeeId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWorkerDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-800">{selectedWorkerDetail.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-500">Current Assigned Site</span>
                <span className="font-semibold text-slate-800">{selectedWorkerDetail.siteName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-500">Today's Status</span>
                <span className="font-semibold text-emerald-600">{selectedWorkerDetail.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-500">Assigned Power Tools</span>
                <span className="font-bold text-blue-600">{selectedWorkerDetail.toolsAssignedCount} tools</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  switchUser(selectedWorkerDetail.id);
                  setViewMode('worker-mobile');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Worker Check-In App</span>
              </button>
              <button
                onClick={() => setSelectedWorkerDetail(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
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
