'use client';

import React from 'react';
import { User, UserRole, CreateUserInput } from '@/types/user';
import { EditUserFormData } from './useAdminUsers';

interface UserModalProps {
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  // State Tạo mới
  createFormData?: CreateUserInput;
  setCreateFormData?: React.Dispatch<React.SetStateAction<CreateUserInput>>;
  // State Edit
  editingUser?: User | null;
  editFormData?: EditUserFormData;
  setEditFormData?: React.Dispatch<React.SetStateAction<EditUserFormData>>;
}

export default function UserModal({
  mode,
  isOpen,
  onClose,
  onSubmit,
  createFormData,
  setCreateFormData,
  editingUser,
  editFormData,
  setEditFormData,
}: UserModalProps) {
  if (!isOpen) return null;

  const isEdit = mode === 'edit';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
        <h2 className="text-xl font-bold text-slate-100">
          {isEdit ? 'Update User Information' : 'Add New User'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Email {isEdit ? '' : '*'}
            </label>
            {isEdit ? (
              <input
                type="email"
                disabled
                value={editingUser?.email || ''}
                className="w-full p-2.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-400 cursor-not-allowed text-sm"
              />
            ) : (
              <input
                type="email"
                required
                value={createFormData?.email || ''}
                onChange={(e) =>
                  setCreateFormData &&
                  setCreateFormData({ ...createFormData!, email: e.target.value })
                }
                placeholder="example@gmail.com"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            )}
          </div>

          {/* Password Field (Only use when creating new) */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={createFormData?.password || ''}
                onChange={(e) =>
                  setCreateFormData &&
                  setCreateFormData({ ...createFormData!, password: e.target.value })
                }
                placeholder="At least 6 characters"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Full name
            </label>
            <input
              type="text"
              value={isEdit ? editFormData?.fullname || '' : createFormData?.fullname || ''}
              onChange={(e) => {
                if (isEdit && setEditFormData) {
                  setEditFormData({ ...editFormData!, fullname: e.target.value });
                } else if (!isEdit && setCreateFormData) {
                  setCreateFormData({ ...createFormData!, fullname: e.target.value });
                }
              }}
              placeholder="Nguyen Van A"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Roles
            </label>
            <select
              value={isEdit ? editFormData?.role : createFormData?.role}
              onChange={(e) => {
                const selectedRole = e.target.value as UserRole;
                if (isEdit && setEditFormData) {
                  setEditFormData({ ...editFormData!, role: selectedRole });
                } else if (!isEdit && setCreateFormData) {
                  setCreateFormData({ ...createFormData!, role: selectedRole });
                }
              }}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
            >
              <option value="user">User</option>
              <option value="technician">Tech</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          {isEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={editFormData?.isActive ? 'true' : 'false'}
                onChange={(e) =>
                  setEditFormData &&
                  setEditFormData({ ...editFormData!, isActive: e.target.value === 'true' })
                }
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Locked</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
            >
              {isEdit ? 'Save changes' : 'Save account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}