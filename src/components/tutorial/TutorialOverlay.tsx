import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { ChevronLeft, ChevronRight, X, Gift, Map, Sword, Shield, Settings } from 'lucide-react';

interface TutorialOverlayProps {
  onClose?: () => void;
}

export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const { completeTutorial } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Oakhaven',
      icon: <Gift className="w-12 h-12 text-amber-500 mb-4" />,
      content: (
        <div className="space-y-4">
          <p>Welcome, adventurer. You have arrived in a dangerous realm where every decision matters.</p>
          <p>This quick guide will teach you how to survive. As a reward for completing (or skipping) this tutorial, you will receive a <strong className="text-amber-500">Beginner's Care Package</strong> containing 50 Gold and 3 Health Potions!</p>
        </div>
      )
    },
    {
      title: 'Energy & Travel',
      icon: <Map className="w-12 h-12 text-blue-400 mb-4" />,
      content: (
        <div className="space-y-4">
          <p>Everything you do costs <strong className="text-blue-400">Energy</strong>. Energy regenerates automatically over time, even when you are logged out.</p>
          <p>Use the <strong className="text-stone-300">Travel Hub</strong> to visit different zones like the Shadowwood or the Crimson Citadel to hunt enemies and gather loot.</p>
        </div>
      )
    },
    {
      title: 'Combat & Classes',
      icon: <Sword className="w-12 h-12 text-red-500 mb-4" />,
      content: (
        <div className="space-y-4">
          <p>When you encounter an enemy, you enter <strong className="text-red-500">Turn-Based Combat</strong>.</p>
          <p>Your damage is determined by your equipped weapon and your primary stat (Strength for Warriors, Agility for Rogues, Intellect for Mages).</p>
          <p>Use your <strong className="text-amber-500">Class Skill</strong> every 3 turns for massive damage, and don't forget to drink Potions to stay alive!</p>
        </div>
      )
    },
    {
      title: 'Guild Bounties',
      icon: <Shield className="w-12 h-12 text-amber-600 mb-4" />,
      content: (
        <div className="space-y-4">
          <p>Visit the <strong className="text-amber-600">Guild Board</strong> to take on Endless Contracts to burn excess energy for fast Gold and XP.</p>
          <p>Or, if you are brave enough, embark on <strong className="text-red-500">Daily Bounties</strong>. These are 0-Energy Boss Fights that reward legendary loot, but you can only complete 3 per day!</p>
        </div>
      )
    },
    {
      title: 'Gear & Upgrades',
      icon: <Settings className="w-12 h-12 text-stone-400 mb-4" />,
      content: (
        <div className="space-y-4">
          <p>Manage your loot in your <strong className="text-stone-300">Inventory</strong>. You can equip weapons and armor to boost your stats.</p>
          <p>Visit the <strong className="text-stone-400">Blacksmith</strong> to upgrade your items, increasing their power. Upgrades cost Gold, but they are essential for defeating Daily Bosses.</p>
          <p className="pt-4 font-bold text-amber-500 text-lg">You are now ready. Good luck!</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    await completeTutorial(true); // Grant reward
    if (onClose) onClose();
  };

  const handleSkip = async () => {
    await completeTutorial(true); // Grant reward even if skipped
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-stone-900 border-2 border-stone-700 rounded-xl max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
        
        {/* Skip Button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1 text-sm font-sans"
        >
          Skip <X size={16} />
        </button>

        {/* Slide Content */}
        <div className="p-10 flex flex-col items-center text-center min-h-[350px] justify-center">
          {slides[currentSlide].icon}
          <h2 className="font-cinzel text-3xl text-amber-500 mb-6 drop-shadow-sm">{slides[currentSlide].title}</h2>
          <div className="font-sans text-stone-300 text-lg leading-relaxed max-w-lg">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Footer / Navigation */}
        <div className="bg-stone-950 p-6 border-t border-stone-800 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 text-stone-400 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors font-cinzel font-bold px-4 py-2"
          >
            <ChevronLeft size={20} /> Previous
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-amber-500' : 'bg-stone-700'}`} />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-cinzel font-bold px-4 py-2 bg-amber-950/30 border border-amber-900 rounded transition-colors"
          >
            {currentSlide === slides.length - 1 ? 'Finish & Claim Reward' : 'Next'} <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
