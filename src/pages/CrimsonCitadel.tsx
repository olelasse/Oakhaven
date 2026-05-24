import { useState } from 'react';
import { Sword, Ghost, Search, ArrowLeft } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  id: number;
  text: string;
  type: 'neutral' | 'success' | 'danger' | 'loot';
}

export default function CrimsonCitadel() {
  const { profile, spendEnergy, takeDamage, addGold, addXp, changeLocation } = useGame();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, text: 'You step into the foreboding halls of the Crimson Citadel...', type: 'neutral' }
  ]);

  const addLog = (text: string, type: LogEntry['type']) => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev]);
  };

  const handleAssassinate = () => {
    if (!spendEnergy(30)) return addLog('Not enough energy.', 'danger');
    if (Math.random() < 0.2 + (profile.agility * 0.03)) {
      addGold(150); addXp(200);
      addLog('You successfully assassinated a Shadow Guard! Gained 200 XP and 150 Gold.', 'loot');
    } else {
      takeDamage(50);
      addLog('The Shadow Guard spotted you! You barely escaped, taking 50 HP damage.', 'danger');
    }
  };

  const handleRaidArmory = () => {
    if (!spendEnergy(60)) return addLog('Not enough energy.', 'danger');
    if (Math.random() < 0.15 + (profile.strength * 0.02)) {
      addXp(500); addGold(400);
      addLog('You smashed through the armory doors and stole their treasury! Gained 500 XP and 400 Gold.', 'loot');
    } else {
      takeDamage(90);
      addLog('You triggered the Citadel alarms! You took massive 90 HP damage while fleeing.', 'danger');
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-red-900 pb-2 mb-2">
        <div>
          <h1 className="text-3xl font-cinzel text-red-600 drop-shadow-sm">The Crimson Citadel</h1>
          <p className="text-sm font-sans text-red-900 italic">The stronghold of the Shadow Lord.</p>
        </div>
        <button onClick={() => { changeLocation('oakhaven'); navigate('/play/travel'); }} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-red-500 rounded text-sm">
          <ArrowLeft size={16} /> Flee to Town
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col gap-4">
          <button onClick={handleAssassinate} disabled={profile.energy < 30} className="flex p-4 bg-stone-950/80 border border-stone-800 hover:border-red-900 rounded group text-left justify-between items-center">
            <div className="flex gap-4"><Ghost className="text-stone-500 group-hover:text-red-600" /><div><h3 className="font-bold text-stone-300">Assassinate Guards</h3><p className="text-xs text-stone-500">Sneak past the defenses.</p></div></div><span className="text-blue-400 font-bold">-30 Energy</span>
          </button>
          <button onClick={handleRaidArmory} disabled={profile.energy < 60} className="flex p-4 bg-stone-950/80 border border-stone-800 hover:border-amber-700 rounded group text-left justify-between items-center">
            <div className="flex gap-4"><Sword className="text-amber-700 group-hover:text-amber-500" /><div><h3 className="font-bold text-stone-300">Raid the Armory</h3><p className="text-xs text-stone-500">Extremely high risk and reward.</p></div></div><span className="text-blue-400 font-bold">-60 Energy</span>
          </button>
        </div>
        <div className="flex flex-col gap-4 bg-stone-950/90 rounded border border-stone-800 p-4 max-h-[400px]">
          <h2 className="font-cinzel text-stone-400 flex items-center gap-2 border-b border-stone-800 pb-2"><Search size={16} /> Citadel Log</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.map((log) => (<div key={log.id} className={`text-sm p-2 rounded bg-stone-900/50 border-l-2 animate-fade-in ${log.type === 'neutral' ? 'border-stone-600 text-stone-400' : ''} ${log.type === 'success' ? 'border-green-600 text-green-400' : ''} ${log.type === 'danger' ? 'border-red-600 text-red-400' : ''} ${log.type === 'loot' ? 'border-amber-500 text-amber-500 font-bold' : ''}`}>{log.text}</div>))}
          </div>
        </div>
      </div>
    </div>
  );
}
