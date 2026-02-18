
import React, { useState, useEffect } from 'react';
import AdSlot from './components/AdSlot';
import ProductForm from './components/ProductForm';
import AnalysisReport from './components/AnalysisReport';
import Auth from './components/Auth';
import HistoryList from './components/HistoryList';
import SavedProducts from './components/SavedProducts';
import ComparisonView from './components/ComparisonView';
import TrendingInsights from './components/TrendingInsights';
import PublicFeed from './components/PublicFeed';
import { ProductInput, AnalysisResult, ViewState, User, SavedProduct } from './types';
import { analyzeProduct } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('auth');
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [allAnalyses, setAllAnalyses] = useState<AnalysisResult[]>([]);
  const [allSavedProducts, setAllSavedProducts] = useState<SavedProduct[]>([]);
  const [comparison, setComparison] = useState<{p1: AnalysisResult, p2: AnalysisResult} | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load persistence from global store
  useEffect(() => {
    const savedUser = localStorage.getItem('insightcart_user');
    const savedHist = localStorage.getItem('insightcart_history_global');
    const savedProds = localStorage.getItem('insightcart_saved_products_global');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView('home');
    }
    if (savedHist) setAllAnalyses(JSON.parse(savedHist));
    if (savedProds) setAllSavedProducts(JSON.parse(savedProds));
  }, []);

  // Filter lists by current user for private views
  const userHistory = currentUser ? allAnalyses.filter(h => h.userId === currentUser.id) : [];
  const userProducts = currentUser ? allSavedProducts.filter(p => p.userId === currentUser.id) : [];
  const publicListings = allAnalyses.filter(h => h.isPublic);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('insightcart_user', JSON.stringify(user));
    setView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('insightcart_user');
    setView('auth');
  };

  const handleAnalysis = async (input: ProductInput) => {
    if (!currentUser) return;
    setView('loading');
    setError(null);
    try {
      const result = await analyzeProduct(input);
      const enrichedResult: AnalysisResult = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        userName: currentUser.name,
        timestamp: Date.now(),
        isPublic: false,
        ratings: [],
        suggestions: []
      };
      
      setReport(enrichedResult);
      const updatedAnalyses = [enrichedResult, ...allAnalyses];
      setAllAnalyses(updatedAnalyses);
      localStorage.setItem('insightcart_history_global', JSON.stringify(updatedAnalyses));
      setView('result');
    } catch (err) {
      console.error(err);
      setError("Audit failed. System bottleneck. Try again.");
      setView('form');
    }
  };

  const updateGlobalAnalyses = (updated: AnalysisResult) => {
    const updatedAll = allAnalyses.map(h => h.id === updated.id ? updated : h);
    setAllAnalyses(updatedAll);
    localStorage.setItem('insightcart_history_global', JSON.stringify(updatedAll));
  };

  const handleToggleListing = (isPublic: boolean) => {
    if (!report || currentUser?.id !== report.userId) return;
    const updatedReport = { ...report, isPublic };
    setReport(updatedReport);
    updateGlobalAnalyses(updatedReport);
  };

  const handleRate = (productId: string, score: number) => {
    if (!currentUser) return;
    const item = allAnalyses.find(h => h.id === productId);
    if (!item) return;

    const existingRatings = item.ratings || [];
    const userRatingIdx = existingRatings.findIndex(r => r.userId === currentUser.id);
    
    let newRatings = [...existingRatings];
    if (userRatingIdx > -1) {
      newRatings[userRatingIdx] = { userId: currentUser.id, score };
    } else {
      newRatings.push({ userId: currentUser.id, score });
    }

    const updatedItem = { ...item, ratings: newRatings };
    if (report?.id === productId) setReport(updatedItem);
    updateGlobalAnalyses(updatedItem);
  };

  const handleSuggest = (productId: string, text: string) => {
    if (!currentUser) return;
    const item = allAnalyses.find(h => h.id === productId);
    if (!item) return;

    const newSuggestion = {
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      timestamp: Date.now()
    };

    const updatedItem = { ...item, suggestions: [...(item.suggestions || []), newSuggestion] };
    if (report?.id === productId) setReport(updatedItem);
    updateGlobalAnalyses(updatedItem);
  };

  const handleAddSavedProduct = (data: Omit<SavedProduct, 'id' | 'userId' | 'timestamp'>) => {
    if (!currentUser) return;
    const newProd: SavedProduct = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      timestamp: Date.now(),
    };
    const updated = [newProd, ...allSavedProducts];
    setAllSavedProducts(updated);
    localStorage.setItem('insightcart_saved_products_global', JSON.stringify(updated));
  };

  const handleDeleteSavedProduct = (id: string) => {
    const updated = allSavedProducts.filter(p => p.id !== id);
    setAllSavedProducts(updated);
    localStorage.setItem('insightcart_saved_products_global', JSON.stringify(updated));
  };

  const handleCompare = (p1: AnalysisResult, p2: AnalysisResult) => {
    setComparison({ p1, p2 });
    setView('compare-two');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 print:hidden shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => currentUser && setView('home')}>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
              <i className="fas fa-shield-virus text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">InsightCart</h1>
              <p className="text-[10px] text-red-600 uppercase font-black tracking-widest leading-none mt-1">AI Market Auditor</p>
            </div>
          </div>

          {currentUser && (
            <nav className="flex items-center gap-4 md:gap-5 overflow-x-auto no-scrollbar py-2">
              <button onClick={() => setView('home')} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'home' ? 'text-red-600' : 'text-slate-400 hover:text-slate-900'}`}>Discovery</button>
              <button onClick={() => setView('form')} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'form' ? 'text-red-600' : 'text-slate-400 hover:text-slate-900'}`}>New Audit</button>
              <button onClick={() => setView('saved-products')} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'saved-products' ? 'text-red-600' : 'text-slate-400 hover:text-slate-900'}`}>Inventory</button>
              <button onClick={() => setView('history')} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'history' ? 'text-red-600' : 'text-slate-400 hover:text-slate-900'}`}>History</button>
              <button onClick={() => setView('trending')} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'trending' ? 'text-red-600' : 'text-slate-400 hover:text-slate-900'}`}>Trends</button>
              <div className="hidden sm:block h-4 w-px bg-slate-200 mx-1"></div>
              <button onClick={handleLogout} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 whitespace-nowrap">Logout</button>
            </nav>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8 flex flex-col xl:flex-row gap-8">
        <aside className="hidden xl:flex w-64 flex-shrink-0 flex-col sticky top-24 self-start print:hidden order-2 xl:order-1">
          <AdSlot label="UGC Creator Ads" />
          <AdSlot label="Amazon FBA Mastery" />
          <AdSlot label="Logistics Pro 2024" />
        </aside>

        <main className="flex-1 min-w-0 order-1 xl:order-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {view === 'auth' && <Auth onLogin={handleLogin} />}
          {view === 'home' && (
            <PublicFeed 
              products={publicListings} 
              currentUser={currentUser} 
              onRate={handleRate} 
              onSuggest={handleSuggest} 
              onViewDetails={(p) => { setReport(p); setView('result'); }}
            />
          )}
          {view === 'form' && <ProductForm onSubmit={handleAnalysis} />}
          {view === 'saved-products' && (
            <SavedProducts 
              products={userProducts} 
              onAdd={handleAddSavedProduct} 
              onDelete={handleDeleteSavedProduct} 
              onAnalyze={(p) => handleAnalysis({name: p.name, productLink: p.link, description: p.description, category: p.category, price: '', targetAudience: '', country: '', platform: ''})} 
            />
          )}
          {view === 'history' && (
            <HistoryList 
              history={userHistory} 
              onSelect={(r) => {setReport(r); setView('result');}} 
              onCompare={handleCompare} 
              onBack={() => setView('form')} 
              onShare={(r) => {
                const url = `${window.location.origin}?reportId=${r.id}`;
                navigator.clipboard.writeText(url);
                alert('Public link copied to clipboard!');
              }}
            />
          )}
          {view === 'compare-two' && comparison && (
            <ComparisonView p1={comparison.p1} p2={comparison.p2} onBack={() => setView('history')} />
          )}
          {view === 'trending' && <TrendingInsights history={publicListings} />}
          {view === 'result' && report && (
            <AnalysisReport 
              data={report} 
              currentUser={currentUser}
              onReset={() => setView('form')} 
              onShare={() => { navigator.clipboard.writeText(window.location.origin + "?reportId=" + report.id); alert('Link copied!'); }} 
              onToggleListing={handleToggleListing} 
            />
          )}
          
          {view === 'loading' && (
            <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Calculating Viability...</h2>
              <p className="text-slate-400 text-xs mt-2 uppercase font-black tracking-widest text-center">Scanning Competitors, Psychology & Social Signals</p>
            </div>
          )}
        </main>

        <aside className="flex w-full xl:w-64 flex-shrink-0 flex-col xl:sticky xl:top-24 xl:self-start print:hidden order-3">
          <AdSlot label="Legal SaaS Templates" />
          <AdSlot label="Inventory Funding" />
          <AdSlot label="Shopify Experts" />
        </aside>
      </div>

      <footer className="bg-white border-t border-slate-200 py-10 px-6 print:hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase text-slate-300 tracking-widest text-center md:text-left gap-4">
          <div>© 2024 InsightCart Free Intelligence. Strict User Data Isolation Active.</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security Statement</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
