
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
      setError('Invalid ID or Password. Default pass: hyundai2024');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full hyundai-blue mb-4">
             <i className="fas fa-car-side text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trend Hyundai</h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">Parts Order Management System</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="user-id" className="block text-sm font-semibold text-slate-700">User ID (e.g. user01)</label>
              <input
                id="user-id"
                name="userId"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white hyundai-blue hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">Restricted to Trend Hyundai authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
