import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, X, Check, MapPin } from 'lucide-react';

interface AddSiteModalProps {
  onClose: () => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ onClose }) => {
  const { addSite } = useApp();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [siteManager, setSiteManager] = useState('');
  const [radiusMeters, setRadiusMeters] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = siteManager.split(' ').map(n => n[0]).join('').toUpperCase() || 'SM';
    addSite({
      name,
      location,
      siteManager,
      siteManagerInitials: initials,
      workersPresent: 0,
      workersTotal: 0,
      toolsCount: 0,
      status: 'Active',
      state: 'Kerala',
      latitude: 10.0159 + (Math.random() - 0.5) * 0.1,
      longitude: 76.3638 + (Math.random() - 0.5) * 0.1,
      radiusMeters: Number(radiusMeters)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Work Site</h3>
              <p className="text-xs text-slate-500">Configure geofence coordinates for worker check-in</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Site Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Edappally Flyover Project"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location Address</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Toll Junction, Edappally, Kochi"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Site Manager</label>
            <input
              type="text"
              required
              value={siteManager}
              onChange={(e) => setSiteManager(e.target.value)}
              placeholder="e.g. Anand R"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Geofence Verification Radius (meters)
            </label>
            <input
              type="number"
              min={100}
              max={2000}
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Workers mobile GPS must fall within this perimeter to check in.
            </p>
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
              <span>Create Work Site</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
