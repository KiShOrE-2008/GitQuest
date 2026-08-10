import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Lock, Mail, Key, AlertTriangle, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (session: any) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('admin@gitquest.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'create'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Login failed. No user returned.');
        setLoading(false);
        return;
      }

      // Check if user has is_admin flag
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        setError('Could not verify admin status. Profile not found.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (!profile.is_admin) {
        setError('Access denied. This account does not have admin privileges.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      onSuccess(data.session);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign up the admin account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: 'Admin',
            collegeName: 'GitQuest Admin'
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Sign up failed. No user returned.');
        setLoading(false);
        return;
      }

      // Upsert the profile with is_admin = true
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        username: 'Admin',
        email: email.trim(),
        college_name: 'GitQuest Admin',
        provider: 'supabase',
        is_admin: true,
        xp: 0,
        level: 1,
        streak: 0
      });

      if (upsertError) {
        setError('Account created but could not set admin flag: ' + upsertError.message);
        setLoading(false);
        return;
      }

      // Now sign in
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (loginError) {
        setError('Admin account created! But auto-login failed: ' + loginError.message + '. Please check your email for verification if required, then login.');
        setMode('login');
        setLoading(false);
        return;
      }

      if (loginData.session) {
        onSuccess(loginData.session);
      } else {
        setError('Admin account created! Please check your email for verification if required, then login.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] bg-red-500/10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] bg-violet-500/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.8)_70%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to App
        </button>

        {/* Login Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800/60 shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="p-8 pb-6 border-b border-slate-800/40 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-xl shadow-red-500/20 mb-5 ring-1 ring-red-400/30">
              <Shield size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Console</h1>
            <p className="text-xs text-slate-400 mt-1.5 font-light">
              GitVerse Administration Panel — Supabase Authenticated
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="px-8 pt-6">
            <div className="flex bg-slate-950/60 rounded-xl p-1 border border-slate-800/40">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300
                  ${mode === 'login'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }
                `}
              >
                <LogIn size={14} /> Login
              </button>
              <button
                onClick={() => { setMode('create'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300
                  ${mode === 'create'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }
                `}
              >
                <UserPlus size={14} /> Create Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleCreateAdmin} className="p-8 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail size={12} /> Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all duration-300 font-mono"
                placeholder="admin@gitquest.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Key size={12} /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}
                ${mode === 'login'
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                  : 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                }
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <Lock size={16} /> Authenticate & Enter
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Create Admin Account
                </>
              )}
            </button>

            {mode === 'create' && (
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                This will create a new Supabase account with <code className="text-violet-400">is_admin: true</code> flag.
                Use email <code className="text-violet-400">admin@gitquest.com</code> and password <code className="text-violet-400">Admin@2026</code>.
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-600 mt-6 font-mono">
          GitVerse Admin Console v1.0 · Supabase Authenticated
        </p>
      </div>
    </div>
  );
};
