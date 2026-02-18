
import React from 'react';
import { AnalysisResult, User } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  currentUser: User | null;
  onReset: () => void;
  onShare: () => void;
  onToggleListing?: (isPublic: boolean) => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, currentUser, onReset, onShare, onToggleListing }) => {
  const isOwner = currentUser?.id === data.userId;

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const handlePrint = () => {
    if (!isOwner) return;
    window.print();
  };

  const isPublic = !!data.isPublic;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-4xl mx-auto print:p-8 print:bg-white print:space-y-8">
      
      {/* HEADER ACTIONS - Restricted to Owner */}
      <div className="flex justify-between items-center px-2 print:hidden">
        <button onClick={onReset} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900">
          <i className="fas fa-arrow-left mr-2"></i> {isOwner ? 'New Analysis' : 'Back to Feed'}
        </button>
        {isOwner && (
          <div className="flex gap-3">
            <button onClick={onShare} className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors">
              <i className="fas fa-share-alt mr-2"></i> Share Link
            </button>
            <button onClick={handlePrint} className="text-[10px] font-black uppercase bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-black transition-colors shadow-lg shadow-slate-200">
              <i className="fas fa-file-pdf mr-2"></i> Export PDF
            </button>
          </div>
        )}
      </div>

      {/* MANDATORY SELECTED MODE BANNER */}
      <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-slate-900 print:border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center text-xl font-black shadow-inner print:shadow-none">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-red-100">Market Intelligence Mode</h2>
            <div className="text-xl font-black tracking-tight leading-none">
              {data.selectedMode}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="text-[10px] font-black uppercase tracking-widest text-red-200">Data Confidence</div>
          <div className="text-2xl font-black">{data.dataConfidence}</div>
        </div>
      </div>

      {/* 1. Normalization Section - PUBLIC SUMMARY */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
          <i className="fas fa-layer-group text-slate-400"></i>
          Product Normalization
        </h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">
            <div className="p-5 border-r border-slate-100">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Core Problem</div>
              <p className="text-xs font-bold text-slate-900 leading-snug">{data.normalization.coreProblem}</p>
            </div>
            <div className="p-5 border-r border-slate-100">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Target Persona</div>
              <p className="text-xs font-bold text-slate-900 leading-snug">{data.normalization.buyerPersona}</p>
            </div>
            <div className="p-5 border-r border-slate-100">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Value Prop</div>
              <p className="text-xs font-bold text-slate-900 leading-snug">{data.normalization.valueProp}</p>
            </div>
            <div className="p-5">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Price Category</div>
              <p className="text-xs font-bold text-slate-900 leading-snug">{data.normalization.pricePositioning}</p>
            </div>
          </div>
          <div className="p-5 bg-slate-900">
            <div className="text-[9px] font-black text-red-500 uppercase mb-3 tracking-widest">System Market Flags</div>
            <div className="flex flex-wrap gap-2">
              {data.normalization.initialRiskFlags.map((flag, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 text-white text-[10px] font-black rounded uppercase tracking-tighter">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Risk Header */}
      <section>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
          <div className="flex-1">
            <div className="text-[10px] text-red-600 uppercase font-black tracking-widest mb-1">Market Viability Score</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{data.productName}</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium italic">"{data.summary}"</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className={`text-7xl font-black tracking-tighter ${getRiskColor(data.failureRiskScore)}`}>
              {100 - data.failureRiskScore}<span className="text-2xl opacity-30">%</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVATE SECTIONS - Restricted to Owner */}
      {isOwner ? (
        <>
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Your Product vs Top Competitors</h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
                <div className="bg-white p-6">
                  <div className="text-[9px] font-black text-emerald-600 uppercase mb-3 tracking-widest">Strategic Wins</div>
                  <ul className="space-y-3">
                    {data.competitiveAnalysis[0].weaknesses.map((w, i) => (
                      <li key={i} className="text-xs font-bold text-slate-800 flex items-start gap-2">
                        <i className="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                        <span>Better positioning against {data.competitiveAnalysis[0].name}'s {w.toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6">
                  <div className="text-[9px] font-black text-red-500 uppercase mb-3 tracking-widest">Competitive Gaps</div>
                  <ul className="space-y-3">
                    {data.competitiveAnalysis[0].strengths.map((s, i) => (
                      <li key={i} className="text-xs font-bold text-slate-800 flex items-start gap-2">
                        <i className="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
                        <span>{data.competitiveAnalysis[0].name} leads in {s.toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Strategic Gap Verdict</div>
                <p className="text-xs font-bold text-slate-700 italic">"The market is saturated with {data.competitiveAnalysis[0].pricing} options; focus on {data.optimizationStrategies[0].category.toLowerCase()} to carve a unique niche."</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">30-Day Launch Roadmap</h3>
            <div className="bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl"><i className="fas fa-flag-checkered"></i></div>
              <div className="relative z-10 space-y-8">
                <div className="text-center md:text-left">
                  <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Winning Launch Angle</div>
                  <h4 className="text-2xl font-black">"{data.gtmPlan.launchAngle}"</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Week 1</div>
                    <p className="text-xs text-white/80 leading-snug">{data.gtmPlan.timeline.days1to7}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Weeks 2-3</div>
                    <p className="text-xs text-white/80 leading-snug">{data.gtmPlan.timeline.days8to21}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Week 4</div>
                    <p className="text-xs text-white/80 leading-snug">{data.gtmPlan.timeline.days22to30}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="print:hidden">
            <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-100 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg shadow-indigo-200">
                <i className="fas fa-bullhorn"></i>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black text-slate-900">Maximize Your Reach?</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Would you like to list this product on InsightCart to gain visibility and traction from our global community?
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => onToggleListing?.(false)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isPublic ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-900 hover:text-slate-900'}`}
                >
                  No, Keep Private
                </button>
                <button 
                  onClick={() => onToggleListing?.(true)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPublic ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600'}`}
                >
                  Yes, List Publicly
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="bg-slate-100 rounded-3xl p-12 text-center border border-slate-200 animate-in fade-in zoom-in duration-500">
          <i className="fas fa-lock text-slate-300 text-4xl mb-4"></i>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Private Audit Intelligence</h3>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-md mx-auto">
            Full competitor comparisons, GTM roadmaps, and distribution strategies are restricted to the product owner. 
            Community feedback is visible on the discovery feed.
          </p>
        </div>
      )}

      {/* Footer Actions & MANDATORY DISCLAIMER */}
      <div className="space-y-12">
        <div className="flex justify-center pt-8 print:hidden">
          <button
            onClick={isOwner ? onReset : () => window.location.reload()}
            className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center gap-3 uppercase text-xs tracking-widest shadow-2xl active:scale-[0.98]"
          >
            <i className={isOwner ? "fas fa-redo" : "fas fa-home"}></i>
            {isOwner ? 'New Analysis' : 'Discovery Hub'}
          </button>
        </div>

        <div className="max-w-2xl mx-auto text-center px-6">
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic border-t border-slate-200 pt-10 uppercase tracking-tight">
            Mode Used: {data.selectedMode} • Date: {new Date(data.timestamp).toLocaleDateString()}
          </p>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic mt-4">
            This analysis is private to the product owner. 
            Community ratings and suggestions do not represent InsightCart’s analysis. 
            InsightCart does not guarantee sales or revenue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
