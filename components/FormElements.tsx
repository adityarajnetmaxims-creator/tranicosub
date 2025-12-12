import React, { useState, useRef, useEffect } from 'react';
import { Customer, Engineer } from '../types';
import { ChevronDown, Search, Check, Sparkles } from 'lucide-react';

// --- CUSTOMER SELECT ---
interface CustomerSelectProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer) => void;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({ customers, selectedCustomer, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filtered = customers.filter(c => 
    c.companyName.toLowerCase().includes(search.toLowerCase()) || 
    c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Customer</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
      >
        {selectedCustomer ? (
          <span className="text-gray-900 font-medium">{selectedCustomer.companyName}</span>
        ) : (
          <span className="text-gray-400">Select customer</span>
        )}
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search Customer..."
                className="w-full pl-9 pr-3 py-2 bg-white text-black border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar p-1">
            {filtered.length > 0 ? filtered.map(customer => (
              <div 
                key={customer.id}
                onClick={() => { onSelect(customer); setIsOpen(false); setSearch(''); }}
                className="px-3 py-2.5 hover:bg-gray-50 rounded-md cursor-pointer group"
              >
                <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  {customer.companyName}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                  {customer.contactName}
                </div>
              </div>
            )) : (
              <div className="p-4 text-center text-sm text-gray-500">No customers found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- ENGINEER SELECT ---
interface EngineerSelectProps {
  engineers: Engineer[];
  selectedEngineer: Engineer | null;
  onSelect: (engineer: Engineer) => void;
  recommendedId?: string | null;
}

export const EngineerSelect: React.FC<EngineerSelectProps> = ({ engineers, selectedEngineer, onSelect, recommendedId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filtered = engineers.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5 flex justify-between">
        <span>Engineer <span className="text-gray-400 font-normal">(optional)</span></span>
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
      >
        {selectedEngineer ? (
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full ${selectedEngineer.color} text-white flex items-center justify-center text-xs font-medium`}>
              {selectedEngineer.initials}
            </div>
            <span className="text-gray-900 font-medium">{selectedEngineer.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">Assign engineer</span>
        )}
        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col bottom-full mb-2 origin-bottom">
           <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search Engineer..."
                className="w-full pl-9 pr-3 py-2 bg-white text-black border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar p-1">
            {filtered.length > 0 ? filtered.map(eng => {
              const isRecommended = eng.id === recommendedId;
              return (
                <div 
                  key={eng.id}
                  onClick={() => { onSelect(eng); setIsOpen(false); setSearch(''); }}
                  className={`px-3 py-2.5 hover:bg-gray-50 rounded-md cursor-pointer flex items-center justify-between group ${isRecommended ? 'bg-indigo-50 hover:bg-indigo-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${eng.color} text-white flex items-center justify-center text-sm font-medium`}>
                      {eng.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        {eng.name}
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide border border-indigo-200">
                             <Sparkles size={10} fill="currentColor" /> AI Pick
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {eng.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedEngineer?.id === eng.id && <Check size={16} className="text-blue-600" />}
                </div>
              );
            }) : (
              <div className="p-4 text-center text-sm text-gray-500">No engineers found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};