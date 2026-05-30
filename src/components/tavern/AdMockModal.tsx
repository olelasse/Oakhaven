import { useState, useEffect } from 'react';
import { X, PlayCircle } from 'lucide-react';

interface AdMockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function AdMockModal({ isOpen, onClose, onComplete }: AdMockModalProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15);
      setIsFinished(false);
      return;
    }

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      onComplete();
    }
  }, [isOpen, timeLeft, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
        {/* Mock Ad Content */}
        <PlayCircle size={64} className="text-stone-700 mb-6 animate-pulse" />
        <h2 className="text-xl font-cinzel text-stone-300 mb-2">Sponsor Message</h2>
        <p className="text-stone-500 text-sm mb-8 text-center max-w-xs">
          Please wait while we show a message from our sponsors...
        </p>

        {isFinished ? (
          <div className="text-green-400 font-bold font-cinzel text-xl animate-bounce">
            Reward Granted!
          </div>
        ) : (
          <div className="text-4xl font-mono font-bold text-amber-500">
            {timeLeft}s
          </div>
        )}

        <button 
          onClick={onClose}
          disabled={!isFinished}
          className={`absolute top-4 right-4 p-2 rounded transition-colors ${
            isFinished ? 'text-stone-400 hover:text-white bg-stone-800' : 'text-stone-700 cursor-not-allowed'
          }`}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
