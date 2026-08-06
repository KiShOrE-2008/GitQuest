import React from 'react';
import { ShoppingBag, Coins, Sparkles, Paintbrush, ShieldCheck } from 'lucide-react';

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
  type: 'theme' | 'avatar' | 'badge';
  detail: string;
}

const THEME_ITEMS: ShopItem[] = [
  { id: 'default', name: 'RETRO PINK', description: 'Default glowing pink and cyber purple pixel cabinet colors.', cost: 0, type: 'theme', detail: 'from-pink-600 to-purple-950' },
  { id: 'synthwave', name: 'NEON WAVE', description: 'Retro 80s aesthetics with hot neon magenta and cyan glows.', cost: 100, type: 'theme', detail: 'from-pink-500 to-cyan-500' },
  { id: 'matrix', name: 'MATRIX CHIP', description: 'Monochrome phosphorus digital green CRT glow matrix lines.', cost: 200, type: 'theme', detail: 'from-emerald-500 to-black' },
  { id: 'ocean', name: 'OCEAN DEEP', description: 'Cyber blue grid lines representing core file hierarchies.', cost: 150, type: 'theme', detail: 'from-blue-600 to-teal-900' },
];

const AVATAR_ITEMS: ShopItem[] = [
  { id: 'code-guru', name: 'Code Guru', description: 'Unlock the legendary master developer profile card.', cost: 150, type: 'avatar', detail: '🧠' },
  { id: 'git-overlord', name: 'Git Overlord', description: 'Banish repositories to the virtual netherworld.', cost: 300, type: 'avatar', detail: '👹' },
  { id: 'cherry-pick-pro', name: 'Cherry Pro', description: 'Precision commit selection avatar.', cost: 200, type: 'avatar', detail: '🍒' },
];

const BADGE_ITEMS: ShopItem[] = [
  { id: 'git-guru', name: 'Git Guru Badge', description: 'Display the honorable Git Guru card on your achievements cabinet.', cost: 250, type: 'badge', detail: '🎓' },
];

export const ShopPage: React.FC<ShopPageProps> = ({
  userProfile,
  activeTheme,
  onBuyTheme,
  onEquipTheme,
  onBuyAvatar,
  onEquipAvatar,
  onBuyBadge,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-brand-text">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-arcade text-left">
          <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
            <ShoppingBag className="text-pink-500" />
            <span>RETRO UPGRADES SHOP</span>
          </h2>
          <p className="text-cyan-400 font-pixel text-[16px] mt-1 normal-case">
            Spend your credits to customize the CRT theme, unlock avatar titles, and buy badges.
          </p>
        </div>

        {/* Coins HUD large */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-4 border-double border-amber-500 bg-amber-950/20 text-amber-400 font-arcade text-sm shadow-lg self-start">
          <Coins className="fill-amber-400/25 animate-bounce" size={16} />
          <span>{userProfile.coins} CREDITS</span>
        </div>
      </div>

      {/* 1. Theme Customizer */}
      <div className="space-y-4">
        <h3 className="text-xs font-arcade text-cyan-400 flex items-center gap-2 border-b-2 border-pink-500/20 pb-2">
          <Paintbrush size={14} className="text-cyan-400" />
          <span>CABINET GRAPHICS (THEMES)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_ITEMS.map((item) => {
            const isUnlocked = userProfile.shopUnlockedThemes.includes(item.id) || item.cost === 0;
            const isActive = activeTheme === item.id;
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`arcade-panel rounded-none p-5 flex flex-col justify-between gap-4 backdrop-blur-xl relative transition-all ${
                  isActive ? 'border-cyan-500 shadow-xl' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-tr ${item.detail} border-2 border-white/10 shrink-0`}></div>
                  <div className="text-left space-y-1">
                    <h4 className="font-arcade text-[10px] text-white">{item.name}</h4>
                    <p className="text-xs text-gray-400 font-pixel text-[14px] leading-normal">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60 font-arcade text-[8px]">
                  <span className="text-gray-500 font-semibold">
                    {item.cost === 0 ? 'FREE' : `${item.cost} CREDITS`}
                  </span>
                  
                  {isUnlocked ? (
                    isActive ? (
                      <span className="bg-pink-900/40 text-pink-400 border border-pink-500/30 px-3 py-1.5 glow-pink-text">
                        EQUIPPED
                      </span>
                    ) : (
                      <button
                        onClick={() => onEquipTheme(item.id)}
                        className="bg-slate-950 border-2 border-cyan-800 hover:border-cyan-500 text-white font-semibold py-1.5 px-4 transition-all"
                      >
                        EQUIP
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onBuyTheme(item.id, item.cost)}
                      disabled={!canAfford}
                      className="bg-amber-600 border-amber-400 hover:bg-amber-500 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-gray-700 text-white font-bold py-1.5 px-4 transition-all flex items-center gap-1"
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

      {/* 2. Custom Avatars */}
      <div className="space-y-4">
        <h3 className="text-xs font-arcade text-cyan-400 flex items-center gap-2 border-b-2 border-pink-500/20 pb-2">
          <Sparkles size={14} className="text-pink-400" />
          <span>PLAYER CHARACTERS</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVATAR_ITEMS.map((item) => {
            const isUnlocked = userProfile.shopUnlockedAvatars.includes(item.name);
            const isActive = userProfile.avatar === item.name;
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`arcade-panel rounded-none p-5 flex flex-col justify-between gap-4 backdrop-blur-xl relative transition-all ${
                  isActive ? 'border-cyan-500 shadow-xl' : ''
                }`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-3xl shadow-inner">
                    {item.detail}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-arcade text-[10px] text-white">{item.name.toUpperCase()}</h4>
                    <p className="text-xs text-gray-400 font-pixel text-[14px] leading-normal px-2">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60 font-arcade text-[8px]">
                  <span className="text-gray-500 font-semibold">
                    {item.cost} CREDITS
                  </span>
                  
                  {isUnlocked ? (
                    isActive ? (
                      <span className="bg-pink-900/40 text-pink-400 border border-pink-500/30 px-3 py-1.5 glow-pink-text">
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => onEquipAvatar(item.name)}
                        className="bg-slate-950 border-2 border-cyan-800 hover:border-cyan-500 text-white font-semibold py-1.5 px-3 transition-all"
                      >
                        SELECT
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onBuyAvatar(item.name, item.cost)}
                      disabled={!canAfford}
                      className="bg-amber-600 border-amber-400 hover:bg-amber-500 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-gray-700 text-white font-bold py-1.5 px-3 transition-all flex items-center gap-1"
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

      {/* 3. Credentials Shop */}
      <div className="space-y-4">
        <h3 className="text-xs font-arcade text-cyan-400 flex items-center gap-2 border-b-2 border-pink-500/20 pb-2">
          <ShieldCheck size={14} className="text-amber-400" />
          <span>CABINET TROPHIES</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGE_ITEMS.map((item) => {
            const isUnlocked = userProfile.badges.includes(item.id);
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className="arcade-panel rounded-none p-5 flex flex-col justify-between gap-4 backdrop-blur-xl hover:border-slate-850"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {item.detail}
                  </div>
                  <div className="text-left space-y-1">
                    <h4 className="font-arcade text-[10px] text-white">{item.name.toUpperCase()}</h4>
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
                      className="bg-amber-600 border-amber-400 hover:bg-amber-500 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-gray-700 text-white font-bold py-1.5 px-4 transition-all flex items-center gap-1"
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
