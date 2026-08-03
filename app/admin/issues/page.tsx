'use client';

import React, { useState, useEffect } from 'react';
import { Issue } from '@/types/issue';
import { PaginationMeta } from '@/types/user';
import { issueService } from '@/services/issue.service';

interface DeviceOption {
  id: string;
  model: string;
}

interface PartOption {
  id: string;
  name: string;
}

interface IssueFormData {
  title: string;
  description: string;
  deviceId: string;
  causes: string;
  solutions: string;
  partIds: string[];
}

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Dynamic Options cho Modal Select
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [parts, setParts] = useState<PartOption[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Load Incident list
  const loadIssues = async (page = 1) => {
    try {
      setLoading(true);
      setIsAiSearching(false);
      const res = await issueService.getIssues(page, 10);
      setIssues(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error('Error loading the issue list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load the list of Devices & Parts to serve the Form.
  const loadOptions = async () => {
    try {
      if (typeof (issueService as any).getDevices === 'function') {
        const devRes = await (issueService as any).getDevices();
        setDevices(devRes);
      }
      if (typeof (issueService as any).getParts === 'function') {
        const partRes = await (issueService as any).getParts();
        setParts(partRes);
      }
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadIssues(1);
      return;
    }

    try {
      setLoading(true);
      setIsAiSearching(true);
      const results = await issueService.searchAi(searchQuery);
      setIssues(results);
      setMeta(null);
    } catch (err) {
      console.error('AI search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await issueService.deleteIssue(deletingId);
      setIssues((prev) => prev.filter((item) => item.id !== deletingId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (formData: IssueFormData) => {
    try {
      if (selectedIssue) {
        await issueService.updateIssue(selectedIssue.id, formData);
      } else {
        await issueService.createIssue(formData);
      }
      setIsModalOpen(false);
      loadIssues(meta?.currentPage || 1);
    } catch (err) {
      console.error('Error saving issue:', err);
      alert('Saving issues failed!');
    }
  };

  useEffect(() => {
    loadIssues();
    loadOptions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Incident Management & Diagnosis
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quick search with AI Vector Search
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedIssue(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200"
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
              placeholder="Enter description of the problem (e.g. screen flickering, power failure, overheating)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-200 whitespace-nowrap"
          >
            🤖 Search using AI
          </button>
          {isAiSearching && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                loadIssues(1);
              }}
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
                <th className="px-6 py-4">Incident Name</th>
                <th className="px-6 py-4">Device</th>
                <th className="px-6 py-4">Related Components</th>
                {isAiSearching && <th className="px-6 py-4">AI Match</th>}
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={isAiSearching ? 5 : 4} className="text-center py-12 text-slate-400">
                    Loading data...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={isAiSearching ? 5 : 4} className="text-center py-12 text-slate-500">
                    No issues found.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-800/40 transition-colors duration-150 group">
                    <td className="px-6 py-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {issue.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {issue.description || 'No description provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-lg text-xs font-medium">
                        {(issue.device as any)?.model || (issue.device as any)?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {issue.parts && issue.parts.length > 0 ? (
                          issue.parts.map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium"
                            >
                              {p.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-xs italic">Không có</span>
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
                          onClick={() => {
                            setSelectedIssue(issue);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 border border-slate-700/60 hover:border-indigo-500/40 rounded-lg transition-all duration-150"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClick(issue.id)}
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
      {!isAiSearching && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400 px-2">
          <div>Trang {meta.currentPage} / {meta.totalPages}</div>
          <div className="flex gap-2">
            <button
              disabled={meta.currentPage <= 1}
              onClick={() => loadIssues(meta.currentPage - 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <button
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => loadIssues(meta.currentPage + 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedIssue}
        devices={devices}
        parts={parts}
      />

      {/* Custom Confirm Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a202c] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
          <h3 className="text-lg font-bold text-white">
          Confirm incident deletion
          </h3>
      
          <p className="text-sm text-slate-400 leading-relaxed">
            Are you sure you want to remove this incident? This action cannot be undone.
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

function IssueModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  devices = [],
  parts = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: IssueFormData) => void;
  initialData: Issue | null;
  devices?: DeviceOption[];
  parts?: PartOption[];
}) {
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    deviceId: '',
    causes: '',
    solutions: '',
    partIds: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        deviceId: (initialData as any).deviceId || (initialData.device as any)?.id || '',
        causes: (initialData as any).causes || '',
        solutions: (initialData as any).solutions || '',
        partIds: initialData.parts ? initialData.parts.map((p) => p.id) : [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deviceId: '',
        causes: '',
        solutions: '',
        partIds: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePartToggle = (partId: string) => {
    setFormData((prev) => {
      const exists = prev.partIds.includes(partId);
      return {
        ...prev,
        partIds: exists
          ? prev.partIds.filter((id) => id !== partId)
          : [...prev.partIds, partId],
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl w-full max-w-xl shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Incident' : 'Add New Incident'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the incident details and mapped hardware info
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
          className="space-y-4 overflow-y-auto pr-1 flex-1"
        >
          {/* Incident Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Incident Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Samsung S21 Ultra overheating"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Target Device */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Target Device
            </label>
            <select
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            >
              <option value="">-- Select a device --</option>
              {devices.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.model}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Causes & Solutions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Causes
              </label>
              <input
                type="text"
                placeholder="Root causes..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition"
                value={formData.causes}
                onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Solutions
              </label>
              <input
                type="text"
                placeholder="Recommended solution..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition"
                value={formData.solutions}
                onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
              />
            </div>
          </div>

          {/* Related Components (Parts) */}
          {parts.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Related Components
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950/40 border border-slate-800 rounded-xl">
                {parts.map((p) => {
                  const selected = formData.partIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePartToggle(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
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
              {initialData ? 'Save Changes' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}