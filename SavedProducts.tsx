
import React, { useState } from 'react';
import { SavedProduct } from '../types';

interface SavedProductsProps {
  products: SavedProduct[];
  onAdd: (p: Omit<SavedProduct, 'id' | 'userId' | 'timestamp'>) => void;
  onDelete: (id: string) => void;
  onAnalyze: (p: SavedProduct) => void;
}

const SavedProducts: React.FC<SavedProductsProps> = ({ products, onAdd, onDelete, onAnalyze }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', link: '', description: '', category: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', link: '', description: '', category: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <i className="fas fa-boxes text-slate-400"></i>
          My Product Inventory
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
        >
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required placeholder="Product Name" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              placeholder="Store/Live Link (Optional)" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
              value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
            />
          </div>
          <textarea 
            required placeholder="Full Product Description" 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
            rows={3}
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <button type="submit" className="w-full bg-red-600 text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest">
            Save to Inventory
          </button>
        </form>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-bold">Your inventory is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900">{p.name}</h3>
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase">User-Owned</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-1">{p.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onAnalyze(p)} className="bg-slate-900 text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Analyze</button>
                <button onClick={() => onDelete(p.id)} className="text-red-500 w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProducts;
