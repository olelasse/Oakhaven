import type { Item, InventoryItem } from '../../types';

interface ItemTooltipProps {
  item: Item;
  upgradeLevel?: number;
  equippedCompareItem?: InventoryItem | null;
}

export default function ItemTooltip({ item, upgradeLevel = 0, equippedCompareItem }: ItemTooltipProps) {
  
  const getStats = (itemToCalc: Item, upLvl: number) => {
    let damage = itemToCalc.bonus_damage || 0;
    let defense = itemToCalc.bonus_defense || 0;
    
    if (upLvl > 0) {
      if (damage > 0) damage = Math.floor(damage * (1 + (upLvl * 0.1)));
      if (defense > 0) defense = Math.floor(defense * (1 + (upLvl * 0.1)));
    }
    
    return { damage, defense };
  };

  const currentStats = getStats(item, upgradeLevel);
  const compareStats = equippedCompareItem && equippedCompareItem.item ? getStats(equippedCompareItem.item, equippedCompareItem.upgrade_level) : null;

  return (
    <div className="absolute hidden group-hover:block top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-stone-950 border border-medieval-gold p-3 rounded z-50 text-left pointer-events-none shadow-xl">
      <div className="border-b border-stone-800 pb-2 mb-2">
        <p className="font-cinzel text-amber-500 text-sm font-bold">
          {item.name} {upgradeLevel > 0 && <span className="text-stone-400 text-xs">(+{upgradeLevel})</span>}
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">{item.type}</span>
          <span className="text-[9px] uppercase tracking-wider text-amber-700 font-bold">{item.rarity}</span>
        </div>
      </div>
      
      <p className="font-sans text-xs text-stone-400 mb-3">{item.description}</p>
      
      {/* Stats Block */}
      <div className="flex flex-col gap-1">
        {currentStats.damage > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-red-400 font-bold">+{currentStats.damage} Damage</span>
            {compareStats && compareStats.damage > 0 && (
              <span className={`font-bold ${currentStats.damage > compareStats.damage ? 'text-green-500' : currentStats.damage < compareStats.damage ? 'text-red-500' : 'text-stone-500'}`}>
                {currentStats.damage > compareStats.damage ? '+' : ''}{currentStats.damage - compareStats.damage}
              </span>
            )}
          </div>
        )}
        
        {currentStats.defense > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-blue-400 font-bold">+{currentStats.defense} Defense</span>
            {compareStats && compareStats.defense > 0 && (
              <span className={`font-bold ${currentStats.defense > compareStats.defense ? 'text-green-500' : currentStats.defense < compareStats.defense ? 'text-red-500' : 'text-stone-500'}`}>
                {currentStats.defense > compareStats.defense ? '+' : ''}{currentStats.defense - compareStats.defense}
              </span>
            )}
          </div>
        )}
      </div>

      {compareStats && (
        <div className="text-stone-500 mt-2 italic text-[10px]">
          Comparing to: {equippedCompareItem?.item?.name || 'Nothing equipped'}
        </div>
      )}
    </div>
  );
}
