export type UserRole = 'admin' | 'worker' | 'supervisor' | 'technician' | 'operator';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  employeeId: string;
  avatar: string;
  phone: string;
  siteId: string;
  siteName: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  siteManager: string;
  siteManagerInitials: string;
  workersPresent: number;
  workersTotal: number;
  toolsCount: number;
  status: 'Active' | 'Inactive';
  state: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export type WorkerStatus = 'Working' | 'Absent' | 'On Leave' | 'Inactive';

export interface Worker {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  role: string;
  siteId: string;
  siteName: string;
  status: WorkerStatus;
  toolsAssignedCount: number;
  avatar: string;
}

export type ToolStatus = 'Assigned' | 'Available' | 'Maintenance' | 'Lost';

export interface ToolMovement {
  id: string;
  toolId: string;
  date: string;
  fromSite: string;
  toSite: string;
  assignedToName: string;
  assignedToId?: string;
  byUser: string;
  notes: string;
}

export interface Tool {
  id: string;
  toolId: string; // e.g. GM-001
  name: string;
  category: string;
  variant: string; // e.g. 10 KG
  serialNumber: string;
  siteId: string;
  siteName: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedWorkerRole?: string;
  status: ToolStatus;
  purchaseDate: string;
  condition: 'Good' | 'Fair' | 'Requires Service';
  imageUrl: string;
  addedOn: string;
  daysAtCurrentSite: number;
  totalUsageDays: number;
  description: string;
  movementHistory: ToolMovement[];
}

export type AttendanceStatus = 'Present' | 'Working' | 'Absent' | 'On Leave';

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  employeeId: string;
  siteId: string;
  siteName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: string;
  status: AttendanceStatus;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  locationVerified: boolean;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface HandoverRequest {
  id: string;
  toolId: string;
  toolName: string;
  variant: string;
  fromWorkerName: string;
  toWorkerId: string;
  toWorkerName: string;
  siteName: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  requestDate: string;
  acceptedDate?: string;
}
