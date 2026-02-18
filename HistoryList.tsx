
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (report: AnalysisResult) => void;
  onCompare: (p1: AnalysisResult, p2: AnalysisResult) => void;
  onBack: () => void;
  onShare: (report: AnalysisResult) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onCompare, onBack, onShare }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const handleCompareClick = () => {
    const p1 = history.find(h => h.id === selectedIds[0]);
    const p2 = history.find(h => h.id === selectedIds[1]);
    if (p1 && p2) onCompare(p1, p2);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <i className="fas fa-history text-slate-400"></i>
            Analysis Vault
          </h2>
          {selectedIds.length > 0 && (
            <p className="text-[10px] font-black text-red-600 uppercase mt-1">
              Selected {selectedIds.length}/2 for comparison
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {selectedIds.length === 2 && (
            <button 
              onClick={handleCompareClick}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
            >
              Compare Side-by-Side
            </button>
          )}
          <button 
            onClick={onBack}
            className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest"
          >
            Back
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
          <i className="fas fa-folder-open text-5xl text-slate-200 mb-6"></i>
          <p className="text-slate-500 font-black uppercase text-sm tracking-widest">No historical audits found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {[...history].sort((a, b) => b.timestamp - a.timestamp).map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col md:flex-row items-center justify-between p-5 hover:shadow-lg group ${selectedIds.includes(report.id) ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => toggleSelect(report.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${selectedIds.includes(report.id) ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  {selectedIds.includes(report.id) && <i className="fas fa-check text-[10px]"></i>}
                </button>
                <div onClick={() => onSelect(report)} className="cursor-pointer flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <i className={report.selectedMode.includes('LINK') ? 'fas fa-link' : 'fas fa-keyboard'}></i>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight">{report.productName}</h3>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                      {new Date(report.timestamp).toLocaleDateString()} • {report.normalization.pricePositioning}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-end mt-4 md:mt-0">
                <div className="text-right">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Viability Score</div>
                  <div className={`text-xl font-black ${report.failureRiskScore < 40 ? 'text-emerald-600' : report.failureRiskScore < 70 ? 'text-amber-600' : 'text-red-600'}`}>
                    {100 - report.failureRiskScore}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onShare(report)} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                    <i className="fas fa-share-alt text-[10px]"></i>
                  </button>
                  <button onClick={() => onSelect(report)} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all">
                    <i className="fas fa-chevron-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
