import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, X, Check } from 'lucide-react';

interface AddToolModalProps {
  onClose: () => void;
}

export const AddToolModal: React.FC<AddToolModalProps> = ({ onClose }) => {
  const { sites, workers, addTool } = useApp();
  const [toolId, setToolId] = useState(`GM-${Math.floor(Math.random() * 800 + 100)}`);
  const [name, setName] = useState('Gilty Machine');
  const [category, setCategory] = useState('Demolition Tools');
  const [variant, setVariant] = useState('10 KG');
  const [serialNumber, setSerialNumber] = useState(`BOSCH-00${Math.floor(Math.random() * 900 + 100)}`);
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [assignedWorkerId, setAssignedWorkerId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const site = sites.find(s => s.id === siteId) || sites[0];
    const worker = workers.find(w => w.id === assignedWorkerId);

    addTool({
      toolId,
      name,
      category,
      variant,
      serialNumber,
      siteId: site.id,
      siteName: site.name,
      assignedWorkerId: worker?.id,
      assignedWorkerName: worker?.name,
      assignedWorkerRole: worker?.role,
      status: worker ? 'Assigned' : 'Available',
      purchaseDate: '14 Sep 2026',
      condition: 'Good',
      imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80',
      addedOn: '14 Sep 2026',
      daysAtCurrentSite: 1,
      totalUsageDays: 0,
      description: 'Heavy duty power tool registered into Sitetrack asset system.',
      movementHistory: [
        {
          id: `mov-${Date.now()}`,
          toolId,
          date: '14 Sep 2026',
          fromSite: 'Procurement',
          toSite: site.name,
          assignedToName: worker ? worker.name : 'Unassigned',
          byUser: 'Admin',
          notes: 'Asset registered and tagged with QR code'
        }
      ]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Power Tool</h3>
              <p className="text-xs text-slate-500">Register asset ID and assign initial location</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Asset Tool ID</label>
              <input
                type="text"
                required
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tool Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Demolition Tools">Demolition Tools</option>
                <option value="Drilling Tools">Drilling Tools</option>
                <option value="Grinding Tools">Grinding Tools</option>
                <option value="Cutting Tools">Cutting Tools</option>
                <option value="Cleaning Tools">Cleaning Tools</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Construction Tools">Construction Tools</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Variant / Spec</label>
              <input
                type="text"
                required
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g. 10 KG or 750W"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deploy to Site</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Worker Assignment (Optional)</label>
            <select
              value={assignedWorkerId}
              onChange={(e) => setAssignedWorkerId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Keep in Site Available Inventory</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
              ))}
            </select>
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
              <span>Add to Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
