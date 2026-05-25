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
  removeGold: (amount: number) => void;
  addXp: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  takeDamage: (amount: number) => void;
  changeLocation: (locationId: string) => void;
  upgradeItem: (inventoryId: string) => { success: boolean, message: string };
  sellItem: (inventoryId: string) => { success: boolean, message: string };
  consumeItem: (inventoryId: string) => { success: boolean, message: string };
  getAttackDamage: () => number;
  addItemToInventory: (itemId: string, quantity: number) => Promise<void>;
  incrementDailyQuest: () => void;
  completeTutorial: (grantReward: boolean) => Promise<void>;
  logAction: (message: string, type: 'success' | 'danger' | 'loot' | 'system' | 'heal') => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [nextEnergyTick, setNextEnergyTick] = useState<number | null>(null);
  const [nextHpTick, setNextHpTick] = useState<number | null>(null);

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

  // Health Regeneration Logic (1 HP per hour = 3600000ms)
  useEffect(() => {
    if (!profile) return;
    
    if (profile.hp >= profile.max_hp) {
      if (nextHpTick !== null) setNextHpTick(null);
      return;
    }

    if (nextHpTick === null) {
      setNextHpTick(Date.now() + 3600000); // 1 hour
    }

    const interval = setInterval(() => {
      if (nextHpTick && Date.now() >= nextHpTick) {
        const newHp = Math.min(profile.max_hp, profile.hp + 1);
        setProfile(p => p ? { ...p, hp: newHp } : null);
        supabase.from('profiles').update({ hp: newHp }).eq('id', profile.id).then();
        
        if (newHp < profile.max_hp) {
          setNextHpTick(Date.now() + 3600000);
        } else {
          setNextHpTick(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profile?.hp, profile?.max_hp, nextHpTick]);

  useEffect(() => {
    const fetchGameData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        // Calculate offline energy regeneration (1 energy per minute)
        const lastUpdated = new Date(profileData.updated_at).getTime();
        const now = Date.now();
        const minutesPassed = Math.floor((now - lastUpdated) / 60000);
        
        if (minutesPassed > 0 && profileData.energy < profileData.max_energy) {
          const newEnergy = Math.min(profileData.max_energy, profileData.energy + minutesPassed);
          if (newEnergy !== profileData.energy) {
            profileData.energy = newEnergy;
            // Silently update database
            supabase.from('profiles').update({ energy: newEnergy }).eq('id', profileData.id).then();
          }
        }

        // Calculate offline HP regeneration (1 HP per hour)
        const hoursPassed = Math.floor(minutesPassed / 60);
        if (hoursPassed > 0 && profileData.hp < profileData.max_hp) {
          const newHp = Math.min(profileData.max_hp, profileData.hp + hoursPassed);
          if (newHp !== profileData.hp) {
            profileData.hp = newHp;
            supabase.from('profiles').update({ hp: newHp }).eq('id', profileData.id).then();
          }
        }

        // Check Daily Quest Reset
        const resetAt = new Date(profileData.daily_quests_reset_at).getTime();
        if (now >= resetAt) {
          // Reset daily quests and set next reset to 24 hours from now
          profileData.daily_quests_completed = 0;
          const nextReset = new Date(now + 24 * 60 * 60 * 1000).toISOString();
          profileData.daily_quests_reset_at = nextReset;
          supabase.from('profiles').update({ daily_quests_completed: 0, daily_quests_reset_at: nextReset }).eq('id', profileData.id).then();
        }

        setProfile(profileData as Profile);
      } else {
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

    // Redirect logic for create-character has to happen when loading is done
    // but the fetch only happens once on mount
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
  }, [navigate]); // Removed location.pathname to prevent looping fetches!

  // Database Syncing Actions
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    setProfile(p => p ? { ...p, ...updates } : null); // Optimistic UI
    
    // Explicitly update `updated_at` to fix offline time calculations
    const finalUpdates = { ...updates, updated_at: new Date().toISOString() };
    await supabase.from('profiles').update(finalUpdates).eq('id', profile.id);
  };

  const logAction = (message: string, type: 'success' | 'danger' | 'loot' | 'system' | 'heal') => {
    if (!profile) return;
    supabase.from('action_logs').insert([{ profile_id: profile.id, message, type }]).then();
  };

  const addGold = (amount: number) => {
    if (!profile) return;
    const newGold = profile.gold + amount;
    setProfile({ ...profile, gold: newGold });
    supabase.from('profiles').update({ gold: newGold }).eq('id', profile.id).then();
  };

  const removeGold = (amount: number) => {
    if (!profile) return;
    const newGold = Math.max(0, profile.gold - amount);
    setProfile({ ...profile, gold: newGold });
    supabase.from('profiles').update({ gold: newGold }).eq('id', profile.id).then();
  };
  
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

  const incrementDailyQuest = () => {
    if (!profile) return;
    const newCompleted = profile.daily_quests_completed + 1;
    updateProfile({ daily_quests_completed: newCompleted });
  };

  const completeTutorial = async (grantReward: boolean) => {
    if (!profile) return;
    
    // Optimsitic UI
    setProfile({ ...profile, has_completed_tutorial: true });
    
    // DB
    await supabase.from('profiles').update({ has_completed_tutorial: true }).eq('id', profile.id);

    if (grantReward) {
      addGold(50);
      await addItemToInventory('minor_health_potion', 3);
    }
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
    const newHp = Math.max(0, profile.hp - amount);
    
    if (newHp === 0) {
      // Death Penalty
      const goldPenalty = Math.floor(profile.gold * 0.1);
      const resHp = Math.max(1, Math.floor(profile.max_hp * 0.1));
      logAction(`You died! Lost ${goldPenalty} Gold and awakened in Oakhaven.`, 'danger');
      updateProfile({ hp: resHp, gold: Math.max(0, profile.gold - goldPenalty), current_location: 'oakhaven' });
    } else {
      updateProfile({ hp: newHp });
    }
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

  const consumeItem = (inventoryId: string) => {
    let result = { success: false, message: '' };
    if (!profile) return result;

    setInventory(prev => {
      const invItem = prev.find(i => i.id === inventoryId);
      if (!invItem || !invItem.item || invItem.item.type !== 'consumable') { 
        result.message = 'Item cannot be consumed.'; 
        return prev; 
      }

      // Handle specific consumables
      if (invItem.item_id === 'minor_health_potion') {
        const healAmount = 25;
        if (profile.hp >= profile.max_hp) {
          result.message = 'Health is already full.';
          return prev;
        }
        updateProfile({ hp: Math.min(profile.max_hp, profile.hp + healAmount) });
        result.message = `Restored ${healAmount} HP.`;
      } else {
        result.message = 'Unknown consumable.';
        return prev;
      }

      // Update quantity
      const newInv = prev.map(i => {
        if (i.id === inventoryId) {
          return { ...i, quantity: i.quantity - 1 };
        }
        return i;
      }).filter(i => i.quantity > 0);

      // Async Sync
      if (invItem.quantity - 1 <= 0) {
        supabase.from('inventory').delete().eq('id', inventoryId).then();
      } else {
        supabase.from('inventory').update({ quantity: invItem.quantity - 1 }).eq('id', inventoryId).then();
      }

      result.success = true;
      return newInv;
    });
    return result;
  };

  const getAttackDamage = () => {
    if (!profile) return 0;
    
    // Base damage from primary stat
    let base = 0;
    if (profile.character_class === 'warrior') base = Math.floor(profile.strength / 2);
    if (profile.character_class === 'rogue') base = Math.floor(profile.agility / 2);
    if (profile.character_class === 'mage') base = Math.floor(profile.intelligence / 2);

    // Weapon damage
    let weaponBonus = 0;
    const equippedWeapon = inventory.find(i => i.is_equipped && i.item?.slot === 'weapon');
    if (equippedWeapon && equippedWeapon.item) {
      // Base weapon damage + 10% per upgrade level
      const dmg = equippedWeapon.item.bonus_damage;
      weaponBonus = Math.floor(dmg * (1 + (equippedWeapon.upgrade_level * 0.1)));
    }

    return Math.max(1, base + weaponBonus);
  };

  const addItemToInventory = async (itemId: string, quantity: number) => {
    if (!profile) return;
    
    // Check if item exists and is stackable
    const existing = inventory.find(i => i.item_id === itemId);
    if (existing && existing.item && existing.item.max_stack > 1) {
      // Stack it
      const newQuantity = existing.quantity + quantity;
      setInventory(prev => prev.map(i => i.id === existing.id ? { ...i, quantity: newQuantity } : i));
      await supabase.from('inventory').update({ quantity: newQuantity }).eq('id', existing.id);
    } else {
      // New row
      const { data } = await supabase.from('inventory').insert([{
        profile_id: profile.id,
        item_id: itemId,
        quantity,
        is_equipped: false
      }]).select().single();
      
      if (data) {
        setInventory(prev => [...prev, { ...data, item: getItemTemplate(itemId) }]);
      }
    }
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
    <GameContext.Provider value={{ profile: profile || fallbackProfile, inventory, nextEnergyTick, addGold, removeGold, addXp, spendEnergy, takeDamage, changeLocation, upgradeItem, sellItem, consumeItem, getAttackDamage, addItemToInventory, incrementDailyQuest, completeTutorial, logAction }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
