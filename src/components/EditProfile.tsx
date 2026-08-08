import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Mail, GraduationCap, Save, CheckCircle2, ArrowLeft } from 'lucide-react';
import { audio } from '../utils/audio';

interface EditProfileProps {
  onBack?: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ onBack }) => {
  const { activeWorld, user, updateUser } = useGame();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isKingdom = activeWorld === 'kingdom';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Username cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setErrorMsg('');
    updateUser({
      username: username.trim(),
      email: email.trim(),
      collegeName: collegeName.trim()
    });

    audio.playVictory();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getInitials = (name: string) => {
    return (name || 'OP').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-16">
      {/* Title Header Card */}
      <div className={`rounded-3xl border overflow-hidden p-6 backdrop-blur-xl relative transition-all duration-500 shadow-2xl flex items-center justify-between gap-6
        ${isKingdom ? 'bg-amber-950/10 border-amber-500/10' : 'bg-cyan-950/10 border-cyan-500/10'}
      `}>
        {/* Glow */}
        <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        <div className="flex items-center gap-4 relative z-10">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 transition-all shrink-0"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border shadow-md shrink-0
            ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}
          `}>
            <User size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Edit Profile Details</h2>
            <p className="text-slate-400 text-xs font-light">
              Update your account credentials, avatar preview, and academy affiliation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Edit Form */}
      <div className="bg-slate-950/50 rounded-3xl border border-slate-850 p-8 space-y-8 backdrop-blur-xl shadow-2xl">
        {/* Live Avatar Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-850">
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-2xl blur-md opacity-70 transition duration-500
              ${isKingdom ? 'bg-gradient-to-tr from-amber-500 to-amber-300' : 'bg-gradient-to-tr from-cyan-500 to-cyan-300'}
            `} />
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl text-slate-950 relative z-10 border shadow-xl
              ${isKingdom 
                ? 'bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 border-amber-300' 
                : 'bg-gradient-to-tr from-cyan-400 via-cyan-300 to-cyan-200 border-cyan-300'
              }
            `}>
              {getInitials(username)}
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-lg font-bold text-white">{username || 'Username Preview'}</span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border
                ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}
              `}>
                {isKingdom ? 'Royal Chronologer' : 'Starfleet Operator'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{email || 'email@gitverse.io'}</p>
            {collegeName && (
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <GraduationCap size={13} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
                <span>{collegeName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-fadeIn">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <User size={14} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
              Username / Operator Handle
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Solaris_Coder"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. solaris@google.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
              required
            />
          </div>

          {/* College / Institute Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap size={14} className={isKingdom ? 'text-amber-400' : 'text-cyan-400'} />
              College / Academy / Institute (Optional)
            </label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Stanford University / Royal Guild Academy"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>

          {/* Form Controls */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-900">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
                ${isKingdom
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/15'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/15'
                }
              `}
            >
              <Save size={16} /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
