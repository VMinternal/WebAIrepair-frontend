'use client';

import React, { useState, useEffect } from 'react';
import { Device, CreateDeviceInput } from '@/types/device';
import { PaginationMeta } from '@/types/user';
import { deviceService } from '@/services/device.service';

interface DeviceFormData {
  brand: string;
  model: string;
}

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Load Device list
const loadDevices = async (page = 1, search = searchQuery) => {
  try {
    setLoading(true);
    const res = await deviceService.getDevices(page, 10, search);
    setDevices(res.data);
    setMeta(res.meta);
  } catch (err) {
    console.error('Error loading device list:', err);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDevices(1, searchQuery);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    loadDevices(1, '');
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deviceService.deleteDevice(deletingId);
      setDevices((prev) => prev.filter((item) => item.id !== deletingId));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (formData: DeviceFormData) => {
    try {
      if (selectedDevice) {
        await deviceService.updateDevice(selectedDevice.id, formData);
      } else {
        await deviceService.createDevice(formData);
      }
      setIsModalOpen(false);
      loadDevices(meta?.currentPage || 1);
    } catch (err: any) {
      console.error('Error saving device:', err);
      alert(err.response?.data?.message || 'Saving device failed!');
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Device Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage hardware devices, brands, and models
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedDevice(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200"
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
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-200 whitespace-nowrap"
          >
            Search
          </button>
          {searchQuery && (
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
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400">
                    Loading data...
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-500">
                    No devices found.
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-800/40 transition-colors duration-150 group">
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
                          className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 border border-slate-700/60 hover:border-indigo-500/40 rounded-lg transition-all duration-150"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClick(device.id)}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-rose-600/20 hover:text-rose-300 text-slate-400 border border-slate-700/60 hover:border-rose-500/40 rounded-lg transition-all duration-150"
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

      {/* Device Modal Form */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedDevice}
      />

      {/* Custom Confirm Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a202c] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-bold text-white">
              Confirm device deletion
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to remove this device? This action cannot be undone and may fail if associated records exist.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-600/30 transition"
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

function DeviceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: DeviceFormData) => void;
  initialData: Device | null;
}) {
  const [formData, setFormData] = useState<DeviceFormData>({
    brand: '',
    model: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || '',
        model: initialData.model || '',
      });
    } else {
      setFormData({
        brand: '',
        model: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Device' : 'Add New Device'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the device details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="space-y-4"
        >
          {/* Brand Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Brand Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apple, Samsung, Dell"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          {/* Model Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Model Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. iPhone 14 Pro, Galaxy S23, XPS 13"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition"
            >
              {initialData ? 'Save Changes' : 'Create Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}