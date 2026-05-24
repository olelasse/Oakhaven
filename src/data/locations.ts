export type LocationType = 'city' | 'forest' | 'mountain' | 'desolate' | 'fortress';

export interface POI {
  id: string;
  name: string;
  type: LocationType;
  x: number; // Percentage X
  y: number; // Percentage Y
  description: string;
  dangerLevel: number;
}

export const WORLD_LOCATIONS: POI[] = [
  {
    id: 'oakhaven',
    name: 'Oakhaven Metropolis',
    type: 'city',
    x: 51,
    y: 50,
    description: 'The shining capital of Oakhaven. A bastion of safety, commerce, and guild activity.',
    dangerLevel: 1,
  },
  {
    id: 'whispering_woods',
    name: 'The Shadowwood',
    type: 'forest',
    x: 31,
    y: 40,
    description: 'An ancient, dense forest where the trees seem to murmur dark secrets. Home to feral beasts and forgotten ruins.',
    dangerLevel: 3,
  },
  {
    id: 'frostpeak',
    name: 'The Obsidian Peak',
    type: 'mountain',
    x: 47,
    y: 20,
    description: 'Treacherous, freezing peaks inhabited by frost trolls and ancient dragons. Only the brave survive here.',
    dangerLevel: 7,
  },
  {
    id: 'ashen_wastes',
    name: 'The Ashen Wastes',
    type: 'desolate',
    x: 43,
    y: 82,
    description: 'A cursed desert of grey ash where the dead walk and fire elementals roam freely.',
    dangerLevel: 6,
  },
  {
    id: 'crimson_citadel',
    name: 'The Crimson Citadel',
    type: 'fortress',
    x: 84,
    y: 45,
    description: 'The looming stronghold of the Shadow Lord. A place of immense power and certain death for the unprepared.',
    dangerLevel: 10,
  }
];

export const getLocationName = (id: string): string => {
  const loc = WORLD_LOCATIONS.find(l => l.id === id);
  return loc ? loc.name : id;
};
