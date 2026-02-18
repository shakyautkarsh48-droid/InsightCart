
import React from 'react';
import { AnalysisResult } from '../types';

interface ComparisonViewProps {
  p1: AnalysisResult;
  p2: AnalysisResult;
  onBack: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ p1, p2, onBack }) => {
  const betterProduct = (100 - p1.failureRiskScore) > (100 - p2.failureRiskScore) ? p1 : p2;

  const MetricRow = ({ label, v1, v2, higherIsBetter = true }: { label: string, v1: any, v2: any, higherIsBetter?: boolean }) => {
    const isV1Better = higherIsBetter ? v1 > v2 : v1 < v2;
    return (
      <div className="grid grid-cols-3 border-b border-slate-100 py-4 items-center">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
        <div className={`text-center font-black ${isV1Better ? 'text-emerald-600' : 'text-slate-900'}`}>{v1}</div>
        <div className={`text-center font-black ${!isV1Better ? 'text-emerald-600' : 'text-slate-900'}`}>{v2}</div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900">
          <i className="fas fa-arrow-left mr-2"></i> Back to History
        </button>
        <div className="text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1 rounded-full">Dual Product Comparison</div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 text-center text-white">
          <h2 className="text-2xl font-black tracking-tight mb-2">Comparison Matrix</h2>
          <p className="text-slate-400 text-sm">Evaluating market potential side-by-side.</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-3 mb-8">
            <div></div>
            <div className="text-center">
              <div className="text-lg font-black text-slate-900 truncate px-2">{p1.productName}</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">{p1.normalization.pricePositioning}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-slate-900 truncate px-2">{p2.productName}</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">{p2.normalization.pricePositioning}</div>
            </div>
          </div>

          <MetricRow label="Viability Score" v1={`${100 - p1.failureRiskScore}%`} v2={`${100 - p2.failureRiskScore}%`} />
          <MetricRow label="Risk Score" v1={p1.failureRiskScore} v2={p2.failureRiskScore} higherIsBetter={false} />
          <MetricRow label="Critical Issues" v1={p1.topMistakes.length} v2={p2.topMistakes.length} higherIsBetter={false} />
          <MetricRow label="Growth Strategies" v1={p1.optimizationStrategies.length} v2={p2.optimizationStrategies.length} />
          
          <div className="grid grid-cols-3 py-6 items-start">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Core Problem</div>
            <div className="px-4 text-[11px] font-medium text-slate-600 leading-tight italic">"{p1.normalization.coreProblem}"</div>
            <div className="px-4 text-[11px] font-medium text-slate-600 leading-tight italic">"{p2.normalization.coreProblem}"</div>
          </div>
        </div>

        <div className="bg-emerald-600 p-8 text-white text-center">
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-100">AI Market Verdict</div>
          <h3 className="text-xl font-black mb-2">"{betterProduct.productName}" shows higher market potential.</h3>
          <p className="text-sm text-emerald-100/80 font-medium">
            Based on failure risk vectors and competitive positioning, {betterProduct.productName} has a {100-betterProduct.failureRiskScore}% viability index vs {betterProduct === p1 ? (100-p2.failureRiskScore) : (100-p1.failureRiskScore)}% for the alternative.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
