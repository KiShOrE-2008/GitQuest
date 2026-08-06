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
  detail: string; // Theme styling colors or Avatar emoji
}

const THEME_ITEMS: ShopItem[] = [
  { id: 'default', name: 'Cyber Indigo', description: 'Deep dark cyber colors with purple glows (Default).', cost: 0, type: 'theme', detail: 'from-purple-600 to-indigo-900' },
  { id: 'synthwave', name: 'Neon Synthwave', description: 'Retro 80s aesthetics with hot pink and cyan glow gradients.', cost: 100, type: 'theme', detail: 'from-pink-500 to-cyan-500' },
  { id: 'matrix', name: 'Matrix Digital', description: 'Hacker theme styling featuring digital green glow matrix lines.', cost: 200, type: 'theme', detail: 'from-emerald-500 to-slate-950' },
  { id: 'ocean', name: 'Deep Ocean', description: 'Clean blue accents representing the depths of Git trees.', cost: 150, type: 'theme', detail: 'from-blue-600 to-teal-900' },
];

const AVATAR_ITEMS: ShopItem[] = [
  { id: 'code-guru', name: 'Code Guru', description: 'Unlock the legendary guru title avatar.', cost: 150, type: 'avatar', detail: '🧠' },
  { id: 'git-overlord', name: 'Git Overlord', description: 'Show absolute dominance over repositories.', cost: 300, type: 'avatar', detail: '👹' },
  { id: 'cherry-pick-pro', name: 'Cherry Pro', description: 'Precision commit selection avatar.', cost: 200, type: 'avatar', detail: '🍒' },
];

const BADGE_ITEMS: ShopItem[] = [
  { id: 'git-guru', name: 'Git Guru Badge', description: 'Add the honorable Git Guru credential to your badge collection case.', cost: 250, type: 'badge', detail: '🎓' },
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
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-purple-500" />
            <span>Developer Item Shop</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Exchange your simulator coins for premium themes, unique developer avatars, and rare achievements.
          </p>
        </div>

        {/* Coins HUD large */}
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-lg shadow-lg self-start">
          <Coins className="fill-amber-400/25 animate-bounce" size={24} />
          <span>{userProfile.coins} Coins</span>
        </div>
      </div>

      {/* 1. Theme Customizer */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2 border-b border-brand-border pb-2">
          <Paintbrush size={18} className="text-cyan-400" />
          <span>Premium UI Themes</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_ITEMS.map((item) => {
            const isUnlocked = userProfile.shopUnlockedThemes.includes(item.id) || item.cost === 0;
            const isActive = activeTheme === item.id;
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`bg-brand-panel border border-brand-border rounded-2xl p-5 flex flex-col justify-between gap-4 backdrop-blur-xl relative overflow-hidden transition-all ${
                  isActive ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Color preview circle */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.detail} border border-white/10 shrink-0`}></div>
                  <div className="text-left space-y-1">
                    <h4 className="font-extrabold text-base">{item.name}</h4>
                    <p className="text-xs text-gray-400 leading-normal">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60">
                  <span className="text-xs font-semibold text-gray-500">
                    {item.cost === 0 ? 'Free' : `${item.cost} Coins`}
                  </span>
                  
                  {isUnlocked ? (
                    isActive ? (
                      <span className="text-[10px] bg-purple-600 text-white font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl">
                        Active Theme
                      </span>
                    ) : (
                      <button
                        onClick={() => onEquipTheme(item.id)}
                        className="bg-slate-900 border border-slate-850 hover:bg-slate-850 text-white font-semibold py-1.5 px-4 rounded-xl text-xs transition-all"
                      >
                        Equip Theme
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onBuyTheme(item.id, item.cost)}
                      disabled={!canAfford}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-600 text-slate-950 font-bold py-1.5 px-4 rounded-xl text-xs transition-all flex items-center gap-1"
                    >
                      <Coins size={12} />
                      <span>Buy Theme</span>
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
        <h3 className="text-xl font-bold flex items-center gap-2 border-b border-brand-border pb-2">
          <Sparkles size={18} className="text-purple-400" />
          <span>Developer Custom Avatars</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVATAR_ITEMS.map((item) => {
            const isUnlocked = userProfile.shopUnlockedAvatars.includes(item.name);
            const isActive = userProfile.avatar === item.name;
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`bg-brand-panel border border-brand-border rounded-2xl p-5 flex flex-col justify-between gap-4 backdrop-blur-xl relative transition-all ${
                  isActive ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:border-slate-800'
                }`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-950/60 border border-slate-850 flex items-center justify-center text-3xl shadow-inner">
                    {item.detail}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base">{item.name}</h4>
                    <p className="text-xs text-gray-400 leading-normal px-2">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60">
                  <span className="text-xs font-semibold text-gray-500">
                    {item.cost} Coins
                  </span>
                  
                  {isUnlocked ? (
                    isActive ? (
                      <span className="text-[10px] bg-purple-600 text-white font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl">
                        Equipped
                      </span>
                    ) : (
                      <button
                        onClick={() => onEquipAvatar(item.name)}
                        className="bg-slate-900 border border-slate-850 hover:bg-slate-850 text-white font-semibold py-1.5 px-3 rounded-xl text-xs transition-all"
                      >
                        Equip
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onBuyAvatar(item.name, item.cost)}
                      disabled={!canAfford}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-600 text-slate-950 font-bold py-1.5 px-3 rounded-xl text-xs transition-all flex items-center gap-1"
                    >
                      <Coins size={12} />
                      <span>Unlock</span>
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
        <h3 className="text-xl font-bold flex items-center gap-2 border-b border-brand-border pb-2">
          <ShieldCheck size={18} className="text-amber-400" />
          <span>Credential Badges Shop</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGE_ITEMS.map((item) => {
            const isUnlocked = userProfile.badges.includes(item.id);
            const canAfford = userProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-brand-panel border border-brand-border rounded-2xl p-5 flex flex-col justify-between gap-4 backdrop-blur-xl hover:border-slate-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {item.detail}
                  </div>
                  <div className="text-left space-y-1">
                    <h4 className="font-extrabold text-base">{item.name}</h4>
                    <p className="text-xs text-gray-400 leading-normal">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60">
                  <span className="text-xs font-semibold text-gray-500">
                    {item.cost} Coins
                  </span>
                  
                  {isUnlocked ? (
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl">
                      Already Unlocked
                    </span>
                  ) : (
                    <button
                      onClick={() => onBuyBadge(item.id, item.cost)}
                      disabled={!canAfford}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-600 text-slate-950 font-bold py-1.5 px-4 rounded-xl text-xs transition-all flex items-center gap-1"
                    >
                      <Coins size={12} />
                      <span>Unlock Badge</span>
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
