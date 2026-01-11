
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HistoryItem from './components/HistoryItem';
import { generateCommitMessage } from './services/geminiService';
import { CommitStyle, CommitHistoryItem, GenerationConfig } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<CommitHistoryItem[]>([]);
  const [config, setConfig] = useState<GenerationConfig>({
    style: CommitStyle.CONVENTIONAL,
    scope: '',
    includeBody: false,
    includeFooter: false,
  });

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please provide some changes or a description.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    
    try {
      const result = await generateCommitMessage(input, config);
      setOutput(result);
      
      const newItem: CommitHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        input,
        output: result,
        style: config.style,
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  };

  const handleSelectFromHistory = (item: CommitHistoryItem) => {
    setOutput(item.output);
    setInput(item.input);
    setConfig(prev => ({ ...prev, style: item.style }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Configuration */}
        <div className="lg:col-span-8 space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                What did you change?
              </label>
              <button 
                onClick={() => setInput('')}
                className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
              >
                Clear Input
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your git diff or describe your changes here... (e.g. 'I updated the login component to handle 2FA and fixed a padding issue in the footer')"
              className="w-full h-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none mono text-sm placeholder:text-slate-600"
            />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Commit Style</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(CommitStyle).map((style) => (
                  <button
                    key={style}
                    onClick={() => setConfig({ ...config, style })}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      config.style === style
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Optional Scope</label>
              <input
                type="text"
                value={config.scope}
                onChange={(e) => setConfig({ ...config, scope: e.target.value })}
                placeholder="e.g. auth, api, ui"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
              <p className="text-[10px] text-slate-500 italic">Commonly used in Conventional Commits</p>
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !input}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl ${
              isGenerating || !input
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing changes...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                Generate Message
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Output & History */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Output</h3>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[120px] flex flex-col justify-between">
                <div className="mono text-sm leading-relaxed text-indigo-100">
                  {output || <span className="text-slate-600 italic">Generated message will appear here...</span>}
                </div>
                {output && (
                  <div className="mt-6 flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      Copy
                    </button>
                    <button 
                      onClick={() => setOutput('')}
                      className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-500 py-2 rounded-lg border border-slate-700 transition-colors"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              Recent History
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{history.length}/10</span>
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length > 0 ? (
                history.map((item) => (
                  <HistoryItem key={item.id} item={item} onSelect={handleSelectFromHistory} />
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-600">No history yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-6 border-t border-slate-900 bg-slate-950 px-4 text-center">
        <p className="text-xs text-slate-500">
          Powered by <span className="text-indigo-400">Gemini 3 Flash</span>. 
          Built for developers who care about commit quality.
        </p>
      </footer>
    </div>
  );
};

export default App;
