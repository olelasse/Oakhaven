import { Outlet, Link } from 'react-router-dom';
import { Shield, Map, Store, User, BookOpen, Gavel } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { getLocationName } from '../../data/locations';

export default function GameLayout() {
  const { profile } = useGame();

  const getBackgroundImage = () => {
    switch (profile.current_location) {
      case 'whispering_woods': return '/images/shadowwood.png';
      case 'frostpeak': return '/images/frostpeak.png';
      case 'ashen_wastes': return '/images/ashen_wastes.png';
      case 'crimson_citadel': return '/images/crimson_citadel.png';
      default: return '/images/town.png';
    }
  };

  return (
    <div className="flex flex-col h-screen lg:max-h-screen lg:overflow-hidden overflow-y-auto bg-stone-950 text-stone-300 font-sans selection:bg-amber-900 selection:text-amber-100 custom-scrollbar">
      
      {/* Top Header Banner */}
      <header className="h-auto lg:h-16 flex flex-col lg:flex-row items-center justify-between p-4 lg:px-6 bg-stone-900 border-b border-medieval-gold shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-20 shrink-0 gap-4 lg:gap-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-cinzel text-amber-500 tracking-widest drop-shadow-md">OAKHAVEN</h1>
          <span className="text-xs font-sans text-stone-400 border border-stone-700 px-2 py-1 rounded bg-stone-800 tracking-wide hidden sm:inline-block">
            {getLocationName(profile.current_location)}
          </span>
        </div>
        
        <div className="flex items-center gap-6 lg:gap-8 font-medieval text-sm w-full lg:w-auto justify-center">
          <div className="flex flex-col items-center">
            <span className="text-red-400">HP</span>
            <span className="text-stone-100">{profile.hp}/{profile.max_hp}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-blue-400">Energy</span>
            <span className="text-stone-100">{profile.energy}/{profile.max_energy}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-amber-500">Gold</span>
            <span className="text-stone-100">{profile.gold}</span>
          </div>
        </div>
      </header>

      {/* Main 3-Column Content */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-stone-900 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col shrink-0 lg:overflow-y-auto custom-scrollbar">
          <nav className="p-4 flex flex-row lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-hidden">
            
            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <h3 className="hidden lg:block text-xs font-cinzel text-amber-700 font-bold uppercase tracking-widest px-2">Character</h3>
              <Link to="/play/profile" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent hover:bg-stone-800 hover:text-amber-500 transition-colors border border-stone-800 lg:border-none">
                <User size={16} /> <span className="hidden sm:inline">Profile</span>
              </Link>
              <Link to="/play/inventory" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent hover:bg-stone-800 hover:text-amber-500 transition-colors border border-stone-800 lg:border-none">
                <Shield size={16} /> <span className="hidden sm:inline">Equipment</span>
              </Link>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <h3 className="hidden lg:block text-xs font-cinzel text-amber-700 font-bold uppercase tracking-widest px-2">Local Area</h3>
              <Link to="/play/quests" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent hover:bg-stone-800 hover:text-amber-500 transition-colors border border-stone-800 lg:border-none">
                <BookOpen size={16} /> <span className="hidden sm:inline">Guild Board</span>
              </Link>
              <Link to="/play/blacksmith" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent text-stone-600 hover:text-amber-500 border border-stone-800 lg:border-none transition-colors">
                <Shield size={16} /> <span className="hidden sm:inline">Blacksmith</span>
              </Link>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <h3 className="hidden lg:block text-xs font-cinzel text-amber-700 font-bold uppercase tracking-widest px-2">World</h3>
              <Link to="/play/travel" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent hover:bg-stone-800 hover:text-amber-500 transition-colors border border-stone-800 lg:border-none">
                <Map size={16} /> <span className="hidden sm:inline">Travel Hub</span>
              </Link>
              <Link to="/play/marketplace" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent text-stone-600 hover:text-amber-500 border border-stone-800 lg:border-none transition-colors">
                <Store size={16} /> <span className="hidden sm:inline">Marketplace</span>
              </Link>
              <Link to="/play/auction-house" className="flex items-center gap-2 lg:gap-3 px-3 py-2 rounded text-sm bg-stone-950 lg:bg-transparent text-amber-700 hover:text-amber-500 border border-stone-800 lg:border-none transition-colors font-bold">
                <Gavel size={16} /> <span className="hidden sm:inline">Auction House</span>
              </Link>
            </div>

          </nav>
        </aside>

        {/* Center Main Canvas (Parchment Style) */}
        <main 
          className="flex-1 p-4 lg:p-6 lg:overflow-y-auto custom-scrollbar relative lg:shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] bg-stone-950 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `linear-gradient(rgba(12, 10, 9, 0.7), rgba(12, 10, 9, 0.7)), url('${getBackgroundImage()}')` }}
        >
          <div className="max-w-4xl mx-auto min-h-full bg-parchment rounded-sm p-4 sm:p-8 relative shadow-[0_0_40px_rgba(0,0,0,0.8)] z-10 mb-8">
            {/* Corner decorations for parchment */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-medieval-gold opacity-50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-medieval-gold opacity-50" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-medieval-gold opacity-50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-medieval-gold opacity-50" />
            
            <Outlet />
          </div>
        </main>

        {/* Right Status Sidebar */}
        <aside className="w-full lg:w-72 bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800 p-4 shrink-0 lg:overflow-y-auto custom-scrollbar flex flex-col sm:flex-row lg:flex-col gap-6 lg:gap-4 items-center sm:items-start lg:items-center">
          
          <div className="flex flex-col items-center gap-4 text-center shrink-0">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 rounded bg-stone-800 border-2 border-medieval-gold flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/images/avatar.png" alt="Player Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <h2 className="font-cinzel text-amber-500 text-lg font-bold">{profile.username}</h2>
              <p className="text-xs font-sans text-amber-500/90 italic tracking-wide">{profile.custom_title}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full flex-1">
            <div className="w-full bg-stone-950 rounded p-3 border border-stone-800 flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Level</span>
                <span className="font-bold text-stone-200">{profile.level}</span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${(profile.xp / (profile.level * 1000)) * 100}%` }}></div>
              </div>
              <div className="text-right text-[10px] text-stone-500">{profile.xp} / {profile.level * 1000} XP</div>
            </div>

            <div className="w-full bg-stone-950 rounded p-3 border border-stone-800 flex flex-col gap-2 text-sm">
              <h3 className="font-cinzel text-amber-700 text-xs border-b border-stone-800 pb-1 mb-1 text-left">Attributes</h3>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Strength</span>
                <span className="font-bold text-stone-200">{profile.strength}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Agility</span>
                <span className="font-bold text-stone-200">{profile.agility}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Intelligence</span>
                <span className="font-bold text-stone-200">{profile.intelligence}</span>
              </div>
            </div>
          </div>

          {/* Ad Placeholder */}
          <div className="mt-auto w-full bg-stone-950 border border-stone-800 rounded p-4 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group mb-4 lg:mb-0">
            <span className="text-[10px] text-stone-600 uppercase tracking-widest absolute top-2 right-2">Advertisement</span>
            <div className="w-full h-32 bg-stone-900 flex items-center justify-center rounded border border-stone-800 mt-4 group-hover:border-amber-900/50 transition-colors">
              <span className="text-stone-700 font-cinzel text-sm">Ad Space Available</span>
            </div>
          </div>

        </aside>

      </div>

      {/* Bottom Footer */}
      <footer className="h-8 flex items-center justify-between px-4 bg-stone-950 border-t border-stone-800 text-[10px] sm:text-xs shrink-0 relative z-20">
        <div className="flex gap-4">
          <span className="text-amber-700 font-bold">[Global]</span>
          <span className="text-stone-400 hidden sm:inline">The server will restart in 4 hours for routine maintenance.</span>
        </div>
        <div className="text-stone-600 font-sans tracking-wide">
          &copy; 2026 Bjellaas Media | <a href="https://bjellaas.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 transition-colors">bjellaas.com</a>
        </div>
      </footer>
      
    </div>
  );
}
