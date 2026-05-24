export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  type: 'regular' | 'daily';
  energy_cost: number;
  min_level: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';
  reward_gold: [number, number];
  reward_xp: [number, number];
  target_enemy_id?: string;
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
  }
];

export const getQuestsByType = (type: 'regular' | 'daily') => {
  return QUEST_DATABASE.filter(q => q.type === type);
};
