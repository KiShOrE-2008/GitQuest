import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, Shield, Rocket } from 'lucide-react';
import { audio } from '../utils/audio';

export const Settings: React.FC = () => {
  const { 
    activeWorld, 
    setWorld, 
    themeMode, 
    toggleThemeMode, 
    soundEnabled, 
    setSoundEnabled 
  } = useGame();

  const [animationSpeed, setAnimationSpeed] = useState<'normal' | 'fast' | 'cinematic'>('normal');

  const isKingdom = activeWorld === 'kingdom';

  const handleWorldSwitch = (world: 'kingdom' | 'space') => {
    setWorld(world);
  };

  const handleAnimationSpeedChange = (speed: 'normal' | 'fast' | 'cinematic') => {
    setAnimationSpeed(speed);
    audio.playClick();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Title */}
      <div className={`rounded-3xl border overflow-hidden p-6 backdrop-blur-xl relative transition-all duration-500 shadow-2xl flex items-center justify-between gap-6
        ${isKingdom ? 'bg-amber-950/10 border-amber-500/10' : 'bg-cyan-950/10 border-cyan-500/10'}
      `}>
        {/* Glow */}
        <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20
          ${isKingdom ? 'bg-amber-500' : 'bg-cyan-500'}
        `} />

        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white border shadow-md
            ${isKingdom ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'}
          `}>
            <SettingsIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Configuration Settings</h2>
            <p className="text-slate-400 text-xs font-light">
              Customize game variables, audio channels, graphics rendering, and switch story universes.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid Card */}
      <div className="bg-slate-950/40 rounded-3xl border border-slate-900 overflow-hidden shadow-2xl p-6 space-y-8">
        
        {/* 1. Universe Selection Theme Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Game Universe Storyline</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleWorldSwitch('kingdom')}
              className={`rounded-2xl p-5 border flex items-center justify-between transition-all duration-300 text-left relative overflow-hidden group
                ${isKingdom 
                  ? 'bg-amber-500/[0.04] border-amber-500/50 shadow-lg shadow-amber-500/5' 
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
                }
              `}
            >
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-200 block">🏰 Kingdom Chronicles</span>
                <span className="text-[10px] text-slate-500 leading-normal block">Warm palettes, medieval metaphors, castle constructing blueprints.</span>
              </div>
              <Shield size={18} className={isKingdom ? 'text-amber-500' : 'text-slate-600'} />
            </button>

            <button 
              onClick={() => handleWorldSwitch('space')}
              className={`rounded-2xl p-5 border flex items-center justify-between transition-all duration-300 text-left relative overflow-hidden group
                ${!isKingdom 
                  ? 'bg-cyan-500/[0.04] border-cyan-500/50 shadow-lg shadow-cyan-500/5' 
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
                }
              `}
            >
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-200 block">🚀 Space Odyssey</span>
                <span className="text-[10px] text-slate-500 leading-normal block">Cool neon, futuristic satellites, reactor engineering modules.</span>
              </div>
              <Rocket size={18} className={!isKingdom ? 'text-cyan-500' : 'text-slate-600'} />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-900/60" />

        {/* 2. Visual appearance / Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">UI Style Theme</label>
            <p className="text-[10px] text-slate-500">Toggle between Dark Mode and Light Mode dashboard layouts.</p>
          </div>
          <button
            onClick={toggleThemeMode}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200
              ${isKingdom
                ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/25 text-amber-300'
                : 'bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
              }
            `}
          >
            {themeMode === 'dark' ? (
              <>
                <Moon size={14} /> Dark Mode Enabled
              </>
            ) : (
              <>
                <Sun size={14} /> Light Mode Enabled
              </>
            )}
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-900/60" />

        {/* 3. Audio / sound toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Synthesizer Sound Effects</label>
            <p className="text-[10px] text-slate-500">Enable or disable Web Audio API interface audio feed indicators.</p>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200
              ${soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
              }
            `}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={14} /> Audio Enabled
              </>
            ) : (
              <>
                <VolumeX size={14} /> Audio Muted
              </>
            )}
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-slate-900/60" />

        {/* 4. Animation Rate */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Commit Transition Speed</label>
            <p className="text-[10px] text-slate-500">Alter drawing rendering speed rates for the timeline visualization nodes.</p>
          </div>
          <div className="flex bg-slate-900 border border-slate-850 p-1.5 rounded-xl gap-1">
            {(['normal', 'fast', 'cinematic'] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => handleAnimationSpeedChange(speed)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-200
                  ${animationSpeed === speed
                    ? isKingdom 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
