import { useState } from 'react';
import { Pickaxe, Skull, Snowflake, Search, ArrowLeft } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  id: number;
  text: string;
  type: 'neutral' | 'success' | 'danger' | 'loot';
}

export default function Frostpeak() {
  const { profile, spendEnergy, takeDamage, addGold, addXp, changeLocation } = useGame();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, text: 'The biting wind of Frostpeak chills you to the bone...', type: 'neutral' }
  ]);

  const addLog = (text: string, type: LogEntry['type']) => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev]);
  };

  const handleMine = () => {
    if (!spendEnergy(10)) {
      addLog('Not enough energy to mine.', 'danger');
      return;
    }
    const roll = Math.random();
    if (roll > 0.5) {
      addGold(25);
      addXp(15);
      addLog('You extracted raw Obsidian! Sold for 25 Gold.', 'success');
    } else {
      addXp(5);
      addLog('Your pickaxe bounced off the frozen rock. Nothing found.', 'neutral');
    }
  };

  const handleHunt = () => {
    if (!spendEnergy(20)) {
      addLog('Not enough energy to hunt.', 'danger');
      return;
    }
    const successChance = 0.4 + (profile.strength * 0.02);
    const roll = Math.random();
    
    if (roll < successChance) {
      addXp(80);
      addGold(50);
      addLog('You defeated a Frost Troll! Gained 80 XP and 50 Gold.', 'loot');
    } else {
      takeDamage(25);
      addLog('The Frost Troll overpowered you! You took 25 HP damage.', 'danger');
    }
  };

  const handleBraveBlizzard = () => {
    if (!spendEnergy(40)) {
      addLog('You are too exhausted to brave the blizzard.', 'danger');
      return;
    }
    const successChance = 0.2 + (profile.intelligence * 0.02) + (profile.strength * 0.01);
    const roll = Math.random();
    
    if (roll < successChance) {
      addXp(250);
      addGold(200);
      addLog('You survived the blizzard and found a frozen hero\'s stash! Gained 250 XP and 200 Gold.', 'loot');
    } else {
      takeDamage(60);
      addLog('The blizzard overwhelmed you! You suffered severe frostbite, taking 60 HP damage.', 'danger');
    }
  };

  const returnHome = () => {
    changeLocation('oakhaven');
    navigate('/play/travel');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-2">
        <div>
          <h1 className="text-3xl font-cinzel text-blue-300 drop-shadow-sm">The Obsidian Peak</h1>
          <p className="text-sm font-sans text-stone-400 italic">Treacherous, freezing peaks.</p>
        </div>
        <button 
          onClick={returnHome}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-blue-700 text-stone-400 hover:text-blue-400 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Return to Travel Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col gap-4">
          <h2 className="font-cinzel text-xl text-stone-400 border-b border-stone-800 pb-2">Zone Actions</h2>
          
          <button 
            onClick={handleMine} disabled={profile.energy < 10}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950/80 border border-stone-800 hover:border-blue-800 rounded group transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-900 rounded group-hover:bg-blue-900/30">
                <Pickaxe className="text-blue-600 group-hover:text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-300 group-hover:text-blue-400">Mine Obsidian</h3>
                <p className="text-xs text-stone-500">Extract rare materials from the frozen earth.</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm font-bold mt-2 sm:mt-0">-10 Energy</span>
          </button>

          <button 
            onClick={handleHunt} disabled={profile.energy < 20}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950/80 border border-stone-800 hover:border-indigo-900/50 rounded group transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-900 rounded group-hover:bg-indigo-900/30">
                <Skull className="text-stone-500 group-hover:text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-300 group-hover:text-indigo-400">Hunt Frost Trolls</h3>
                <p className="text-xs text-stone-500">Battle the apex predators of the peaks.</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm font-bold mt-2 sm:mt-0">-20 Energy</span>
          </button>

          <button 
            onClick={handleBraveBlizzard} disabled={profile.energy < 40}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950/80 border border-stone-800 hover:border-cyan-700 rounded group transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-900 rounded group-hover:bg-cyan-900/30">
                <Snowflake className="text-stone-500 group-hover:text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-300 group-hover:text-cyan-400">Brave the Blizzard</h3>
                <p className="text-xs text-stone-500">Venture into the storm for legendary rewards.</p>
              </div>
            </div>
            <span className="text-blue-400 text-sm font-bold mt-2 sm:mt-0">-40 Energy</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 bg-stone-950/90 rounded border border-stone-800 p-4 shadow-inner max-h-[400px]">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h2 className="font-cinzel text-stone-400 flex items-center gap-2">
              <Search size={16} /> Exploration Log
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.map((log) => (
              <div key={log.id} className={`text-sm p-2 rounded bg-stone-900/50 border-l-2 animate-fade-in ${log.type === 'neutral' ? 'border-stone-600 text-stone-400' : ''} ${log.type === 'success' ? 'border-green-600 text-green-400' : ''} ${log.type === 'danger' ? 'border-red-600 text-red-400' : ''} ${log.type === 'loot' ? 'border-amber-500 text-amber-500 font-bold' : ''}`}>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
