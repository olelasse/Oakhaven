import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getCampaignStage, CAMPAIGN_DATABASE } from '../data/campaign';
import { ArrowLeft, BookOpen, Swords, Coins, Zap } from 'lucide-react';

export default function Campaign() {
  const { profile } = useGame();
  const navigate = useNavigate();

  const progress = profile.campaign_progress || 0;
  const currentStage = getCampaignStage(progress);
  
  const isCompleted = progress >= CAMPAIGN_DATABASE.length;

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in text-stone-300 relative">
      
      {/* Background Image Header */}
      <div className="relative w-full h-64 md:h-80 shrink-0 border-b-4 border-amber-900 shadow-2xl bg-stone-900">
        <div className="absolute inset-0 bg-[url('/images/ashen_wastes.png')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        
        <button 
          onClick={() => navigate('/play/travel')}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-stone-900/80 hover:bg-stone-800 border border-stone-700 rounded text-stone-300 hover:text-white transition-colors backdrop-blur-sm text-sm font-bold shadow-lg"
        >
          <ArrowLeft size={16} /> Return
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-amber-900 border border-amber-700 text-amber-200 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded shadow-lg">
              Main Story
            </span>
            <span className="text-stone-400 font-mono text-sm">Chapter {isCompleted ? 'Complete' : progress + 1}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-cinzel text-stone-100 font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            {isCompleted ? 'A Hero\'s Rest' : currentStage?.title}
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-stone-950 p-6 md:p-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          
          {isCompleted ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-cinzel text-amber-500 mb-4">The Current Threat is Vanquished!</h2>
              <p className="text-stone-400 leading-relaxed max-w-lg mx-auto">
                You have completed all available story chapters. The realm of Oakhaven is safe... for now. 
                Continue to level up, explore the biomes, and gather legendary loot. New threats will emerge soon.
              </p>
            </div>
          ) : (
            <>
              {/* Lore Section */}
              <div className="relative">
                <BookOpen className="absolute -left-8 top-1 text-stone-700" size={20} />
                <h3 className="text-lg font-cinzel text-amber-600 mb-2 font-bold uppercase tracking-widest">Chronicle</h3>
                <p className="text-stone-300 text-lg leading-relaxed font-serif italic border-l-2 border-stone-800 pl-4 py-1">
                  "{currentStage?.lore}"
                </p>
              </div>

              {/* Objective Section */}
              <div className="bg-stone-900/50 border border-stone-800 rounded p-6 shadow-inner mt-4">
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-3">Current Objective</h3>
                <p className="text-stone-200 text-lg mb-6">{currentStage?.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-stone-800 pt-4">
                  <div className="flex flex-wrap gap-2 text-sm font-bold">
                    <span className="flex items-center gap-1.5 text-amber-500 bg-amber-950/30 border border-amber-900/50 px-3 py-1.5 rounded">
                      <Coins size={16} /> {currentStage?.reward_gold} Gold
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400 bg-blue-950/30 border border-blue-900/50 px-3 py-1.5 rounded">
                      <Zap size={16} /> {currentStage?.reward_xp} XP
                    </span>
                    {currentStage?.reward_item && (
                      <span className="flex items-center gap-1.5 text-purple-400 bg-purple-950/30 border border-purple-900/50 px-3 py-1.5 rounded uppercase text-[10px] tracking-wider">
                        + Legendary Item
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/play/combat/${currentStage?.enemy_id}`)}
                    className="w-full sm:w-auto bg-red-900 hover:bg-red-800 text-white font-cinzel font-bold text-lg px-8 py-3 rounded border border-red-700 shadow-[0_0_15px_rgba(153,27,27,0.4)] hover:shadow-[0_0_25px_rgba(153,27,27,0.6)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Swords size={20} /> Confront Threat
                  </button>
                </div>
              </div>

              {/* Hint Section */}
              {currentStage?.next_hint && (
                <div className="text-sm text-stone-500 italic text-center mt-4 bg-stone-950 p-4 border border-stone-900 rounded">
                  Hint: {currentStage.next_hint}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
