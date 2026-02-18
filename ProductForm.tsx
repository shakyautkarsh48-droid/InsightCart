
import React, { useState } from 'react';
import { ProductInput } from '../types';

interface ProductFormProps {
  onSubmit: (data: ProductInput) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<'A' | 'B'>('A');
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    productLink: '',
    description: '',
    category: '',
    price: '',
    targetAudience: '',
    country: '',
    platform: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Mode B, we clear the link. In Mode A, empty fields will be auto-filled by AI
    const submissionData = mode === 'B' ? { ...formData, productLink: '' } : formData;
    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-slate-800 px-8 py-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <i className="fas fa-shield-virus"></i>
          InsightCart Market Audit
        </h2>
        <p className="text-red-100 text-sm mt-1">Professional Grade Failure Prediction Engine</p>
      </div>

      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => setMode('A')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
            mode === 'A' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fas fa-bolt mr-2 text-amber-500"></i>
          Mode A: Auto-Scan Link
        </button>
        <button
          onClick={() => setMode('B')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
            mode === 'B' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fas fa-file-invoice mr-2 text-blue-500"></i>
          Mode B: Manual Entry
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {mode === 'A' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
              <i className="fas fa-magic text-emerald-600"></i>
              <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-tight">
                AI will automatically extract pricing, category & audience from the link.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Product/Store URL</label>
              <input
                required
                name="productLink"
                type="url"
                placeholder="https://www.amazon.com/example-product"
                className="w-full px-5 py-4 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-lg"
                value={formData.productLink}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Internal Reference Name</label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="e.g., Summer Collection Mask"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Target Region (Optional)</label>
                <input 
                  name="country" 
                  type="text" 
                  placeholder="e.g., USA, UK" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none" 
                  value={formData.country} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Name</label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="e.g., Luxury Sleep Mask"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <input 
                  required 
                  name="category" 
                  type="text" 
                  placeholder="e.g., Wellness" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" 
                  value={formData.category} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Description</label>
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Detail the product, pricing structure, and target audience persona..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Price ($)</label>
                <input required name="price" type="text" placeholder="49.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" value={formData.price} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Buyer Persona</label>
                <input required name="targetAudience" type="text" placeholder="Busy Parents" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" value={formData.targetAudience} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Region</label>
                <input required name="country" type="text" placeholder="US" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" value={formData.country} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Platform</label>
                <input required name="platform" type="text" placeholder="Shopify" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" value={formData.platform} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <i className="fas fa-radar text-red-500"></i>
          <span className="uppercase tracking-widest text-xs">
            {mode === 'A' ? 'Run AI Link Scan' : 'Run Manual Risk Audit'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
