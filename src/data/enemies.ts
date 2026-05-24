export interface EnemyLootDrop {
  item_id: string;
  chance: number; // 0.0 to 1.0
  min_quantity: number;
  max_quantity: number;
}

export interface EnemyTemplate {
  id: string;
  name: string;
  description: string;
  level: number;
  max_hp: number;
  base_damage: number;
  defense: number;
  xp_reward: number;
  min_gold: number;
  max_gold: number;
  loot_table: EnemyLootDrop[];
  image_url: string;
}

export const enemies: Record<string, EnemyTemplate> = {
  'feral_wolf': {
    id: 'feral_wolf',
    name: 'Feral Wolf',
    description: 'A starving, rabid wolf of the Shadowwood. Its eyes glow with an unnatural hunger.',
    level: 1,
    max_hp: 50,
    base_damage: 8,
    defense: 2,
    xp_reward: 25,
    min_gold: 5,
    max_gold: 15,
    loot_table: [
      { item_id: 'minor_health_potion', chance: 0.1, min_quantity: 1, max_quantity: 1 },
      { item_id: 'rusty_iron_sword', chance: 0.05, min_quantity: 1, max_quantity: 1 }
    ],
    image_url: '/images/enemies/feral_wolf.png'
  },
  'bandit_scout': {
    id: 'bandit_scout',
    name: 'Bandit Scout',
    description: 'A rogue outcast preying on travelers. Quick with a blade.',
    level: 3,
    max_hp: 80,
    base_damage: 12,
    defense: 5,
    xp_reward: 45,
    min_gold: 15,
    max_gold: 35,
    loot_table: [
      { item_id: 'minor_health_potion', chance: 0.2, min_quantity: 1, max_quantity: 2 },
      { item_id: 'hunting_bow', chance: 0.1, min_quantity: 1, max_quantity: 1 },
      { item_id: 'steel_longsword', chance: 0.02, min_quantity: 1, max_quantity: 1 }
    ],
    image_url: '/images/enemies/bandit_scout.png'
  }
};

export const getEnemyTemplate = (id: string): EnemyTemplate | undefined => {
  return enemies[id];
};
