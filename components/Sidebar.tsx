
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Map,
  CalendarRange
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [isCustomerOpen, setIsCustomerOpen] = useState(true);

  const getLinkClass = (pageName: string) => {
    const isActive = currentPage === pageName;
    return `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive 
        ? 'bg-gray-900 text-white shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col shrink-0">
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">TRANICO LTD</h1>
        <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] mt-1">GYM SERVICES & EQUIPMENT</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
        
        {/* Section: Overview */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Overview</h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => onNavigate('dashboard')} className={getLinkClass('dashboard')}>
                <LayoutDashboard size={18} />
                Dashboard
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Management */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Management</h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => onNavigate('engineers')} className={getLinkClass('engineers')}>
                <Users size={18} />
                Engineers
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsCustomerOpen(!isCustomerOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={18} />
                  Customer
                </div>
                {isCustomerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {isCustomerOpen && (
                <ul className="mt-1 ml-9 space-y-1">
                  <li>
                    <button className="block px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900 transition-colors w-full text-left">
                      Gym Customer
                    </button>
                  </li>
                  <li>
                    <button className="block px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900 transition-colors w-full text-left">
                      Sub-Contract
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => onNavigate('work-orders')} className={getLinkClass('work-orders')}>
                <ClipboardList size={18} />
                Work Orders
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('annual-service')} className={getLinkClass('annual-service')}>
                <CalendarRange size={18} />
                Annual Service
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Tools */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Tools</h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => onNavigate('settings')} className={getLinkClass('settings')}>
                <Map size={18} />
                Settings
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};
