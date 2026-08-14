'use client';

import React from 'react';
import { useAdminIssues } from './useAdminIssues';
import { IssueModal, DeleteConfirmModal } from './IssueModal';

export default function AdminIssuesPage() {
  const {
    issues,
    meta,
    loading,
    submitting,
    isModalOpen,
    setIsModalOpen,
    selectedIssue,
    deletingId,
    setDeletingId,
    devices,
    parts,
    searchQuery,
    setSearchQuery,
    isAiSearching,
    loadIssues,
    handleAiSearch,
    handleResetSearch,
    handleConfirmDelete,
    handleFormSubmit,
    openCreateModal,
    openEditModal,
  } = useAdminIssues();

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Issues Management & Diagnosis
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quick search with AI Vector Search
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
        >
          <span>+</span>
          <span>Add New Issue</span>
        </button>
      </div>

      {/* AI Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-2xl shadow-xl backdrop-blur-xl">
        <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Enter description of the problem (e.g. screen flickering, power failure)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all whitespace-nowrap"
          >
            🤖 Search using AI
          </button>
          {isAiSearching && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-all whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800/80 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Issues Name</th>
                <th className="px-6 py-4">Symptoms</th>
                <th className="px-6 py-4">Device</th>
                <th className="px-6 py-4">Related Parts</th>
                {isAiSearching && <th className="px-6 py-4">AI Match</th>}
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={isAiSearching ? 6 : 5} className="text-center py-12 text-slate-400">
                    Loading data...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={isAiSearching ? 6 : 5} className="text-center py-12 text-slate-500">
                    No issues found.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {issue.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {issue.description || 'No description provided'}
                      </div>
                    </td>
                   <td className="px-6 py-4 max-w-xs">
                      <div className="text-xs text-slate-300 line-clamp-2">
                        {Array.isArray(issue.symptoms) && issue.symptoms.length > 0 ? (
                          // Case 1: The backend returns an array `[{ content: "..." }]`.
                          issue.symptoms.map((s: any) => s.content || s).join(', ')
                        ) : typeof issue.symptoms === 'string' && issue.symptoms ? (
                          // Case 2: Legacy data is still stored as a string.
                          issue.symptoms
                        ) : (
                          // Case 3: Empty array [] or null/undefined -> Display N/A
                          <span className="text-slate-500 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-lg text-xs font-medium">
                        {issue.device?.model || issue.device?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {issue.parts && issue.parts.length > 0 ? (
                          issue.parts.map((p: any) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium"
                            >
                              {p.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs italic">N/A</span>
                        )}
                      </div>
                    </td>
                    {isAiSearching && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-lg text-xs">
                          {issue.similarityScore ? `${issue.similarityScore.toFixed(1)}%` : 'N/A'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(issue)}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(issue.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isAiSearching && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400 px-2">
          <div>
            Page {meta.currentPage} of {meta.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={meta.currentPage <= 1}
              onClick={() => loadIssues(meta.currentPage - 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => loadIssues(meta.currentPage + 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedIssue}
        isLoading={submitting}
        devices={devices}
        parts={parts}
      />

      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}