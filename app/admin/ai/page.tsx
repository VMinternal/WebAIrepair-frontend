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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
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
              AI Model Management
            </h1>
            <p className="text-sm text-slate-400">
              Managing Local AI Models, Vector Databases & Diagnostic Testing
            </p>
          </div>
        </div>
        <button
          onClick={loadStatus}
          disabled={loadingStatus}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
        >
          <svg
            className={`w-4 h-4 ${loadingStatus ? 'animate-spin' : ''}`}
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
          Refresh
        </button>
      </div>

      {/* Alert Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid 1: Status Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Local Model Engine</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                status?.status === 'READY'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {status?.status || 'UNKNOWN'}
            </span>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {status?.modelName || 'Loading...'}
          </div>
          <div className="text-xs text-slate-400">
            Dimensions:{' '}
            <span className="text-indigo-400 font-mono font-bold">
              {status?.dimensions || 768}
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Total Symptoms
          </div>
          <div className="text-3xl font-extrabold text-white">
            {status?.totalSymptoms ?? '-'}
          </div>
          <p className="text-xs text-slate-500">Record in the table symptoms</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Vector generated
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {status?.indexedVectors ?? '-'}
          </div>
          <p className="text-xs text-slate-500">Ready to search for semantics</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            No vector available yet.
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {status?.unindexedSymptoms ?? '-'}
          </div>
          <p className="text-xs text-slate-500">Press to synchronize.</p>
        </div>
      </div>

      {/* Grid 2: Action & Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Vector DB Control */}
        <div className="lg:col-span-1 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              />
            </svg>
            Vector DB Management
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h3 className="text-sm font-semibold text-slate-200">
                1. Missing Vector Synchronization
              </h3>
              <p className="text-xs text-slate-400">
                Generate vectors for symptoms newly added to the database.
              </p>
              <button
                onClick={handleSync}
                disabled={
                  isSyncing || isReindexing || status?.unindexedSymptoms === 0
                }
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSyncing ? 'Synchronizing...' : 'Sync now'}
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h3 className="text-sm font-semibold text-slate-200">
                2. Re-index toàn bộ
              </h3>
              <p className="text-xs text-slate-400">
                Delete the vector table and regenerate it entirely from scratch.
              </p>
              <button
                onClick={handleReindex}
                disabled={isSyncing || isReindexing}
                className="w-full py-2.5 px-4 bg-rose-600/80 hover:bg-rose-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isReindexing ? 'Re-indexing...' : 'Re-index everything'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Playground */}
        <div className="lg:col-span-2">
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
    </div>
  );
}