'use client';

import React, { useState } from 'react';
import { TestSearchResponse } from '@/types/ai';

interface AiPlaygroundProps {
  queryText: string;
  setQueryText: (val: string) => void;
  topK: number;
  setTopK: (val: number) => void;
  minSimilarity: number;
  setMinSimilarity: (val: number) => void;
  isSearching: boolean;
  searchResults: TestSearchResponse | null;
  matchesList: any[];
  onSubmit: (e: React.FormEvent) => void;
}

export default function AiPlayground({
  queryText,
  setQueryText,
  topK,
  setTopK,
  minSimilarity,
  setMinSimilarity,
  isSearching,
  searchResults,
  matchesList,
  onSubmit,
}: AiPlaygroundProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
         AI-Powered Troubleshooting & Diagnostics
        </h2>

        {/* Toggle custom filters for Tech */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-cyan-400 transition underline font-mono"
        >
          {showAdvanced ? '⚙️ Hide AI filters' : '⚙️ Customize AI filters'}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description of the incident / malfunction on the equipment:
          </label>
          <textarea
            rows={3}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="For example: iPhone 13 Pro Max suffering from a white screen, a short circuit in the secondary power rail..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 placeholder-slate-600 transition"
          />
        </div>

        {/* Advanced configuration block (Hidden by default for compactness) */}
        {showAdvanced && (
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Maximum number of results (Top-K: {topK})
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
               Minimum joint angle threshold ({Math.round(minSimilarity * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSearching || !queryText.trim()}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
        >
          {isSearching ? '🤖 AI is analyzing...' : '⚡ Analysis & Diagnosis'}
        </button>
      </form>

      {/* Display search results */}
      {searchResults && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-400">
            Tìm thấy{' '}
            <span className="text-cyan-400 font-bold">
              {searchResults.resultCount ?? matchesList.length}
            </span>{' '}
           Matching results in the database:
          </div>

          {matchesList.length === 0 ? (
            <div className="p-4 bg-slate-950 rounded-xl text-sm text-slate-500 text-center">
             No error/issue code found matching the threshold. ({Math.round(minSimilarity * 100)}%). Try lowering the matching threshold or adjusting the keywords.
            </div>
          ) : (
            <div className="space-y-3">
              {matchesList.map((item: any, idx: number) => {
                const simPercent =
                  item.similarity > 1
                    ? item.similarity
                    : Math.round((item.similarity || item.score || 0) * 100);

                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">
                        ID: {item.symptomId || item.id || 'N/A'}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          simPercent >= 80
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : simPercent >= 65
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        Fit: {simPercent}%
                      </span>
                    </div>

                    <p className="text-sm font-bold text-white">
                      {item.description ||
                        item.name ||
                        item.symptomContent ||
                        'No description of the phenomenon'}
                    </p>

                    {/* Display repair solution if returned by the API */}
                    {(item.solution || item.remedy || item.actionSteps) && (
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-1">
                        <span className="text-cyan-400 font-bold block">🛠️ Suggested course of action:</span>
                        <p className="leading-relaxed">
                          {item.solution || item.remedy || item.actionSteps}
                        </p>
                      </div>
                    )}

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${simPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}