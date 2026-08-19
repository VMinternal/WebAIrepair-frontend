'use client';

import React, { useState, useEffect } from 'react';
import { Post, PostStatus } from '@/types/post';
import { PostFormData } from './useAdminPosts';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: PostFormData) => void;
  initialData: Post | null;
}

export default function PostModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PostModalProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    status: PostStatus.DRAFT,
    thumbnailUrl: '',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        status: initialData.status || PostStatus.DRAFT,
        thumbnailUrl: initialData.thumbnailUrl || '',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        status: PostStatus.DRAFT,
        thumbnailUrl: '',
        metaTitle: '',
        metaDescription: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl w-full max-w-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Post' : 'Add New Post'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the post details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Getting Started with Next.js"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Status & Thumbnail URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
              >
                <option value={PostStatus.DRAFT}>Draft</option>
                <option value={PostStatus.PUBLISHED}>Published</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Thumbnail URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.png"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={formData.thumbnailUrl || ''}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              placeholder="Write post content here..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-y"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {/* SEO Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Meta Title
              </label>
              <input
                type="text"
                placeholder="SEO Meta Title"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Meta Description
              </label>
              <input
                type="text"
                placeholder="SEO Meta Description"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Actions */}
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
              {initialData ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}