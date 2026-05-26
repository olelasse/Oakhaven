import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { QUEST_DATABASE } from '../data/quests';
import { ArrowLeft, Scroll, Zap, Coins, Skull, ShieldAlert, Sparkles, Swords } from 'lucide-react';

export default function QuestBriefing() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { profile, spendEnergy, addGold, addXp, takeDamage, logAction } = useGame();
  
  const [isResolving, setIsResolving] = useState(false);
  const [resolution, setResolution] = useState<'success' | 'failure' | null>(null);
  const [resolutionDetails, setResolutionDetails] = useState<{ gold: number, xp: number, damage: number } | null>(null);

  const quest = QUEST_DATABASE.find(q => q.id === questId);

  if (!quest) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-500">
        <Scroll size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-cinzel">Contract Not Found</h2>
        <button onClick={() => navigate('/play/quests')} className="mt-4 text-amber-500 hover:text-amber-400">Return to Guild Board</button>
      </div>
    );
  }

  const handleAction = () => {
    if (quest.type === 'daily' || quest.type === 'encounter') {
      if (quest.type === 'daily' && profile.daily_quests_completed >= 3) {
        alert("You have reached your daily bounty limit!");
        return;
      }
      
      if (!spendEnergy(quest.energy_cost)) {
        alert(`Not enough energy. You need ${quest.energy_cost} Energy.`);
        return;
      }

      navigate(`/play/combat/${quest.target_enemy_id}`);
      return;
    }

    // Regular Quest (Dice Roll)
    if (profile.level < quest.min_level) {
      alert(`You must be level ${quest.min_level} to embark on this quest.`);
      return;
    }

    if (!spendEnergy(quest.energy_cost)) {
      alert(`Not enough energy. You need ${quest.energy_cost} Energy.`);
      return;
    }

    setIsResolving(true);
    
    // Fake loading delay for suspense
    setTimeout(() => {
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
        logAction(`Completed contract "${quest.title}". Earned ${earnedGold} Gold and ${earnedXp} XP.`, 'success');
        
        setResolutionDetails({ gold: earnedGold, xp: earnedXp, damage: 0 });
        setResolution('success');
      } else {
        const damageTaken = Math.floor(Math.random() * 15) + 5;
        takeDamage(damageTaken);
        logAction(`Failed contract "${quest.title}" and lost ${damageTaken} HP.`, 'danger');
        
        setResolutionDetails({ gold: 0, xp: 0, damage: damageTaken });
        setResolution('failure');
      }
      setIsResolving(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fade-in text-stone-300 relative">
      
      {/* Background Image Header */}
      <div className="relative w-full h-64 md:h-80 shrink-0 border-b-4 border-amber-900 shadow-2xl bg-stone-900">
        <img 
          src={`/assets/quests/${quest.id}.png`} 
          alt={quest.title} 
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        
        <button 
          onClick={() => navigate('/play/quests')} 
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-stone-900/80 backdrop-blur border border-stone-700 hover:text-amber-500 rounded text-sm z-10 transition-colors"
        >
          <ArrowLeft size={16} /> Guild Board
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              quest.difficulty === 'Easy' ? 'bg-green-900/80 text-green-200 border border-green-700' :
              quest.difficulty === 'Medium' ? 'bg-amber-900/80 text-amber-200 border border-amber-700' : 
              quest.difficulty === 'Hard' ? 'bg-orange-900/80 text-orange-200 border border-orange-700' : 
              'bg-red-900/80 text-red-200 border border-red-700'
            }`}>
              {quest.difficulty}
            </span>
            {quest.type === 'daily' && (
              <span className="bg-red-950 border border-red-800 text-red-200 text-[10px] uppercase px-2 py-1 rounded flex items-center gap-1 font-bold">
                <Skull size={12}/> Boss Bounty
              </span>
            )}
            {quest.type === 'encounter' && (
              <span className="bg-purple-950 border border-purple-800 text-purple-200 text-[10px] uppercase px-2 py-1 rounded flex items-center gap-1 font-bold shadow-md">
                <Swords size={12}/> Combat Encounter
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-500 drop-shadow-md">{quest.title}</h1>
        </div>
      </div>

      {/* Quest Details Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full flex flex-col gap-8 custom-scrollbar">
        
        {/* Lore Description */}
        <div className="bg-stone-900/50 p-6 rounded-lg border border-stone-800 shadow-inner">
          <p className="text-lg font-sans text-stone-300 leading-relaxed">
            {quest.description}
          </p>
        </div>

        {/* Stats & Requirements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-950 border border-stone-800 rounded p-4 flex flex-col items-center justify-center text-center gap-2">
            <Zap className="text-blue-400" />
            <span className="text-xs text-stone-500 uppercase font-bold">Energy Cost</span>
            <span className="font-cinzel text-xl text-stone-200">{quest.energy_cost > 0 ? `-${quest.energy_cost}` : 'Free'}</span>
          </div>
          
          <div className="bg-stone-950 border border-stone-800 rounded p-4 flex flex-col items-center justify-center text-center gap-2">
            <ShieldAlert className="text-purple-400" />
            <span className="text-xs text-stone-500 uppercase font-bold">Required Lvl</span>
            <span className="font-cinzel text-xl text-stone-200">{quest.min_level}+</span>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded p-4 flex flex-col items-center justify-center text-center gap-2">
            <Coins className="text-amber-500" />
            <span className="text-xs text-stone-500 uppercase font-bold">Gold Reward</span>
            <span className="font-cinzel text-xl text-stone-200">{quest.reward_gold[0]} - {quest.reward_gold[1]}</span>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded p-4 flex flex-col items-center justify-center text-center gap-2">
            <Sparkles className="text-emerald-400" />
            <span className="text-xs text-stone-500 uppercase font-bold">XP Reward</span>
            <span className="font-cinzel text-xl text-stone-200">{quest.reward_xp[0]} - {quest.reward_xp[1]}</span>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-auto flex justify-center py-6">
          <button
            onClick={handleAction}
            disabled={isResolving || profile.level < quest.min_level}
            className={`px-12 py-4 rounded-lg font-cinzel font-bold text-xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-3 ${
              quest.type === 'daily' 
                ? 'bg-red-900 text-red-100 hover:bg-red-800 border-2 border-red-700 hover:shadow-[0_0_30px_rgba(153,27,27,0.6)]'
                : 'bg-amber-700 text-amber-100 hover:bg-amber-600 border-2 border-amber-500 hover:shadow-[0_0_30px_rgba(217,119,6,0.6)]'
            } disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed`}
          >
            {isResolving ? (
              <span className="animate-pulse">Resolving...</span>
            ) : quest.type === 'daily' ? (
              <><Swords /> Initiate Boss Fight</>
            ) : quest.type === 'encounter' ? (
              <><Swords /> Start Encounter</>
            ) : (
              <><Swords /> Embark on Quest</>
            )}
          </button>
        </div>

      </div>

      {/* Resolution Overlay */}
      {resolution && resolutionDetails && (
        <div className="absolute inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`max-w-md w-full bg-stone-900 border-4 rounded-xl shadow-2xl p-8 flex flex-col items-center text-center ${
            resolution === 'success' ? 'border-emerald-600' : 'border-red-800'
          }`}>
            
            {resolution === 'success' ? (
              <>
                <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
                  <Sparkles size={40} className="text-emerald-400" />
                </div>
                <h2 className="text-4xl font-cinzel text-emerald-400 font-bold mb-2">Victory!</h2>
                <p className="text-stone-300 font-sans mb-8">You successfully completed the contract and claimed your rewards.</p>
                
                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col items-center">
                    <span className="text-xs text-stone-500 uppercase mb-1">Earned</span>
                    <span className="text-2xl font-cinzel text-amber-500 flex items-center gap-1"><Coins size={20}/> {resolutionDetails.gold}</span>
                  </div>
                  <div className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col items-center">
                    <span className="text-xs text-stone-500 uppercase mb-1">Earned</span>
                    <span className="text-2xl font-cinzel text-emerald-400 flex items-center gap-1"><Sparkles size={20}/> {resolutionDetails.xp}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-900/50 rounded-full flex items-center justify-center mb-6">
                  <Skull size={40} className="text-red-500" />
                </div>
                <h2 className="text-4xl font-cinzel text-red-500 font-bold mb-2">Defeat...</h2>
                <p className="text-stone-300 font-sans mb-8">You were overwhelmed during the encounter and forced to flee.</p>
                
                <div className="w-full bg-stone-950 border border-red-900 p-4 rounded flex flex-col items-center mb-8">
                  <span className="text-xs text-stone-500 uppercase mb-1">Suffered</span>
                  <span className="text-3xl font-cinzel text-red-500">-{resolutionDetails.damage} HP</span>
                </div>
              </>
            )}

            <div className="flex w-full gap-3">
              <button 
                onClick={() => setResolution(null)}
                className="flex-1 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-amber-500 font-cinzel font-bold rounded border border-amber-900 transition-colors"
              >
                Embark Again
              </button>
              <button 
                onClick={() => navigate('/play/quests')}
                className="flex-1 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-white font-cinzel font-bold rounded border border-stone-600 transition-colors"
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
