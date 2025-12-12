import React from 'react';
import { WorkOrder, Priority } from '../types';
import { Search, ChevronDown, MoreHorizontal } from 'lucide-react';

interface WorkOrderListProps {
  orders: WorkOrder[];
  hidePriority?: boolean;
  onOrderClick: (order: WorkOrder) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    [Priority.NO_PRIORITY]: 'text-gray-600',
    [Priority.LOW]: 'text-green-600',
    [Priority.MEDIUM]: 'text-amber-500',
    [Priority.HIGH]: 'text-red-600',
  };

  const dots = {
    [Priority.NO_PRIORITY]: 'bg-gray-400',
    [Priority.LOW]: 'bg-green-500',
    [Priority.MEDIUM]: 'bg-amber-500',
    [Priority.HIGH]: 'bg-red-600',
  };

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${styles[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[priority]}`} />
      {priority}
    </div>
  );
};

export const WorkOrderList: React.FC<WorkOrderListProps> = ({ orders, hidePriority = false, onOrderClick }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Work Order ..." 
            className="w-full pl-10 pr-4 py-2 bg-white text-black border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
          />
        </div>
        {!hidePriority && (
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            All Priority <ChevronDown size={16} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Job number</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              {!hidePriority && (
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              )}
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Assigned Engineer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 align-top">
                  <div 
                    onClick={() => onOrderClick(order)}
                    className="font-bold text-gray-900 underline underline-offset-2 decoration-gray-300 decoration-1 hover:decoration-black cursor-pointer"
                  >
                    {order.jobNumber}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="inline-block" style={{ fontSize: '10px' }}>📅</span> {order.date}
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="font-semibold text-gray-900">{order.title}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <span className="font-normal text-gray-400">🏢</span> {order.customer.companyName}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{order.customer.contactName}</div>
                </td>
                {!hidePriority && (
                  <td className="px-6 py-4 align-top pt-5">
                    <PriorityBadge priority={order.priority} />
                  </td>
                )}
                <td className="px-6 py-4 align-top pt-4">
                  {order.assignedEngineer ? (
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full ${order.assignedEngineer.color} text-white flex items-center justify-center text-xs font-medium`}>
                        {order.assignedEngineer.initials}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{order.assignedEngineer.name}</span>
                    </div>
                  ) : (
                    <button className="flex items-center justify-between w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">
                      Assign <ChevronDown size={14} />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 align-top text-right pt-5">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {orders.length === 0 && (
         <div className="p-12 text-center">
            <p className="text-gray-500">No work orders found.</p>
         </div>
      )}
    </div>
  );
};