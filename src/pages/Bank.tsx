import { useState } from 'react';
import { ArrowLeft, Landmark, Coins, Shield } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import ItemTooltip from '../components/inventory/ItemTooltip';

export default function Bank() {
  const { profile, inventory, depositGold, withdrawGold, transferItem } = useGame() as any;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'treasury' | 'vault'>('treasury');
  const [amountInput, setAmountInput] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleDepositGold = () => {
    const amt = parseInt(amountInput);
    if (!isNaN(amt) && amt > 0) {
      depositGold(amt);
      setAmountInput('');
    }
  };

  const handleWithdrawGold = () => {
    const amt = parseInt(amountInput);
    if (!isNaN(amt) && amt > 0) {
      withdrawGold(amt);
      setAmountInput('');
    }
  };

  const unbankedItems = inventory.filter((i: any) => !i.is_banked && !i.is_equipped);
  const bankedItems = inventory.filter((i: any) => i.is_banked);
  
  const handleItemTransfer = (invItem: any, toBank: boolean) => {
    let amount = 1;
    if (invItem.quantity > 1) {
      const input = window.prompt(`How many ${invItem.item?.name}s do you want to ${toBank ? 'deposit' : 'withdraw'}? (Max: ${invItem.quantity})`, invItem.quantity.toString());
      if (!input) return;
      amount = parseInt(input, 10);
      if (isNaN(amount) || amount <= 0) return;
    }
    transferItem(invItem.id, toBank, amount);
  };

  return (
    <div className="animate-fade-in flex flex-col text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-500 drop-shadow-sm flex items-center gap-2">
            <Landmark size={32} /> Oakhaven Vaults
          </h1>
          <p className="text-sm font-sans text-stone-500 italic">Store your wealth away from the dangers of the world.</p>
        </div>
        <button onClick={() => navigate('/play')} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-amber-500 rounded text-sm">
          <ArrowLeft size={16} /> Leave Vault
        </button>
      </div>

      <div className="flex gap-4 border-b border-stone-800 mb-6 shrink-0">
        <button 
          onClick={() => setActiveTab('treasury')}
          className={`flex items-center gap-2 pb-2 px-4 font-cinzel font-bold transition-colors ${activeTab === 'treasury' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <Coins size={18} /> Treasury
        </button>
        <button 
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2 pb-2 px-4 font-cinzel font-bold transition-colors ${activeTab === 'vault' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <Shield size={18} /> Item Vault
        </button>
      </div>

      {activeTab === 'treasury' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 rounded-lg p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <Shield size={150} className="absolute -bottom-10 -right-10 text-stone-900 opacity-50" />
            
            <h2 className="text-2xl font-cinzel text-amber-500 mb-6 relative z-10 text-center">Gold Reserves</h2>
            
            <div className="flex justify-between mb-8 relative z-10">
              <div className="text-center p-4 bg-stone-900 border border-stone-700 rounded flex-1 mr-2">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">On Hand</p>
                <p className="text-xl font-cinzel text-stone-200">{profile.gold} G</p>
              </div>
              <div className="text-center p-4 bg-amber-950/20 border border-amber-900 rounded flex-1 ml-2">
                <p className="text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">In Vault</p>
                <p className="text-2xl font-cinzel text-amber-500">{profile.bank_gold} G</p>
              </div>
            </div>

            <div className="flex gap-2 relative z-10 mb-4">
              <input 
                type="number" 
                min="1"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="Amount..."
                className="flex-1 bg-stone-900 border border-stone-700 p-3 rounded text-stone-300 focus:outline-none focus:border-amber-700"
              />
              <button 
                onClick={() => setAmountInput(profile.gold.toString())}
                className="px-3 py-2 bg-stone-800 text-stone-400 rounded text-xs uppercase font-bold hover:bg-stone-700"
              >Max Dpt</button>
            </div>

            <div className="flex gap-4 relative z-10">
              <button 
                onClick={handleDepositGold}
                className="flex-1 py-3 bg-stone-800 text-stone-300 font-bold rounded hover:bg-stone-700 transition-colors border border-stone-600"
              >
                Deposit
              </button>
              <button 
                onClick={handleWithdrawGold}
                className="flex-1 py-3 bg-amber-900 text-amber-100 font-bold rounded hover:bg-amber-800 transition-colors border border-amber-700"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inventory */}
          <div className="flex flex-col gap-4 bg-stone-950 border border-stone-800 rounded p-4">
            <h2 className="font-cinzel text-stone-400 border-b border-stone-800 pb-2">Your Backpack</h2>
            {unbankedItems.length === 0 ? (
              <p className="text-stone-600 italic text-sm text-center mt-4">No unequipped items.</p>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {unbankedItems.map((invItem: any) => (
                  <div 
                    key={invItem.id} 
                    className="aspect-square bg-stone-900 border border-stone-700 rounded relative cursor-pointer hover:border-amber-500 transition-colors group"
                    onClick={() => handleItemTransfer(invItem, true)}
                    onMouseEnter={() => setHoveredItem(invItem.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-xs text-center p-1 font-bold">
                      {invItem.item?.name}
                    </div>
                    {invItem.quantity > 1 && (
                      <span className="absolute bottom-1 right-1 text-[10px] bg-stone-950 px-1 rounded text-amber-500 border border-stone-700 font-bold z-10">
                        x{invItem.quantity}
                      </span>
                    )}
                    {hoveredItem === invItem.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded">
                        <span className="text-xs font-bold text-amber-500">Deposit</span>
                      </div>
                    )}
                    {hoveredItem === invItem.id && invItem.item && (
                      <ItemTooltip item={invItem.item} upgradeLevel={invItem.upgrade_level} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vault */}
          <div className="flex flex-col gap-4 bg-stone-900/50 border border-stone-800 rounded p-4">
            <h2 className="font-cinzel text-amber-500 border-b border-amber-900/50 pb-2">Vault Storage</h2>
            {bankedItems.length === 0 ? (
              <p className="text-stone-600 italic text-sm text-center mt-4">The vault is empty.</p>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {bankedItems.map((invItem: any) => (
                  <div 
                    key={invItem.id} 
                    className="aspect-square bg-stone-950 border border-stone-800 rounded relative cursor-pointer hover:border-amber-500 transition-colors group"
                    onClick={() => handleItemTransfer(invItem, false)}
                    onMouseEnter={() => setHoveredItem(invItem.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs text-center p-1 font-bold">
                      {invItem.item?.name}
                    </div>
                    {invItem.quantity > 1 && (
                      <span className="absolute bottom-1 right-1 text-[10px] bg-stone-900 px-1 rounded text-amber-500 border border-stone-700 font-bold z-10">
                        x{invItem.quantity}
                      </span>
                    )}
                    {hoveredItem === invItem.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded">
                        <span className="text-xs font-bold text-amber-500">Withdraw</span>
                      </div>
                    )}
                    {hoveredItem === invItem.id && invItem.item && (
                      <ItemTooltip item={invItem.item} upgradeLevel={invItem.upgrade_level} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
