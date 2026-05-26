export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  type: 'regular' | 'daily' | 'encounter';
  energy_cost: number;
  min_level: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';
  reward_gold: [number, number];
  reward_xp: [number, number];
  target_enemy_id?: string;
  location?: string;
}

export const QUEST_DATABASE: QuestTemplate[] = [
  // REGULAR QUESTS (Simulated)
  {
    id: 'reg_rats',
    title: 'Clear the Cellar Rats',
    description: 'The local tavern keeper needs someone to exterminate the dire rats infesting the mead cellar.',
    type: 'regular',
    energy_cost: 10,
    min_level: 1,
    difficulty: 'Easy',
    reward_gold: [5, 15],
    reward_xp: [20, 40]
  },
  {
    id: 'reg_patrol',
    title: 'Patrol the City Gates',
    description: 'Assist the city guard with the night watch. Keep an eye out for smugglers.',
    type: 'regular',
    energy_cost: 15,
    min_level: 1,
    difficulty: 'Medium',
    reward_gold: [10, 25],
    reward_xp: [35, 60]
  },
  {
    id: 'reg_boar',
    title: 'Hunt the Forest Boar',
    description: 'A massive boar has been terrorizing the lumberjacks just outside the city walls.',
    type: 'regular',
    energy_cost: 25,
    min_level: 3,
    difficulty: 'Hard',
    reward_gold: [30, 60],
    reward_xp: [80, 150]
  },

  // DAILY QUESTS (Combat)
  {
    id: 'daily_bandit_king',
    title: 'Bounty: The Bandit King',
    description: 'The notorious Bandit King has been spotted near the Shadowwood. The Royal Guard has placed a massive bounty on his head. (Warning: Boss Fight!)',
    type: 'daily',
    energy_cost: 0,
    min_level: 3,
    difficulty: 'Boss',
    reward_gold: [200, 400],
    reward_xp: [300, 500],
    target_enemy_id: 'bandit_king'
  },
  
  // SHADOWWOOD QUESTS
  {
    id: 'sw_forage',
    title: 'Forage for Herbs',
    description: 'Search the undergrowth for valuable Bloodweed.',
    type: 'regular',
    energy_cost: 5,
    min_level: 1,
    difficulty: 'Easy',
    reward_gold: [5, 15],
    reward_xp: [5, 15],
    location: 'shadowwood'
  },
  {
    id: 'sw_hunt',
    title: 'Hunt Feral Wolves',
    description: 'Track and fight the dangerous beasts of the woods in a turn-based encounter.',
    type: 'encounter',
    energy_cost: 10,
    min_level: 2,
    difficulty: 'Medium',
    reward_gold: [0, 0], // Rewards given by combat
    reward_xp: [0, 0], // Rewards given by combat
    target_enemy_id: 'feral_wolf',
    location: 'shadowwood'
  },
  {
    id: 'sw_explore',
    title: 'Explore Ruins',
    description: 'High risk, high reward. Rely on your intelligence to avoid ancient traps.',
    type: 'regular',
    energy_cost: 30,
    min_level: 4,
    difficulty: 'Hard',
    reward_gold: [50, 150],
    reward_xp: [100, 200],
    location: 'shadowwood'
  },

  // FROSTPEAK QUESTS
  {
    id: 'fp_fish',
    title: 'Ice Fishing',
    description: 'Brave the cold winds to catch rare Frost-scaled Trout.',
    type: 'regular',
    energy_cost: 15,
    min_level: 5,
    difficulty: 'Medium',
    reward_gold: [30, 60],
    reward_xp: [40, 80],
    location: 'frostpeak'
  },
  {
    id: 'fp_hunt',
    title: 'Hunt Frost Trolls',
    description: 'Engage in a turn-based battle against the hulking Frost Trolls that roam the mountain pass.',
    type: 'encounter',
    energy_cost: 25,
    min_level: 6,
    difficulty: 'Hard',
    reward_gold: [0, 0],
    reward_xp: [0, 0],
    target_enemy_id: 'frost_troll',
    location: 'frostpeak'
  },
  {
    id: 'fp_scale',
    title: 'Scale the Summit',
    description: 'Attempt to climb to the very peak to uncover ancient frozen treasures. Highly dangerous.',
    type: 'regular',
    energy_cost: 40,
    min_level: 8,
    difficulty: 'Boss', // Just means very hard visually
    reward_gold: [150, 300],
    reward_xp: [200, 400],
    location: 'frostpeak'
  }
];

export const getQuestsByType = (type: 'regular' | 'daily' | 'encounter') => {
  return QUEST_DATABASE.filter(q => q.type === type && !q.location);
};

export const getQuestsByLocation = (locationId: string) => {
  return QUEST_DATABASE.filter(q => q.location === locationId);
};
