
export enum Priority {
  NO_PRIORITY = 'No Priority',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  logoInitial: string; // e.g. "G" for Gamma
}

export interface Engineer {
  id: string;
  name: string;
  initials: string;
  tags: string[]; // e.g. ["SW", "E2"]
  color: string; // Tailwind color class for avatar bg
  specialties?: string[]; // For AI matching
}

export type OrderType = 'Annual Service' | 'Regular Work Order' | null;

export interface ServiceItem {
  id: string;
  name: string; // e.g. "Treadmill T-1000"
  serialNumber: string;
  status: 'Fixed' | 'Issue' | 'Pending';
  engineerComments?: string;
  servicedAt?: string;
  images?: string[]; // URLs of uploaded images for issues
}

export interface WorkOrder {
  id: string;
  jobNumber: string;
  customer: Customer;
  title: string;
  description?: string;
  date: string;
  priority: Priority;
  assignedEngineer?: Engineer | null;
  status: 'New' | 'Pending' | 'Ongoing' | 'Declined' | 'History';
  type: OrderType;
  attachments?: string[];
  serviceItems?: ServiceItem[]; // List of machines for Annual Service
  followUpIds?: string[]; // IDs of WorkOrders created as follow-ups
}
