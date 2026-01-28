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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#102A43] px-10">
      <div className="w-full max-w-sm space-y-16">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white tracking-tighter">Trend</span>
            <p className="text-[#E67E22] text-[13px] tracking-[0.4em] font-black uppercase mt-1">Spares</p>
          </div>
          <p className="text-white/30 text-[9px] font-medium absolute top-8 right-8">
             {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}, {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-10" onSubmit={handleLogin}>
          <div className="space-y-10">
            {/* Username Field */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border border-white/40 rounded-lg px-5 py-4 text-white text-lg placeholder-white/30 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all"
                  placeholder="Username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="flex justify-start gap-1.5 px-1">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white/20"></div>
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full bg-transparent border border-white/40 rounded-lg px-5 py-4 text-white text-lg placeholder-white/30 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <span className="text-white/40 text-xs">••••</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-orange-400 text-[10px] text-center font-black uppercase tracking-widest animate-pulse">{error}</p>
          )}

          <div className="pt-4 flex justify-center">
            <button
                type="submit"
                className="w-56 py-4 bg-[#E67E22] text-white text-xl font-bold rounded-full shadow-[0_10px_30px_rgba(230,126,34,0.3)] active:scale-95 transition-all transform hover:brightness-110"
            >
                Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;