import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Site, Worker, Tool, AttendanceRecord, HandoverRequest, ToolMovement 
} from '../types';
import { 
  INITIAL_SITES, INITIAL_WORKERS, INITIAL_TOOLS, INITIAL_ATTENDANCE, 
  INITIAL_HANDOVERS, DEMO_USERS 
} from '../data/mockData';

export type ActiveAdminTab = 'dashboard' | 'sites' | 'workers' | 'tools' | 'tool-detail' | 'attendance' | 'reports';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, role?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  
  // App navigation
  activeAdminTab: ActiveAdminTab;
  setActiveAdminTab: (tab: ActiveAdminTab) => void;
  selectedToolId: string | null;
  setSelectedToolId: (id: string | null) => void;
  viewMode: 'admin' | 'worker-mobile';
  setViewMode: (mode: 'admin' | 'worker-mobile') => void;

  // Sites
  sites: Site[];
  addSite: (site: Omit<Site, 'id'>) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;

  // Workers
  workers: Worker[];
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;

  // Tools
  tools: Tool[];
  addTool: (tool: Omit<Tool, 'id'>) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  moveTool: (toolId: string, toSiteId: string, toWorkerId?: string, notes?: string) => void;
  setToolMaintenance: (id: string) => void;
  setToolLost: (id: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  getWorkerTodayAttendance: (workerId: string) => AttendanceRecord | undefined;
  checkInWorker: (workerId: string, siteId: string, photoDataUrl: string, coords?: { lat: number; lng: number }) => AttendanceRecord;
  checkOutWorker: (recordId: string, photoDataUrl: string) => void;

  // Handovers
  handoverRequests: HandoverRequest[];
  acceptHandover: (id: string) => void;
  declineHandover: (id: string) => void;
  createHandover: (toolId: string, toWorkerId: string) => void;

  // Recent activity stream
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'checkin' | 'checkout' | 'movement' | 'maintenance' | 'worker';
  }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization with fallbacks
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sitetrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeAdminTab, setActiveAdminTab] = useState<ActiveAdminTab>('dashboard');
  const [selectedToolId, setSelectedToolId] = useState<string | null>('tool-1'); // Default to GM-001
  const [viewMode, setViewMode] = useState<'admin' | 'worker-mobile'>('admin');

  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem('sitetrack_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('sitetrack_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('sitetrack_tools');
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sitetrack_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [handoverRequests, setHandoverRequests] = useState<HandoverRequest[]>(() => {
    const saved = localStorage.getItem('sitetrack_handovers');
    return saved ? JSON.parse(saved) : INITIAL_HANDOVERS;
  });

  const [recentActivities, setRecentActivities] = useState<Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'checkin' | 'checkout' | 'movement' | 'maintenance' | 'worker';
  }>>([
    {
      id: 'act-1',
      title: 'Raj Kumar checked in at Kochi Project',
      description: 'Face and location verified at 09:04 AM',
      time: 'Today, 09:04 AM',
      type: 'checkin'
    },
    {
      id: 'act-2',
      title: 'GM-001 moved to Aluva Project',
      description: 'Transferred by Admin for core drilling',
      time: 'Today, 08:32 AM',
      type: 'movement'
    },
    {
      id: 'act-3',
      title: 'New worker Manoj added',
      description: 'Assigned to Thrissur Project workforce',
      time: 'Yesterday, 05:21 PM',
      type: 'worker'
    },
    {
      id: 'act-4',
      title: 'DR-021 marked for maintenance',
      description: 'Reported chuck wobble by technician',
      time: 'Yesterday, 03:10 PM',
      type: 'maintenance'
    },
    {
      id: 'act-5',
      title: 'Suresh checked out from Thrissur Project',
      description: 'Completed 9h 12m work shift',
      time: 'Yesterday, 06:12 PM',
      type: 'checkout'
    }
  ]);

  // Persist state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sitetrack_user', JSON.stringify(currentUser));
      if (currentUser.role === 'admin') {
        setViewMode('admin');
      } else {
        setViewMode('worker-mobile');
      }
    } else {
      localStorage.removeItem('sitetrack_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sitetrack_sites', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('sitetrack_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('sitetrack_tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('sitetrack_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('sitetrack_handovers', JSON.stringify(handoverRequests));
  }, [handoverRequests]);

  const login = (identifier: string): boolean => {
    const trimmed = identifier.trim().toLowerCase();
    // Check if matching any demo user
    const matched = DEMO_USERS.find(
      u => u.username.toLowerCase() === trimmed || 
           u.employeeId.toLowerCase() === trimmed || 
           u.name.toLowerCase() === trimmed
    );

    if (matched) {
      setCurrentUser(matched);
      return true;
    }

    // Default admin fallback
    if (trimmed === 'admin') {
      const adminUser = DEMO_USERS[0];
      setCurrentUser(adminUser);
      return true;
    }

    // If identifier looks like a worker
    const workerMatch = workers.find(
      w => w.employeeId.toLowerCase() === trimmed || 
           w.name.toLowerCase().includes(trimmed)
    );
    if (workerMatch) {
      const workerUser: User = {
        id: workerMatch.id,
        name: workerMatch.name,
        username: workerMatch.employeeId.toLowerCase(),
        role: 'worker',
        employeeId: workerMatch.employeeId,
        avatar: workerMatch.avatar,
        phone: workerMatch.phone,
        siteId: workerMatch.siteId,
        siteName: workerMatch.siteName,
      };
      setCurrentUser(workerUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const addSite = (siteData: Omit<Site, 'id'>) => {
    const newSite: Site = {
      ...siteData,
      id: `site-${Date.now()}`
    };
    setSites(prev => [newSite, ...prev]);
  };

  const updateSite = (id: string, updates: Partial<Site>) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addWorker = (workerData: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: `worker-${Date.now()}`
    };
    setWorkers(prev => [newWorker, ...prev]);
    setRecentActivities(prev => [{
      id: `act-${Date.now()}`,
      title: `New worker ${workerData.name} added`,
      description: `Assigned to ${workerData.siteName}`,
      time: 'Just now',
      type: 'worker'
    }, ...prev]);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const addTool = (toolData: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...toolData,
      id: `tool-${Date.now()}`
    };
    setTools(prev => [newTool, ...prev]);
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const moveTool = (toolId: string, toSiteId: string, toWorkerId?: string, notes?: string) => {
    const tool = tools.find(t => t.id === toolId || t.toolId === toolId);
    if (!tool) return;

    const targetSite = sites.find(s => s.id === toSiteId);
    const targetWorker = toWorkerId ? workers.find(w => w.id === toWorkerId) : undefined;

    const newMovement: ToolMovement = {
      id: `mov-${Date.now()}`,
      toolId: tool.toolId,
      date: '14 Sep 2026',
      fromSite: tool.siteName,
      toSite: targetSite ? targetSite.name : tool.siteName,
      assignedToName: targetWorker ? targetWorker.name : 'Unassigned',
      assignedToId: targetWorker?.id,
      byUser: currentUser?.name || 'Admin',
      notes: notes || 'Site requirement reallocation'
    };

    setTools(prev => prev.map(t => {
      if (t.id === tool.id) {
        return {
          ...t,
          siteId: targetSite ? targetSite.id : t.siteId,
          siteName: targetSite ? targetSite.name : t.siteName,
          assignedWorkerId: targetWorker?.id,
          assignedWorkerName: targetWorker ? targetWorker.name : undefined,
          assignedWorkerRole: targetWorker ? targetWorker.role : undefined,
          status: targetWorker ? 'Assigned' : 'Available',
          daysAtCurrentSite: 0,
          movementHistory: [newMovement, ...(t.movementHistory || [])]
        };
      }
      return t;
    }));

    // If assigned to a worker, create a handover request as well
    if (targetWorker) {
      const newHandover: HandoverRequest = {
        id: `ho-${Date.now()}`,
        toolId: tool.toolId,
        toolName: `${tool.name} (${tool.variant})`,
        variant: tool.variant,
        fromWorkerName: tool.assignedWorkerName || 'Admin Handover',
        toWorkerId: targetWorker.id,
        toWorkerName: targetWorker.name,
        siteName: targetSite ? targetSite.name : tool.siteName,
        status: 'Pending',
        requestDate: '14 Sep 2026, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHandoverRequests(prev => [newHandover, ...prev]);
    }

    setRecentActivities(prev => [{
      id: `act-${Date.now()}`,
      title: `${tool.toolId} moved to ${targetSite?.name || 'new site'}`,
      description: `Assigned to ${targetWorker?.name || 'Available pool'}`,
      time: 'Just now',
      type: 'movement'
    }, ...prev]);
  };

  const setToolMaintenance = (id: string) => {
    setTools(prev => prev.map(t => (t.id === id || t.toolId === id) ? { ...t, status: 'Maintenance' } : t));
    const tool = tools.find(t => t.id === id || t.toolId === id);
    if (tool) {
      setRecentActivities(prev => [{
        id: `act-${Date.now()}`,
        title: `${tool.toolId} marked for maintenance`,
        description: `Status updated by ${currentUser?.name || 'Admin'}`,
        time: 'Just now',
        type: 'maintenance'
      }, ...prev]);
    }
  };

  const setToolLost = (id: string) => {
    setTools(prev => prev.map(t => (t.id === id || t.toolId === id) ? { ...t, status: 'Lost' } : t));
  };

  const getWorkerTodayAttendance = (workerId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find(a => a.workerId === workerId && a.date === '14 Sep 2026');
  };

  const checkInWorker = (
    workerId: string, 
    siteId: string, 
    photoDataUrl: string,
    coords?: { lat: number; lng: number }
  ): AttendanceRecord => {
    const worker = workers.find(w => w.id === workerId);
    const site = sites.find(s => s.id === siteId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Check if existing record
    const existing = attendanceRecords.find(a => a.workerId === workerId && a.date === '14 Sep 2026');
    if (existing) {
      const updated: AttendanceRecord = {
        ...existing,
        checkInTime: existing.checkInTime || timeStr,
        status: 'Working',
        checkInPhoto: photoDataUrl || existing.checkInPhoto,
        locationVerified: true,
        latitude: coords?.lat || site?.latitude,
        longitude: coords?.lng || site?.longitude
      };
      setAttendanceRecords(prev => prev.map(a => a.id === existing.id ? updated : a));
      return updated;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      workerId,
      workerName: worker ? worker.name : 'Raj Kumar',
      workerAvatar: worker ? worker.avatar : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      employeeId: worker ? worker.employeeId : 'EMP001',
      siteId: siteId,
      siteName: site ? site.name : 'Kochi Project',
      date: '14 Sep 2026',
      checkInTime: timeStr,
      workingHours: 'In Progress (0h 01m)',
      status: 'Working',
      checkInPhoto: photoDataUrl,
      locationVerified: true,
      latitude: coords?.lat || site?.latitude || 10.0159,
      longitude: coords?.lng || site?.longitude || 76.3638,
      notes: `Location detected at ${site?.name || 'Kochi Project'}`
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Update worker status
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, status: 'Working', siteId, siteName: site?.name || w.siteName } : w));

    // Update site count
    if (site) {
      setSites(prev => prev.map(s => s.id === siteId ? { ...s, workersPresent: s.workersPresent + 1 } : s));
    }

    // Add recent activity
    setRecentActivities(prev => [{
      id: `act-${Date.now()}`,
      title: `${worker?.name || 'Raj Kumar'} checked in at ${site?.name || 'Kochi Project'}`,
      description: `Live photograph & GPS verified at ${timeStr}`,
      time: `Today, ${timeStr}`,
      type: 'checkin'
    }, ...prev]);

    return newRecord;
  };

  const checkOutWorker = (recordId: string, photoDataUrl: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    setAttendanceRecords(prev => prev.map(a => {
      if (a.id === recordId) {
        return {
          ...a,
          checkOutTime: timeStr,
          workingHours: '9h 14m',
          status: 'Present',
          checkOutPhoto: photoDataUrl || a.checkOutPhoto
        };
      }
      return a;
    }));

    const targetRecord = attendanceRecords.find(a => a.id === recordId);
    if (targetRecord) {
      setRecentActivities(prev => [{
        id: `act-${Date.now()}`,
        title: `${targetRecord.workerName} checked out from ${targetRecord.siteName}`,
        description: `Completed 9h 14m shift with checkout photo`,
        time: `Today, ${timeStr}`,
        type: 'checkout'
      }, ...prev]);
    }
  };

  const acceptHandover = (id: string) => {
    setHandoverRequests(prev => prev.map(h => {
      if (h.id === id) {
        return {
          ...h,
          status: 'Accepted',
          acceptedDate: '14 Sep 2026, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return h;
    }));
  };

  const declineHandover = (id: string) => {
    setHandoverRequests(prev => prev.map(h => h.id === id ? { ...h, status: 'Declined' } : h));
  };

  const createHandover = (toolId: string, toWorkerId: string) => {
    const tool = tools.find(t => t.id === toolId || t.toolId === toolId);
    const worker = workers.find(w => w.id === toWorkerId);
    if (!tool || !worker) return;

    const newReq: HandoverRequest = {
      id: `ho-${Date.now()}`,
      toolId: tool.toolId,
      toolName: `${tool.name} (${tool.variant})`,
      variant: tool.variant,
      fromWorkerName: currentUser?.name || 'Admin',
      toWorkerId: worker.id,
      toWorkerName: worker.name,
      siteName: worker.siteName,
      status: 'Pending',
      requestDate: '14 Sep 2026, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHandoverRequests(prev => [newReq, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      switchUser,
      activeAdminTab,
      setActiveAdminTab,
      selectedToolId,
      setSelectedToolId,
      viewMode,
      setViewMode,
      sites,
      addSite,
      updateSite,
      workers,
      addWorker,
      updateWorker,
      tools,
      addTool,
      updateTool,
      moveTool,
      setToolMaintenance,
      setToolLost,
      attendanceRecords,
      getWorkerTodayAttendance,
      checkInWorker,
      checkOutWorker,
      handoverRequests,
      acceptHandover,
      declineHandover,
      createHandover,
      recentActivities
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
