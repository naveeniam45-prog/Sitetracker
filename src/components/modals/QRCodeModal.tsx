import React from 'react';
import { QrCode, X, Download, Printer } from 'lucide-react';

interface QRCodeModalProps {
  toolId: string | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ toolId, onClose }) => {
  if (!toolId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
        <div className="flex items-center justify-between border-b pb-3 text-left">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Equipment Asset QR Tag</h3>
            <p className="text-[11px] text-slate-500">Asset identifier: {toolId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Badge Area */}
        <div className="p-5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-blue-700 font-extrabold text-sm">
            <span>Sitetrack Physical Tag</span>
          </div>

          <div className="p-3 bg-white border rounded-xl inline-block shadow-sm">
            <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white" />
              <rect x="10" y="10" width="26" height="26" fill="black" />
              <rect x="14" y="14" width="18" height="18" fill="white" />
              <rect x="18" y="18" width="10" height="10" fill="black" />

              <rect x="64" y="10" width="26" height="26" fill="black" />
              <rect x="68" y="14" width="18" height="18" fill="white" />
              <rect x="72" y="18" width="10" height="10" fill="black" />

              <rect x="10" y="64" width="26" height="26" fill="black" />
              <rect x="14" y="68" width="18" height="18" fill="white" />
              <rect x="18" y="72" width="10" height="10" fill="black" />

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

          <div>
            <span className="font-mono font-bold text-slate-900 text-sm block">{toolId}</span>
            <span className="text-[10px] text-slate-500">Scan via Sitetrack mobile camera to accept handover</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tag</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
