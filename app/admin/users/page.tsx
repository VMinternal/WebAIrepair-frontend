'use client';

import React from 'react';
import { useAdminUsers } from './useAdminUsers';
import UserModal from './UserModal';
import { UserRole } from '@/types/user';

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    currentUser,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingUser,
    setEditingUser,
    deletingUserId,
    setDeletingUserId,
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    handleCreateSubmit,
    handleOpenEdit,
    handleUpdateSubmit,
    confirmDelete,
  } = useAdminUsers();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            List of all accounts in the WebAIRepair system
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <span className="text-lg leading-none">+</span> Add User
        </button>
      </div>

      {/* Report any errors */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          {error}
        </div>
      )}

      {/* Data table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => {
                  const roleUpper = String(u.role || '').toUpperCase();
                  const isAdmin = roleUpper === 'ADMIN' || u.role === UserRole?.ADMIN;
                  const isTech =
                    roleUpper === 'TECHNICIAN' ||
                    roleUpper === 'TECH' ||
                    u.role === UserRole?.TECHNICIAN;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-800/40 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {u.fullname || '---'}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border ${
                            isAdmin
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : isTech
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-slate-700/30 text-slate-400 border-slate-700'
                          }`}
                        >
                          {roleUpper || 'USER'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            u.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                          />
                          {u.isActive ? 'Active' : 'Locked'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          {u.id !== currentUser?.id && u.role !== UserRole.ADMIN && (
                            <button
                              onClick={() => setDeletingUserId(u.id)}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <UserModal
        mode="create"
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        createFormData={createFormData}
        setCreateFormData={setCreateFormData}
      />

      {/* Edit User Modal */}
      <UserModal
        mode="edit"
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleUpdateSubmit}
        editingUser={editingUser}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
      />

      {/* Modal Confirmation Delete */}
      {deletingUserId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Confirm account deletion</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete this user? This action cannot be reversed.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingUserId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-600/30"
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