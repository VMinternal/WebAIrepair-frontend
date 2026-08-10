'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Part, CreatePartInput } from '@/types/part';
import { partService } from '@/services/partService';
import { deviceService } from '@/services/device.service';
import { issueService } from '@/services/issue.service';

interface OptionItem {
  id: string | number;
  name?: string;
  title?: string;
  model?: string;
  brand?: string;
}

export default function PartsAdminPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Danh sách gợi ý từ API
  const [availableDevices, setAvailableDevices] = useState<OptionItem[]>([]);
  const [availableIssues, setAvailableIssues] = useState<OptionItem[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePartInput>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    warrantyPeriod: '',
    deviceIds: [],
    issueIds: [],
  });

  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await partService.getParts(page, 10, search);
      setParts(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotal(res.meta?.totalItems || 0);
    } catch (error) {
      console.error('Error loading Parts list:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  // Mở modal & Load dữ liệu liên quan
  const handleOpenModal = async (part?: Part) => {
    if (availableDevices.length === 0 || availableIssues.length === 0) {
      try {
        const [devRes, issRes] = await Promise.all([
          deviceService.getDevices(1, 100),
          issueService.getIssues(1, 100),
        ]);
        setAvailableDevices(devRes.data || []);
        setAvailableIssues(issRes.data || []);
      } catch (err) {
        console.error('Error loading relation list:', err);
      }
    }

    if (part) {
      setEditingPart(part);
      setFormData({
        name: part.name || '',
        slug: part.slug || '',
        description: part.description || '',
        price: part.price || 0,
        warrantyPeriod: part.warrantyPeriod || '',
        deviceIds: part.devices ? part.devices.map((d) => String(d.id)) : [],
        issueIds: part.issues ? part.issues.map((i) => String(i.id)) : [],
      });
    } else {
      setEditingPart(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        warrantyPeriod: '',
        deviceIds: [],
        issueIds: [],
      });
    }
    setIsModalOpen(true);
  };

  // Tự động tạo slug khi gõ tên
  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingPart ? prev.slug : generatedSlug,
    }));
  };

  // Toggle Device Selection (Ép kiểu String an toàn)
  const toggleDeviceSelect = (id: string | number) => {
    const targetId = String(id);
    const currentList = (formData.deviceIds || []).map(String);
    const exists = currentList.includes(targetId);

    setFormData((prev) => ({
      ...prev,
      deviceIds: exists
        ? currentList.filter((item) => item !== targetId)
        : [...currentList, targetId],
    }));
  };

  // Toggle Issue Selection (Ép kiểu String an toàn)
  const toggleIssueSelect = (id: string | number) => {
    const targetId = String(id);
    const currentList = (formData.issueIds || []).map(String);
    const exists = currentList.includes(targetId);

    setFormData((prev) => ({
      ...prev,
      issueIds: exists
        ? currentList.filter((item) => item !== targetId)
        : [...currentList, targetId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug?.trim() || undefined,
      };

      if (editingPart) {
        await partService.updatePart(editingPart.id, payload);
      } else {
        await partService.createPart(payload);
      }
      setIsModalOpen(false);
      fetchParts();
    } catch (error) {
      console.error('Error saving part:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await partService.deletePart(deletingId);
      setParts((prev) => prev.filter((item) => item.id !== deletingId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

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
                        onClick={() => handleDeleteClick(item.id)}
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

      {/* ==================== ADD / EDIT MODAL ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col space-y-5 text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingPart ? 'Part Updates' : 'Add New Parts'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage spare part specifications and hardware mappings
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Part Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Part name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="Automatically generated if blank"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              {/* Price & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Price (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Warranty period
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 6 months"
                    value={formData.warrantyPeriod}
                    onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Compatible Devices */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Compatible devices ({(formData.deviceIds || []).length})
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl">
                  {availableDevices.length > 0 ? (
                    availableDevices.map((dev) => {
                      const devIdStr = String(dev.id);
                      const isSelected = (formData.deviceIds || [])
                        .map(String)
                        .includes(devIdStr);
                      const displayLabel =
                        dev.brand && dev.model
                          ? `${dev.brand} ${dev.model}`
                          : dev.model || dev.name || dev.title || `Device #${dev.id}`;

                      return (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => toggleDeviceSelect(dev.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {displayLabel}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-500 italic p-1">No devices found.</span>
                  )}
                </div>
              </div>

              {/* Related Issues */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Related issues ({(formData.issueIds || []).length})
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl">
                  {availableIssues.length > 0 ? (
                    availableIssues.map((issue) => {
                      const issIdStr = String(issue.id);
                      const isSelected = (formData.issueIds || [])
                        .map(String)
                        .includes(issIdStr);
                      const displayTitle = issue.title || issue.name || `Issue #${issue.id}`;

                      return (
                        <button
                          key={issue.id}
                          type="button"
                          onClick={() => toggleIssueSelect(issue.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all truncate max-w-xs ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {displayTitle}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-500 italic p-1">No issues found.</span>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition"
                >
                  {editingPart ? 'Update' : 'Add new'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
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