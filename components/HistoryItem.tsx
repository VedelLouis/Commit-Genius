
import React from 'react';
import { CommitHistoryItem } from '../types';

interface HistoryItemProps {
  item: CommitHistoryItem;
  onSelect: (item: CommitHistoryItem) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onSelect }) => {
  const date = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      onClick={() => onSelect(item)}
      className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
          {item.style}
        </span>
        <span className="text-xs text-slate-500">{date}</span>
      </div>
      <p className="text-sm text-slate-300 line-clamp-2 mono bg-slate-950/50 p-2 rounded border border-slate-800 group-hover:bg-slate-950 transition-colors">
        {item.output}
      </p>
    </div>
  );
};

export default HistoryItem;
