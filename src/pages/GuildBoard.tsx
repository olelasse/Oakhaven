import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { getLocationName } from '../data/locations';
import { Scroll, Zap, Coins } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  energy_cost: number;
  min_level: number;
  reward_gold: [number, number]; // [min, max]
  reward_xp: [number, number]; // [min, max]
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const LOCAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Clear the Cellar Rats',
    description: 'The local tavern keeper needs someone to exterminate the dire rats infesting the mead cellar.',
    energy_cost: 10,
    min_level: 1,
    reward_gold: [5, 15],
    reward_xp: [20, 40],
    difficulty: 'Easy'
  },
  {
    id: 'q2',
    title: 'Patrol the City Gates',
    description: 'Assist the city guard with the night watch. Keep an eye out for smugglers.',
    energy_cost: 15,
    min_level: 1,
    reward_gold: [10, 25],
    reward_xp: [35, 60],
    difficulty: 'Medium'
  },
  {
    id: 'q3',
    title: 'Hunt the Forest Boar',
    description: 'A massive boar has been terrorizing the lumberjacks just outside the city walls.',
    energy_cost: 25,
    min_level: 3,
    reward_gold: [30, 60],
    reward_xp: [80, 150],
    difficulty: 'Hard'
  }
];

export default function GuildBoard() {
  const { profile, spendEnergy, addGold, addXp, takeDamage } = useGame();
  const [logs, setLogs] = useState<string[]>([]);

  const handleEmbark = (quest: Quest) => {
    if (profile.level < quest.min_level) {
      setLogs(prev => [`[System] You are not high enough level for ${quest.title}.`, ...prev]);
      return;
    }

    if (!spendEnergy(quest.energy_cost)) {
      setLogs(prev => [`[System] You are too exhausted! You need ${quest.energy_cost} Energy.`, ...prev]);
      return;
    }

    // Simulate Server-side Combat Roll
    const successRoll = Math.floor(Math.random() * 100) + 1; // 1-100
    // Rough formula: Agility + Strength helps success chance. 
    // Harder difficulty requires higher rolls.
    let targetRoll = 30; // Easy
    if (quest.difficulty === 'Medium') targetRoll = 50;
    if (quest.difficulty === 'Hard') targetRoll = 75;

    // Player bonuses
    const playerBonus = Math.floor((profile.strength + profile.agility) / 2);
    const finalRoll = successRoll + playerBonus;

    if (finalRoll >= targetRoll) {
      // Success
      const earnedGold = Math.floor(Math.random() * (quest.reward_gold[1] - quest.reward_gold[0] + 1)) + quest.reward_gold[0];
      const earnedXp = Math.floor(Math.random() * (quest.reward_xp[1] - quest.reward_xp[0] + 1)) + quest.reward_xp[0];
      
      addGold(earnedGold);
      addXp(earnedXp);

      setLogs(prev => [
        `[Success] You completed "${quest.title}"! Earned ${earnedGold} Gold and ${earnedXp} XP. (Roll: ${finalRoll} vs ${targetRoll})`,
        ...prev
      ]);
    } else {
      // Failure
      const damageTaken = Math.floor(Math.random() * 15) + 5;
      takeDamage(damageTaken);
      
      setLogs(prev => [
        `[Failure] You were overwhelmed during "${quest.title}" and fled! Lost ${damageTaken} HP. (Roll: ${finalRoll} vs ${targetRoll})`,
        ...prev
      ]);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3 border-b-2 border-medieval-gold pb-4">
        <Scroll size={32} className="text-amber-700" />
        <div>
          <h1 className="text-3xl drop-shadow-sm border-b-2 border-medieval-gold pb-2 mb-2">Guild Board</h1>
          <p className="text-sm font-sans text-stone-500 italic">Available Contracts in {getLocationName(profile.current_location)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        
        {/* Left Col: Quests */}
        <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {LOCAL_QUESTS.map(quest => (
            <div key={quest.id} className="bg-stone-100 p-4 rounded border border-amber-900/30 shadow-sm relative overflow-hidden group">
              {/* Difficulty indicator */}
              <div className={`absolute top-0 right-0 w-2 h-full ${
                quest.difficulty === 'Easy' ? 'bg-green-600' :
                quest.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-red-700'
              }`} />
              
              <h3 className="font-cinzel font-bold text-amber-900 text-lg mb-1">{quest.title}</h3>
              <p className="font-sans text-stone-700 text-sm mb-4 leading-relaxed">{quest.description}</p>
              
              <div className="flex flex-wrap items-center justify-between mt-auto pt-4 border-t border-amber-900/10">
                <div className="flex gap-4 font-sans text-xs font-bold">
                  <span className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    <Zap size={14} /> {quest.energy_cost}
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    <Coins size={14} /> {quest.reward_gold[0]}-{quest.reward_gold[1]}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleEmbark(quest)}
                  className="bg-stone-900 text-amber-500 font-cinzel font-bold text-sm px-6 py-2 rounded border border-stone-700 hover:bg-amber-900 hover:text-amber-100 transition-colors shadow-md active:scale-95"
                >
                  Embark
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Action Feed */}
        <div className="bg-stone-900 rounded p-4 border border-stone-700 flex flex-col font-sans">
          <h2 className="text-amber-500 font-cinzel text-lg border-b border-stone-700 pb-2 mb-4">Adventure Log</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.length === 0 ? (
              <p className="text-stone-500 italic text-sm text-center mt-10">The ink is dry. No adventures logged yet.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`text-sm p-3 rounded border-l-4 ${
                  log.startsWith('[Success]') ? 'bg-green-950/30 border-green-600 text-green-200' :
                  log.startsWith('[Failure]') ? 'bg-red-950/30 border-red-700 text-red-200' :
                  'bg-stone-800 border-stone-600 text-stone-300'
                }`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
