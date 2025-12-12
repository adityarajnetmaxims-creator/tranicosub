
import React, { useState } from 'react';
import { WorkOrderList } from './components/WorkOrderList';
import { CreateOrderModal } from './components/CreateOrderModal';
import { Button } from './components/Button';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { INITIAL_ORDERS, generateServiceItems } from './constants';
import { WorkOrder, Priority, OrderType, ServiceItem } from './types';
import { Plus } from 'lucide-react';

const TABS = ['New', 'Pending', 'Ongoing', 'Declined', 'History'];

type ViewType = 'work-orders' | 'annual-service' | 'dashboard' | 'engineers' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState('New');
  const [currentView, setCurrentView] = useState<ViewType>('work-orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<WorkOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

  const handleCreateOrder = (data: any) => {
    const newOrderType: OrderType = data.type;
    
    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      jobNumber: `${newOrderType === 'Annual Service' ? 'AS' : 'WO'}-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customer: data.customer,
      title: data.title || 'Untitled Request',
      description: data.description,
      date: data.date,
      priority: Priority.NO_PRIORITY, // Default
      status: 'New',
      assignedEngineer: data.engineer || null,
      type: newOrderType,
      attachments: data.attachments || [],
      // For Demo purposes: Inject some machines if it's an Annual Service
      serviceItems: newOrderType === 'Annual Service' ? generateServiceItems(25) : undefined
    };
    
    setOrders([newOrder, ...orders]);

    // Automatically switch view to match the created order type and close any detail view
    setSelectedOrder(null);
    if (newOrderType === 'Annual Service') {
      setCurrentView('annual-service');
    } else {
      setCurrentView('work-orders');
    }
  };

  const handleCreateFollowUp = (parentOrder: WorkOrder, items: ServiceItem[]) => {
    // Generate description based on selected items
    const description = `Follow-up required for the following items from ${parentOrder.jobNumber}:\n\n` + 
      items.map(item => `• ${item.name} (SN: ${item.serialNumber})\n  Issue: ${item.engineerComments || 'Not specified'}`).join('\n\n');

    const newOrder: WorkOrder = {
      id: `wo-fu-${Date.now()}`,
      jobNumber: `FU-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customer: parentOrder.customer,
      title: `Follow-up: ${items.length} Issue${items.length > 1 ? 's' : ''} from ${parentOrder.title}`,
      description: description,
      date: new Date().toLocaleDateString(),
      priority: Priority.HIGH, // Default to high for issues
      status: 'New',
      assignedEngineer: null,
      type: 'Regular Work Order',
      attachments: []
    };

    // 1. Add new order to list
    // 2. Update parent order to include this new ID in followUpIds
    const updatedOrders = orders.map(o => {
      if (o.id === parentOrder.id) {
        return {
          ...o,
          followUpIds: [...(o.followUpIds || []), newOrder.id]
        };
      }
      return o;
    });

    setOrders([newOrder, ...updatedOrders]);
    
    // Update the currently selected order in view so the new tab shows data immediately
    setSelectedOrder(prev => prev ? {
      ...prev,
      followUpIds: [...(prev.followUpIds || []), newOrder.id]
    } : null);
  };

  const handleNavigate = (page: string) => {
    setCurrentView(page as ViewType);
    setSelectedOrder(null); // Reset detail view when switching main pages
  };

  // Filter orders based on current view
  const filteredOrders = orders.filter(order => {
    if (currentView === 'annual-service') {
      return order.type === 'Annual Service';
    }
    // Default to 'work-orders' view showing 'Regular Work Order' or undefined types
    return order.type === 'Regular Work Order' || !order.type;
  });

  const getPageTitle = () => {
    switch (currentView) {
      case 'annual-service': return 'Annual Services';
      case 'work-orders': return 'Work Orders';
      default: return 'Work Orders';
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar currentPage={currentView} onNavigate={handleNavigate} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto">
          {selectedOrder ? (
            <ServiceDetailPage 
              order={selectedOrder} 
              allOrders={orders}
              onBack={() => setSelectedOrder(null)} 
              onCreateFollowUp={handleCreateFollowUp}
              onOrderClick={setSelectedOrder}
            />
          ) : (
            <div className="max-w-7xl mx-auto p-8 space-y-8">
              
              {/* Page Header */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
                  <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                    Add {currentView === 'annual-service' ? 'Service' : 'Work Order'}
                  </Button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium transition-all relative
                        ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                      `}
                    >
                      {tab}
                      {tab === 'New' && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 font-semibold border border-gray-200">
                          {filteredOrders.length}
                        </span>
                      )}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <WorkOrderList 
                orders={filteredOrders} 
                hidePriority={currentView === 'annual-service'}
                onOrderClick={setSelectedOrder}
              />
              
            </div>
          )}
        </div>
      </main>

      <CreateOrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}

export default App;
