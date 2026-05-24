import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profile, InventoryItem } from '../types';

interface GameState {
  profile: Profile;
  inventory: InventoryItem[];
  addGold: (amount: number) => void;
  addXp: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  takeDamage: (amount: number) => void;
  changeLocation: (locationId: string) => void;
  upgradeItem: (inventoryId: string) => { success: boolean, message: string };
  sellItem: (inventoryId: string) => { success: boolean, message: string };
}

const mockProfile: Profile = {
  id: 'mock-123',
  username: 'Player_One',
  custom_title: 'Novice Adventurer',
  active_theme: 'default',
  gold: 500,
  premium_tokens: 0,
  level: 1,
  xp: 250,
  energy: 85,
  max_energy: 100,
  hp: 100,
  max_hp: 100,
  strength: 10,
  agility: 12,
  intelligence: 8,
  current_location: 'oakhaven',
  traveling_until: null,
  updated_at: new Date().toISOString()
};

import { getItemTemplate } from '../data/items';

const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    profile_id: 'mock-123',
    item_id: 'rusty_iron_sword',
    quantity: 1,
    is_equipped: true,
    is_banked: false,
    upgrade_level: 1,
    created_at: new Date().toISOString(),
    item: getItemTemplate('rusty_iron_sword')
  },
  {
    id: 'inv-2',
    profile_id: 'mock-123',
    item_id: 'minor_health_potion',
    quantity: 5,
    is_equipped: false,
    is_banked: false,
    upgrade_level: 0,
    created_at: new Date().toISOString(),
    item: getItemTemplate('minor_health_potion')
  }
];

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  const addGold = (amount: number) => setProfile(p => ({ ...p, gold: p.gold + amount }));
  
  const addXp = (amount: number) => setProfile(p => {
    let newXp = p.xp + amount;
    let newLevel = p.level;
    const levelThreshold = p.level * 1000;
    
    if (newXp >= levelThreshold) {
      newXp = newXp - levelThreshold;
      newLevel += 1;
    }
    return { ...p, xp: newXp, level: newLevel };
  });

  const spendEnergy = (amount: number) => {
    if (profile.energy >= amount) {
      setProfile(p => ({ ...p, energy: p.energy - amount }));
      return true;
    }
    return false;
  };

  const takeDamage = (amount: number) => {
    setProfile(p => ({ ...p, hp: Math.max(0, p.hp - amount) }));
  };

  const changeLocation = (locationId: string) => {
    setProfile(p => ({ ...p, current_location: locationId }));
  };

  const upgradeItem = (inventoryId: string) => {
    let result = { success: false, message: '' };
    setInventory(prev => {
      const newInv = [...prev];
      const index = newInv.findIndex(i => i.id === inventoryId);
      if (index === -1) { result.message = 'Item not found.'; return prev; }
      
      const invItem = newInv[index];
      if (!invItem.item || invItem.item.type !== 'equipment') { result.message = 'Item cannot be upgraded.'; return prev; }
      if (invItem.upgrade_level >= 10) { result.message = 'Item is already at max level.'; return prev; }

      const cost = invItem.item.gold_cost * invItem.upgrade_level;
      if (profile.gold < cost) { result.message = 'Not enough gold.'; return prev; }

      setProfile(p => ({ ...p, gold: p.gold - cost }));
      invItem.upgrade_level += 1;
      result = { success: true, message: `Upgraded ${invItem.item.name} to Level ${invItem.upgrade_level}!` };
      return newInv;
    });
    return result;
  };

  const sellItem = (inventoryId: string) => {
    let result = { success: false, message: '' };
    setInventory(prev => {
      const invItem = prev.find(i => i.id === inventoryId);
      if (!invItem || !invItem.item) { result.message = 'Item not found.'; return prev; }
      if (invItem.is_equipped) { result.message = 'Cannot sell equipped items.'; return prev; }

      const sellValue = Math.floor(invItem.item.gold_cost / 2);
      setProfile(p => ({ ...p, gold: p.gold + sellValue }));
      result = { success: true, message: `Sold ${invItem.item.name} for ${sellValue} Gold.` };
      return prev.filter(i => i.id !== inventoryId);
    });
    return result;
  };

  return (
    <GameContext.Provider value={{ profile, inventory, addGold, addXp, spendEnergy, takeDamage, changeLocation, upgradeItem, sellItem }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
