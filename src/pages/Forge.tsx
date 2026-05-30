import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { RECIPE_DATABASE } from '../data/recipes';
import { ITEM_DATABASE } from '../data/items';
import { Hammer, ArrowLeft, Coins, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Forge() {
  const navigate = useNavigate();
  const { profile, inventory, removeGold, removeItemFromInventory, addItemToInventory } = useGame();
  const [craftingRecipeId, setCraftingRecipeId] = useState<string | null>(null);

  if (!profile) return null;

  const recipes = Object.values(RECIPE_DATABASE);

  const canCraft = (recipeId: string) => {
    const recipe = RECIPE_DATABASE[recipeId];
    if (profile.gold < recipe.gold_cost) return false;
    if (profile.level < recipe.required_level) return false;

    for (const req of recipe.ingredients) {
      // count unbanked items
      const playerHas = inventory
        .filter(i => i.item_id === req.item_id && !i.is_banked)
        .reduce((sum, item) => sum + item.quantity, 0);
      if (playerHas < req.quantity) return false;
    }
    return true;
  };

  const handleCraft = async (recipeId: string) => {
    if (!canCraft(recipeId)) return;
    setCraftingRecipeId(recipeId);

    const recipe = RECIPE_DATABASE[recipeId];
    
    // Deduct ingredients
    for (const req of recipe.ingredients) {
      await removeItemFromInventory(req.item_id, req.quantity);
    }
    
    // Deduct gold
    removeGold(recipe.gold_cost);

    // Add item
    await addItemToInventory(recipe.output_item_id, 1);

    setTimeout(() => {
      setCraftingRecipeId(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in text-stone-300 relative z-10 max-w-4xl mx-auto w-full p-4 md:p-8">
      
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-cinzel text-orange-500 drop-shadow-sm flex items-center gap-3">
            <Hammer className="text-orange-700" size={32} /> The Town Forge
          </h1>
          <p className="text-sm font-sans text-stone-500 italic mt-1">Sparks fly as the blacksmith hammers hot iron.</p>
        </div>
        <button 
          onClick={() => navigate('/play/travel')}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-orange-700 text-stone-400 hover:text-orange-500 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Leave Forge
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {recipes.map(recipe => {
          const outputItem = ITEM_DATABASE[recipe.output_item_id];
          const isCrafting = craftingRecipeId === recipe.id;
          const craftable = canCraft(recipe.id);

          return (
            <div key={recipe.id} className="bg-stone-900/80 border border-stone-800 rounded p-4 md:p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-stone-800 pb-3">
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-orange-400">{outputItem.name}</h3>
                  <p className="text-xs text-stone-500">Requires Level {recipe.required_level}</p>
                </div>
              </div>

              <div className="flex gap-4 items-center flex-1">
                <div className="flex-1 flex flex-col gap-2 bg-stone-950 p-3 rounded border border-stone-800/50">
                  <h4 className="text-xs uppercase text-stone-500 font-bold mb-1 tracking-wider">Required Materials</h4>
                  {recipe.ingredients.map(req => {
                    const materialItem = ITEM_DATABASE[req.item_id];
                    const playerHas = inventory
                      .filter(i => i.item_id === req.item_id && !i.is_banked)
                      .reduce((sum, item) => sum + item.quantity, 0);
                    
                    const hasEnough = playerHas >= req.quantity;

                    return (
                      <div key={req.item_id} className="flex justify-between items-center text-sm">
                        <span className={hasEnough ? 'text-stone-300' : 'text-stone-600'}>{materialItem.name}</span>
                        <span className={`font-mono ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                          {playerHas} / {req.quantity}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-stone-800/50">
                    <span className="text-stone-300 flex items-center gap-1"><Coins size={14} className="text-amber-500"/> Gold</span>
                    <span className={`font-mono ${profile.gold >= recipe.gold_cost ? 'text-green-400' : 'text-red-400'}`}>
                      {profile.gold} / {recipe.gold_cost}
                    </span>
                  </div>
                </div>

                <div className="text-stone-700">
                  <ArrowRight size={24} />
                </div>

                <div className="w-24 h-24 bg-stone-950 border border-stone-800 rounded flex flex-col items-center justify-center p-2 text-center shadow-inner">
                   {/* Placeholder for item image */}
                   <span className="text-[10px] text-stone-500 italic mt-2">{outputItem.slot === 'weapon' ? `ATK: ${outputItem.bonus_damage}` : `DEF: ${outputItem.bonus_defense}`}</span>
                </div>
              </div>

              <button
                onClick={() => handleCraft(recipe.id)}
                disabled={!craftable || craftingRecipeId !== null}
                className={`w-full py-3 rounded font-cinzel font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isCrafting 
                    ? 'bg-orange-600 text-stone-100 border border-orange-500' 
                    : craftable
                      ? 'bg-orange-950/50 border border-orange-900 text-orange-500 hover:bg-orange-900/50 hover:text-orange-400'
                      : 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                }`}
              >
                {isCrafting ? (
                  <>
                    <Hammer className="animate-bounce" size={18} /> Forging...
                  </>
                ) : (
                  <>
                    Forge Item
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
