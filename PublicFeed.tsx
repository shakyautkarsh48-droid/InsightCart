
import React, { useState } from 'react';
import { AnalysisResult, User } from '../types';

interface PublicFeedProps {
  products: AnalysisResult[];
  currentUser: User | null;
  onRate: (productId: string, score: number) => void;
  onSuggest: (productId: string, text: string) => void;
  onViewDetails: (product: AnalysisResult) => void;
}

const PublicFeed: React.FC<PublicFeedProps> = ({ products, currentUser, onRate, onSuggest, onViewDetails }) => {
  const [sortBy, setSortBy] = useState<'trending' | 'rated' | 'new' | 'score'>('trending');
  const [filterCategory, setFilterCategory] = useState('All');
  const [activeDetailsId, setActiveDetailsId] = useState<string | null>(null);
  const [newSuggestion, setNewSuggestion] = useState('');

  const getAvgRating = (ratings: AnalysisResult['ratings']) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length;
  };

  const sortedProducts = [...products]
    .filter(p => filterCategory === 'All' || p.normalization.pricePositioning.includes(filterCategory))
    .sort((a, b) => {
      if (sortBy === 'new') return b.timestamp - a.timestamp;
      if (sortBy === 'score') return a.failureRiskScore - b.failureRiskScore;
      if (sortBy === 'rated') return getAvgRating(b.ratings) - getAvgRating(a.ratings);
      return b.timestamp - a.timestamp; // trending fallback
    });

  const categories = ['All', ...new Set(products.map(p => p.normalization.pricePositioning.split(' ')[0]))];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <i className="fas fa-globe-americas text-red-600"></i>
          Discovery Hub
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
            <option value="trending">🔥 Trending</option>
            <option value="rated">⭐ Highest Rated</option>
            <option value="new">🆕 Newly Listed</option>
            <option value="score">📊 Highest Market Score</option>
          </select>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
            <i className="fas fa-search text-5xl text-slate-200 mb-6"></i>
            <p className="text-slate-500 font-black uppercase text-sm tracking-widest">No products found in this category.</p>
          </div>
        ) : (
          sortedProducts.map((p) => {
            const avg = getAvgRating(p.ratings);
            const userRating = p.ratings?.find(r => r.userId === currentUser?.id)?.score;
            const isOwner = currentUser?.id === p.userId;
            
            return (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-red-500 transition-all group flex flex-col">
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tighter self-start">
                          {p.normalization.pricePositioning}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          Listed by {isOwner ? 'You' : (p.userName || 'Market Pro')}
                        </span>
                      </div>
                      <div className="text-right">
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Viability</div>
                         <div className="text-xl font-black text-slate-900">{100 - p.failureRiskScore}%</div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-red-600 transition-colors">{p.productName}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2 italic">"{p.summary}"</p>
                    
                    <div className="flex items-center gap-6 pt-2 overflow-x-auto no-scrollbar">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex text-amber-400 text-[10px]">
                          {[1,2,3,4,5,6,7,8,9,10].map(s => (
                            <i key={s} className={`fas fa-star ${s <= Math.round(avg) ? 'text-amber-400' : 'text-slate-100'}`}></i>
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-900">{avg.toFixed(1)}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">({p.ratings?.length || 0} Ratings)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 justify-center">
                    <button 
                      onClick={() => onViewDetails(p)}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                    >
                      {isOwner ? 'Full Analysis' : 'Public Summary'}
                    </button>
                    <button 
                      onClick={() => setActiveDetailsId(activeDetailsId === p.id ? null : p.id)}
                      className="border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all"
                    >
                      {activeDetailsId === p.id ? 'Hide Feedback' : 'Give Feedback'}
                    </button>
                  </div>
                </div>

                {activeDetailsId === p.id && (
                  <div className="bg-slate-50 border-t border-slate-100 p-6 md:p-8 space-y-8 animate-in slide-in-from-top-4">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Rate this Product</h4>
                      <div className="flex flex-wrap gap-2">
                        {[1,2,3,4,5,6,7,8,9,10].map(score => (
                          <button
                            key={score}
                            onClick={() => onRate(p.id, score)}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${userRating === score ? 'bg-red-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500'}`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Suggestions ({p.suggestions?.length || 0})</h4>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                        {p.suggestions?.map((s, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-slate-900">{s.userName}</span>
                              <span className="text-[9px] font-bold text-slate-400">{new Date(s.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{s.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text" 
                          placeholder="What would you improve?"
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                          value={newSuggestion}
                          onChange={(e) => setNewSuggestion(e.target.value)}
                        />
                        <button 
                          onClick={() => {
                            if (newSuggestion.trim()) {
                              onSuggest(p.id, newSuggestion);
                              setNewSuggestion('');
                            }
                          }}
                          className="bg-slate-900 text-white px-6 py-3 sm:py-0 rounded-xl text-[10px] font-black uppercase whitespace-nowrap"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="text-center pt-12 border-t border-slate-200">
        <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic uppercase tracking-tight">
          Ratings and suggestions reflect community opinions. 
          InsightCart analysis is independent and advisory in nature. 
          InsightCart does not guarantee sales or revenue.
        </p>
      </div>
    </div>
  );
};

export default PublicFeed;
