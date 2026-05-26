import { useNavigate } from 'react-router-dom';

import { getQuestsByLocation } from '../data/quests';
import { ArrowLeft, Zap, Coins, ArrowRight, Skull, Swords } from 'lucide-react';

export default function Frostpeak() {

  const navigate = useNavigate();

  const quests = getQuestsByLocation('frostpeak');

  const returnHome = () => {
    navigate('/travel');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 lg:h-[80vh]">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-2 shrink-0">
        <div>
          <h1 className="text-3xl font-cinzel text-blue-300 drop-shadow-sm">The Obsidian Peak</h1>
          <p className="text-sm font-sans text-stone-400 italic">Treacherous, freezing peaks.</p>
        </div>
        <button 
          onClick={returnHome}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-blue-700 text-stone-400 hover:text-blue-500 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Travel Hub
        </button>
      </div>

      {/* Quests Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quests.map(quest => (
            <div key={quest.id} className="bg-stone-900 rounded border border-stone-700 shadow-sm relative overflow-hidden group flex flex-col h-full hover:border-blue-700 transition-colors">
              {/* Difficulty indicator */}
              <div className={`absolute top-0 right-0 w-2 h-full z-10 ${
                quest.difficulty === 'Easy' ? 'bg-green-600' :
                quest.difficulty === 'Medium' ? 'bg-amber-500' : 
                quest.difficulty === 'Hard' ? 'bg-orange-600' : 'bg-red-700'
              }`} />
              
              {/* Card Image Banner */}
              <div className="h-32 relative w-full border-b border-stone-800 bg-stone-950 flex items-center justify-center">
                {/* Fallback pattern since we don't have images for all biome quests yet */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 to-transparent"></div>
                <h3 className="font-cinzel font-bold text-blue-300 text-xl drop-shadow-md z-10 text-center px-4">{quest.title}</h3>
                
                {quest.type === 'encounter' && (
                  <div className="absolute top-2 right-4 z-10">
                    <span className="bg-purple-950 border border-purple-800 text-purple-200 text-[10px] uppercase px-2 py-1 rounded flex items-center gap-1 font-bold shadow-md">
                      <Swords size={12}/> Encounter
                    </span>
                  </div>
                )}
                {quest.difficulty === 'Boss' && (
                  <div className="absolute top-2 right-4 z-10">
                    <span className="bg-red-900 border border-red-800 text-red-100 text-[10px] uppercase px-2 py-1 rounded flex items-center gap-1 font-bold shadow-md">
                      <Skull size={12}/> Boss
                    </span>
                  </div>
                )}
              </div>
              
              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col relative z-20 bg-stone-900">
                <p className="font-sans text-stone-400 text-sm mb-6 leading-relaxed line-clamp-3">{quest.description}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-stone-800">
                  <div className="flex flex-wrap gap-2 font-sans text-xs font-bold">
                    {quest.energy_cost > 0 && (
                      <span className="flex items-center gap-1 text-blue-400 bg-blue-950/30 border border-blue-900 px-2 py-1 rounded">
                        <Zap size={14} /> -{quest.energy_cost}
                      </span>
                    )}
                    {quest.type !== 'encounter' && (
                      <span className="flex items-center gap-1 text-amber-500 bg-amber-950/30 border border-amber-900 px-2 py-1 rounded">
                        <Coins size={14} /> {quest.reward_gold[0]}-{quest.reward_gold[1]}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/play/quest/${quest.id}`)}
                    className="w-full sm:w-auto bg-stone-950 text-blue-400 font-cinzel font-bold text-sm px-4 py-2 rounded border border-stone-700 hover:border-blue-500 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    Details <ArrowRight size={16} />
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
