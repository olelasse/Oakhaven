import { createClient } from '@supabase/supabase-js';
import { ITEM_DATABASE } from '../src/data/items';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
if (!process.env.VITE_SUPABASE_URL) {
  dotenv.config({ path: resolve(process.cwd(), '.env') });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ ERROR: Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL in your .env.local file.");
  console.error("Please add SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here to .env.local");
  console.error("You can find this key in Supabase Dashboard -> Project Settings -> API.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncItems() {
  console.log('🔄 Starting Item Database Sync...');
  
  const itemsArray = Object.values(ITEM_DATABASE).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: item.type,
    slot: item.slot,
    rarity: item.rarity,
    required_level: item.required_level,
    gold_cost: item.gold_cost,
    sold_at_blacksmith: item.sold_at_blacksmith,
    drop_sources: item.drop_sources || [],
    drop_chance: item.drop_chance || 0,
    bonus_damage: item.bonus_damage || 0,
    bonus_defense: item.bonus_defense || 0,
    slots_granted: item.slots_granted || 0
  }));

  console.log(`📦 Found ${itemsArray.length} items in src/data/items.ts`);

  // Upsert all items into the database
  const { error } = await supabase
    .from('items')
    .upsert(itemsArray, { onConflict: 'id' });

  if (error) {
    console.error('❌ Failed to sync items:', error);
    process.exit(1);
  }

  console.log('✅ Successfully synced all items to Supabase!');
}

syncItems();
