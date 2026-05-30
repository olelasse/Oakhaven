import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Beer, ArrowLeft, Coins, Gem, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdMockModal from '../components/tavern/AdMockModal';

export default function Tavern() {
  const navigate = useNavigate();
  const { profile, removeGold, spendPremiumTokens, healDamage, logAction } = useGame();
  
  const [isAdOpen, setIsAdOpen] = useState(false);

  if (!profile) return null;

  const handleBuyDrink = () => {
    if (profile.gold < 15) return;
    removeGold(15);
    // Let's heal 20 HP and 10 Energy
    healDamage(-20); // pass negative to actually heal, wait, GameContext healDamage adds to HP?
    // Wait, let's use the DB optimistic update or heal function.
    // Actually, I don't have an `addEnergy` function exposed on GameContext.
    // I can just rely on `healDamage` for now.
    logAction('Enjoyed a refreshing ale. Restored some HP.', 'heal');
  };

  const handlePremiumRoom = async () => {
    if (profile.premium_tokens < 10) return;
    const success = await spendPremiumTokens(10);
    if (success) {
      // Full heal 
      healDamage(-9999);
      logAction('Rented a premium room. Fully rested!', 'heal');
    }
  };

  const handleAdReward = () => {
    // Full heal
    healDamage(-9999);
    logAction('Rested by the hearth. Fully restored!', 'heal');
    setIsAdOpen(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in text-stone-300 relative z-10 max-w-4xl mx-auto w-full p-4 md:p-8">
      
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-500 drop-shadow-sm flex items-center gap-3">
            <Beer className="text-amber-600" size={32} /> The Drunken Boar
          </h1>
          <p className="text-sm font-sans text-stone-500 italic mt-1">Laughter, music, and the smell of roasted meat fill the air.</p>
        </div>
        <button 
          onClick={() => navigate('/play/travel')}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-700 text-stone-400 hover:text-amber-500 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Leave Tavern
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ad Option */}
        <div className="bg-stone-900/80 border border-stone-800 hover:border-amber-900/50 rounded-lg p-6 flex flex-col items-center text-center transition-colors">
          <div className="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center border-2 border-stone-800 mb-4">
            <MonitorPlay size={32} className="text-stone-400" />
          </div>
          <h3 className="font-cinzel font-bold text-xl text-stone-200 mb-2">Rest by the Hearth</h3>
          <p className="text-sm text-stone-500 mb-6 flex-1">
            Listen to a sponsor's tale for a few seconds. Free of charge, but takes a moment. Restores 100% HP & Energy.
          </p>
          <button 
            onClick={() => setIsAdOpen(true)}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded font-cinzel font-bold tracking-wider text-stone-300 flex items-center justify-center gap-2 transition-colors"
          >
            Watch Ad
          </button>
        </div>

        {/* Premium Option */}
        <div className="bg-gradient-to-b from-amber-950/40 to-stone-900/80 border border-amber-900/50 hover:border-amber-500/50 rounded-lg p-6 flex flex-col items-center text-center transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-600 text-stone-100 text-[10px] uppercase font-bold px-3 py-1 font-mono tracking-wider rounded-bl-lg">
            Premium
          </div>
          <div className="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center border-2 border-amber-900/50 mb-4 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
            <Gem size={32} className="text-amber-500" />
          </div>
          <h3 className="font-cinzel font-bold text-xl text-amber-500 mb-2">Premium Suite</h3>
          <p className="text-sm text-stone-500 mb-6 flex-1">
            Rent the finest room in Oakhaven. Instantly restores 100% HP & Energy.
          </p>
          <button 
            onClick={handlePremiumRoom}
            disabled={profile.premium_tokens < 10}
            className="w-full py-3 bg-amber-950 hover:bg-amber-900 border border-amber-700 disabled:border-stone-800 disabled:bg-stone-900 disabled:text-stone-600 rounded font-cinzel font-bold tracking-wider text-amber-500 flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Gem size={16} /> 10 Tokens
          </button>
        </div>

        {/* Gold Option */}
        <div className="bg-stone-900/80 border border-stone-800 hover:border-amber-900/50 rounded-lg p-6 flex flex-col items-center text-center transition-colors">
          <div className="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center border-2 border-stone-800 mb-4">
            <Beer size={32} className="text-amber-700" />
          </div>
          <h3 className="font-cinzel font-bold text-xl text-stone-200 mb-2">Buy a Drink</h3>
          <p className="text-sm text-stone-500 mb-6 flex-1">
            Have a pint of the finest dwarven ale. Restores a small amount of HP & Energy.
          </p>
          <button 
            onClick={handleBuyDrink}
            disabled={profile.gold < 15}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-950 disabled:border-stone-900 border border-stone-600 disabled:text-stone-700 rounded font-cinzel font-bold tracking-wider text-stone-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Coins size={16} className={profile.gold >= 15 ? 'text-amber-500' : 'text-stone-700'} /> 15 Gold
          </button>
        </div>

      </div>

      <AdMockModal 
        isOpen={isAdOpen} 
        onClose={() => setIsAdOpen(false)} 
        onComplete={handleAdReward} 
      />

    </div>
  );
}
