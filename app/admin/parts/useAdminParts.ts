'use client';

import { useState, useEffect, useCallback } from 'react';
import { Part, CreatePartInput } from '@/types/part';
import { partService } from '@/services/partService';
import { deviceService } from '@/services/device.service';
import { issueService } from '@/services/issue.service';

export interface OptionItem {
  id: string | number;
  name?: string;
  title?: string;
  model?: string;
  brand?: string;
}

export function useAdminParts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Danh sách gợi ý thiết bị & sự cố từ API
  const [availableDevices, setAvailableDevices] = useState<OptionItem[]>([]);
  const [availableIssues, setAvailableIssues] = useState<OptionItem[]>([]);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch danh sách Linh kiện
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

  // Open modal & Load relationship data 
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

    setEditingPart(part || null);
    setIsModalOpen(true);
  };

  // Submit Form 
  const handleFormSubmit = async (formData: CreatePartInput) => {
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
      await fetchParts();
    } catch (err: any) {
      console.error('Error saving part:', err);

      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      let errorMessage = 'Failed to save part!';

      if (status === 409) {
        errorMessage = 'This part name or slug already exists in the system!';
      } else if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.join('\n');
      } else if (typeof serverMessage === 'string') {
        errorMessage = serverMessage;
      }

      alert(errorMessage);
    }
  };

  // Delete Part
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

  return {
    parts,
    loading,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    total,
    availableDevices,
    availableIssues,
    isModalOpen,
    setIsModalOpen,
    editingPart,
    deletingId,
    setDeletingId,
    handleOpenModal,
    handleFormSubmit,
    handleConfirmDelete,
  };
}