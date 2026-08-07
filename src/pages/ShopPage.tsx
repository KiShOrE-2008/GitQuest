import React from 'react';
import { ShoppingBag, Coins, Sparkles, ShieldCheck } from 'lucide-react';

interface ShopPageProps {
  userProfile: {
    coins: number;
    shopUnlockedThemes: string[];
    shopUnlockedAvatars: string[];
    avatar: string;
    badges: string[];
  };
  activeTheme: string;
  onBuyTheme: (themeId: string, cost: number) => void;
  onEquipTheme: (themeId: string) => void;
  onBuyAvatar: (avatarName: string, cost: number) => void;
  onEquipAvatar: (avatarName: string) => void;
  onBuyBadge: (badgeId: string, cost: number) => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'avatar' | 'badge';
  detail: string;
}

const AVATAR_ITEMS: ShopItem[] = [
  { id: 'archmage', name: 'Grand Archmage', description: 'Unlock the legendary advisor of the high king. Ancient power.', cost: 150, type: 'avatar', detail: '🧙‍♂️' },
  { id: 'admiral', name: 'Fleet Commander', description: 'Command spacecraft timelines with cosmic authority.', cost: 200, type: 'avatar', detail: '👨‍✈️' },
  { id: 'ai-core', name: 'Station AI Core', description: 'Become the sentinel intelligence monitoring system sectors.', cost: 250, type: 'avatar', detail: '💠' },
  { id: 'chancellor', name: 'Lord Chancellor', description: 'Direct the royal archive registry with absolute scroll control.', cost: 300, type: 'avatar', detail: '📜' },
];

const BADGE_ITEMS: ShopItem[] = [
  { id: 'holy-grail', name: 'Holy Grail of Git', description: 'Kingdom trophy representing the ultimate artifact of history control.', cost: 200, type: 'badge', detail: '🏆' },
  { id: 'warp-drive', name: 'Warp Drive Core', description: 'Space trophy indicating perfect synchronization of parallel sectors.', cost: 250, type: 'badge', detail: '🧬' },
  { id: 'commit-lord', name: 'Lord of the Commit', description: 'Reign supreme over repository branches with gold chronicle badges.', cost: 300, type: 'badge', detail: '👑' },
  { id: 'timeline-warden', name: 'Timeline Warden', description: 'Space cadet achievement for resolving multiple conflicting realities.', cost: 350, type: 'badge', detail: '🌀' },
];

export const ShopPage: React.FC<ShopPageProps> = ({
  userProfile,
  activeTheme,
  onBuyAvatar,
  onEquipAvatar,
  onBuyBadge,
}) => {
  const isKingdom = activeTheme === 'kingdom';

  // Dynamic styling classes
  const accentText = isKingdom ? 'text-amber-400' : 'text-cyan-400';
  const borderCol = isKingdom ? 'border-amber-500/20' : 'border-pink-500/20';
  const mainBorder = isKingdom ? 'border-amber-500/60' : 'border-pink-500/60';
  const buttonStyle = isKingdom
    ? 'bg-amber-600 border-amber-400 hover:bg-amber-500 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-gray-700'
    : 'bg-pink-600 border-pink-400 hover:bg-pink-500 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-gray-700';

  return (
    <div className={`max-w-4xl mx-auto space-y-8 ${isKingdom ? 'text-amber-100' : 'text-cyan-100'}`}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-arcade text-left">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isKingdom ? 'text-amber-400' : 'text-pink-400'}`}>
            <ShoppingBag />
            <span>GITVERSE COSMETIC ARCHIVES</span>
          </h2>
          <p className={`${accentText} font-pixel text-[16px] mt-1 normal-case`}>
            {isKingdom 
              ? 'Exchange your hard-earned credits for legendary realm figures and royal relics.'
              : 'Allocate space credits to requisition advanced officer status files and chronometer hardware.'}
          </p>
        </div>

        {/* Coins HUD large */}
        <div className={`flex items-center gap-2.5 px-5 py-3 border-4 border-double bg-slate-950 font-arcade text-sm shadow-lg self-start ${
          isKingdom ? 'border-amber-500 text-amber-400' : 'border-cyan-500 text-cyan-400'
        }`}>
          <Coins className="animate-bounce" size={16} />
          <span>{userProfile.coins} CREDITS</span>
        </div>
      </div>

      {/* 1. Custom Avatars Section */}
      <div className="space-y-4">
        <h3 className={`text-xs font-arcade flex items-center gap-2 border-b-2 ${borderCol} pb-2 ${accentText}`}>
          <Sparkles size={14} />
          <span>EXPANDED CHARACTER PROFILES</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVATAR_ITEMS.map((item) => {
            const isUnlocked = userProfile.shopUnlockedAvatars.includes(item.name);
            const isActive = userProfile.avatar === item.name;
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`arcade-panel rounded-none p-5 flex flex-col justify-between gap-4 backdrop-blur-xl relative transition-all ${mainBorder} ${
                  isActive ? isKingdom ? 'border-amber-400 shadow-xl' : 'border-cyan-500 shadow-xl' : ''
                }`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-3xl shadow-inner">
                    {item.detail}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-arcade text-[9px] text-white truncate max-w-full">{item.name.toUpperCase()}</h4>
                    <p className="text-xs text-gray-400 font-pixel text-[14px] leading-normal px-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60 font-arcade text-[8px]">
                  <span className="text-gray-500 font-semibold">
                    {item.cost} CREDITS
                  </span>
                  
                  {isUnlocked ? (
                    isActive ? (
                      <span className={`border px-3 py-1.5 glow-text ${
                        isKingdom ? 'bg-amber-900/40 border-amber-500/30 text-amber-400' : 'bg-pink-900/40 border-pink-500/30 text-pink-400'
                      }`}>
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => onEquipAvatar(item.name)}
                        className={`bg-slate-950 border-2 text-white font-semibold py-1.5 px-3 transition-all ${
                          isKingdom ? 'border-amber-800 hover:border-amber-500' : 'border-cyan-800 hover:border-cyan-500'
                        }`}
                      >
                        SELECT
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onBuyAvatar(item.name, item.cost)}
                      disabled={!canAfford}
                      className={`text-white font-bold py-1.5 px-3 transition-all flex items-center gap-1 border-2 ${buttonStyle}`}
                    >
                      <Coins size={10} />
                      <span>UNLOCK</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Credentials Badges Section */}
      <div className="space-y-4">
        <h3 className={`text-xs font-arcade flex items-center gap-2 border-b-2 ${borderCol} pb-2 ${accentText}`}>
          <ShieldCheck size={14} />
          <span>REALM ACHIEVEMENT RELICS</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGE_ITEMS.map((item) => {
            const isUnlocked = userProfile.badges.includes(item.id);
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`arcade-panel rounded-none p-5 flex flex-col justify-between gap-4 backdrop-blur-xl hover:border-slate-800 ${mainBorder}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {item.detail}
                  </div>
                  <div className="text-left space-y-1">
                    <h4 className="font-arcade text-[9px] text-white">{item.name.toUpperCase()}</h4>
                    <p className="text-xs text-gray-400 font-pixel text-[14px] leading-normal">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60 font-arcade text-[8px]">
                  <span className="text-gray-500 font-semibold">
                    {item.cost} CREDITS
                  </span>
                  
                  {isUnlocked ? (
                    <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5">
                      OWNED
                    </span>
                  ) : (
                    <button
                      onClick={() => onBuyBadge(item.id, item.cost)}
                      disabled={!canAfford}
                      className={`text-white font-bold py-1.5 px-4 transition-all flex items-center gap-1 border-2 ${buttonStyle}`}
                    >
                      <Coins size={10} />
                      <span>BUY TROPHY</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
