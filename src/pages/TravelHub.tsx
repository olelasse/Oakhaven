import { useState } from 'react';
import { MapPin, Skull, TreePine, Mountain, Castle, ShieldAlert, BookOpen, Landmark, Hammer, Beer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

import type { POI, LocationType } from '../data/locations';
import { WORLD_LOCATIONS } from '../data/locations';

export default function TravelHub() {
  const { profile, changeLocation } = useGame();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<POI | null>(null);
  
  const currentLocationId = profile.current_location;

  const handleTravel = (_id?: string, path?: string) => {
    if (path) {
      navigate(path);
      return;
    }

    if (!selectedLocation) return;
    
    changeLocation(selectedLocation.id);
    switch (selectedLocation.id) {
      case 'whispering_woods':
        navigate('/play/zones/shadowwood');
        break;
      case 'frostpeak':
        navigate('/play/zones/frostpeak');
        break;
      case 'ashen_wastes':
        navigate('/play/zones/ashen-wastes');
        break;
      case 'crimson_citadel':
        navigate('/play/zones/crimson-citadel');
        break;
      default:
        navigate('/play');
    }
  };

  const getIconForType = (type: LocationType) => {
    switch (type) {
      case 'city': return <MapPin className="text-blue-400 drop-shadow-md" size={32} />;
      case 'forest': return <TreePine className="text-green-500 drop-shadow-md" size={32} />;
      case 'mountain': return <Mountain className="text-stone-300 drop-shadow-md" size={32} />;
      case 'desolate': return <Skull className="text-amber-700 drop-shadow-md" size={32} />;
      case 'fortress': return <Castle className="text-red-600 drop-shadow-md" size={32} />;
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl drop-shadow-sm border-b-2 border-medieval-gold pb-2 mb-2">World Map</h1>
        <p className="text-sm font-sans text-stone-500 italic">Select a destination to journey across Aethelgard...</p>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => handleTravel('bank', '/play/bank')}
          className="flex items-center gap-4 p-4 bg-stone-900 border border-stone-800 hover:border-amber-700 rounded group transition-all text-left"
        >
          <div className="p-3 bg-stone-950 rounded group-hover:bg-amber-900/30 transition-colors">
            <Landmark className="text-stone-500 group-hover:text-amber-500" size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel font-bold text-stone-200">The Bank</span>
            <span className="text-xs text-stone-400">Safely store your wealth.</span>
          </div>
        </button>

        <button 
          onClick={() => handleTravel('campaign', '/play/campaign')}
          className="flex items-center gap-4 p-4 bg-amber-950/20 border-2 border-amber-900/50 hover:border-amber-500 rounded group transition-all text-left shadow-[0_0_15px_rgba(180,83,9,0.1)] hover:shadow-[0_0_20px_rgba(180,83,9,0.2)]"
        >
          <div className="p-3 bg-amber-900/40 rounded group-hover:bg-amber-800 transition-colors">
            <BookOpen className="text-amber-500 group-hover:text-amber-100" size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel font-bold text-amber-500 group-hover:text-amber-400">Main Story</span>
            <span className="text-xs text-stone-400">Continue the epic campaign.</span>
          </div>
        </button>

        <button 
          onClick={() => handleTravel('forge', '/play/forge')}
          className="flex items-center gap-4 p-4 bg-stone-900 border border-stone-800 hover:border-orange-700 rounded group transition-all text-left"
        >
          <div className="p-3 bg-stone-950 rounded group-hover:bg-orange-900/30 transition-colors">
            <Hammer className="text-stone-500 group-hover:text-orange-500" size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel font-bold text-stone-200">The Forge</span>
            <span className="text-xs text-stone-400">Craft powerful gear.</span>
          </div>
        </button>

        <button 
          onClick={() => handleTravel('tavern', '/play/tavern')}
          className="flex items-center gap-4 p-4 bg-stone-900 border border-stone-800 hover:border-amber-700 rounded group transition-all text-left"
        >
          <div className="p-3 bg-stone-950 rounded group-hover:bg-amber-900/30 transition-colors">
            <Beer className="text-stone-500 group-hover:text-amber-500" size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel font-bold text-stone-200">The Tavern</span>
            <span className="text-xs text-stone-400">Rest and recover.</span>
          </div>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full rounded border-2 border-medieval-gold shadow-inner overflow-hidden bg-stone-900 group">
        <img 
          src="/images/world_map.png" 
          alt="World Map" 
          className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-700 block"
        />
        
        {/* Map Dim Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 pointer-events-none mix-blend-multiply" />

        {/* Map Pins */}
        {WORLD_LOCATIONS.map((loc) => {
          const isCurrent = loc.id === currentLocationId;
          const isSelected = selectedLocation?.id === loc.id;
          
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group/pin transition-transform hover:scale-110 z-10
                ${isSelected ? 'scale-125 z-20' : ''}
              `}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            >
              {getIconForType(loc.type)}
              <span className={`text-[10px] font-cinzel font-bold px-1.5 py-0.5 rounded border whitespace-nowrap drop-shadow-md transition-colors
                ${isCurrent ? 'bg-blue-900/80 border-blue-400 text-blue-200' : 
                  isSelected ? 'bg-amber-900/90 border-amber-500 text-amber-200' : 
                  'bg-stone-950/80 border-stone-700 text-stone-300 group-hover/pin:border-amber-600 group-hover/pin:text-amber-500'}
              `}>
                {loc.name} {isCurrent && '(You are here)'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Info Panel */}
      {selectedLocation ? (
        <div className="bg-stone-900 rounded p-6 border border-amber-900/50 shadow-lg animate-fade-in flex flex-col sm:flex-row gap-6 items-start">
          <div className="bg-stone-950 p-4 rounded border border-stone-800 flex items-center justify-center shrink-0">
            {getIconForType(selectedLocation.type)}
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-start border-b border-stone-800 pb-2">
              <div>
                <h2 className="text-2xl font-cinzel text-amber-500">{selectedLocation.name}</h2>
                <p className="text-xs font-sans text-stone-500 uppercase tracking-widest">{selectedLocation.type} Biome</p>
              </div>
              <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded border border-red-900/30">
                <ShieldAlert size={16} className="text-red-500" />
                <span className="text-xs font-bold text-red-400">Danger: {selectedLocation.dangerLevel}/10</span>
              </div>
            </div>
            
            <p className="font-sans text-sm text-stone-300 leading-relaxed">
              {selectedLocation.description}
            </p>
            
            <div className="mt-4 flex gap-4">
              <button 
                onClick={() => handleTravel()}
                disabled={selectedLocation.id === currentLocationId || selectedLocation.dangerLevel > profile.level + 2}
                className="px-6 py-2 bg-stone-800 hover:bg-amber-700 text-amber-500 hover:text-stone-100 font-cinzel font-bold border border-amber-900 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {selectedLocation.id === currentLocationId ? 'Already Here' : 'Travel to Location'}
              </button>
              {selectedLocation.dangerLevel > profile.level + 2 && (
                <span className="text-xs font-sans text-red-500 flex items-center">
                  Your level is too low to survive this journey.
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-stone-900/50 rounded p-6 border border-stone-800/50 text-center text-stone-500 font-sans italic text-sm">
          Select a location on the map to view details and travel options.
        </div>
      )}

    </div>
  );
}
