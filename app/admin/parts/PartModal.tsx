'use client';

import React, { useState, useEffect } from 'react';
import { Part, CreatePartInput } from '@/types/part';
import { OptionItem } from './useAdminParts';

interface PartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreatePartInput) => Promise<void>;
  initialData: Part | null;
  availableDevices: OptionItem[];
  availableIssues: OptionItem[];
}

export default function PartModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  availableDevices,
  availableIssues,
}: PartModalProps) {
  const [formData, setFormData] = useState<CreatePartInput>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    warrantyPeriod: '',
    deviceIds: [],
    issueIds: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        warrantyPeriod: initialData.warrantyPeriod || '',
        deviceIds: initialData.devices ? initialData.devices.map((d) => String(d.id)) : [],
        issueIds: initialData.issues ? initialData.issues.map((i) => String(i.id)) : [],
      });
    } else {
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
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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
      slug: initialData ? prev.slug : generatedSlug,
    }));
  };

  // Toggle Device Selection
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

  // Toggle Issue Selection
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

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col space-y-5 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Part Updates' : 'Add New Parts'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage spare part specifications and hardware mappings
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="space-y-4 overflow-y-auto pr-1 flex-1"
        >
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
              Describe
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
                type="text"
                placeholder="e.g. 2,500,000"
                value={formData.price ? Number(formData.price).toLocaleString('en-US') : ''}
                onChange={(e) => {
                  const rawNumber = e.target.value.replace(/\D/g, '');
                  setFormData({
                    ...formData,
                    price: rawNumber ? Number(rawNumber) : 0,
                  });
                }}
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
                  const isSelected = (formData.deviceIds || []).map(String).includes(devIdStr);
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
                  const isSelected = (formData.issueIds || []).map(String).includes(issIdStr);
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
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition"
            >
              {initialData ? 'Update' : 'Add new'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}