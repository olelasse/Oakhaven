import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, GitCommit, Sparkles, Wrench, ShieldAlert, Cpu } from 'lucide-react';
import { CHANGELOG } from '../data/changelog';

export default function Changelog() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedVersion, setExpandedVersion] = useState<string>(CHANGELOG[0].version);

  // If they came from landing page, return there. Otherwise return to hub.
  const goBack = () => {
    // A simple heuristic: if there's no profile or we are on landing, they likely came from /
    navigate(-1);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'feature': return <Sparkles size={16} className="text-amber-500" />;
      case 'fix': return <Wrench size={16} className="text-blue-400" />;
      case 'balance': return <ShieldAlert size={16} className="text-purple-400" />;
      case 'system': return <Cpu size={16} className="text-green-400" />;
      default: return <GitCommit size={16} className="text-stone-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'feature': return <span className="text-amber-500 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 border border-amber-900 bg-amber-950/30 rounded">Feature</span>;
      case 'fix': return <span className="text-blue-400 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 border border-blue-900 bg-blue-950/30 rounded">Fix</span>;
      case 'balance': return <span className="text-purple-400 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 border border-purple-900 bg-purple-950/30 rounded">Balance</span>;
      case 'system': return <span className="text-green-400 font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 border border-green-900 bg-green-950/30 rounded">System</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in text-stone-300 relative z-10 max-w-4xl mx-auto w-full p-4 md:p-8">
      
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-cinzel text-amber-500 drop-shadow-sm flex items-center gap-3">
            <GitCommit className="text-amber-700" size={32} /> Update History
          </h1>
          <p className="text-sm font-sans text-stone-500 italic mt-1">Chronicles of Oakhaven's development.</p>
        </div>
        <button 
          onClick={goBack}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-700 text-stone-400 hover:text-amber-500 rounded transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-20">
        {CHANGELOG.map((entry, index) => {
          const isLatest = index === 0;
          const isExpanded = expandedVersion === entry.version;
          
          return (
            <div 
              key={entry.version} 
              className={`bg-stone-900/80 border rounded-lg overflow-hidden transition-all duration-300 ${
                isExpanded ? (isLatest ? 'border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.15)]' : 'border-stone-600') : 'border-stone-800 hover:border-stone-600'
              }`}
            >
              {/* Header */}
              <button 
                onClick={() => setExpandedVersion(isExpanded ? '' : entry.version)}
                className="w-full text-left p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-950/50 hover:bg-stone-900/50 transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-mono font-bold text-lg ${isLatest ? 'text-amber-500' : 'text-stone-300'}`}>
                      {entry.version}
                    </span>
                    {isLatest && (
                      <span className="bg-amber-900/50 text-amber-300 border border-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse">
                        Latest
                      </span>
                    )}
                  </div>
                  <h2 className="font-cinzel text-xl text-stone-200">{entry.title}</h2>
                </div>
                <span className="text-stone-500 text-sm font-mono bg-stone-900 px-3 py-1 rounded border border-stone-800">{entry.date}</span>
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="p-4 md:p-6 border-t border-stone-800 bg-stone-900/30 animate-fade-in">
                  <ul className="flex flex-col gap-4">
                    {entry.changes.map((change, i) => (
                      <li key={i} className="flex flex-col sm:flex-row items-start gap-3 bg-stone-950/40 p-3 rounded border border-stone-800/50">
                        <div className="flex-shrink-0 mt-0.5">
                          {getCategoryLabel(change.category)}
                        </div>
                        <p className="text-stone-300 text-sm leading-relaxed">{change.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
