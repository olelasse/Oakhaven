import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, Crosshair, Wand2, ArrowRight } from 'lucide-react';
import type { CharacterClass, Gender } from '../types';

export default function CharacterCreation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [charClass, setCharClass] = useState<CharacterClass>('warrior');
  const [gender, setGender] = useState<Gender>('male');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      setUserId(session.user.id);
      
      // Auto-fill username from email if available
      if (session.user.email) {
        setUsername(session.user.email.split('@')[0]);
      }

      // Check if they already have a profile
      const { data } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
      if (data) {
        navigate('/play'); // Already created
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !username) return;
    setCreating(true);
    setError('');

    // Define base stats based on class
    let stats = { strength: 10, agility: 10, intelligence: 10, max_hp: 100, hp: 100 };
    let starterWeapon = 'rusty_iron_sword';

    if (charClass === 'warrior') {
      stats = { strength: 15, agility: 8, intelligence: 5, max_hp: 120, hp: 120 };
      starterWeapon = 'rusty_iron_sword';
    } else if (charClass === 'rogue') {
      stats = { strength: 8, agility: 15, intelligence: 5, max_hp: 100, hp: 100 };
      starterWeapon = 'hunting_bow';
    } else if (charClass === 'mage') {
      stats = { strength: 5, agility: 8, intelligence: 15, max_hp: 80, hp: 80 };
      starterWeapon = 'wooden_staff';
    }

    try {
      // 1. Create Profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        username,
        character_class: charClass,
        gender: gender,
        ...stats
      });
      if (profileError) throw profileError;

      // 2. Create Starter Inventory
      const { error: invError } = await supabase.from('inventory').insert([
        { profile_id: userId, item_id: starterWeapon, quantity: 1, is_equipped: true },
        { profile_id: userId, item_id: 'minor_health_potion', quantity: 5, is_equipped: false }
      ]);
      if (invError) throw invError;

      // Success! Go to game
      navigate('/play');
    } catch (err: any) {
      setError(err.message || 'Failed to create character. Please try again.');
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500 font-cinzel text-xl">Loading...</div>;
  }

  const avatarUrl = `/images/avatars/${charClass}_${gender}.png`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 font-sans selection:bg-amber-900 selection:text-amber-100 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-lg max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl">
        
        {/* Left Side: Avatar Preview */}
        <div className="w-full md:w-2/5 bg-stone-950 relative border-r border-stone-800 p-6 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="font-cinzel text-2xl text-amber-500 mb-6 drop-shadow">Your Champion</h2>
          <div className="w-48 h-64 border-4 border-stone-800 rounded-lg overflow-hidden shadow-2xl mb-4 bg-stone-900 relative">
            <img src={avatarUrl} alt="Character Avatar" className="w-full h-full object-cover transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
          </div>
          <p className="font-cinzel text-lg text-stone-400 capitalize">{gender} {charClass}</p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-3/5 p-8 lg:p-10">
          <h1 className="text-3xl font-cinzel text-stone-200 mb-2">Character Creation</h1>
          <p className="text-sm text-stone-500 mb-8 italic">Choose your destiny in Oakhaven carefully...</p>

          {error && <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded text-sm mb-6">{error}</div>}

          <form onSubmit={handleCreate} className="flex flex-col gap-8">
            
            {/* Identity */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-wider">Identity</label>
              <div className="flex gap-4">
                <input 
                  type="text" required placeholder="Character Name" 
                  value={username} onChange={e => setUsername(e.target.value)}
                  className="flex-1 bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:outline-none focus:border-amber-700"
                />
                <select 
                  value={gender} onChange={(e) => setGender(e.target.value as Gender)}
                  className="bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:outline-none focus:border-amber-700 cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Class Selection */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-wider">Class</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  type="button" onClick={() => setCharClass('warrior')}
                  className={`p-4 rounded border flex flex-col items-center gap-2 transition-colors ${charClass === 'warrior' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-600'}`}
                >
                  <Shield size={24} />
                  <span className="font-cinzel font-bold">Warrior</span>
                </button>
                <button 
                  type="button" onClick={() => setCharClass('rogue')}
                  className={`p-4 rounded border flex flex-col items-center gap-2 transition-colors ${charClass === 'rogue' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-600'}`}
                >
                  <Crosshair size={24} />
                  <span className="font-cinzel font-bold">Rogue</span>
                </button>
                <button 
                  type="button" onClick={() => setCharClass('mage')}
                  className={`p-4 rounded border flex flex-col items-center gap-2 transition-colors ${charClass === 'mage' ? 'bg-amber-900/30 border-amber-600 text-amber-500' : 'bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-600'}`}
                >
                  <Wand2 size={24} />
                  <span className="font-cinzel font-bold">Mage</span>
                </button>
              </div>
              
              <div className="bg-stone-950 p-4 border border-stone-800 rounded text-sm text-stone-400">
                {charClass === 'warrior' && "A master of melee combat. Starts with high Strength and Maximum Health. Armed with a Rusty Iron Sword."}
                {charClass === 'rogue' && "A stealthy survivor. Starts with high Agility for critical hits. Armed with a Hunting Bow."}
                {charClass === 'mage' && "A wielder of arcane elements. Starts with high Intellect for spell damage. Armed with a Wooden Staff."}
              </div>
            </div>

            <button 
              type="submit" disabled={creating}
              className="w-full py-4 bg-amber-700 hover:bg-amber-600 text-amber-100 text-lg font-cinzel font-bold rounded shadow-[0_0_20px_rgba(180,83,9,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {creating ? 'Forging Character...' : 'Enter Oakhaven'} <ArrowRight size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
