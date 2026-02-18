
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Market Pro',
      email: email || 'user@insightcart.ai',
      createdAt: Date.now(),
    };
    onLogin(newUser);
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
            <i className="fas fa-shield-virus"></i>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">InsightCart SaaS</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase font-black tracking-widest">Access Private Intelligence</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Professional Email</label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            Log In & Start Analysis
          </button>
          <p className="text-center text-[10px] text-slate-400 font-medium">
            InsightCart is FREE. Ads support our computational costs.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
