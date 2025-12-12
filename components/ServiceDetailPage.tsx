
import React, { useState } from 'react';
import { WorkOrder, Priority, ServiceItem } from '../types';
import { ArrowLeft, Calendar, FileText, Paperclip, CheckCircle, AlertTriangle, Circle, Search, Activity, LayoutTemplate, ListTodo, Image as ImageIcon, Briefcase, Plus } from 'lucide-react';
import { Button } from './Button';
import { WorkOrderList } from './WorkOrderList';

interface ServiceDetailPageProps {
  order: WorkOrder;
  allOrders?: WorkOrder[];
  onBack: () => void;
  onCreateFollowUp?: (parentOrder: WorkOrder, items: ServiceItem[]) => void;
  onOrderClick?: (order: WorkOrder) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'New': 'bg-blue-50 text-blue-700 border-blue-100',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
    'Ongoing': 'bg-purple-50 text-purple-700 border-purple-100',
    'Declined': 'bg-red-50 text-red-700 border-red-100',
    'History': 'bg-gray-50 text-gray-700 border-gray-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status] || styles['New']}`}>
      {status}
    </span>
  );
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ order, allOrders = [], onBack, onCreateFollowUp, onOrderClick }) => {
  const isAnnual = order.type === 'Annual Service';
  const [activeTab, setActiveTab] = useState<'Overview' | 'Service Progress' | 'Follow-up Orders'>('Overview');
  const [filter, setFilter] = useState<'All' | 'Fixed' | 'Issue' | 'Pending'>('All');
  const [search, setSearch] = useState('');
  
  // Selection State for Follow-up creation
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());

  // Calculate stats
  const items = order.serviceItems || [];
  const total = items.length;
  const fixed = items.filter(i => i.status === 'Fixed').length;
  const issues = items.filter(i => i.status === 'Issue').length;
  const pending = items.filter(i => i.status === 'Pending').length;
  const progress = total > 0 ? Math.round(((fixed) / total) * 100) : 0;

  // Linked Orders
  const linkedFollowUps = allOrders.filter(o => order.followUpIds?.includes(o.id));

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.serialNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIssueIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIssueIds(newSet);
  };

  const handleSelectAllIssues = () => {
    if (selectedIssueIds.size === issues) {
      setSelectedIssueIds(new Set());
    } else {
      const allIssues = items.filter(i => i.status === 'Issue').map(i => i.id);
      setSelectedIssueIds(new Set(allIssues));
    }
  };

  const executeCreateFollowUp = () => {
    if (!onCreateFollowUp) return;
    const selectedItems = items.filter(i => selectedIssueIds.has(i.id));
    onCreateFollowUp(order, selectedItems);
    setSelectedIssueIds(new Set()); // Clear selection
    setActiveTab('Follow-up Orders'); // Switch tab
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-300 pb-24">
      {/* Header Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to {isAnnual ? 'Annual Services' : 'Work Orders'}
      </button>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{order.title}</h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
              {order.jobNumber}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              Created on {order.date}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-none">
            Edit Request
          </Button>
          <Button>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Tabs (Only for Annual Service) */}
      {isAnnual && (
        <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('Overview')}
            className={`pb-3 text-sm font-medium transition-all relative flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'Overview' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <LayoutTemplate size={16} />
            Overview
            {activeTab === 'Overview' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('Service Progress')}
            className={`pb-3 text-sm font-medium transition-all relative flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'Service Progress' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <ListTodo size={16} />
            Service Progress
             <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-600 font-bold border border-gray-200">
              {total}
            </span>
            {activeTab === 'Service Progress' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('Follow-up Orders')}
            className={`pb-3 text-sm font-medium transition-all relative flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'Follow-up Orders' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <Briefcase size={16} />
            Follow-up Orders
             <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-600 font-bold border border-gray-200">
              {linkedFollowUps.length}
            </span>
            {activeTab === 'Follow-up Orders' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
            )}
          </button>
        </div>
      )}

      {/* Tab Content: Overview */}
      {(!isAnnual || activeTab === 'Overview') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-gray-400" />
                Issue Description
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {order.description ? (
                  <p>{order.description}</p>
                ) : (
                  <p className="italic text-gray-400">No description provided.</p>
                )}
              </div>
            </div>

            {/* Attachments Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Paperclip size={20} className="text-gray-400" />
                Attachments
              </h2>
              {order.attachments && order.attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file}</p>
                        <p className="text-xs text-gray-500">Document</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
                  <p className="text-sm text-gray-400">No attachments uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            
            {/* Customer Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                Customer
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {order.customer.logoInitial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{order.customer.companyName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{order.customer.contactName}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">ID: {order.customer.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engineer Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                Assigned Engineer
              </h2>
              {order.assignedEngineer ? (
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${order.assignedEngineer.color} text-white flex items-center justify-center text-lg font-bold shrink-0`}>
                    {order.assignedEngineer.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{order.assignedEngineer.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {order.assignedEngineer.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">No engineer assigned yet</p>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    Assign Engineer
                  </button>
                </div>
              )}
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Ticket Info
              </h2>
              <div className="space-y-4">
                {!isAnnual && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Priority</span>
                    <span className={`text-sm font-medium
                      ${order.priority === Priority.HIGH ? 'text-red-600' : 
                        order.priority === Priority.MEDIUM ? 'text-amber-600' : 'text-gray-700'}
                    `}>
                      {order.priority}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Service Type</span>
                  <span className="text-sm font-medium text-gray-900">{order.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Due Date</span>
                  <span className="text-sm font-medium text-gray-900">{order.date}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content: Service Progress */}
      {isAnnual && activeTab === 'Service Progress' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-gray-400" />
                Service Progress
              </h2>
              <span className="text-sm font-medium text-gray-600">
                {fixed} / {total} Fixed
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div 
                className="bg-black h-3 rounded-full transition-all duration-700 ease-out shadow-sm" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-white rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-green-600 font-black text-3xl mb-1">{fixed}</div>
                  <div className="text-green-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle size={14} /> Fixed
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-red-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-red-600 font-black text-3xl mb-1">{issues}</div>
                  <div className="text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Issues
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                  <div className="text-gray-700 font-black text-3xl mb-1">{pending}</div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Circle size={14} /> Pending
                  </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {(['All', 'Fixed', 'Issue', 'Pending'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap
                      ${filter === tab 
                        ? 'bg-black text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name or serial..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-72 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 w-10 text-center">
                     {filter === 'Issue' && (
                       <input 
                         type="checkbox" 
                         className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                         checked={selectedIssueIds.size === issues && issues > 0}
                         onChange={handleSelectAllIssues}
                       />
                     )}
                  </th>
                  <th className="px-4 py-4 w-1/3">Asset Details</th>
                  <th className="px-4 py-4 w-1/4">Status</th>
                  <th className="px-4 py-4">Engineer Notes & Images</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-4 py-5 text-center align-top">
                      {item.status === 'Issue' && (
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 cursor-pointer"
                          checked={selectedIssueIds.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                        />
                      )}
                    </td>
                    <td className="px-4 py-5 align-top">
                      <div className="font-bold text-gray-900 text-base">{item.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1 bg-gray-100 inline-block px-1.5 py-0.5 rounded border border-gray-200">
                        {item.serialNumber}
                      </div>
                    </td>
                    <td className="px-4 py-5 align-top">
                      {item.status === 'Fixed' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle size={14} /> Fixed
                        </span>
                      )}
                      {item.status === 'Issue' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <AlertTriangle size={14} /> Issue
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <Circle size={14} /> Pending
                        </span>
                      )}
                      {item.servicedAt && (
                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                          Updated: {item.servicedAt}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-5 align-top">
                      {/* Comments Section */}
                      {item.engineerComments ? (
                        <div className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-100 relative mb-3">
                           <div className="absolute top-3 left-0 w-1 h-8 bg-amber-300 rounded-r"></div>
                           <p className="pl-2">{item.engineerComments}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic flex items-center gap-2 opacity-50 mb-3">
                          <span className="w-4 h-0.5 bg-gray-300 rounded-full"></span> No comments
                        </div>
                      )}

                      {/* Images Section */}
                      {item.images && item.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.images.map((img, index) => (
                            <div key={index} className="relative group/img overflow-hidden rounded-lg border border-gray-200 w-16 h-16 cursor-pointer">
                              <img 
                                src={img} 
                                alt={`Issue proof ${index + 1}`} 
                                className="w-full h-full object-cover transition-transform group-hover/img:scale-110" 
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                          <Search size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Action Bar for Selected Issues */}
      {selectedIssueIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-6 fade-in">
          <div className="flex flex-col">
            <span className="font-bold text-sm">{selectedIssueIds.size} Items Selected</span>
            <span className="text-xs text-gray-400">Generate follow-up jobs</span>
          </div>
          <button 
            onClick={executeCreateFollowUp}
            className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Create Work Order
          </button>
          <button 
            onClick={() => setSelectedIssueIds(new Set())}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <ArrowLeft size={18} className="rotate-180" /> {/* Close icon visual hack or import X */}
          </button>
        </div>
      )}

      {/* Tab Content: Follow-up Orders */}
      {isAnnual && activeTab === 'Follow-up Orders' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Linked Work Orders</h2>
            <p className="text-gray-500 text-sm">
              These work orders were automatically generated from issues identified during this annual service.
            </p>
          </div>
          <WorkOrderList 
            orders={linkedFollowUps}
            onOrderClick={onOrderClick || (() => {})}
          />
        </div>
      )}
    </div>
  );
};
