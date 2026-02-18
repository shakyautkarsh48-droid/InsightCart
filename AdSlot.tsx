
import React from 'react';

interface AdSlotProps {
  label: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ label }) => {
  return (
    <div className="ad-slot-placeholder w-full h-48 mb-6 rounded-xl flex flex-col items-center justify-center p-4 text-center transition-all hover:border-blue-400 group">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Promoted Content</div>
      <div className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
        {label}
      </div>
      <div className="mt-2 h-1 w-12 bg-slate-300 rounded group-hover:bg-blue-300"></div>
    </div>
  );
};

export default AdSlot;
