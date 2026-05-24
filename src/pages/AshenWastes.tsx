import { useState } from 'react';
import { Bone, Flame, Skull, Search, ArrowLeft } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  id: number;
  text: string;
  type: 'neutral' | 'success' | 'danger' | 'loot';
}

export default function AshenWastes() {
  const { profile, spendEnergy, takeDamage, addGold, addXp, changeLocation } = useGame();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, text: 'Ash crunches beneath your boots in this dead land...', type: 'neutral' }
  ]);

  const addLog = (text: string, type: LogEntry['type']) => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev]);
  };

  const handleScavenge = () => {
    if (!spendEnergy(15)) return addLog('Not enough energy.', 'danger');
    if (Math.random() > 0.4) {
      addGold(40); addXp(20);
      addLog('You found valuable intact bones! Sold for 40 Gold.', 'success');
    } else {
      addXp(5);
      addLog('Only dust and shattered remnants here.', 'neutral');
    }
  };

  const handleFightElementals = () => {
    if (!spendEnergy(25)) return addLog('Not enough energy.', 'danger');
    if (Math.random() < 0.3 + (profile.agility * 0.02)) {
      addXp(120); addGold(80);
      addLog('You extinguished a Fire Elemental! Gained 120 XP and 80 Gold.', 'loot');
    } else {
      takeDamage(35);
      addLog('The elemental burned you! You took 35 HP damage.', 'danger');
    }
  };

  const handleRaidTombs = () => {
    if (!spendEnergy(50)) return addLog('Not enough energy.', 'danger');
    if (Math.random() < 0.2 + (profile.intelligence * 0.02)) {
      addXp(350); addGold(300);
      addLog('You looted a forgotten Pharaoh\'s tomb! Gained 350 XP and 300 Gold.', 'loot');
    } else {
      takeDamage(80);
      addLog('You awoke an ancient curse! You took 80 HP damage.', 'danger');
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-2">
        <div>
          <h1 className="text-3xl font-cinzel text-orange-500 drop-shadow-sm">The Ashen Wastes</h1>
          <p className="text-sm font-sans text-stone-500 italic">A cursed desert of grey ash.</p>
        </div>
        <button onClick={() => { changeLocation('oakhaven'); navigate('/play/travel'); }} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-orange-500 rounded text-sm">
          <ArrowLeft size={16} /> Return
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col gap-4">
          <button onClick={handleScavenge} disabled={profile.energy < 15} className="flex p-4 bg-stone-950/80 border border-stone-800 hover:border-orange-800 rounded group text-left justify-between items-center">
            <div className="flex gap-4"><Bone className="text-orange-600" /><div><h3 className="font-bold text-stone-300">Scavenge Bones</h3><p className="text-xs text-stone-500">Dig through the ash.</p></div></div><span className="text-blue-400 font-bold">-15 Energy</span>
          </button>
          <button onClick={handleFightElementals} disabled={profile.energy < 25} className="flex p-4 bg-stone-950/80 border border-stone-800 hover:border-red-800 rounded group text-left justify-between items-center">
            <div className="flex gap-4"><Flame className="text-red-600" /><div><h3 className="font-bold text-stone-300">Fight Elementals</h3><p className="text-xs text-stone-500">Battle living fire.</p></div></div><span className="text-blue-400 font-bold">-25 Energy</span>
          </button>
          <button onClick={handleRaidTombs} disabled={profile.energy < 50} className="flex p-4 bg-stone-950/80 border border-stone-800 hover:border-amber-700 rounded group text-left justify-between items-center">
            <div className="flex gap-4"><Skull className="text-amber-500" /><div><h3 className="font-bold text-stone-300">Raid Tombs</h3><p className="text-xs text-stone-500">High risk, massive reward.</p></div></div><span className="text-blue-400 font-bold">-50 Energy</span>
          </button>
        </div>
        <div className="flex flex-col gap-4 bg-stone-950/90 rounded border border-stone-800 p-4 max-h-[400px]">
          <h2 className="font-cinzel text-stone-400 flex items-center gap-2 border-b border-stone-800 pb-2"><Search size={16} /> Exploration Log</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.map((log) => (<div key={log.id} className={`text-sm p-2 rounded bg-stone-900/50 border-l-2 animate-fade-in ${log.type === 'neutral' ? 'border-stone-600 text-stone-400' : ''} ${log.type === 'success' ? 'border-green-600 text-green-400' : ''} ${log.type === 'danger' ? 'border-red-600 text-red-400' : ''} ${log.type === 'loot' ? 'border-amber-500 text-amber-500 font-bold' : ''}`}>{log.text}</div>))}
          </div>
        </div>
      </div>
    </div>
  );
}
