
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">CommitGenius <span className="text-indigo-400">AI</span></h1>
            <p className="text-xs text-slate-400">Senior Dev Commit Agent</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Documentation</a>
          <a href="https://github.com/conventional-commits/conventionalcommits.org" target="_blank" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Standards</a>
          <div className="h-4 w-px bg-slate-700"></div>
          <button className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md border border-slate-700 transition-all">
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
