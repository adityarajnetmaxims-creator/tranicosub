import React from 'react';
import { Bell } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="bg-gray-50/50 h-16 flex items-center justify-end px-8 shrink-0">
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-gray-50">
            4
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#A87B51] text-white flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity">
          LY
        </div>
      </div>
    </header>
  );
};