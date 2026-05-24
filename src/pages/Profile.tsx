import { useGame } from '../contexts/GameContext';
import { Shield, Swords, Brain, Heart, Zap, MapPin } from 'lucide-react';
import { getLocationName } from '../data/locations';

export default function Profile() {
  const { profile } = useGame();

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex justify-between items-end border-b-2 border-medieval-gold pb-4">
        <div>
          <h1 className="text-3xl drop-shadow-sm">{profile.username}</h1>
          <p className="text-amber-700 font-sans italic">{profile.custom_title}</p>
        </div>
        <div className="text-right">
          <p className="text-stone-500 font-sans text-sm">Level <span className="text-stone-900 font-bold text-lg">{profile.level}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Vitals & Status */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-stone-800 border-b border-stone-400 pb-2">Vitals</h2>
          
          <div className="bg-stone-900 text-stone-200 p-4 rounded border border-stone-700 flex flex-col gap-4 font-sans">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-red-400">
                <Heart size={18} /> <span>Health</span>
              </div>
              <span className="font-bold">{profile.hp} / {profile.max_hp}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-blue-400">
                <Zap size={18} /> <span>Energy</span>
              </div>
              <span className="font-bold">{profile.energy} / {profile.max_energy}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-700">
              <div className="flex items-center gap-2 text-stone-400">
                <MapPin size={18} /> 
                <span className="text-stone-500 w-24 inline-block">Location</span>
                <span className="font-bold text-stone-200">{getLocationName(profile.current_location)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-stone-800 border-b border-stone-400 pb-2">Attributes</h2>
          
          <div className="bg-stone-900 text-stone-200 p-4 rounded border border-stone-700 flex flex-col gap-4 font-sans">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-stone-400">
                <Swords size={18} /> <span>Strength</span>
              </div>
              <span className="font-bold text-amber-500 text-lg">{profile.strength}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-stone-400">
                <Shield size={18} /> <span>Agility</span>
              </div>
              <span className="font-bold text-amber-500 text-lg">{profile.agility}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-stone-400">
                <Brain size={18} /> <span>Intelligence</span>
              </div>
              <span className="font-bold text-amber-500 text-lg">{profile.intelligence}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Progression */}
      <div className="mt-4 bg-stone-900 p-6 rounded border border-medieval-gold relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-medieval-gold">
          <Shield size={100} />
        </div>
        
        <h2 className="text-amber-500 text-lg mb-4 relative z-10">Experience</h2>
        <div className="w-full bg-stone-950 h-4 rounded-full overflow-hidden border border-stone-700 relative z-10">
          <div 
            className="bg-gradient-to-r from-amber-700 to-amber-500 h-full transition-all duration-500" 
            style={{ width: `${(profile.xp / (profile.level * 1000)) * 100}%` }}
          />
        </div>
        <p className="text-right text-xs text-stone-400 mt-2 font-sans relative z-10">
          {profile.xp} / {profile.level * 1000} XP to next level
        </p>
      </div>

    </div>
  );
}
