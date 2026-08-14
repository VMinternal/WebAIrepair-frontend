'use client';

import React from 'react';
import { useAdminParts } from './useAdminParts';
import PartModal from './PartModal';

export default function PartsAdminPage() {
  const {
    parts,
    loading,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    total,
    availableDevices,
    availableIssues,
    isModalOpen,
    setIsModalOpen,
    editingPart,
    deletingId,
    setDeletingId,
    handleOpenModal,
    handleFormSubmit,
    handleConfirmDelete,
  } = useAdminParts();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Parts Management</h1>
          <p className="text-slate-400 text-xs mt-1">Total: {total} Parts</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm"
        >
          <span>＋</span> Add new Parts
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by Part name or slug..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-96 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Main Parts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Part name</th>
                <th className="px-6 py-4 font-semibold">Price (VNĐ)</th>
                <th className="px-6 py-4 font-semibold">Warranty</th>
                <th className="px-6 py-4 font-semibold">Support device</th>
                <th className="px-6 py-4 font-semibold">Related issues</th>
                <th className="px-6 py-4 font-semibold text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    Loading data...
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No Parts found.
                  </td>
                </tr>
              ) : (
                parts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Name & Slug */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.slug}</div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-emerald-400 font-mono font-medium">
                      {item.price ? item.price.toLocaleString('vi-VN') : '—'}
                    </td>

                    {/* Warranty */}
                    <td className="px-6 py-4 text-slate-300">{item.warrantyPeriod || '—'}</td>

                    {/* Devices Badges */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.devices && item.devices.length > 0 ? (
                          item.devices.map((d) => (
                            <span
                              key={d.id}
                              className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-md text-xs border border-indigo-500/20"
                            >
                              {d.model || d.name || `Device #${d.id}`}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Issues Badges */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.issues && item.issues.length > 0 ? (
                          item.issues.map((i) => (
                            <span
                              key={i.id}
                              className="px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-md text-xs border border-amber-500/20 truncate max-w-[150px]"
                            >
                              {i.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-xs font-medium text-slate-300 transition"
            >
              Previous page
            </button>
            <span className="text-xs text-slate-400">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-xs font-medium text-slate-300 transition"
            >
              Next page
            </button>
          </div>
        )}
      </div>

      {/* Part Form Modal */}
      <PartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingPart}
        availableDevices={availableDevices}
        availableIssues={availableIssues}
      />

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 text-center shadow-2xl">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-bold text-white">Confirm Part deletion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this Part? All associated information will be removed, and this action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-rose-600/20 transition"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}