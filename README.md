# Oakhaven: A Web-based Medieval Fantasy RPG

Oakhaven is an immersive, web-based Medieval Fantasy RPG built with modern web technologies. Players create a character, manage their inventory, engage in dynamic quests and turn-based combat, and progress through a persistent world with real-time database synchronization.

## Features

- **Character Progression:** Choose between Warrior, Rogue, or Mage. Level up your character, allocate stats (Strength, Agility, Intelligence), and manage your Energy and Health.
- **Dynamic Quest System:** Accept quests from the Guild Board or explore dangerous biomes like The Shadowwood and Frostpeak. Quests feature immersive "Briefing Screens" with simulated dice rolls (affected by your stats) and full turn-based combat encounters.
- **Inventory & Loot:** Discover, buy, sell, and equip randomly generated loot. The game features a drag-and-drop style visual inventory with detailed comparison tooltips. Items range from Common to Legendary artifacts.
- **Turn-based Combat:** Face off against enemies in strategic, turn-based combat. Manage your health and out-damage your foes to claim their bounties.
- **Persistent Synchronization:** A robust backend system constantly synchronizes your profile and inventory with a remote Supabase Postgres database.

## Tech Stack

The application is a Single Page Application (SPA) designed to feel like a native desktop game.

- **Framework:** React 18 with Vite
- **Styling:** TailwindCSS with a custom medieval-themed design system and fonts (Cinzel, MedievalSharp).
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Database / Backend:** Supabase (PostgreSQL)

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env` and fill in your Supabase connection details:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Syncing the Item Database:**
   The game uses a local source of truth for items (`src/data/items.ts`). To synchronize this data to the Supabase database (so it can be viewed online), run:
   ```bash
   npm run sync-items
   ```
   *Note: This requires `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file.*

## Architecture Notes

- **Game Context:** The core state (Profile, Inventory, combat stats) is managed centrally in `src/contexts/GameContext.tsx`. State is updated locally for immediate UI responsiveness and asynchronously synced to Supabase behind the scenes.
- **Quests:** Quests are defined in `src/data/quests.ts` and rendered dynamically by the `QuestBriefing.tsx` component.
- **Turn-Based Encounters:** The `Combat.tsx` component handles the core gameplay loop for fights, tracking player and enemy HP iteratively.
