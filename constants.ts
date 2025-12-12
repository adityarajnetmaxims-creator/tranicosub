
import { Customer, Engineer, WorkOrder, Priority, ServiceItem } from './types';

export const CUSTOMERS: Customer[] = [
  { id: 'c1', companyName: 'Gamma Technologies', contactName: 'David Wilson', logoInitial: 'G' },
  { id: 'c2', companyName: 'Alpha Innovations', contactName: 'Emily Carter', logoInitial: 'A' },
  { id: 'c3', companyName: 'Beta Solutions', contactName: 'Michael Smith', logoInitial: 'B' },
  { id: 'c4', companyName: 'Delta Dynamics', contactName: 'Sophia Johnson', logoInitial: 'D' },
  { id: 'c5', companyName: 'Omega Enterprises', contactName: 'James Brown', logoInitial: 'O' },
  { id: 'c6', companyName: 'Zeta Technologies', contactName: 'Olivia Davis', logoInitial: 'Z' },
  { id: 'c7', companyName: 'FlexiStrength 9000', contactName: 'Delta Innovations', logoInitial: 'D' },
];

export const ENGINEERS: Engineer[] = [
  { id: 'e1', name: 'Alex Kim', initials: 'AK', tags: ['SW', 'E2'], color: 'bg-blue-600', specialties: ['software', 'firmware', 'diagnostics'] },
  { id: 'e2', name: 'Daniel Jones', initials: 'DJ', tags: ['SW', 'E2'], color: 'bg-emerald-500', specialties: ['conveyor', 'mechanical', 'sensors'] },
  { id: 'e3', name: 'Brian Lee', initials: 'BL', tags: ['SW', 'E2', 'E3'], color: 'bg-purple-600', specialties: ['heavy machinery', 'electrical', 'power'] },
  { id: 'e4', name: 'Sarah Connor', initials: 'SC', tags: ['ME', 'E1'], color: 'bg-orange-500', specialties: ['hydraulics', 'maintenance'] },
];

// Helper to generate mock service items
export const generateServiceItems = (count: number): ServiceItem[] => {
  const machineTypes = ['Treadmill', 'Elliptical', 'Rowing Machine', 'Cable Crossover', 'Leg Press'];
  
  return Array.from({ length: count }).map((_, i) => {
    const type = machineTypes[Math.floor(Math.random() * machineTypes.length)];
    const statusRoll = Math.random();
    let status: ServiceItem['status'] = 'Pending';
    let comments = undefined;
    let images: string[] = [];

    if (statusRoll > 0.6) {
      status = 'Fixed';
    } else if (statusRoll > 0.4) {
      status = 'Issue';
      comments = 'Parts worn out, replacement ordered.';
      // Mock images for issues
      images = [
        `https://placehold.co/400x300/e2e8f0/64748b?text=Broken+Part`,
        `https://placehold.co/400x300/e2e8f0/64748b?text=Serial+Tag`
      ];
    }

    return {
      id: `item-${i}-${Date.now()}`,
      name: `${type} #${100 + i}`,
      serialNumber: `SN-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}`,
      status,
      engineerComments: comments,
      servicedAt: status !== 'Pending' ? new Date().toLocaleDateString() : undefined,
      images: images.length > 0 ? images : undefined
    };
  });
};

export const INITIAL_ORDERS: WorkOrder[] = [
  // Regular Work Orders
  {
    id: 'wo1',
    jobNumber: 'WO-2024-001',
    customer: { id: 'c7', companyName: 'FlexiStrength 9000', contactName: 'Delta Innovations', logoInitial: 'D' },
    title: 'FlexiStrength 9000 Maintenance',
    date: '1-12-2025',
    priority: Priority.NO_PRIORITY,
    status: 'New',
    assignedEngineer: null,
    type: 'Regular Work Order'
  },
  {
    id: 'wo2',
    jobNumber: 'WO-2024-002',
    customer: { id: 'c5', companyName: 'UltraFit 8000', contactName: 'Omega Tech Solutions', logoInitial: 'U' },
    title: 'UltraFit 8000 Calibration',
    date: '1-12-2025',
    priority: Priority.MEDIUM,
    status: 'New',
    assignedEngineer: null,
    type: 'Regular Work Order'
  },
  {
    id: 'wo3',
    jobNumber: 'WO-2024-003',
    customer: { id: 'c2', companyName: 'MaxPower 6000', contactName: 'Alpha Systems', logoInitial: 'M' },
    title: 'MaxPower 6000 Repair',
    date: '1-12-2025',
    priority: Priority.LOW,
    status: 'New',
    assignedEngineer: null,
    type: 'Regular Work Order'
  },
  {
    id: 'wo4',
    jobNumber: 'WO-2024-004',
    customer: { id: 'c3', companyName: 'TurboFit 5000', contactName: 'Beta Enterprises', logoInitial: 'T' },
    title: 'TurboFit 5000 Overhaul',
    date: '1-12-2025',
    priority: Priority.HIGH,
    status: 'New',
    assignedEngineer: null,
    type: 'Regular Work Order'
  },
  
  // Annual Services (10 items)
  {
    id: 'as1',
    jobNumber: 'AS-2025-001',
    customer: { id: 'c1', companyName: 'Gamma Technologies', contactName: 'David Wilson', logoInitial: 'G' },
    title: 'Annual Safety Inspection',
    date: '15-01-2025',
    priority: Priority.MEDIUM,
    status: 'Ongoing',
    assignedEngineer: ENGINEERS[0],
    type: 'Annual Service',
    serviceItems: generateServiceItems(45)
  },
  {
    id: 'as2',
    jobNumber: 'AS-2025-002',
    customer: { id: 'c2', companyName: 'Alpha Innovations', contactName: 'Emily Carter', logoInitial: 'A' },
    title: 'Yearly Equipment Audit',
    date: '16-01-2025',
    priority: Priority.LOW,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(12)
  },
  {
    id: 'as3',
    jobNumber: 'AS-2025-003',
    customer: { id: 'c3', companyName: 'Beta Solutions', contactName: 'Michael Smith', logoInitial: 'B' },
    title: 'Full System Diagnostic',
    date: '18-01-2025',
    priority: Priority.HIGH,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(80)
  },
  {
    id: 'as4',
    jobNumber: 'AS-2025-004',
    customer: { id: 'c4', companyName: 'Delta Dynamics', contactName: 'Sophia Johnson', logoInitial: 'D' },
    title: 'Preventative Maintenance Check',
    date: '20-01-2025',
    priority: Priority.MEDIUM,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(30)
  },
  {
    id: 'as5',
    jobNumber: 'AS-2025-005',
    customer: { id: 'c5', companyName: 'Omega Enterprises', contactName: 'James Brown', logoInitial: 'O' },
    title: 'Annual Calibration Service',
    date: '22-01-2025',
    priority: Priority.MEDIUM,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(25)
  },
  {
    id: 'as6',
    jobNumber: 'AS-2025-006',
    customer: { id: 'c6', companyName: 'Zeta Technologies', contactName: 'Olivia Davis', logoInitial: 'Z' },
    title: 'Hardware Certification Renewal',
    date: '25-01-2025',
    priority: Priority.LOW,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(15)
  },
  {
    id: 'as7',
    jobNumber: 'AS-2025-007',
    customer: { id: 'c1', companyName: 'Gamma Technologies', contactName: 'David Wilson', logoInitial: 'G' },
    title: 'Q1 Performance Review',
    date: '28-01-2025',
    priority: Priority.NO_PRIORITY,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(50)
  },
  {
    id: 'as8',
    jobNumber: 'AS-2025-008',
    customer: { id: 'c7', companyName: 'FlexiStrength 9000', contactName: 'Ethan Carter', logoInitial: 'F' },
    title: 'Hydraulic Systems Check',
    date: '01-02-2025',
    priority: Priority.HIGH,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(10)
  },
  {
    id: 'as9',
    jobNumber: 'AS-2025-009',
    customer: { id: 'c2', companyName: 'Alpha Innovations', contactName: 'Emily Carter', logoInitial: 'A' },
    title: 'Electrical Safety Compliance',
    date: '03-02-2025',
    priority: Priority.MEDIUM,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(60)
  },
  {
    id: 'as10',
    jobNumber: 'AS-2025-010',
    customer: { id: 'c4', companyName: 'Delta Dynamics', contactName: 'Sophia Johnson', logoInitial: 'D' },
    title: 'Software Firmware Update',
    date: '05-02-2025',
    priority: Priority.LOW,
    status: 'New',
    assignedEngineer: null,
    type: 'Annual Service',
    serviceItems: generateServiceItems(100)
  },
];