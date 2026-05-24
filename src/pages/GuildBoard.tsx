import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLocationName } from '../data/locations';
import { getQuestsByType } from '../data/quests';
import type { QuestTemplate } from '../data/quests';
import { Scroll, Zap, Coins, Skull, ShieldAlert } from 'lucide-react';

interface LogEntry {
  id: number;
  msg: string;
  type: 'success' | 'failure' | 'system';
}

export default function GuildBoard() {
  const { profile, spendEnergy, addGold, addXp, takeDamage } = useGame();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'regular'>('daily');

  const regularQuests = getQuestsByType('regular');
  const dailyQuests = getQuestsByType('daily');

  const addLog = (msg: string, type: 'success' | 'failure' | 'system') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), msg, type }, ...prev].slice(0, 10));
  };

  const handleEmbarkRegular = (quest: QuestTemplate) => {
    if (profile.level < quest.min_level) {
      addLog(`You are not high enough level for ${quest.title}.`, 'system');
      return;
    }

    if (!spendEnergy(quest.energy_cost)) {
      addLog(`You are too exhausted! You need ${quest.energy_cost} Energy.`, 'system');
      return;
    }

    // Simulate Server-side Combat Roll
    const successRoll = Math.floor(Math.random() * 100) + 1; // 1-100
    let targetRoll = 30; // Easy
    if (quest.difficulty === 'Medium') targetRoll = 50;
    if (quest.difficulty === 'Hard') targetRoll = 75;

    // Player bonuses
    const playerBonus = Math.floor((profile.strength + profile.agility) / 2);
    const finalRoll = successRoll + playerBonus;

    if (finalRoll >= targetRoll) {
      const earnedGold = Math.floor(Math.random() * (quest.reward_gold[1] - quest.reward_gold[0] + 1)) + quest.reward_gold[0];
      const earnedXp = Math.floor(Math.random() * (quest.reward_xp[1] - quest.reward_xp[0] + 1)) + quest.reward_xp[0];
      
      addGold(earnedGold);
      addXp(earnedXp);
      addLog(`Completed "${quest.title}"! Earned ${earnedGold} Gold and ${earnedXp} XP.`, 'success');
    } else {
      const damageTaken = Math.floor(Math.random() * 15) + 5;
      takeDamage(damageTaken);
      addLog(`Overwhelmed during "${quest.title}" and fled! Lost ${damageTaken} HP.`, 'failure');
    }
  };

  const handleEmbarkDaily = (quest: QuestTemplate) => {
    if (profile.daily_quests_completed >= 3) {
      addLog(`You have already completed your maximum Daily Bounties for today!`, 'system');
      return;
    }

    if (profile.level < quest.min_level) {
      addLog(`You are not high enough level to fight ${quest.title}.`, 'system');
      return;
    }

    if (!quest.target_enemy_id) return;
    
    // Jump to boss fight
    navigate(`/play/combat/${quest.target_enemy_id}`);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-[80vh]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-medieval-gold pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Scroll size={32} className="text-amber-700" />
          <div>
            <h1 className="text-3xl drop-shadow-sm mb-1 font-cinzel text-amber-500">Guild Board</h1>
            <p className="text-sm font-sans text-stone-500 italic">Available Contracts in {getLocationName(profile.current_location)}...</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-950 border border-stone-800 rounded p-1">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded font-cinzel font-bold text-sm transition-colors ${activeTab === 'daily' ? 'bg-amber-900 text-amber-100' : 'text-stone-500 hover:text-stone-300'}`}
          >
            Daily Bounties ({profile.daily_quests_completed}/3)
          </button>
          <button 
            onClick={() => setActiveTab('regular')}
            className={`px-6 py-2 rounded font-cinzel font-bold text-sm transition-colors ${activeTab === 'regular' ? 'bg-amber-900 text-amber-100' : 'text-stone-500 hover:text-stone-300'}`}
          >
            Endless Contracts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Quests */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
          
          {activeTab === 'daily' && (
            <div className="bg-red-950/20 border border-red-900/50 p-4 rounded text-red-200 text-sm mb-2 flex items-center gap-2">
              <ShieldAlert size={16} /> 
              Daily Bounties are highly dangerous Boss encounters. Defeating them grants massive rewards. You can complete 3 per day. Resets at midnight GMT.
            </div>
          )}

          {(activeTab === 'daily' ? dailyQuests : regularQuests).map(quest => (
            <div key={quest.id} className="bg-stone-900 p-5 rounded border border-stone-700 shadow-sm relative overflow-hidden group">
              {/* Difficulty indicator */}
              <div className={`absolute top-0 right-0 w-2 h-full ${
                quest.difficulty === 'Easy' ? 'bg-green-600' :
                quest.difficulty === 'Medium' ? 'bg-amber-500' : 
                quest.difficulty === 'Hard' ? 'bg-orange-600' : 'bg-red-700'
              }`} />
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-cinzel font-bold text-amber-500 text-lg">{quest.title}</h3>
                {quest.difficulty === 'Boss' && <span className="bg-red-900 text-red-100 text-[10px] uppercase px-2 py-1 rounded flex items-center gap-1 font-bold"><Skull size={12}/> Boss Fight</span>}
              </div>
              
              <p className="font-sans text-stone-400 text-sm mb-6 leading-relaxed pr-6">{quest.description}</p>
              
              <div className="flex flex-wrap items-center justify-between mt-auto pt-4 border-t border-stone-800">
                <div className="flex gap-4 font-sans text-xs font-bold">
                  {quest.energy_cost > 0 && (
                    <span className="flex items-center gap-1 text-blue-400 bg-blue-950/30 border border-blue-900 px-2 py-1 rounded">
                      <Zap size={14} /> -{quest.energy_cost}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-amber-500 bg-amber-950/30 border border-amber-900 px-2 py-1 rounded">
                    <Coins size={14} /> {quest.reward_gold[0]}-{quest.reward_gold[1]}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400 bg-purple-950/30 border border-purple-900 px-2 py-1 rounded">
                    Lv. {quest.min_level}+
                  </span>
                </div>
                
                {activeTab === 'daily' ? (
                  <button 
                    onClick={() => handleEmbarkDaily(quest)}
                    disabled={profile.daily_quests_completed >= 3 || profile.level < quest.min_level}
                    className="bg-red-900 text-red-100 font-cinzel font-bold text-sm px-6 py-2 rounded border border-red-700 hover:bg-red-800 transition-colors shadow-md disabled:opacity-50"
                  >
                    Fight Boss
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEmbarkRegular(quest)}
                    disabled={profile.level < quest.min_level || profile.energy < quest.energy_cost}
                    className="bg-stone-950 text-amber-500 font-cinzel font-bold text-sm px-6 py-2 rounded border border-stone-700 hover:border-amber-500 transition-colors shadow-md disabled:opacity-50"
                  >
                    Embark
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Action Feed */}
        <div className="bg-stone-950 rounded p-4 border border-stone-800 flex flex-col font-sans shrink-0">
          <h2 className="text-amber-500 font-cinzel text-lg border-b border-stone-800 pb-2 mb-4">Adventure Log</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.length === 0 ? (
              <p className="text-stone-600 italic text-sm text-center mt-10">The ink is dry. No adventures logged yet.</p>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} className={`animate-fade-in text-sm p-3 rounded border-l-4 ${
                  log.type === 'success' ? 'bg-green-950/30 border-green-600 text-green-200' :
                  log.type === 'failure' ? 'bg-red-950/30 border-red-700 text-red-200' :
                  'bg-stone-900 border-stone-700 text-stone-400'
                }`}>
                  {log.msg}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
