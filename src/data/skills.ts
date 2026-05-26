export type SkillEffectType = 'damage' | 'heal' | 'buff' | 'dot';

export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  class_req: 'warrior' | 'mage' | 'rogue';
  energy_cost: number;
  cooldown_turns: number;
  effect_type: SkillEffectType;
  base_value: number; // Damage, heal amount, or buff amount
  duration?: number; // Turns for buffs or dots
}

export const SKILL_DATABASE: SkillTemplate[] = [
  // WARRIOR SKILLS
  {
    id: 'skill_cleave',
    name: 'Cleave',
    description: 'A powerful sweeping attack that deals heavy damage based on your Strength.',
    class_req: 'warrior',
    energy_cost: 15,
    cooldown_turns: 2,
    effect_type: 'damage',
    base_value: 1.5 // 1.5x damage multiplier
  },
  {
    id: 'skill_iron_skin',
    name: 'Iron Skin',
    description: 'Harden your resolve, heavily reducing incoming damage for the next 2 turns.',
    class_req: 'warrior',
    energy_cost: 20,
    cooldown_turns: 4,
    effect_type: 'buff',
    base_value: 0.5, // Take 50% less damage
    duration: 2
  },

  // MAGE SKILLS
  {
    id: 'skill_fireball',
    name: 'Fireball',
    description: 'Hurl a ball of pure magical energy that deals massive damage based on Intelligence.',
    class_req: 'mage',
    energy_cost: 15,
    cooldown_turns: 2,
    effect_type: 'damage',
    base_value: 1.8 // 1.8x damage multiplier
  },
  {
    id: 'skill_heal',
    name: 'Cauterize Wounds',
    description: 'Use magic to restore your health based on Intelligence.',
    class_req: 'mage',
    energy_cost: 25,
    cooldown_turns: 3,
    effect_type: 'heal',
    base_value: 40 // Base heal + int bonus
  },

  // ROGUE SKILLS
  {
    id: 'skill_poison_strike',
    name: 'Poison Strike',
    description: 'Coat your weapon in venom, dealing immediate damage and leaving a deadly poison that deals damage over 3 turns.',
    class_req: 'rogue',
    energy_cost: 15,
    cooldown_turns: 3,
    effect_type: 'dot',
    base_value: 15, // Damage per turn
    duration: 3
  },
  {
    id: 'skill_evade',
    name: 'Shadow Step',
    description: 'Step into the shadows, guaranteeing you will dodge the enemy\'s next attack.',
    class_req: 'rogue',
    energy_cost: 20,
    cooldown_turns: 4,
    effect_type: 'buff',
    base_value: 1.0, // 100% dodge chance
    duration: 1
  }
];

export const getSkillsForClass = (playerClass: string) => {
  return SKILL_DATABASE.filter(s => s.class_req === playerClass);
};
