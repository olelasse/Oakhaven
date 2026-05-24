import { useState } from 'react';
import { ArrowLeft, Gavel, Search, Coins, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuctionHouse() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  return (
    <div className="animate-fade-in flex flex-col h-full text-stone-300">
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-500 drop-shadow-sm">The Auction House</h1>
          <p className="text-sm font-sans text-stone-500 italic">Trade legendary artifacts with other players.</p>
        </div>
        <button onClick={() => navigate('/play')} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 hover:text-amber-500 rounded text-sm">
          <ArrowLeft size={16} /> Return to Town
        </button>
      </div>

      <div className="flex gap-4 border-b border-stone-800 mb-6">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex items-center gap-2 pb-2 px-2 font-cinzel font-bold transition-colors ${activeTab === 'browse' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <Search size={18} /> Browse Auctions
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 pb-2 px-2 font-cinzel font-bold transition-colors ${activeTab === 'create' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <PlusCircle size={18} /> Create Listing
        </button>
      </div>

      {activeTab === 'browse' && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-stone-950 border border-stone-800 p-4 rounded">
            <input type="text" placeholder="Search for items..." className="flex-1 bg-stone-900 border border-stone-700 p-2 rounded text-stone-300 focus:outline-none focus:border-amber-700" />
            <select className="bg-stone-900 border border-stone-700 p-2 rounded text-stone-300 focus:outline-none focus:border-amber-700">
              <option>All Rarities</option>
              <option>Legendary</option>
              <option>Epic</option>
              <option>Rare</option>
            </select>
            <button className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold rounded transition-colors">Search</button>
          </div>
          
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-stone-800 rounded bg-stone-900/30">
            <div className="text-center text-stone-500">
              <Gavel size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-cinzel text-lg text-stone-400">The Auction House is closed.</p>
              <p className="text-sm">Multiplayer database connection is required to trade with others.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-950/80 border border-stone-800 rounded p-6">
            <h2 className="font-cinzel text-xl text-stone-400 mb-4">List an Item</h2>
            <p className="text-sm text-stone-500 mb-6">Select an unequipped item from your inventory to auction it to other players. You set the price.</p>
            
            <div className="text-center p-8 bg-stone-900 border border-stone-700 rounded shadow-inner">
              <p className="text-stone-400 italic mb-4">You must connect to the multiplayer server to create a listing.</p>
              <button disabled className="px-6 py-3 bg-stone-800 text-stone-500 font-bold rounded cursor-not-allowed border border-stone-700 flex items-center justify-center gap-2 mx-auto">
                Create Listing <Coins size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
