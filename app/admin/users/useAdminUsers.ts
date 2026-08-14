'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/user.service';
import { User, UserRole, CreateUserInput } from '@/types/user';

export interface EditUserFormData {
  fullname: string;
  role: UserRole;
  isActive: boolean;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Form States
  const [createFormData, setCreateFormData] = useState<CreateUserInput>({
    email: '',
    password: '',
    fullname: '',
    role: UserRole.USER,
    isActive: true,
  });

  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    fullname: '',
    role: UserRole.USER,
    isActive: true,
  });

  // get the current User info from LocalStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing current user from localStorage:', e);
      }
    }
  }, []);

  // Fetch the list of Users
  const loadUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle Creating New User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(createFormData);
      alert('Successfully created a user!');
      setIsCreateModalOpen(false);
      setCreateFormData({
        email: '',
        password: '',
        fullname: '',
        role: UserRole.USER,
        isActive: true,
      });
      await loadUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Create failure';
      alert(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  // Open Edit Modal & Fill in old data
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      fullname: user.fullname || '',
      role: (user.role?.toLowerCase() as UserRole) || UserRole.USER,
      isActive: user.isActive ?? true,
    });
  };

  // Handle User Update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload = {
        fullname: editFormData.fullname,
        role: editFormData.role,
        isActive: Boolean(editFormData.isActive),
      };

      await userService.updateUser(editingUser.id, payload);

      alert('Update successful!');
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Update failed';
      alert(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  // Handle Delete User
  const confirmDelete = async () => {
    if (!deletingUserId) return;
    try {
      await userService.deleteUser(deletingUserId);
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Deletion failure');
    } finally {
      setDeletingUserId(null);
    }
  };

  return {
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
  };
}