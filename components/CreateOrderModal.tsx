import React, { useState, useEffect } from 'react';
import { Customer, Engineer, OrderType } from '../types';
import { CustomerSelect, EngineerSelect } from './FormElements';
import { CUSTOMERS, ENGINEERS } from '../constants';
import { X, Calendar, Wrench, Sparkles, UploadCloud } from 'lucide-react';
import { getEngineerRecommendation } from '../services/geminiService';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [orderType, setOrderType] = useState<OrderType>(null);
  
  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [recommendedEngId, setRecommendedEngId] = useState<string | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setOrderType(null);
        setSelectedCustomer(null);
        setTitle('');
        setDescription('');
        setSelectedEngineer(null);
        setFiles([]);
        setRecommendedEngId(null);
        setAiReasoning(null);
      }, 300);
    }
  }, [isOpen]);

  // AI Recommendation Trigger
  useEffect(() => {
    if (title.length > 5 && description.length > 10 && step === 2) {
      const timer = setTimeout(async () => {
        setIsAiLoading(true);
        const result = await getEngineerRecommendation(title, description, ENGINEERS);
        setRecommendedEngId(result.engineerId);
        setAiReasoning(result.reasoning);
        setIsAiLoading(false);
      }, 1000); // Debounce
      return () => clearTimeout(timer);
    }
  }, [title, description, step]);

  const handleTypeSelect = (type: OrderType) => {
    setOrderType(type);
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (!selectedCustomer) return;
    onSubmit({
      customer: selectedCustomer,
      title,
      description,
      engineer: selectedEngineer,
      type: orderType,
      date: new Date().toLocaleDateString(),
      attachments: files.map(f => f.name)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 1 ? 'New Service Request' : orderType}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <button 
                onClick={() => handleTypeSelect('Annual Service')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Annual Service</h3>
                  <p className="text-sm text-gray-500 mt-1">Scheduled maintenance and yearly checks for contracted equipment.</p>
                </div>
              </button>

              <button 
                onClick={() => handleTypeSelect('Regular Work Order')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Regular Work Order</h3>
                  <p className="text-sm text-gray-500 mt-1">Ad-hoc repairs, fixes, and general support requests.</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Customer */}
              <CustomerSelect 
                customers={CUSTOMERS} 
                selectedCustomer={selectedCustomer}
                onSelect={setSelectedCustomer}
              />

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Issue Title <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Conveyor belt malfunction"
                  className="w-full px-3 py-2.5 bg-white text-black border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Issue Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail"
                  rows={4}
                  className="w-full px-3 py-2.5 bg-white text-black border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 resize-none"
                />
                {isAiLoading && (
                  <div className="mt-2 text-xs text-indigo-600 flex items-center gap-1.5 animate-pulse">
                    <Sparkles size={12} />
                    Analyzing issue for engineer match...
                  </div>
                )}
                {!isAiLoading && aiReasoning && (
                  <div className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-2">
                    <Sparkles className="text-indigo-600 mt-0.5 shrink-0" size={14} />
                    <p className="text-xs text-indigo-800 leading-tight">
                      <span className="font-semibold">AI Recommendation:</span> {aiReasoning}
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Attachments <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors text-center relative">
                   <input 
                    type="file" 
                    onChange={handleFileChange}
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <UploadCloud className="text-gray-400 mb-2" size={32} />
                   <p className="text-sm font-medium text-gray-900">Choose files or drag & drop it here</p>
                   <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, MP4, MOV, up to 50MB</p>
                   {files.length > 0 && (
                     <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {files.map((f, i) => (
                          <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-gray-700">
                            {f.name}
                          </span>
                        ))}
                     </div>
                   )}
                   <button className="mt-4 px-4 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-700 shadow-sm pointer-events-none">
                     Browse files
                   </button>
                </div>
              </div>

              {/* Engineer */}
              <EngineerSelect 
                engineers={ENGINEERS}
                selectedEngineer={selectedEngineer}
                onSelect={setSelectedEngineer}
                recommendedId={recommendedEngId}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button 
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              Back
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!selectedCustomer}
              className={`px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all
                ${selectedCustomer 
                  ? 'bg-black hover:bg-gray-800 hover:shadow-md' 
                  : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Create Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};