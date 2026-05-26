export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    category: 'feature' | 'fix' | 'balance' | 'system';
    description: string;
  }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v0.2.0',
    date: 'May 2026',
    title: 'The Great Expedition',
    changes: [
      { category: 'feature', description: 'Unified Quest System: All biomes now use the immersive Quest Briefing screens.' },
      { category: 'feature', description: 'Encounter Quests: Specific quests now pull you into fully turn-based combat encounters.' },
      { category: 'balance', description: 'Massively increased gold and XP rewards for defeating turn-based encounter enemies like Feral Wolves and Frost Trolls.' },
      { category: 'feature', description: 'Added new cinematic artwork for all biome-specific quests.' },
      { category: 'fix', description: 'Fixed infinite loading loop on the landing page for new sessions.' }
    ]
  },
  {
    version: 'v0.1.5',
    date: 'May 2026',
    title: 'Economy & Storage',
    changes: [
      { category: 'feature', description: 'The Bank: Safely store your excess gold and unequipped items.' },
      { category: 'feature', description: 'Marketplace Expansion: Added standard stock items and a rotating Daily Rare Deal.' },
      { category: 'feature', description: 'Item Comparison: Hovering over an item now compares its stats with your currently equipped item in the same slot.' },
      { category: 'fix', description: 'Fixed a race condition in combat health tracking.' }
    ]
  },
  {
    version: 'v0.1.0',
    date: 'May 2026',
    title: 'Genesis',
    changes: [
      { category: 'feature', description: 'Initial release of Oakhaven.' },
      { category: 'feature', description: 'Character Creation: Choose between Warrior, Mage, and Rogue.' },
      { category: 'feature', description: 'Core Systems: Energy, Health, Leveling, and basic turn-based combat.' },
      { category: 'feature', description: 'Locations: Guild Board, Travel Hub, Blacksmith, Shadowwood, Frostpeak.' },
      { category: 'system', description: 'Real-time synchronization with Supabase backend.' }
    ]
  }
];
