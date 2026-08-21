'use client';

import React from 'react';
import { useAdminDevices } from './useTechDevices';
import DeviceModal from './DeviceModal';

export default function AdminDevicesPage() {
  const {
    devices,
    meta,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedDevice,
    setSelectedDevice,
    deletingId,
    setDeletingId,
    searchQuery,
    setSearchQuery,
    loadDevices,
    handleSearch,
    handleResetSearch,
    handleConfirmDelete,
    handleFormSubmit,
  } = useAdminDevices();

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Device Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage hardware devices, brands, and models</p>
        </div>
        <button
          onClick={() => {
            setSelectedDevice(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
        >
          <span>+</span>
          <span>Add New Device</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-2xl shadow-xl backdrop-blur-xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search by brand or model name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-all"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800/80 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400">Loading data...</td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-500">No devices found.</td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold">
                        {device.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {device.model}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-medium transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(device.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-medium transition-all"
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
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400 px-2">
          <div>Page {meta.currentPage} of {meta.totalPages}</div>
          <div className="flex gap-2">
            <button
              disabled={meta.currentPage <= 1}
              onClick={() => loadDevices(meta.currentPage - 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <button
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => loadDevices(meta.currentPage + 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Device Form Modal */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedDevice}
      />

      {/* Confirm Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a202c] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Confirm device deletion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to remove this device? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition"
              >
                Agree to delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}