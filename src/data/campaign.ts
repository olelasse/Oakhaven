export interface CampaignStage {
  progress_id: number;
  title: string;
  description: string;
  lore: string;
  enemy_id: string; // The boss to defeat
  reward_gold: number;
  reward_xp: number;
  reward_item?: string;
  next_hint?: string;
}

export const CAMPAIGN_DATABASE: CampaignStage[] = [
  {
    progress_id: 0,
    title: 'The Missing Guard',
    description: 'A city guard went missing near the old ruins of Shadowwood. Investigate the area.',
    lore: 'Captain Valerius asked for volunteers. The guard, Marcus, was last seen investigating strange green lights near the ruins. The Captain suspects bandits, but the locals whisper of darker things.',
    enemy_id: 'bandit_scout',
    reward_gold: 150,
    reward_xp: 300,
    next_hint: 'The bandit you defeated dropped a map pointing to the Crimson Citadel.'
  },
  {
    progress_id: 1,
    title: 'Cultist Conspiracy',
    description: 'The map leads to a ruined outpost where cultists are gathering.',
    lore: 'The map you recovered from the bandit scout shows a safehouse used by the Cult of the Ashen Dawn. They are preparing a ritual, and you must stop them.',
    enemy_id: 'cultist_acolyte', // We will need to add this enemy
    reward_gold: 300,
    reward_xp: 600,
    reward_item: 'apprentice_wand',
    next_hint: 'The cultist muttered something about the Frost Trolls being awakened by their master.'
  },
  {
    progress_id: 2,
    title: 'The Frozen Master',
    description: 'Climb Frostpeak to confront the Cultist Leader who is rallying the Trolls.',
    lore: 'The Cult of the Ashen Dawn is attempting to bind the ancient Frost Trolls to their will. The ritual is being conducted at the summit of Obsidian Peak.',
    enemy_id: 'cultist_leader', // We will need to add this enemy
    reward_gold: 800,
    reward_xp: 1500,
    reward_item: 'iron_sword',
    next_hint: 'The leader is dead, but the true master resides in the Ashen Wastes.'
  }
];

export const getCampaignStage = (progress: number) => {
  return CAMPAIGN_DATABASE.find(c => c.progress_id === progress);
};
