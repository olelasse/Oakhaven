import { useState } from 'react';
import { ArrowLeft, Anvil, Coins, Hammer, LogOut } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import type { ItemRarity } from '../types';

const getRarityColor = (rarity: ItemRarity) => {
  switch (rarity) {
    case 'common': return 'text-stone-300';
    case 'uncommon': return 'text-green-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-orange-400';
    default: return 'text-stone-300';
  }
};

export default function Blacksmith() {
  const { inventory, upgradeItem, sellItem } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upgrade' | 'sell'>('upgrade');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const equippedWeapon = inventory.find(i => i.is_equipped && i.item?.slot === 'weapon');
  const sellableItems = inventory.filter(i => !i.is_equipped && i.item && i.item.sold_at_blacksmith);

  const handleUpgrade = () => {
    if (!equippedWeapon) return;
    const res = upgradeItem(equippedWeapon.id);
    setMessage({ text: res.message, type: res.success ? 'success' : 'error' });
  };

  const handleSell = (id: string) => {
    const res = sellItem(id);
    setMessage({ text: res.message, type: res.success ? 'success' : 'error' });
  };

  return (
    <div className="animate-fade-in flex flex-col h-full text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-600 drop-shadow-sm">The Blacksmith</h1>
          <p className="text-sm font-sans text-stone-500 italic">Sparks fly as the hammer meets the anvil.</p>
        </div>
        <button onClick={() => navigate('/play')} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-amber-500 rounded text-sm">
          <ArrowLeft size={16} /> Return to Town
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-stone-800 mb-6">
        <button 
          onClick={() => { setActiveTab('upgrade'); setMessage(null); }}
          className={`flex items-center gap-2 pb-2 px-2 font-cinzel font-bold transition-colors ${activeTab === 'upgrade' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <Hammer size={18} /> Upgrade Equipment
        </button>
        <button 
          onClick={() => { setActiveTab('sell'); setMessage(null); }}
          className={`flex items-center gap-2 pb-2 px-2 font-cinzel font-bold transition-colors ${activeTab === 'sell' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <LogOut size={18} /> Sell to Blacksmith
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded font-bold text-center text-sm ${message.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'upgrade' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-950/80 border border-stone-800 rounded p-6">
            <h2 className="font-cinzel text-xl text-stone-400 mb-4 flex items-center gap-2"><Anvil /> The Anvil</h2>
            {equippedWeapon && equippedWeapon.item ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-stone-900 border border-stone-700 rounded text-center shadow-inner">
                  <h3 className={`font-bold text-lg ${getRarityColor(equippedWeapon.item.rarity)}`}>
                    {equippedWeapon.item.name} <span className="text-amber-500">[+{equippedWeapon.upgrade_level}]</span>
                  </h3>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">{equippedWeapon.item.rarity} Weapon</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-stone-950 p-2 rounded border border-stone-800">
                      <span className="text-stone-500 block">Current Damage</span>
                      <span className="text-stone-300 font-bold">{equippedWeapon.item.bonus_damage + (equippedWeapon.upgrade_level * 2)}</span>
                    </div>
                    <div className="bg-stone-950 p-2 rounded border border-stone-800">
                      <span className="text-stone-500 block">Next Level</span>
                      <span className="text-green-500 font-bold">{equippedWeapon.upgrade_level >= 10 ? 'MAX' : equippedWeapon.item.bonus_damage + ((equippedWeapon.upgrade_level + 1) * 2)}</span>
                    </div>
                  </div>
                </div>

                {equippedWeapon.upgrade_level < 10 ? (
                  <button onClick={handleUpgrade} className="w-full py-4 bg-amber-700 hover:bg-amber-600 text-amber-100 font-cinzel font-bold rounded flex justify-center items-center gap-2 shadow-lg transition-colors">
                    Upgrade Weapon <Coins size={16} /> {equippedWeapon.item.gold_cost * equippedWeapon.upgrade_level}
                  </button>
                ) : (
                  <button disabled className="w-full py-4 bg-stone-800 text-stone-500 font-cinzel font-bold rounded cursor-not-allowed border border-stone-700">
                    MAX LEVEL REACHED
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 italic border-2 border-dashed border-stone-800 rounded">
                Equip a weapon in your inventory to upgrade it here.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sell' && (
        <div className="bg-stone-950/80 border border-stone-800 rounded p-6">
          <h2 className="font-cinzel text-xl text-stone-400 mb-4">Sell Unwanted Gear</h2>
          <p className="text-sm text-stone-500 mb-6">The Blacksmith will buy standard equipment for 50% of its base value. He does not buy legendary or rare artifacts.</p>
          
          {sellableItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellableItems.map(invItem => (
                <div key={invItem.id} className="p-3 bg-stone-900 border border-stone-800 rounded flex flex-col justify-between hover:border-amber-900/50 transition-colors">
                  <div>
                    <h3 className={`font-bold ${getRarityColor(invItem.item!.rarity)}`}>{invItem.item!.name} <span className="text-amber-700">[+{invItem.upgrade_level}]</span></h3>
                    <p className="text-xs text-stone-500 mb-3">{invItem.quantity > 1 ? `Quantity: ${invItem.quantity}` : `Lvl ${invItem.item!.required_level} ${invItem.item!.slot}`}</p>
                  </div>
                  <button onClick={() => handleSell(invItem.id)} className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded flex items-center justify-center gap-2 text-sm font-bold border border-stone-700 transition-colors">
                    Sell <Coins size={14} className="text-amber-500" /> {Math.floor(invItem.item!.gold_cost / 2)}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-600 italic border-2 border-dashed border-stone-800 rounded">
              You have no standard equipment to sell.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
