import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, QrCode, Edit, ArrowRightLeft, AlertTriangle, 
  Trash2, Download, Building2, User, Calendar, Clock, 
  CheckCircle2, Plus, Wrench, MoreHorizontal, ChevronRight, X
} from 'lucide-react';

interface ToolDetailViewProps {
  toolId: string;
  onBack: () => void;
  onOpenMoveModal: (toolId: string) => void;
  onOpenQRModal: (toolId: string) => void;
}

export const ToolDetailView: React.FC<ToolDetailViewProps> = ({
  toolId,
  onBack,
  onOpenMoveModal,
  onOpenQRModal,
}) => {
  const { tools, setToolMaintenance, setToolLost } = useApp();
  const [selectedVariant, setSelectedVariant] = useState('10 KG');

  const tool = tools.find(t => t.id === toolId || t.toolId === toolId) || tools[0];

  const variantTools = tools.filter(t => t.name === tool.name);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tools</span>
          </button>
          <span>/</span>
          <span className="text-slate-700">{tool.name} ({tool.variant})</span>
          <span>/</span>
          <span className="text-blue-600 font-bold">{tool.toolId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQRModal(tool.toolId)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4 text-slate-600" />
            <span>View QR Code</span>
          </button>

          <button
            onClick={() => onOpenMoveModal(tool.id)}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Move Tool</span>
          </button>

          <button
            onClick={() => setToolMaintenance(tool.id)}
            className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Mark for Maintenance</span>
          </button>

          <button
            onClick={() => setToolLost(tool.id)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            title="Mark as Lost"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Detail Header Grid (Page 5 Bottom Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tool Visual & Specs Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Main Product Image */}
            <div className="w-full sm:w-56 space-y-2">
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-3">
                <img
                  src={tool.imageUrl}
                  alt={tool.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-12 rounded-lg bg-slate-100 border-2 border-blue-600 overflow-hidden p-1">
                  <img src={tool.imageUrl} alt="Angle 1" className="w-full h-full object-contain" />
                </div>
                <div className="w-16 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden p-1 opacity-70">
                  <img src={tool.imageUrl} alt="Angle 2" className="w-full h-full object-contain scale-x-[-1]" />
                </div>
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  tool.status === 'Assigned'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : tool.status === 'Available'
                    ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {tool.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {tool.toolId}</span>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {tool.toolId}
                </h2>
                <h3 className="text-base font-semibold text-slate-700">
                  {tool.name} — {tool.variant}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Specs Table */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tool Type</span>
                  <span className="font-semibold text-slate-800">{tool.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Variant</span>
                  <span className="font-semibold text-slate-800">{tool.variant}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Category</span>
                  <span className="font-semibold text-slate-800">{tool.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Serial Number</span>
                  <span className="font-mono font-semibold text-slate-800">{tool.serialNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Purchase Date</span>
                  <span className="font-semibold text-slate-800">{tool.purchaseDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Condition</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {tool.condition}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Scan Card (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 w-full">
              <span className="text-xs font-bold text-slate-800">Asset Barcode & QR</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {tool.toolId}
              </span>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="my-5 p-4 rounded-2xl bg-white border-2 border-slate-200 inline-block shadow-sm">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                {/* QR corner patterns */}
                <rect x="10" y="10" width="26" height="26" fill="black" />
                <rect x="14" y="14" width="18" height="18" fill="white" />
                <rect x="18" y="18" width="10" height="10" fill="black" />

                <rect x="64" y="10" width="26" height="26" fill="black" />
                <rect x="68" y="14" width="18" height="18" fill="white" />
                <rect x="72" y="18" width="10" height="10" fill="black" />

                <rect x="10" y="64" width="26" height="26" fill="black" />
                <rect x="14" y="68" width="18" height="18" fill="white" />
                <rect x="18" y="72" width="10" height="10" fill="black" />

                {/* QR Data Matrix dots */}
                <rect x="42" y="12" width="6" height="6" fill="black" />
                <rect x="52" y="12" width="6" height="6" fill="black" />
                <rect x="42" y="24" width="6" height="6" fill="black" />
                <rect x="48" y="32" width="6" height="6" fill="black" />
                <rect x="14" y="44" width="6" height="6" fill="black" />
                <rect x="26" y="44" width="6" height="6" fill="black" />
                <rect x="42" y="44" width="6" height="6" fill="black" />
                <rect x="60" y="44" width="6" height="6" fill="black" />
                <rect x="74" y="44" width="6" height="6" fill="black" />
                <rect x="42" y="56" width="6" height="6" fill="black" />
                <rect x="54" y="56" width="6" height="6" fill="black" />
                <rect x="70" y="56" width="6" height="6" fill="black" />
                <rect x="42" y="70" width="6" height="6" fill="black" />
                <rect x="52" y="80" width="6" height="6" fill="black" />
                <rect x="64" y="72" width="6" height="6" fill="black" />
                <rect x="80" y="80" width="6" height="6" fill="black" />
              </svg>
            </div>

            <p className="text-xs font-bold text-slate-800">{tool.toolId}</p>
            <p className="text-[11px] text-slate-500">Scan to view details or verify handover</p>
          </div>

          <button
            onClick={() => onOpenQRModal(tool.toolId)}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR Tag</span>
          </button>
        </div>
      </div>

      {/* Assignment & Status Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Assignment Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Current Assignment</span>
            </h3>
            <button
              onClick={() => onOpenMoveModal(tool.id)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Reassign
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Site</span>
                <span className="font-bold text-slate-800 text-sm block mt-0.5">{tool.siteName}</span>
                <span className="text-[11px] text-slate-500">Kerala</span>
              </div>
              <button
                onClick={() => onOpenMoveModal(tool.id)}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned To</span>
                <span className="font-bold text-slate-800 text-sm block mt-0.5">
                  {tool.assignedWorkerName || 'Available Pool'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {tool.assignedWorkerRole ? `EMP001 • ${tool.assignedWorkerRole}` : 'Unassigned'}
                </span>
              </div>
              <button
                onClick={() => onOpenMoveModal(tool.id)}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Status Information Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Status Information</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Active Tracking
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned On</span>
              <span className="font-bold text-slate-800 text-xs block mt-1">14 Sep 2026</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Days at Site</span>
              <span className="font-bold text-blue-600 text-sm block mt-1">{tool.daysAtCurrentSite} days</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Usage</span>
              <span className="font-bold text-slate-800 text-sm block mt-1">Est. {tool.totalUsageDays} days</span>
            </div>
          </div>
        </div>

      </div>

      {/* Movement History Table (Page 5 Bottom Mockup) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Movement History</h3>
            <p className="text-xs text-slate-500">Audit trail of physical relocations and handovers</p>
          </div>
          <button
            onClick={() => onOpenMoveModal(tool.id)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            <span>+ Relocate Tool</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">From</th>
                <th className="py-3 px-4 font-semibold">To</th>
                <th className="py-3 px-4 font-semibold">Assigned To</th>
                <th className="py-3 px-4 font-semibold">By</th>
                <th className="py-3 px-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tool.movementHistory && tool.movementHistory.length > 0 ? (
                tool.movementHistory.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{mov.date}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {mov.fromSite}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {mov.toSite}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {mov.assignedToName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {mov.byUser}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {mov.notes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No prior movement history recorded for this asset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
