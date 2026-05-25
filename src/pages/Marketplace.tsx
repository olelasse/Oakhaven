import { useState } from 'react';
import { ArrowLeft, Package, Coins, Star, Clock } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { getItemTemplate } from '../data/items';
import ItemTooltip from '../components/inventory/ItemTooltip';

const GENERAL_STOCK = [
  'minor_health_potion',
  'rusty_iron_sword',
  'leather_tunic',
  'small_pouch'
];

const RARE_DEALS = [
  'steel_longsword',
  'iron_plate',
  'hunting_bow',
  'wooden_staff'
];

export default function Marketplace() {
  const { profile, buyMarketplaceItem, buyDailyDeal } = useGame();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Calculate daily deal based on day of year
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / 86400000);
  };

  const dailyDealId = RARE_DEALS[getDayOfYear() % RARE_DEALS.length];
  const dailyDealItem = getItemTemplate(dailyDealId);

  // Check if they bought it today
  const hasBoughtDailyDeal = () => {
    if (!profile.daily_deal_bought_at) return false;
    const boughtDate = new Date(profile.daily_deal_bought_at);
    const today = new Date();
    return boughtDate.getDate() === today.getDate() && 
           boughtDate.getMonth() === today.getMonth() && 
           boughtDate.getFullYear() === today.getFullYear();
  };

  const handleBuy = async (itemId: string, cost: number, isDaily: boolean = false) => {
    let result;
    if (isDaily) {
      result = await buyDailyDeal(itemId, cost);
    } else {
      result = await buyMarketplaceItem(itemId, cost);
    }
    setMessage(result.message);
  };

  return (
    <div className="animate-fade-in flex flex-col text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-500 drop-shadow-sm">The Marketplace</h1>
          <p className="text-sm font-sans text-stone-500 italic">Merchants shouting, coins clinking.</p>
        </div>
        <button onClick={() => navigate('/play')} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-amber-500 rounded text-sm">
          <ArrowLeft size={16} /> Return to Town
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* General Goods */}
        <div className="bg-stone-950 border border-stone-800 rounded p-6 shadow-inner flex flex-col gap-4">
          <h2 className="font-cinzel text-xl text-stone-400 border-b border-stone-800 pb-2 flex items-center gap-2">
            <Package /> General Goods
          </h2>
          
          <div className="flex flex-col gap-3">
            {GENERAL_STOCK.map(itemId => {
              const item = getItemTemplate(itemId);
              if (!item) return null;
              
              return (
                <div key={itemId} className="flex items-center justify-between p-3 bg-stone-900 border border-stone-700 rounded relative group">
                  <div 
                    className="flex-1 cursor-help"
                    onMouseEnter={() => setHoveredItem(itemId)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <h3 className="font-bold text-amber-500 text-sm">{item.name}</h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">{item.type}</p>
                    
                    {hoveredItem === itemId && (
                      <ItemTooltip item={item} upgradeLevel={0} />
                    )}
                  </div>
                  <button 
                    onClick={() => handleBuy(itemId, item.gold_cost)}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-cinzel font-bold rounded flex items-center gap-2 transition-colors border border-stone-600 shadow"
                  >
                    Buy <Coins size={14} className="text-amber-500" /> {item.gold_cost}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Deal */}
        <div className="bg-amber-950/20 border border-amber-900/50 rounded p-6 shadow-inner flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 text-amber-500 pointer-events-none">
            <Star size={200} />
          </div>
          
          <h2 className="font-cinzel text-xl text-amber-500 border-b border-amber-900/50 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2"><Star /> Daily Rare Deal</span>
            <span className="text-xs font-sans text-stone-400 flex items-center gap-1"><Clock size={12}/> Refreshes at Midnight</span>
          </h2>

          {dailyDealItem && (
            <div className="flex flex-col items-center justify-center p-6 bg-stone-950 border-2 border-amber-900 rounded-lg shadow-2xl relative h-full">
              
              {hasBoughtDailyDeal() ? (
                <div className="text-center">
                  <Package size={48} className="mx-auto text-stone-700 mb-2" />
                  <p className="font-cinzel font-bold text-stone-500">Out of Stock</p>
                  <p className="text-xs text-stone-600 mt-2">Check back tomorrow for a new deal.</p>
                </div>
              ) : (
                <>
                  <div 
                    className="text-center w-full relative z-50 cursor-help group"
                    onMouseEnter={() => setHoveredItem('daily')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="w-20 h-20 mx-auto bg-stone-900 border-2 border-amber-700 rounded mb-4 flex items-center justify-center shadow-lg">
                      <Star size={32} className="text-amber-500 animate-pulse" />
                    </div>
                    <h3 className="font-bold text-amber-500 text-xl font-cinzel">{dailyDealItem.name}</h3>
                    <p className="text-sm text-stone-400 mt-2">{dailyDealItem.description}</p>
                    
                    <ItemTooltip item={dailyDealItem} upgradeLevel={0} />
                  </div>
                  
                  <div className="mt-8 relative z-10 w-full">
                    <button 
                      onClick={() => handleBuy(dailyDealId, dailyDealItem.gold_cost, true)}
                      className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-amber-100 font-cinzel font-bold rounded flex items-center justify-center gap-2 transition-colors border border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]"
                    >
                      Purchase Special Deal <Coins size={18} /> {dailyDealItem.gold_cost}
                    </button>
                    <p className="text-center text-[10px] text-stone-500 mt-2">Only 1 available per player.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
      
      {message && (
        <div className="mt-4 p-3 bg-stone-900 border border-stone-700 rounded text-center text-sm font-bold text-amber-500 shrink-0 shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
}
