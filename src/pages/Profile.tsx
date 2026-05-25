import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Shield, Swords, Brain, Heart, Zap, MapPin, Info } from 'lucide-react';
import { getLocationName } from '../data/locations';
import TutorialOverlay from '../components/tutorial/TutorialOverlay';
import AdventureHistory from '../components/profile/AdventureHistory';

export default function Profile() {
  const { profile } = useGame();
  const [showReplayTutorial, setShowReplayTutorial] = useState(false);

  const avatarUrl = `/images/avatars/${profile.character_class}_${profile.gender}.png`;

  return (
    <div className="animate-fade-in flex flex-col gap-6 text-stone-300">
      
      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row gap-6 border-b-2 border-stone-800 pb-6">
        <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-stone-800 rounded-lg overflow-hidden shadow-2xl bg-stone-900 relative flex-shrink-0">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-4xl font-cinzel text-amber-500 drop-shadow-sm">{profile.username}</h1>
              <p className="text-stone-400 font-sans italic text-lg capitalize">{profile.gender} {profile.character_class} - {profile.custom_title}</p>
            </div>
            <div className="text-right">
              <button 
                onClick={() => setShowReplayTutorial(true)}
                className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-500 mb-2 border border-amber-900 px-2 py-1 rounded bg-stone-950"
              >
                <Info size={12} /> Replay Tutorial
              </button>
              <p className="text-stone-500 font-sans text-sm">Level <span className="text-amber-500 font-bold text-2xl">{profile.level}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-stone-400 bg-stone-950 border border-stone-800 p-2 rounded w-fit">
            <MapPin size={16} className="text-amber-700" /> 
            <span className="text-sm">Currently in:</span>
            <span className="font-bold text-stone-200">{getLocationName(profile.current_location)}</span>
          </div>
        </div>
      </div>

      {showReplayTutorial && <TutorialOverlay onClose={() => setShowReplayTutorial(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Vitals & Status */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-cinzel text-stone-400 border-b border-stone-800 pb-2">Vitals</h2>
          
          <div className="bg-stone-900 p-4 rounded border border-stone-800 flex flex-col gap-4 font-sans">
            <div className="flex justify-between items-center bg-stone-950 p-3 rounded border border-stone-800 shadow-inner">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Heart size={18} /> <span>Health</span>
              </div>
              <span className="font-bold text-stone-200">{profile.hp} / {profile.max_hp}</span>
            </div>
            
            <div className="flex justify-between items-center bg-stone-950 p-3 rounded border border-stone-800 shadow-inner">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Zap size={18} /> <span>Energy</span>
              </div>
              <span className="font-bold text-stone-200">{profile.energy} / {profile.max_energy}</span>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-cinzel text-stone-400 border-b border-stone-800 pb-2">Attributes</h2>
          
          <div className="bg-stone-900 p-4 rounded border border-stone-800 flex flex-col gap-4 font-sans">
            <div className="flex justify-between items-center bg-stone-950 p-3 rounded border border-stone-800 shadow-inner">
              <div className="flex items-center gap-2 text-stone-400 font-bold">
                <Swords size={18} /> <span>Strength</span>
              </div>
              <span className="font-bold text-amber-500 text-lg">{profile.strength}</span>
            </div>
            
            <div className="flex justify-between items-center bg-stone-950 p-3 rounded border border-stone-800 shadow-inner">
              <div className="flex items-center gap-2 text-stone-400 font-bold">
                <Shield size={18} /> <span>Agility</span>
              </div>
              <span className="font-bold text-amber-500 text-lg">{profile.agility}</span>
            </div>

            <div className="flex justify-between items-center bg-stone-950 p-3 rounded border border-stone-800 shadow-inner">
              <div className="flex items-center gap-2 text-stone-400 font-bold">
                <Brain size={18} /> <span>Intelligence</span>
              </div>
              <span className="font-bold text-amber-500 text-lg">{profile.intelligence}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Progression */}
      <div className="mt-4 bg-stone-900 p-6 rounded border border-stone-800 relative overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-stone-500">
          <Shield size={100} />
        </div>
        
        <h2 className="font-cinzel text-amber-500 text-lg mb-4 relative z-10">Experience</h2>
        <div className="w-full bg-stone-950 h-4 rounded-full overflow-hidden border border-stone-800 relative z-10">
          <div 
            className="bg-gradient-to-r from-amber-700 to-amber-500 h-full transition-all duration-500" 
            style={{ width: `${(profile.xp / (profile.level * 1000)) * 100}%` }}
          />
        </div>
        <p className="text-right text-xs text-stone-500 mt-2 font-sans relative z-10 font-bold tracking-widest uppercase">
          {profile.xp} / {profile.level * 1000} XP
        </p>
      </div>

      {/* Adventure History Log */}
      <AdventureHistory />

    </div>
  );
}
