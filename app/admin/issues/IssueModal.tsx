'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Issue, CreateIssueInput } from '@/types/issue';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIssueInput) => void;
  initialData?: Issue | null;
  isLoading?: boolean;
  devices?: any[];
  parts?: any[];
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
  }, [initialData, isOpen]);

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
    onSubmit(formData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">
          {initialData ? 'Fix the issue' : 'Create a new issue'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Issue name *
            </label>
            <input
              type="text"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Device Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Target Device
            </label>
            <select
              value={formData.deviceId || ''}
              onChange={(e) =>
                setFormData({ ...formData, deviceId: e.target.value, partIds: [] })
              }
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select a device --</option>
              {devices.map((dev: any) => (
                <option key={dev.id || dev._id} value={dev.id || dev._id}>
                  {dev.brand ? `${dev.brand} ${dev.model}` : dev.model || dev.name}
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
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
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
              placeholder="Enter the symptoms (e.g., screen flickering, device overheating)..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </div>

          {/* Causes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Reason
            </label>
            <textarea
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              value={formData.causes}
              onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
            />
          </div>

          {/* Solutions */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Solution
            </label>
            <textarea
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              value={formData.solutions}
              onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
            />
          </div>

          {/* Related Parts */}
          {parts.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Related Parts {formData.deviceId && `(Filtered by device)`}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950/40 border border-slate-800 rounded-xl">
                {filteredParts.length > 0 ? (
                  filteredParts.map((p: any) => {
                    const selected = (formData.partIds || []).includes(p.id);
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
                  })
                ) : (
                  <span className="text-xs text-slate-500 italic p-1">
                    No matching parts for this device.
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
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Issue'}
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
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a202c] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-white">Confirm Issue deletion</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Are you sure you want to delete this issue? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-rose-600/30 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};