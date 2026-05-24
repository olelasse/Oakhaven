import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Profile, InventoryItem } from '../types';
import { getItemTemplate } from '../data/items';

interface GameState {
  profile: Profile;
  inventory: InventoryItem[];
  nextEnergyTick: number | null; // Timestamp for next energy regeneration
  addGold: (amount: number) => void;
  addXp: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  takeDamage: (amount: number) => void;
  changeLocation: (locationId: string) => void;
  upgradeItem: (inventoryId: string) => { success: boolean, message: string };
  sellItem: (inventoryId: string) => { success: boolean, message: string };
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [nextEnergyTick, setNextEnergyTick] = useState<number | null>(null);

  // Energy Regeneration Logic
  useEffect(() => {
    if (!profile) return;
    
    // If we have full energy, clear the timer
    if (profile.energy >= profile.max_energy) {
      if (nextEnergyTick !== null) setNextEnergyTick(null);
      return;
    }

    // If we need energy but have no timer, start one (60 seconds)
    if (nextEnergyTick === null) {
      setNextEnergyTick(Date.now() + 60000);
    }

    // Tick checker
    const interval = setInterval(() => {
      if (nextEnergyTick && Date.now() >= nextEnergyTick) {
        // Regenerate 1 Energy
        const newEnergy = Math.min(profile.max_energy, profile.energy + 1);
        setProfile(p => p ? { ...p, energy: newEnergy } : null);
        supabase.from('profiles').update({ energy: newEnergy }).eq('id', profile.id).then();
        
        // Reset timer if we still need more energy
        if (newEnergy < profile.max_energy) {
          setNextEnergyTick(Date.now() + 60000);
        } else {
          setNextEnergyTick(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profile?.energy, profile?.max_energy, nextEnergyTick]);

  useEffect(() => {
    // Only enforce auth if we are inside the /play or /create-character routes
    if (!location.pathname.startsWith('/play') && location.pathname !== '/create-character') {
      setLoading(false);
      return;
    }

    const fetchGameData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        // No profile found, force Character Creation
        if (location.pathname !== '/create-character') {
          navigate('/create-character');
        }
        setLoading(false);
        return;
      }

      // If they are on create-character but already have a profile, send them to play
      if (location.pathname === '/create-character') {
        navigate('/play');
      }

      setProfile(profileData as Profile);

      // Fetch Inventory
      const { data: invData } = await supabase
        .from('inventory')
        .select('*')
        .eq('profile_id', session.user.id);

      if (invData) {
        // Hydrate with item templates
        const hydrated = invData.map((i: any) => ({
          ...i,
          item: getItemTemplate(i.item_id)
        }));
        setInventory(hydrated);
      }

      setLoading(false);
    };

    fetchGameData();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setInventory([]);
        navigate('/');
      }
      if (event === 'SIGNED_IN') fetchGameData();
    });

    return () => authListener.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // Database Syncing Actions
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    setProfile(p => p ? { ...p, ...updates } : null); // Optimistic UI
    await supabase.from('profiles').update(updates).eq('id', profile.id);
  };

  const addGold = (amount: number) => updateProfile({ gold: profile!.gold + amount });
  
  const addXp = (amount: number) => {
    if (!profile) return;
    let newXp = profile.xp + amount;
    let newLevel = profile.level;
    const levelThreshold = profile.level * 1000;
    
    if (newXp >= levelThreshold) {
      newXp = newXp - levelThreshold;
      newLevel += 1;
    }
    updateProfile({ xp: newXp, level: newLevel });
  };

  const spendEnergy = (amount: number) => {
    if (!profile) return false;
    if (profile.energy >= amount) {
      updateProfile({ energy: profile.energy - amount });
      return true;
    }
    return false;
  };

  const takeDamage = (amount: number) => {
    if (!profile) return;
    updateProfile({ hp: Math.max(0, profile.hp - amount) });
  };

  const changeLocation = (locationId: string) => {
    updateProfile({ current_location: locationId });
  };

  const upgradeItem = (inventoryId: string) => {
    let result = { success: false, message: '' };
    if (!profile) return result;

    setInventory(prev => {
      const newInv = [...prev];
      const index = newInv.findIndex(i => i.id === inventoryId);
      if (index === -1) { result.message = 'Item not found.'; return prev; }
      
      const invItem = newInv[index];
      if (!invItem.item || invItem.item.type !== 'equipment') { result.message = 'Item cannot be upgraded.'; return prev; }
      if (invItem.upgrade_level >= 10) { result.message = 'Item is already at max level.'; return prev; }

      const cost = invItem.item.gold_cost * invItem.upgrade_level;
      if (profile.gold < cost) { result.message = 'Not enough gold.'; return prev; }

      // Optimistic Updates
      updateProfile({ gold: profile.gold - cost });
      invItem.upgrade_level += 1;
      
      // Async Sync
      supabase.from('inventory').update({ upgrade_level: invItem.upgrade_level }).eq('id', inventoryId).then();

      result = { success: true, message: `Upgraded ${invItem.item.name} to Level ${invItem.upgrade_level}!` };
      return newInv;
    });
    return result;
  };

  const sellItem = (inventoryId: string) => {
    let result = { success: false, message: '' };
    if (!profile) return result;

    setInventory(prev => {
      const invItem = prev.find(i => i.id === inventoryId);
      if (!invItem || !invItem.item) { result.message = 'Item not found.'; return prev; }
      if (invItem.is_equipped) { result.message = 'Cannot sell equipped items.'; return prev; }

      const sellValue = Math.floor(invItem.item.gold_cost / 2);
      
      // Optimistic UI
      updateProfile({ gold: profile.gold + sellValue });
      const newInv = prev.filter(i => i.id !== inventoryId);

      // Async Sync
      supabase.from('inventory').delete().eq('id', inventoryId).then();

      result = { success: true, message: `Sold ${invItem.item.name} for ${sellValue} Gold.` };
      return newInv;
    });
    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-amber-500 font-cinzel text-xl">
        <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mb-4"></div>
        Summoning Realm...
      </div>
    );
  }

  // If we are on the landing page or creating a character, profile might be null, which is fine since we aren't in the GameLayout
  // However, GameState requires a profile, so we only provide the context fully populated if it exists.
  // We use a fallback empty profile just to satisfy TS if we are rendering outside the /play route.
  const fallbackProfile = {} as Profile;

  return (
    <GameContext.Provider value={{ profile: profile || fallbackProfile, inventory, nextEnergyTick, addGold, addXp, spendEnergy, takeDamage, changeLocation, upgradeItem, sellItem }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
