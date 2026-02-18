
import React from 'react';
import { AnalysisResult, TrendingAggregate } from '../types';

interface TrendingInsightsProps {
  history: AnalysisResult[];
}

const TrendingInsights: React.FC<TrendingInsightsProps> = ({ history }) => {
  // Simulated aggregation logic
  const publicProducts = history.filter(h => h.isPublic);
  
  const aggregateData: TrendingAggregate = {
    topCategories: [
      { name: 'Eco-Wellness', growth: '+42%' },
      { name: 'Niche SaaS', growth: '+28%' },
      { name: 'Pet Technology', growth: '+15%' }
    ],
    winningPriceBands: [
      { band: '$49 - $99', successRate: '78%' },
      { band: '$199 - $499', successRate: '64%' },
      { band: '$0 - $25', successRate: '41%' }
    ],
    platformPerformance: [
      { name: 'TikTok Shop', score: '9.2' },
      { name: 'Meta Advantage+', score: '8.5' },
      { name: 'Pinterest Ads', score: '7.1' }
    ],
    commonWinningPatterns: [
      'Bundled trial periods for subscription products.',
      'Explicit supply-chain transparency in value props.',
      'Comparison-focused landing pages vs major incumbents.'
    ],
    commonFailurePatterns: [
      'Vague target personas (e.g., "everyone").',
      'Pricing too low for sustainable ad-spend margins.',
      'Lack of recognizable trust badges on checkout.'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <i className="fas fa-fire text-red-500"></i>
            Advanced Trending Engine
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
            Real-time market signals aggregated from 12,000+ anonymous product audits. 
            Identities are never exposed. Patterns only.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Fast-Rising Categories</h3>
          <div className="space-y-4">
            {aggregateData.topCategories.map((c, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">{c.name}</span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{c.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Bands */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Winning Price Bands</h3>
          <div className="space-y-4">
            {aggregateData.winningPriceBands.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">{p.band}</span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{p.successRate} PR</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {aggregateData.platformPerformance.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">{p.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-slate-900">{p.score}</span>
                  <i className="fas fa-star text-[8px] text-amber-400"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patterns Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100">
          <h3 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fas fa-check-circle"></i> Winning Archetypes
          </h3>
          <ul className="space-y-4">
            {aggregateData.commonWinningPatterns.map((p, i) => (
              <li key={i} className="text-sm font-bold text-slate-800 leading-snug flex items-start gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100">
          <h3 className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fas fa-times-circle"></i> Failure Traps
          </h3>
          <ul className="space-y-4">
            {aggregateData.commonFailurePatterns.map((p, i) => (
              <li key={i} className="text-sm font-bold text-slate-800 leading-snug flex items-start gap-3">
                <span className="text-red-400 mt-1">•</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Public Discovery (Reach) Section */}
      {publicProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Live Discovery Feed</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase">Visible to all users</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicProducts.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-red-400 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-black text-slate-900">{p.productName}</h4>
                    <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-black uppercase">{100 - p.failureRiskScore}% Score</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.summary}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">{p.normalization.pricePositioning}</span>
                  <button className="text-[9px] font-black text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Full Insight</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TrendingInsights;
