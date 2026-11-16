import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRightLeft, X, Building2, User, Check } from 'lucide-react';

interface MoveToolModalProps {
  toolId: string | null;
  onClose: () => void;
}

export const MoveToolModal: React.FC<MoveToolModalProps> = ({ toolId, onClose }) => {
  const { tools, sites, workers, moveTool } = useApp();
  const tool = tools.find(t => t.id === toolId || t.toolId === toolId);

  const [toSiteId, setToSiteId] = useState(tool?.siteId || sites[0]?.id || '');
  const [toWorkerId, setToWorkerId] = useState(tool?.assignedWorkerId || '');
  const [notes, setNotes] = useState('');

  if (!tool) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    moveTool(tool.id, toSiteId, toWorkerId || undefined, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Move Tool / Initiate Handover</h3>
              <p className="text-xs text-slate-500">Asset: {tool.toolId} - {tool.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Current Location & Assignment
            </label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 flex justify-between">
              <span>{tool.siteName}</span>
              <span className="font-semibold text-slate-800">{tool.assignedWorkerName || 'Available Pool'}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Transfer to Destination Site
            </label>
            <select
              value={toSiteId}
              onChange={(e) => setToSiteId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Assign to Worker (Initiates Handover Request)
            </label>
            <select
              value={toWorkerId}
              onChange={(e) => setToWorkerId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Keep in Site Available Pool (No Worker)</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.role} - {w.employeeId})</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              If assigned to a worker, a handover acceptance alert will appear in their mobile app.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason / Movement Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Site requirement for foundation drilling"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
