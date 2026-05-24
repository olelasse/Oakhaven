import { Link } from 'react-router-dom';
import { Shield, Sparkles, Sword } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 font-sans selection:bg-amber-900 selection:text-amber-100 flex flex-col relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(12,10,9,0.3), rgba(12,10,9,1)), url('/images/town.png')" }}
      />

      <div className="relative z-10 flex flex-col h-full flex-1">
        
        {/* Navigation */}
        <header className="p-6 flex justify-between items-center max-w-6xl w-full mx-auto">
          <h1 className="text-3xl font-cinzel text-amber-500 font-bold tracking-widest drop-shadow-md">AETHELGARD</h1>
          <div className="flex gap-4">
            <Link to="/app" className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded transition-colors border border-stone-700">Login</Link>
            <Link to="/app" className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold rounded transition-colors shadow-lg">Play Now</Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-20">
          <h2 className="text-5xl md:text-7xl font-cinzel text-stone-100 font-black tracking-wider mb-6 drop-shadow-xl">Forge Your Legacy</h2>
          <p className="text-lg md:text-xl text-stone-400 max-w-2xl leading-relaxed mb-10">
            Enter a dark medieval fantasy text RPG where every decision matters. Hunt terrible beasts, explore forgotten ruins, and climb the ranks of the Guild.
          </p>
          <Link to="/app" className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-amber-100 text-xl font-cinzel font-bold rounded shadow-[0_0_20px_rgba(180,83,9,0.4)] hover:shadow-[0_0_30px_rgba(180,83,9,0.6)] transition-all uppercase tracking-widest">
            Enter the Realm
          </Link>
        </main>

        {/* Features Section */}
        <section className="bg-stone-900/80 border-t border-stone-800 py-20 relative z-20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4 p-6 bg-stone-950/50 rounded-lg border border-stone-800 hover:border-amber-900/50 transition-colors">
              <Sword size={48} className="text-amber-600" />
              <h3 className="text-xl font-cinzel text-stone-200 font-bold">Deep Progression</h3>
              <p className="text-stone-400 text-sm">Level up your character, allocate attributes, and hunt for legendary equipment to survive the darkness.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6 bg-stone-950/50 rounded-lg border border-stone-800 hover:border-amber-900/50 transition-colors">
              <Sparkles size={48} className="text-amber-600" />
              <h3 className="text-xl font-cinzel text-stone-200 font-bold">Interactive World</h3>
              <p className="text-stone-400 text-sm">Travel between distinct biomes from the Frostpeak Mountains to the Ashen Wastes, each with unique challenges.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-6 bg-stone-950/50 rounded-lg border border-stone-800 hover:border-amber-900/50 transition-colors">
              <Shield size={48} className="text-amber-600" />
              <h3 className="text-xl font-cinzel text-stone-200 font-bold">Player Driven</h3>
              <p className="text-stone-400 text-sm">Complete guild contracts, trade in the marketplace, and build your reputation in the city of Oakhaven.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-stone-950 border-t border-stone-900 py-8 text-center text-stone-600 text-sm relative z-20">
          <p>&copy; 2026 Bjellaas Media | <a href="https://bjellaas.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 transition-colors">bjellaas.com</a></p>
        </footer>

      </div>
    </div>
  );
}
