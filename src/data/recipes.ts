export interface RecipeIngredient {
  item_id: string;
  quantity: number;
}

export interface CraftingRecipe {
  id: string;
  output_item_id: string;
  gold_cost: number;
  ingredients: RecipeIngredient[];
  required_level: number;
}

export const RECIPE_DATABASE: Record<string, CraftingRecipe> = {
  'craft_steel_longsword': {
    id: 'craft_steel_longsword',
    output_item_id: 'steel_longsword',
    gold_cost: 100,
    ingredients: [
      { item_id: 'iron_ore', quantity: 3 },
      { item_id: 'wolf_pelt', quantity: 1 }
    ],
    required_level: 5
  },
  'craft_leather_armor': {
    id: 'craft_leather_armor',
    output_item_id: 'leather_tunic',
    gold_cost: 50,
    ingredients: [
      { item_id: 'wolf_pelt', quantity: 5 }
    ],
    required_level: 2
  },
  'craft_magic_staff': {
    id: 'craft_magic_staff',
    output_item_id: 'wooden_staff', // Let's pretend it's a magic staff upgrade
    gold_cost: 200,
    ingredients: [
      { item_id: 'magic_essence', quantity: 2 },
      { item_id: 'iron_ore', quantity: 1 }
    ],
    required_level: 5
  }
};
