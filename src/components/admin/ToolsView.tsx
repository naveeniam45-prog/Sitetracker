import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tool } from '../../types';
import { 
  Wrench, CheckCircle, Clock, AlertTriangle, Plus, Search, 
  Download, MoreHorizontal, Filter, RotateCcw, ExternalLink
} from 'lucide-react';

interface ToolsViewProps {
  onAddTool: () => void;
  onSelectTool: (toolId: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onAddTool, onSelectTool }) => {
  const { tools, sites } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'category' | 'site' | 'status'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [siteFilter, setSiteFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.toolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter;
    const matchesSite = siteFilter === 'All' || tool.siteName === siteFilter;
    const matchesStatus = statusFilter === 'All' || tool.status === statusFilter;
    return matchesSearch && matchesCategory && matchesSite && matchesStatus;
  });

  const handleReset = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setSiteFilter('All');
    setStatusFilter('All');
  };

  const handleExportCSV = () => {
    const headers = "Tool ID,Tool Name,Category,Variant,Current Site,Assigned To,Status,Serial Number\n";
    const rows = filteredTools.map(t => 
      `"${t.toolId}","${t.name}","${t.category}","${t.variant}","${t.siteName}","${t.assignedWorkerName || 'Unassigned'}","${t.status}","${t.serialNumber}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitetrack-tools-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tools</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and manage all power tools and equipment across your sites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            onClick={onAddTool}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row (Page 4 Bottom) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Tools</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">1,428</span>
                <span className="text-[11px] text-emerald-600 font-semibold">↑ 12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Assigned</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">1,102</span>
                <span className="text-[11px] text-slate-500">77%</span>
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
              <p className="text-[11px] font-medium text-slate-500">Available</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">201</span>
                <span className="text-[11px] text-slate-500">14%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Maintenance</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">78</span>
                <span className="text-[11px] text-slate-500">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Header (Page 4) */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 relative transition-all ${
            activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          All Tools
        </button>
        <button
          onClick={() => setActiveTab('category')}
          className={`pb-3 relative transition-all ${
            activeTab === 'category' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          By Category
        </button>
        <button
          onClick={() => setActiveTab('site')}
          className={`pb-3 relative transition-all ${
            activeTab === 'site' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          By Site
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`pb-3 relative transition-all ${
            activeTab === 'status' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          By Status
        </button>
      </div>

      {/* Filters Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by tool name, ID, serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Demolition Tools">Demolition Tools</option>
              <option value="Drilling Tools">Drilling Tools</option>
              <option value="Grinding Tools">Grinding Tools</option>
              <option value="Cutting Tools">Cutting Tools</option>
              <option value="Power Tools">Power Tools</option>
              <option value="Cleaning Tools">Cleaning Tools</option>
              <option value="Construction Tools">Construction Tools</option>
            </select>
          </div>

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
              <option value="Assigned">Assigned</option>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Lost">Lost</option>
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

      {/* Tools Table (Page 4 Bottom) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="py-3 px-3 w-10 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Tool ID</th>
                <th className="py-3 px-4 font-semibold">Tool Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Variant / Specification</th>
                <th className="py-3 px-4 font-semibold">Current Site</th>
                <th className="py-3 px-4 font-semibold">Assigned To</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTools.map((tool, idx) => (
                <tr 
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-slate-100"
                      />
                      <span className="font-mono font-bold text-blue-600 group-hover:underline">
                        {tool.toolId}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {tool.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {tool.category}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {tool.variant}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {tool.siteName}
                  </td>
                  <td className="py-3 px-4">
                    {tool.assignedWorkerName ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {tool.assignedWorkerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-800">
                          {tool.assignedWorkerName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      tool.status === 'Assigned'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : tool.status === 'Available'
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        : tool.status === 'Maintenance'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {tool.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectTool(tool.id); }}
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

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredTools.length} of 1,428 tools</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400">‹</button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">3</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">4</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">5</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-600">143</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-400">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};
