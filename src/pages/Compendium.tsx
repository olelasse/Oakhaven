import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEM_DATABASE } from '../data/items';
import { ArrowLeft, Search, Filter, Shield, Sword, FlaskConical, CircleDot } from 'lucide-react';

import type { Item } from '../types';

export default function Compendium() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredItems = Object.values(ITEM_DATABASE).filter((item: Item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return <Sword size={14} className="text-red-400" />;
      case 'armor': return <Shield size={14} className="text-blue-400" />;
      case 'consumable': return <FlaskConical size={14} className="text-green-400" />;
      case 'material': return <CircleDot size={14} className="text-stone-400" />;
      default: return null;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-stone-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-amber-500 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      default: return 'text-stone-400';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] animate-fade-in text-stone-300 relative z-10 p-2 sm:p-4 md:p-8">
      
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-cinzel text-blue-300 drop-shadow-sm flex items-center gap-3">
            <Search className="text-blue-500" size={28} /> Grand Compendium
          </h1>
          <p className="text-sm font-sans text-stone-500 italic mt-1">A complete repository of known artifacts in Oakhaven.</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-blue-700 text-stone-400 hover:text-blue-500 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0 bg-stone-900/50 p-4 border border-stone-800 rounded">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-stone-500" size={18} />
          <input 
            type="text" 
            placeholder="Search items by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded p-2 pl-10 text-stone-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
          <Filter size={18} className="text-stone-500" />
          {['all', 'weapon', 'armor', 'consumable', 'material'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors border ${
                filterType === type 
                  ? 'bg-blue-900/50 border-blue-500 text-blue-200' 
                  : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item: Item) => (
            <div key={item.id} className="bg-stone-900/80 border border-stone-800 hover:border-blue-900/50 rounded p-4 flex flex-col gap-2 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-stone-950 rounded border border-stone-800">
                    {getTypeIcon(item.type)}
                  </div>
                  <h3 className={`font-cinzel font-bold text-lg ${getRarityColor(item.rarity)}`}>{item.name}</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {item.rarity}
                </span>
              </div>
              
              <p className="text-xs text-stone-400 italic mb-2 leading-relaxed h-10 line-clamp-2">{item.description}</p>
              
              <div className="mt-auto grid grid-cols-2 gap-2 text-xs border-t border-stone-800 pt-3">
                {item.slot === 'weapon' && <span className="text-red-400 font-mono bg-red-950/30 px-2 py-1 rounded">ATK: {item.bonus_damage}</span>}
                {item.type === 'equipment' && item.slot !== 'weapon' && <span className="text-blue-400 font-mono bg-blue-950/30 px-2 py-1 rounded">DEF: {item.bonus_defense}</span>}
                <span className="text-amber-500 font-mono bg-amber-950/30 px-2 py-1 rounded">Val: {item.gold_cost}g</span>
                <span className="text-stone-500 font-mono bg-stone-950 px-2 py-1 rounded">Lvl: {item.required_level}</span>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-500 font-cinzel text-xl">
              No items match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
