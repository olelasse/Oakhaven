import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLocationName } from '../data/locations';
import { getQuestsByType } from '../data/quests';
import { Scroll, Zap, Coins, Skull, ShieldAlert, ArrowRight } from 'lucide-react';

export default function GuildBoard() {
  const { profile } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daily' | 'regular'>('daily');

  const regularQuests = getQuestsByType('regular');
  const dailyQuests = getQuestsByType('daily');

  return (
    <div className="animate-fade-in flex flex-col gap-6 lg:h-[80vh]">
      
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

      {/* Quests Area (Full Width Now) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {activeTab === 'daily' && (
            <div className="col-span-full bg-red-950/20 border border-red-900/50 p-4 rounded text-red-200 text-sm mb-2 flex items-center gap-2">
              <ShieldAlert size={16} /> 
              Daily Bounties are highly dangerous Boss encounters. Defeating them grants massive rewards. You can complete 3 per day. Resets at midnight GMT.
            </div>
          )}

          {(activeTab === 'daily' ? dailyQuests : regularQuests).map(quest => (
            <div key={quest.id} className="bg-stone-900 rounded border border-stone-700 shadow-sm relative overflow-hidden group flex flex-col h-full hover:border-amber-700 transition-colors">
              {/* Difficulty indicator */}
              <div className={`absolute top-0 right-0 w-2 h-full z-10 ${
                quest.difficulty === 'Easy' ? 'bg-green-600' :
                quest.difficulty === 'Medium' ? 'bg-amber-500' : 
                quest.difficulty === 'Hard' ? 'bg-orange-600' : 'bg-red-700'
              }`} />
              
              {/* Card Image Banner */}
              <div className="h-32 relative w-full border-b border-stone-800">
                <img 
                  src={`/assets/quests/${quest.id}.png`} 
                  alt={quest.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
                <div className="absolute bottom-2 left-4">
                  <h3 className="font-cinzel font-bold text-amber-500 text-lg drop-shadow-md">{quest.title}</h3>
                </div>
                {quest.difficulty === 'Boss' && (
                  <div className="absolute top-2 right-4">
                    <span className="bg-red-900 text-red-100 text-[10px] uppercase px-2 py-1 rounded flex items-center gap-1 font-bold shadow-md">
                      <Skull size={12}/> Boss
                    </span>
                  </div>
                )}
              </div>
              
              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="font-sans text-stone-400 text-sm mb-6 leading-relaxed line-clamp-3">{quest.description}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-stone-800">
                  <div className="flex flex-wrap gap-2 font-sans text-xs font-bold">
                    {quest.energy_cost > 0 && (
                      <span className="flex items-center gap-1 text-blue-400 bg-blue-950/30 border border-blue-900 px-2 py-1 rounded">
                        <Zap size={14} /> -{quest.energy_cost}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-500 bg-amber-950/30 border border-amber-900 px-2 py-1 rounded">
                      <Coins size={14} /> {quest.reward_gold[0]}-{quest.reward_gold[1]}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/play/quest/${quest.id}`)}
                    className="w-full sm:w-auto bg-stone-950 text-amber-500 font-cinzel font-bold text-sm px-4 py-2 rounded border border-stone-700 hover:border-amber-500 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    View Details <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
