import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Sword, Mail, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/play');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registration successful! Check your email or login if email verification is disabled.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

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
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-4 max-w-6xl mx-auto py-10 w-full">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-cinzel text-stone-100 font-black tracking-wider mb-6 drop-shadow-xl">Forge Your Legacy</h2>
            <p className="text-lg md:text-xl text-stone-400 max-w-2xl leading-relaxed mb-10">
              Enter a dark medieval fantasy text RPG where every decision matters. Hunt terrible beasts, explore forgotten ruins, and climb the ranks of the Guild.
            </p>
          </div>

          {/* Auth Box */}
          <div className="bg-stone-900/90 border border-stone-800 p-8 rounded-lg w-full max-w-md shadow-2xl backdrop-blur-sm relative z-20">
            <h3 className="text-2xl font-cinzel text-amber-500 text-center mb-6">{isLogin ? 'Enter the Realm' : 'Register Account'}</h3>
            
            {error && <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded text-sm mb-4">{error}</div>}

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-stone-500" size={18} />
                <input 
                  type="email" required placeholder="Email Address" 
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 pl-10 text-stone-200 focus:outline-none focus:border-amber-700 transition-colors"
                />
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-stone-500" size={18} />
                <input 
                  type="password" required placeholder="Password" 
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 pl-10 text-stone-200 focus:outline-none focus:border-amber-700 transition-colors"
                />
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full py-4 mt-2 bg-amber-700 hover:bg-amber-600 text-amber-100 text-lg font-cinzel font-bold rounded shadow-[0_0_20px_rgba(180,83,9,0.4)] transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Character')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-stone-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-amber-500 hover:text-amber-400 font-bold underline transition-colors">
                {isLogin ? 'Register Here' : 'Login Here'}
              </button>
            </div>
          </div>
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
