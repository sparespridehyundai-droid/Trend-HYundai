
import React, { useState } from 'react';
import { User } from '../types';
import { AUTH_USERS, DEFAULT_PASS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AUTH_USERS.find(u => u.id.toLowerCase() === userId.toLowerCase());
    if (user && password === DEFAULT_PASS) {
      onLogin(user);
    } else {
      setError('Invalid ID or Password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] px-10">
      <div className="w-full max-w-sm space-y-12">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-28 h-28 bg-gradient-to-tr from-[#E67E22] to-[#F39C12] rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(230,126,34,0.3)] rotate-6 hover:rotate-0 transition-all duration-500 group">
              <span className="text-white text-6xl font-black -rotate-6 group-hover:rotate-0 transition-all duration-500">T</span>
            </div>
            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#0F172A]">
               <i className="fas fa-shield-halved text-[#E67E22] text-xl"></i>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">Trend</h1>
          <p className="text-[#E67E22] text-[16px] tracking-[0.5em] font-black uppercase mt-1">Spares</p>
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-1 bg-[#E67E22] rounded-full"></div>
            <div className="w-2 h-1 bg-white/20 rounded-full"></div>
            <div className="w-2 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-lg placeholder-slate-500 outline-none focus:border-[#E67E22] focus:bg-white/10 transition-all shadow-inner"
                placeholder="USERNAME"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <i className="fas fa-user absolute right-6 top-1/2 -translate-y-1/2 text-white/10"></i>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-lg placeholder-slate-500 outline-none focus:border-[#E67E22] focus:bg-white/10 transition-all shadow-inner"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fas fa-lock absolute right-6 top-1/2 -translate-y-1/2 text-white/10"></i>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 py-3 rounded-xl">
                <p className="text-rose-400 text-[10px] text-center font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-[#E67E22] text-white text-xl font-black rounded-3xl shadow-[0_20px_50px_rgba(230,126,34,0.3)] active:scale-95 transition-all hover:brightness-110 uppercase tracking-[0.2em]"
          >
            Access Spares
          </button>
        </form>
        
        <p className="text-center text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">Authorized Access Only</p>
      </div>
    </div>
  );
};

export default Login;
