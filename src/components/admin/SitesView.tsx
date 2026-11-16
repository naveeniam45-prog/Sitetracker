import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Site } from '../../types';
import { 
  Building2, MapPin, Plus, Search, MoreHorizontal, CheckCircle2, 
  XCircle, Filter, Users, Wrench, Shield, Check
} from 'lucide-react';

interface SitesViewProps {
  onAddSite: () => void;
}

export const SitesView: React.FC<SitesViewProps> = ({ onAddSite }) => {
  const { sites } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedSiteForDetail, setSelectedSiteForDetail] = useState<Site | null>(null);

  const filteredSites = sites
    .filter((site) => {
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            site.siteManager.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || site.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'workers-desc') return b.workersPresent - a.workersPresent;
      if (sortBy === 'tools-desc') return b.toolsCount - a.toolsCount;
      return 0;
    });

  const activeCount = sites.filter(s => s.status === 'Active').length;
  const inactiveCount = sites.filter(s => s.status === 'Inactive').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sites</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your construction sites and view workforce and tools at each location.
          </p>
        </div>

        <button
          onClick={onAddSite}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Site</span>
        </button>
      </div>

      {/* Stats Cards Row (Page 3 Mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Sites</p>
              <p className="text-xl font-extrabold text-slate-900">28</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Active Sites</p>
              <p className="text-xl font-extrabold text-slate-900">{activeCount + 20}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Inactive Sites</p>
              <p className="text-xl font-extrabold text-slate-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Workers</p>
              <p className="text-xl font-extrabold text-slate-900">248</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 text-slate-500">
            <span className="text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span className="text-[11px]">State:</span>
            <select className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
              <option value="All">All</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span className="text-[11px]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="name-asc">Name (A - Z)</option>
              <option value="workers-desc">Most Workers</option>
              <option value="tools-desc">Most Tools</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Site Name</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Site Manager</th>
                <th className="py-3 px-4 font-semibold">Workers (Present / Total)</th>
                <th className="py-3 px-4 font-semibold">Tools Total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSites.map((site, idx) => (
                <tr 
                  key={site.id} 
                  onClick={() => setSelectedSiteForDetail(site)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">
                      {site.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Geofence: {site.radiusMeters}m radius
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{site.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                        {site.siteManagerInitials}
                      </div>
                      <span className="font-medium text-slate-800">{site.siteManager}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    <span className="text-emerald-600">{site.workersPresent}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-slate-700">{site.workersTotal}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {site.toolsCount}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      site.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedSiteForDetail(site); }}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer (Page 3) */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredSites.length} of 28 sites</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">‹</button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">3</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">4</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">5</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">›</button>
          </div>
        </div>
      </div>

      {/* Site Detail Drawer Modal */}
      {selectedSiteForDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedSiteForDetail.name}</h3>
                <p className="text-xs text-slate-500">{selectedSiteForDetail.location}</p>
              </div>
              <button 
                onClick={() => setSelectedSiteForDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="text-slate-500 block">Site Manager</span>
                <span className="font-bold text-slate-800">{selectedSiteForDetail.siteManager}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="text-slate-500 block">Status</span>
                <span className="font-bold text-emerald-600">{selectedSiteForDetail.status}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="text-slate-500 block">Workers On Site</span>
                <span className="font-bold text-slate-800">{selectedSiteForDetail.workersPresent} / {selectedSiteForDetail.workersTotal}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border">
                <span className="text-slate-500 block">Allocated Tools</span>
                <span className="font-bold text-slate-800">{selectedSiteForDetail.toolsCount} items</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold block">GPS Geofence Perimeter:</span>
              <p className="text-[11px] text-blue-800">
                Lat: {selectedSiteForDetail.latitude}, Lng: {selectedSiteForDetail.longitude} (Radius: {selectedSiteForDetail.radiusMeters}m).
                Mobile check-ins from workers are verified within this radius.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedSiteForDetail(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
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
