'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';
import { User, UserRole, CreateUserInput } from '@/types/user';


export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
   
  // The state of the user currently editing (null = no one selected yet)
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState({
    fullname: '',
    role: UserRole.USER,
    isActive: true,
    });

  // State for the newly created form
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    password: '',
    fullname: '',
    role: UserRole.USER,
    isActive: true,
  });

  // load the User list
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // User Creation Process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      alert('Successfully created a user!');
      setIsModalOpen(false);
      // Reset form
      setFormData({ email: '', password: '', fullname: '', role: UserRole.USER, isActive: true });
      loadUsers(); // Reload table
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Create failure';
      alert(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

    // The Modal opens the Modal and populates the old data into the form.
    const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({
        fullname: user.fullname || '',
       role: (user.role?.toLowerCase() as UserRole) || UserRole.USER,
        isActive: user.isActive ?? true,
    });
    };

    // Function to send update API
    const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
        const payload = {
        fullname: editFormData.fullname,
        role: String(editFormData.role).toLowerCase(),
        isActive: Boolean(editFormData.isActive),
         };

        await userService.updateUser(editingUser.id, editFormData);

        alert('Update successful!');
        setEditingUser(null); // Close modal
        loadUsers(); // Reload table
    } catch (err: any) {
        const msg = err.response?.data?.message || 'Update failed';
        alert(Array.isArray(msg) ? msg.join(', ') : msg);
    }
    };

  //Delete execution function
 const confirmDelete = async () => {
  if (!deletingUserId) return;
  try {
    await userService.deleteUser(deletingUserId);
    loadUsers(); 
  } catch (err: any) {
    alert(err.response?.data?.message || 'Deletion failure');
  } finally {
    setDeletingUserId(null); 
  }
};

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
        onClick={() => setIsModalOpen(true)}
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
                const isTech = roleUpper === 'TECHNICIAN' || roleUpper === 'TECH' || u.role === UserRole?.TECHNICIAN;

                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{u.email}</td>
                    <td className="px-6 py-4 text-slate-300 whitespace-nowrap">{u.fullname || '---'}</td>
                    
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
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                        {u.id !== currentUser?.id && u.role !== UserRole.ADMIN && (
                        <button
                          onClick={() => setDeletingUserId(u.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

    {/* Add User Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Add New User</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@gmail.com"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Full name
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                placeholder="Nguyen Van A"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Roles
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
              >
                <option value="user">User</option>
                <option value="technician">Tech</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
              >
                Save account
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Modal User Update */}
    {editingUser && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Update User Information</h2>

          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                value={editingUser.email}
                className="w-full p-2.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-400 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Full name
              </label>
              <input
                type="text"
                value={editFormData.fullname}
                onChange={(e) => setEditFormData({ ...editFormData, fullname: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Roles
              </label>
              <select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
              >
                <option value="user">User</option>
                <option value="technician">Tech</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={editFormData.isActive ? 'true' : 'false'}
                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === 'true' })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Locked</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

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
