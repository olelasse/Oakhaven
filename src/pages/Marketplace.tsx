import { useState } from 'react';
import { ArrowLeft, Package, Coins } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

export default function Marketplace() {
  const { profile, addGold } = useGame();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const buyPotion = () => {
    if (profile.gold >= 15) {
      addGold(-15);
      setMessage('Successfully purchased a Minor Health Potion!');
    } else {
      setMessage('Not enough gold!');
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-500 drop-shadow-sm">The Marketplace</h1>
          <p className="text-sm font-sans text-stone-500 italic">Merchants shouting, coins clinking.</p>
        </div>
        <button onClick={() => navigate('/play')} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-amber-500 rounded text-sm">
          <ArrowLeft size={16} /> Return to Town
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-stone-950/80 border border-stone-800 rounded p-6">
          <h2 className="font-cinzel text-xl text-stone-400 mb-4 flex items-center gap-2"><Package /> General Goods</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-stone-900 border border-stone-700 rounded">
              <div>
                <h3 className="font-bold text-amber-500">Minor Health Potion</h3>
                <p className="text-xs text-stone-400">Restores a small amount of health.</p>
              </div>
              <button onClick={buyPotion} className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 font-cinzel font-bold rounded flex items-center gap-2 transition-colors">
                Buy <Coins size={16} /> 15
              </button>
            </div>
          </div>
          {message && <p className="mt-4 text-center text-sm font-bold text-amber-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
