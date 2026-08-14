'use client';

import React from 'react';
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
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <svg
          className="w-5 h-5 text-emerald-400"
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
        AI Playground — Error Diagnosis Test
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Issue description / Test question:
          </label>
          <textarea
            rows={3}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="For example: the phone doesn't display an image when the power button is pressed..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Top-K results ({topK})
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Similarity threshold ({Math.round(minSimilarity * 100)}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={minSimilarity}
              onChange={(e) => setMinSimilarity(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !queryText.trim()}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSearching ? 'AI is analyzing...' : 'Preliminary diagnosis'}
        </button>
      </form>

      {/* Test Results Section */}
      {searchResults && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-400">
            Find{' '}
            <span className="text-emerald-400 font-bold">
              {searchResults.resultCount ?? matchesList.length}
            </span>{' '}
            matching results:
          </div>

          {matchesList.length === 0 ? (
            <div className="p-4 bg-slate-950 rounded-xl text-sm text-slate-500 text-center">
              No errors found meeting the similarity threshold (
              {Math.round(minSimilarity * 100)}%).
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
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">
                        ID: {item.symptomId || item.id || 'N/A'}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          simPercent >= 80
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : simPercent >= 65
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        Fit: {simPercent}%
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-200">
                      {item.description ||
                        item.name ||
                        item.symptomContent ||
                        'No description available'}
                    </p>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
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