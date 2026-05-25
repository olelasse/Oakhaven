export type Location = string;
export type CharacterClass = 'warrior' | 'rogue' | 'mage';
export type Gender = 'male' | 'female';

export interface Profile {
  id: string;
  username: string;
  character_class: CharacterClass;
  gender: Gender;
  custom_title: string;
  active_theme: string;
  gold: number;
  premium_tokens: number;
  level: number;
  xp: number;
  energy: number;
  max_energy: number;
  hp: number;
  max_hp: number;
  strength: number;
  agility: number;
  intelligence: number;
  current_location: Location;
  traveling_until: string | null;
  daily_quests_completed: number;
  daily_quests_reset_at: string;
  has_completed_tutorial: boolean;
  updated_at: string;
}

export type ItemType = 'equipment' | 'quest_item' | 'consumable' | 'bag';
export type ItemSlot = 'head' | 'body' | 'hands' | 'bracers' | 'legs' | 'feet' | 'cape' | 'necklace' | 'ring' | 'weapon' | 'none';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
  id: string;
  name: string;
  description: string | null;
  type: ItemType;
  slot: ItemSlot;
  rarity: ItemRarity;
  required_level: number;
  gold_cost: number;
  token_cost: number;
  is_premium_cosmetic: boolean;
  sold_at_blacksmith: boolean;
  drop_sources: string[];
  drop_chance: number;
  bonus_damage: number;
  bonus_defense: number;
  slots_granted: number;
  max_stack: number;
}

export interface InventoryItem {
  id: string;
  profile_id: string;
  item_id: string;
  quantity: number;
  is_equipped: boolean;
  is_banked: boolean;
  upgrade_level: number; // max 10 for equipment
  created_at: string;
  item?: Item; // Joined relation
}

export interface ActionLog {
  id: string;
  profile_id: string;
  message: string;
  type: string;
  created_at: string;
}

export interface DailyAdClaim {
  id: string;
  profile_id: string;
  claimed_at: string;
}
