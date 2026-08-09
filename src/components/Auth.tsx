import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, GraduationCap, Eye, EyeOff, Check, X } from 'lucide-react';
import { audio } from '../utils/audio';

interface AuthProps {
  onSuccess: () => void;
  onClose?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onClose }) => {
  const { login, loginCredentials, loginOAuth, activeWorld } = useGame();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [error, setError] = useState('');
  
  // Loading states for OAuth simulation
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | 'credentials' | null>(null);
  const [loadingStepText, setLoadingStepText] = useState('');

  const isKingdom = activeWorld === 'kingdom';

  // Password constraints
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Basic email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isSubmitting = loadingProvider === 'credentials';

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials fields.');
      audio.playError();
      return;
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      audio.playError();
      return;
    }

    if (mode === 'signup') {
      if (!username.trim()) {
        setError('Please provide a username.');
        audio.playError();
        return;
      }
      if (!collegeName.trim()) {
        setError('Please enter your college name.');
        audio.playError();
        return;
      }
      if (!isPasswordValid) {
        setError('Password does not meet security constraints (8+ chars, uppercase, lowercase, number, special char).');
        audio.playError();
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        audio.playError();
        return;
      }
    }

    audio.playClick();
    setLoadingProvider('credentials');
    setLoadingStepText(mode === 'signin' ? 'Verifying credentials with Supabase...' : 'Creating Supabase account...');

    try {
      const result = await loginCredentials(
        email.trim().toLowerCase(),
        password.trim(),
        mode === 'signup',
        mode === 'signup' ? username.trim() : undefined,
        mode === 'signup' ? collegeName.trim() : undefined
      );
      setLoadingProvider(null);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.errorMsg || 'Authentication failed');
        audio.playError();
      }
    } catch {
      setLoadingProvider(null);
      onSuccess();
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    audio.playClick();
    setLoadingProvider(provider);
    setLoadingStepText(`Connecting to Supabase ${provider === 'google' ? 'Google' : 'GitHub'} OAuth...`);

    const result = await loginOAuth(provider);
    if (!result.success) {
      setLoadingProvider(null);
      setError(result.errorMsg || `Authentication via ${provider} failed`);
      audio.playError();
    }
  };

  const handleDemoLogin = () => {
    audio.playClick();
    setLoadingProvider('credentials');
    setLoadingStepText(isKingdom 
      ? 'Constructing temporary guest chronicles...' 
      : 'Calibrating holographic simulation cockpit...'
    );
    setTimeout(() => {
      login('Demo_Operator', 'guest@gitverse.io', 'demo');
      setLoadingProvider(null);
      onSuccess();
    }, 1000);
  };

  const toggleMode = () => {
    audio.playClick();
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setCollegeName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background Star field effects */}
      <div className="absolute inset-0 bg-radial-at-t from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />
      <div className={`absolute w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20 transition-all duration-1000
        ${isKingdom ? 'bg-amber-500/20 top-1/4 left-1/4' : 'bg-cyan-500/20 bottom-1/4 right-1/4'}
      `} />

      {/* Back button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 left-5 z-10 text-slate-500 hover:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
      )}

      {/* Main card */}
      <div className={`relative z-10 w-full max-w-md rounded-3xl border p-8 backdrop-blur-xl transition-colors duration-500 shadow-2xl flex flex-col justify-between
        ${isKingdom 
          ? 'bg-amber-950/10 border-amber-500/10 shadow-amber-500/5' 
          : 'bg-cyan-950/10 border-cyan-500/10 shadow-cyan-500/5'
        }
      `}>
        {/* Loading Overlay */}
        {loadingProvider && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 rounded-3xl flex flex-col justify-center items-center p-6 text-center space-y-4">
            <Loader2 className={`w-12 h-12 animate-spin
              ${isKingdom ? 'text-amber-500' : 'text-cyan-500'}
            `} />
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-slate-500 tracking-widest block">Connecting Gateway</span>
              <p className="text-sm font-bold text-slate-200 animate-pulse">{loadingStepText}</p>
            </div>
          </div>
        )}

        {/* Header Title block */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm shadow
              ${isKingdom 
                ? 'bg-gradient-to-tr from-amber-500 to-amber-300' 
                : 'bg-gradient-to-tr from-cyan-500 to-cyan-300'
              }
            `}>
              G
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">GitVerse</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'Welcome Back!' : 'Initialize Account'}
          </h2>
          <p className="text-slate-400 text-xs font-light leading-normal max-w-[280px] mx-auto">
            {mode === 'signin' 
              ? 'Sign in to access your saved timeline nodes and dashboard metrics.' 
              : 'Create a profile to begin tracking XP, streak flames, and badges.'
            }
          </p>
        </div>

        {/* Credentials Form */}
        <form id="auth-form" onSubmit={handleCredentialsSubmit} className="space-y-3.5" noValidate>
          {error && (
            <div className="text-rose-400 border border-rose-500/20 bg-rose-500/5 px-3 py-2 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Display Username</label>
                <div className="relative">
                  <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full bg-slate-950/80 border border-slate-900 focus:border-slate-700 outline-none text-slate-100 rounded-xl px-10 py-2.5 text-sm transition-all placeholder:text-slate-650"
                    placeholder="e.g. OctocatKnight"
                  />
                  <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">College / Institution Name</label>
                <div className="relative">
                  <input
                    id="signup-college"
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    autoComplete="organization"
                    className="w-full bg-slate-950/80 border border-slate-900 focus:border-slate-700 outline-none text-slate-100 rounded-xl px-10 py-2.5 text-sm transition-all placeholder:text-slate-650"
                    placeholder="e.g. MIT, Stanford, IIT Madras"
                  />
                  <GraduationCap size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Email Address</label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`w-full bg-slate-950/80 border outline-none text-slate-100 rounded-xl px-10 py-2.5 text-sm transition-all placeholder:text-slate-650
                  ${email.length > 0
                    ? isEmailValid
                      ? 'border-slate-900 focus:border-slate-700'
                      : 'border-rose-500/50 focus:border-rose-500'
                    : 'border-slate-900 focus:border-slate-700'
                  }
                `}
                placeholder="operator@gitverse.com"
              />
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Password field with view toggle */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Password</label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full bg-slate-950/80 border border-slate-900 focus:border-slate-700 outline-none text-slate-100 rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all placeholder:text-slate-650"
                placeholder="••••••••"
              />
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password field (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`w-full bg-slate-950/80 border outline-none text-slate-100 rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all placeholder:text-slate-650
                    ${confirmPassword.length > 0 
                      ? passwordsMatch 
                        ? 'border-emerald-500/50 focus:border-emerald-500' 
                        : 'border-rose-500/50 focus:border-rose-500'
                      : 'border-slate-900 focus:border-slate-700'
                    }
                  `}
                  placeholder="••••••••"
                />
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Password Constraints Checklist (Sign Up only) */}
          {mode === 'signup' && password.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 space-y-1.5 text-[11px]">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block mb-1">Password Requirements</span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-400">
                <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {hasLength ? <Check size={12} className="text-emerald-400 shrink-0" /> : <X size={12} className="text-slate-600 shrink-0" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {hasUpper ? <Check size={12} className="text-emerald-400 shrink-0" /> : <X size={12} className="text-slate-600 shrink-0" />}
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {hasLower ? <Check size={12} className="text-emerald-400 shrink-0" /> : <X size={12} className="text-slate-600 shrink-0" />}
                  <span>Lowercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {hasNumber ? <Check size={12} className="text-emerald-400 shrink-0" /> : <X size={12} className="text-slate-600 shrink-0" />}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                  {hasSpecial ? <Check size={12} className="text-emerald-400 shrink-0" /> : <X size={12} className="text-slate-600 shrink-0" />}
                  <span>Special char (!@#$...)</span>
                </div>
                {confirmPassword.length > 0 && (
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400 font-medium' : 'text-rose-400'}`}>
                    {passwordsMatch ? <Check size={12} className="text-emerald-400 shrink-0" /> : <X size={12} className="text-rose-400 shrink-0" />}
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-sm font-bold text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md mt-5
              ${isKingdom
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/10'
                : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/10'
              } disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {mode === 'signin' ? 'Verify Blueprint Profile' : 'Construct New Profile'}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Separator line */}
        <div className="flex items-center gap-3 my-6 text-[10px] font-extrabold uppercase text-slate-600 select-none">
          <span className="flex-grow h-px bg-slate-900" />
          <span>Social Login</span>
          <span className="flex-grow h-px bg-slate-900" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => handleOAuthLogin('google')}
            className="w-full py-3 rounded-xl text-xs font-bold bg-white text-slate-950 border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all hover:scale-[1.01]"
          >
            {/* Google G icon drawing in SVG */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          
          <button 
            onClick={() => handleOAuthLogin('github')}
            className="w-full py-3 rounded-xl text-xs font-bold bg-slate-900 text-slate-100 border border-slate-800 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.01] hover:text-white"
          >
            {/* Github Octocat SVG */}
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Continue with GitHub
          </button>

          <button 
            type="button"
            onClick={handleDemoLogin}
            className={`w-full py-3 rounded-xl text-xs font-bold border transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 mt-1
              ${isKingdom
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20'
              }
            `}
          >
            Explore in Demo Sandbox Mode
          </button>
        </div>

        {/* Sign In / Sign Up toggler link */}
        <div className="text-center mt-8 text-xs">
          <span className="text-slate-500 font-medium">
            {mode === 'signin' ? "Don't have a profile yet? " : 'Already registered? '}
          </span>
          <button 
            onClick={toggleMode}
            className={`font-black hover:underline
              ${isKingdom ? 'text-amber-400' : 'text-cyan-400'}
            `}
          >
            {mode === 'signin' ? 'Create Blueprint Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
