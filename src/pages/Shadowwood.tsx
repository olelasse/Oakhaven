import { useState } from 'react';
import { Leaf, Sword, Skull, Search, ArrowLeft } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  id: number;
  text: string;
  type: 'neutral' | 'success' | 'danger' | 'loot';
}

export default function Shadowwood() {
  const { profile, spendEnergy, takeDamage, addGold, addXp, changeLocation } = useGame();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, text: 'You step into the cold, oppressive fog of The Shadowwood...', type: 'neutral' }
  ]);

  const addLog = (text: string, type: LogEntry['type']) => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev]);
  };

  const handleForage = () => {
    if (!spendEnergy(5)) {
      addLog('Not enough energy to forage.', 'danger');
      return;
    }
    const roll = Math.random();
    if (roll > 0.6) {
      addGold(15);
      addXp(10);
      addLog('You found some rare Bloodweed! Sold for 15 Gold.', 'success');
    } else {
      addXp(5);
      addLog('You spent hours searching but only found common roots.', 'neutral');
    }
  };

  const handleHunt = () => {
    if (!spendEnergy(15)) {
      addLog('Not enough energy to hunt.', 'danger');
      return;
    }
    const successChance = 0.5 + (profile.agility * 0.01) + (profile.strength * 0.01);
    const roll = Math.random();
    
    if (roll < successChance) {
      addXp(40);
      addGold(30);
      addLog('You tracked and successfully hunted a Feral Wolf! Gained 40 XP and 30 Gold.', 'loot');
    } else {
      takeDamage(15);
      addLog('A Feral Wolf ambushed you! You barely escaped, taking 15 HP damage.', 'danger');
    }
  };

  const handleExploreRuins = () => {
    if (!spendEnergy(30)) {
      addLog('You are too exhausted to delve into the ruins.', 'danger');
      return;
    }
    const successChance = 0.3 + (profile.intelligence * 0.02);
    const roll = Math.random();
    
    if (roll < successChance) {
      addXp(150);
      addGold(100);
      addLog('You successfully navigated the traps in the Forgotten Ruins and found a hidden chest! Gained 150 XP and 100 Gold.', 'loot');
    } else {
      takeDamage(40);
      addLog('You triggered an ancient trap in the ruins! You took a massive 40 HP damage and fled.', 'danger');
    }
  };

  const returnHome = () => {
    changeLocation('oakhaven');
    navigate('/travel');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full text-stone-300">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-2">
        <div>
          <h1 className="text-3xl font-cinzel text-green-700 drop-shadow-sm">The Shadowwood</h1>
          <p className="text-sm font-sans text-stone-500 italic">The trees are whispering your name...</p>
        </div>
        <button 
          onClick={returnHome}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-700 text-stone-400 hover:text-amber-500 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Return to Travel Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        
        {/* Actions Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="font-cinzel text-xl text-stone-400 border-b border-stone-800 pb-2">Zone Actions</h2>
          
          <button 
            onClick={handleForage}
            disabled={profile.energy < 5}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950/80 border border-stone-800 hover:border-green-800 rounded group transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-900 rounded group-hover:bg-green-900/30">
                <Leaf className="text-green-600 group-hover:text-green-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-300 group-hover:text-green-400">Forage for Herbs</h3>
                <p className="text-xs text-stone-500">Search the undergrowth for valuable Bloodweed.</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm font-bold mt-2 sm:mt-0">-5 Energy</span>
          </button>

          <button 
            onClick={handleHunt}
            disabled={profile.energy < 15}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950/80 border border-stone-800 hover:border-red-900/50 rounded group transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-900 rounded group-hover:bg-red-900/30">
                <Sword className="text-stone-500 group-hover:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-300 group-hover:text-red-400">Hunt Feral Wolves</h3>
                <p className="text-xs text-stone-500">Track and fight the dangerous beasts of the woods.</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm font-bold mt-2 sm:mt-0">-15 Energy</span>
          </button>

          <button 
            onClick={handleExploreRuins}
            disabled={profile.energy < 30}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950/80 border border-stone-800 hover:border-amber-700 rounded group transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-900 rounded group-hover:bg-amber-900/30">
                <Skull className="text-stone-500 group-hover:text-amber-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-300 group-hover:text-amber-500">Explore Ruins</h3>
                <p className="text-xs text-stone-500">High risk, high reward. Rely on your intelligence to avoid traps.</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm font-bold mt-2 sm:mt-0">-30 Energy</span>
          </button>
        </div>

        {/* Action Log */}
        <div className="flex flex-col gap-4 bg-stone-950/90 rounded border border-stone-800 p-4 shadow-inner max-h-[400px]">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h2 className="font-cinzel text-stone-400 flex items-center gap-2">
              <Search size={16} /> Exploration Log
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`text-sm p-2 rounded bg-stone-900/50 border-l-2 animate-fade-in
                  ${log.type === 'neutral' ? 'border-stone-600 text-stone-400' : ''}
                  ${log.type === 'success' ? 'border-green-600 text-green-400' : ''}
                  ${log.type === 'danger' ? 'border-red-600 text-red-400' : ''}
                  ${log.type === 'loot' ? 'border-amber-500 text-amber-500 font-bold' : ''}
                `}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
