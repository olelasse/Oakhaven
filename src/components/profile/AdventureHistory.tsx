import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useGame } from '../../contexts/GameContext';
import type { ActionLog } from '../../types';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdventureHistory() {
  const { profile } = useGame();
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 50;

  useEffect(() => {
    if (!profile) return;
    fetchLogs();
  }, [profile, page]);

  const fetchLogs = async () => {
    if (!profile) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('action_logs')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
      return;
    }

    setLogs(data as ActionLog[]);
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
  };

  return (
    <div className="mt-8 bg-stone-900 rounded border border-stone-800 p-6 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-4">
        <h2 className="font-cinzel text-xl text-amber-500">Adventure History</h2>
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-4 text-sm font-sans text-stone-400">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="flex items-center gap-1 hover:text-amber-500 disabled:opacity-50 disabled:hover:text-stone-400 transition-colors"
          >
            <ChevronLeft size={16} /> Newer
          </button>
          <span>Page {page + 1}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore || loading}
            className="flex items-center gap-1 hover:text-amber-500 disabled:opacity-50 disabled:hover:text-stone-400 transition-colors"
          >
            Older <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <p className="text-stone-500 italic text-center mt-10 animate-pulse">Consulting the archives...</p>
        ) : logs.length === 0 ? (
          <p className="text-stone-600 italic text-center mt-10">The ink is dry. No adventures logged yet.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className={`p-3 rounded border-l-4 text-sm font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              log.type === 'success' ? 'bg-green-950/20 border-green-700 text-green-200' :
              log.type === 'danger' ? 'bg-red-950/20 border-red-800 text-red-200' :
              log.type === 'loot' ? 'bg-amber-950/20 border-amber-600 text-amber-200' :
              log.type === 'heal' ? 'bg-blue-950/20 border-blue-600 text-blue-200' :
              'bg-stone-950/50 border-stone-700 text-stone-300'
            }`}>
              <span>{log.message}</span>
              <span className="text-xs opacity-50 flex items-center gap-1 shrink-0">
                <Clock size={12} /> {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
