'use client';

import React from 'react';
import { useAiManagement } from './useAiManagement';
import AiPlayground from './AiPlayground';

export default function AiManagementPage() {
  const {
    status,
    loadingStatus,
    isSyncing,
    isReindexing,
    actionMessage,
    setActionMessage,
    queryText,
    setQueryText,
    topK,
    setTopK,
    minSimilarity,
    setMinSimilarity,
    isSearching,
    searchResults,
    matchesList,
    loadStatus,
    handleSync,
    handleReindex,
    handleTestSearch,
  } = useAiManagement();

 return (
  <div className="p-6 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
    {/* Header Page */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-3.25 3.25m3.25-3.25H5"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Diagnostics & Vector Search
          </h1>
          <p className="text-sm text-slate-400">
            Search symptoms, analyze equipment issues and check vector indexes
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={loadStatus}
        disabled={loadingStatus}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-slate-800 cursor-pointer disabled:cursor-not-allowed self-start sm:self-auto"
      >
        <svg
          className={`w-4 h-4 ${loadingStatus ? 'animate-spin text-cyan-400' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh Status
      </button>
    </div>

    {/* Alert Notification */}
    {actionMessage && (
      <div
        className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
          actionMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}
      >
        <span className="font-medium">{actionMessage.text}</span>
        <button
          type="button"
          onClick={() => setActionMessage(null)}
          className="text-slate-400 hover:text-white px-2 py-1 text-base leading-none cursor-pointer"
        >
          ✕
        </button>
      </div>
    )}

    {/* AI & Vector Index Statistics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Engine */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>AI Model</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              status?.status === 'READY'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {status?.status || 'LOADING...'}
          </span>
        </div>
        <div className="text-base font-bold text-white truncate">
          {status?.modelName || 'Not Connected'}
        </div>
        <div className="text-xs text-slate-400">
          Dimensions:{' '}
          <span className="text-cyan-400 font-mono font-bold">
            {status?.dimensions || 768}
          </span>
        </div>
      </div>

      {/* Card 2: Total Symptoms */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Total Symptoms
        </div>
        <div className="text-3xl font-extrabold text-white">
          {status?.totalSymptoms ?? '-'}
        </div>
        <p className="text-xs text-slate-500">Records in the symptoms table</p>
      </div>

      {/* Card 3: Indexed Vectors */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Indexed Vectors
        </div>
        <div className="text-3xl font-extrabold text-cyan-400">
          {status?.indexedVectors ?? '-'}
        </div>
        <p className="text-xs text-slate-500">Ready for semantic search</p>
      </div>

      {/* Card 4: Unindexed Vectors */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Unindexed
        </div>
        <div className="text-3xl font-extrabold text-amber-400">
          {status?.unindexedSymptoms ?? '-'}
        </div>
        <p className="text-xs text-slate-500">Requires admin sync for AI detection</p>
      </div>
    </div>

    {/* Main Diagnostic Area */}
    <div className="w-full">
      <AiPlayground
        queryText={queryText}
        setQueryText={setQueryText}
        topK={topK}
        setTopK={setTopK}
        minSimilarity={minSimilarity}
        setMinSimilarity={setMinSimilarity}
        isSearching={isSearching}
        searchResults={searchResults}
        matchesList={matchesList}
        onSubmit={handleTestSearch}
      />
    </div>
  </div>
);
}