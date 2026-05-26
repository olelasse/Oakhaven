import { useGame } from '../contexts/GameContext';
import { Package, Sword, User } from 'lucide-react';
import type { ItemSlot } from '../types';
import ItemTooltip from '../components/inventory/ItemTooltip';

export default function Inventory() {
  const { inventory, consumeItem, toggleEquipItem } = useGame();

  const equippedItems = inventory.filter(i => i.is_equipped);
  const backpackItems = inventory.filter(i => !i.is_equipped && !i.is_banked);
  const emptySlots = Math.max(0, 10 - backpackItems.length);

  const renderSlot = (slot: ItemSlot) => {
    const equipped = equippedItems.find(i => i.item?.slot === slot);
    
    const handleUnequip = () => {
      if (equipped) toggleEquipItem(equipped.id);
    };
    
    return (
      <div key={slot} className="flex flex-col gap-1 items-center z-10 hover:z-50">
        <span className="text-[10px] font-cinzel text-amber-700 uppercase tracking-wider bg-stone-950/80 px-1 rounded">{slot}</span>
        <div 
          onClick={handleUnequip}
          className={`w-16 h-16 rounded border flex items-center justify-center cursor-pointer transition-colors shadow-inner ${
          equipped 
          ? 'bg-stone-800 border-amber-600 hover:bg-stone-700' 
          : 'bg-stone-900 border-stone-700 opacity-80 hover:opacity-100'
        }`}>
          {equipped ? (
            <div className="text-center group relative w-full h-full flex items-center justify-center">
              <Sword size={28} className="text-amber-500" />
              {equipped.item && <ItemTooltip item={equipped.item} upgradeLevel={equipped.upgrade_level} />}
            </div>
          ) : (
            <div className="w-8 h-8 border-2 border-dashed border-stone-600 rounded-full opacity-30" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-32">
      
      {/* Top: Equipment Paper Doll */}
      <div className="shrink-0 flex flex-col items-center">
        <h1 className="text-3xl drop-shadow-sm border-b-2 border-medieval-gold pb-2 mb-6 w-full text-left">Equipment</h1>
        
        <div className="relative w-full max-w-md mx-auto p-4 bg-stone-900/50 rounded-lg border border-stone-800 shadow-inner">
          {/* Central Background Figure */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <User size={280} className="text-amber-900" />
          </div>

          <div className="grid grid-cols-3 gap-y-6 gap-x-8 relative z-10">
            {/* Row 1 */}
            <div className="flex justify-end">{renderSlot('necklace')}</div>
            <div className="flex justify-center">{renderSlot('head')}</div>
            <div className="flex justify-start">{renderSlot('cape')}</div>

            {/* Row 2 */}
            <div className="flex justify-end">{renderSlot('weapon')}</div>
            <div className="flex justify-center">{renderSlot('body')}</div>
            <div className="flex justify-start">{renderSlot('bracers')}</div>

            {/* Row 3 */}
            <div className="flex justify-end">{renderSlot('hands')}</div>
            <div className="flex justify-center">{renderSlot('legs')}</div>
            <div className="flex justify-start">{renderSlot('ring')}</div>

            {/* Row 4 */}
            <div className="col-start-2 flex justify-center">{renderSlot('feet')}</div>
          </div>
        </div>
      </div>

      {/* Bottom: Backpack */}
      <div className="bg-stone-900 rounded p-6 border border-stone-800 shadow-inner">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-700 pb-4">
          <Package className="text-amber-600" />
          <h2 className="text-xl text-stone-200">Backpack</h2>
          <span className="ml-auto text-xs font-sans text-stone-400">{backpackItems.length} / 10 Slots</span>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {backpackItems.map((invItem) => (
            <div 
              key={invItem.id} 
              onClick={() => {
                if (invItem.item?.type === 'consumable') {
                  consumeItem(invItem.id);
                } else if (invItem.item?.type === 'equipment') {
                  toggleEquipItem(invItem.id);
                }
              }}
              className="aspect-square bg-stone-800 border border-stone-600 rounded flex flex-col items-center justify-center relative cursor-pointer hover:border-amber-500 group transition-colors shadow-sm hover:z-50"
            >
               <Package size={24} className="text-stone-400 group-hover:text-amber-500" />
               <span className="absolute bottom-1 right-1 text-[10px] font-sans text-stone-400 font-bold bg-stone-950/80 px-1 rounded">x{invItem.quantity}</span>
               
               {invItem.item && (
                 <ItemTooltip 
                   item={invItem.item} 
                   upgradeLevel={invItem.upgrade_level} 
                   equippedCompareItem={equippedItems.find(i => i.item?.slot === invItem.item?.slot)} 
                 />
               )}
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-stone-950/40 border border-stone-800/50 rounded flex items-center justify-center opacity-50 shadow-inner">
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
