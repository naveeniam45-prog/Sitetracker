import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardView } from './DashboardView';
import { SitesView } from './SitesView';
import { WorkersView } from './WorkersView';
import { ToolsView } from './ToolsView';
import { ToolDetailView } from './ToolDetailView';
import { AttendanceView } from './AttendanceView';
import { ReportsView } from './ReportsView';
import { MoveToolModal } from '../modals/MoveToolModal';
import { AddWorkerModal } from '../modals/AddWorkerModal';
import { AddSiteModal } from '../modals/AddSiteModal';
import { AddToolModal } from '../modals/AddToolModal';
import { QRCodeModal } from '../modals/QRCodeModal';

export const AdminLayout: React.FC = () => {
  const { 
    activeAdminTab, 
    setActiveAdminTab, 
    selectedToolId, 
    setSelectedToolId 
  } = useApp();

  const [activeModal, setActiveModal] = useState<'move' | 'worker' | 'site' | 'tool' | 'qr' | null>(null);
  const [modalToolId, setModalToolId] = useState<string | null>(null);

  const handleOpenAddModal = (type: 'worker' | 'site' | 'tool') => {
    setActiveModal(type);
  };

  const handleSelectTool = (id: string) => {
    setSelectedToolId(id);
    setActiveAdminTab('tool-detail');
  };

  const handleOpenMoveModal = (toolId: string) => {
    setModalToolId(toolId);
    setActiveModal('move');
  };

  const handleOpenQRModal = (toolId: string) => {
    setModalToolId(toolId);
    setActiveModal('qr');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Dark Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* View Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto pb-12">
            {activeAdminTab === 'dashboard' && (
              <DashboardView onOpenAddModal={handleOpenAddModal} />
            )}

            {activeAdminTab === 'sites' && (
              <SitesView onAddSite={() => handleOpenAddModal('site')} />
            )}

            {activeAdminTab === 'workers' && (
              <WorkersView onAddWorker={() => handleOpenAddModal('worker')} />
            )}

            {activeAdminTab === 'tools' && (
              <ToolsView 
                onAddTool={() => handleOpenAddModal('tool')} 
                onSelectTool={handleSelectTool}
              />
            )}

            {activeAdminTab === 'tool-detail' && (
              <ToolDetailView
                toolId={selectedToolId || 'tool-1'}
                onBack={() => setActiveAdminTab('tools')}
                onOpenMoveModal={handleOpenMoveModal}
                onOpenQRModal={handleOpenQRModal}
              />
            )}

            {activeAdminTab === 'attendance' && (
              <AttendanceView />
            )}

            {activeAdminTab === 'reports' && (
              <ReportsView />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {activeModal === 'move' && (
        <MoveToolModal
          toolId={modalToolId}
          onClose={() => { setActiveModal(null); setModalToolId(null); }}
        />
      )}

      {activeModal === 'worker' && (
        <AddWorkerModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'site' && (
        <AddSiteModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'tool' && (
        <AddToolModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'qr' && (
        <QRCodeModal
          toolId={modalToolId}
          onClose={() => { setActiveModal(null); setModalToolId(null); }}
        />
      )}
    </div>
  );
};
