'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Issue, CreateIssueInput } from '@/types/issue';

interface DeviceOption {
  id?: string;
  _id?: string;
  brand?: string;
  model?: string;
  name?: string;
}

interface PartOption {
  id: string;
  name: string;
  deviceId?: string;
  device?: { id: string };
}

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIssueInput) => void;
  initialData?: Issue | null;
  isLoading?: boolean;
  devices?: DeviceOption[];
  parts?: PartOption[];
}

export const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  devices = [],
  parts = [],
}) => {
  const [formData, setFormData] = useState<CreateIssueInput>({
    title: '',
    description: '',
    symptoms: '',
    causes: '',
    solutions: '',
    deviceId: '',
    partIds: [],
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let formattedSymptoms = '';
        if (Array.isArray(initialData.symptoms)) {
          formattedSymptoms = initialData.symptoms
            .map((s: any) => (typeof s === 'string' ? s : s.content || ''))
            .filter(Boolean)
            .join(', ');
        } else if (typeof initialData.symptoms === 'string') {
          formattedSymptoms = initialData.symptoms;
        }

        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          symptoms: formattedSymptoms,
          causes: initialData.causes || '',
          solutions: initialData.solutions || '',
          deviceId: initialData.device?.id || '',
          partIds: initialData.parts ? initialData.parts.map((p) => p.id) : [],
        });
      } else {
        setFormData({
          title: '',
          description: '',
          symptoms: '',
          causes: '',
          solutions: '',
          deviceId: '',
          partIds: [],
        });
      }
    }
  }, [initialData, isOpen]);

  // Keyboard shortcut listener (Escape key to dismiss)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Filter components by selected device
  const filteredParts = useMemo(() => {
    if (!formData.deviceId) return parts;
    return parts.filter(
      (p) => p.deviceId === formData.deviceId || p.device?.id === formData.deviceId
    );
  }, [parts, formData.deviceId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      title: formData.title.trim(),
    });
  };

  const handlePartToggle = (partId: string) => {
    setFormData((prev) => {
      const currentIds = prev.partIds || [];
      const exists = currentIds.includes(partId);
      return {
        ...prev,
        partIds: exists
          ? currentIds.filter((id) => id !== partId)
          : [...currentIds, partId],
      };
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Issue Entry' : 'Create New Technical Issue'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify issue details, symptoms, root cause, and recommended solutions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Issue Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Database connection pool exhaustion under load"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Device Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Target Device / Subsystem
            </label>
            <select
              value={formData.deviceId || ''}
              onChange={(e) =>
                setFormData({ ...formData, deviceId: e.target.value, partIds: [] })
              }
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
            >
              <option value="">-- Select a device --</option>
              {devices.map((dev) => {
                const devId = dev.id || dev._id || '';
                return (
                  <option key={devId} value={devId}>
                    {dev.brand ? `${dev.brand} ${dev.model}` : dev.model || dev.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="High-level description of the technical issue..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Symptoms
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Latency spikes, unexpected 500 error responses..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </div>

          {/* Root Causes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Root Cause
            </label>
            <textarea
              rows={2}
              placeholder="Underlying bug or structural reason for the defect..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
              value={formData.causes}
              onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
            />
          </div>

          {/* Solutions */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Solution / Fix Strategy
            </label>
            <textarea
              rows={2}
              placeholder="Steps, code fixes, or workarounds required to resolve..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
              value={formData.solutions}
              onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
            />
          </div>

          {/* Related Parts */}
          {parts.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Related Components {formData.deviceId && `(Filtered by device)`}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950/40 border border-slate-800 rounded-xl">
                {filteredParts.length > 0 ? (
                  filteredParts.map((p) => {
                    const selected = (formData.partIds || []).includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePartToggle(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selected
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {p.name}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-500 italic p-1">
                    No matching components found for this device.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Export the Delete Confirmation Modal */
export const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white">Confirm Issue Deletion</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Are you sure you want to delete this issue entry? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl text-sm shadow-lg shadow-rose-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};