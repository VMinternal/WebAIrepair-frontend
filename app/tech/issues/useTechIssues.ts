'use client';

import { useState, useEffect, useCallback } from 'react';
import { Issue, DeviceOption, CreateIssueInput } from '@/types/issue';
import { PaginationMeta } from '@/types/common';
import { Part } from '@/types/part';
import { issueService } from '@/services/issue.service';
import { deviceService } from '@/services/device.service';
import { partService } from '@/services/partService';

export function useTechIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [parts, setParts] = useState<Part[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);

  const loadIssues = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setIsAiSearching(false);
      const res = await issueService.getIssues(page, 10);
      setIssues(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error('Error loading issue list:', err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    if (devices.length > 0 && parts.length > 0) return;
    try {
      const [devRes, partRes] = await Promise.all([
        deviceService.getDevices(1, 100),
        partService.getParts(1, 100),
      ]);

      const deviceList = Array.isArray(devRes) ? devRes : devRes?.data || [];
      const partList = Array.isArray(partRes) ? partRes : partRes?.data || [];

      const normalizedParts = partList.map((part: Part) => ({
        ...part,
        deviceId: part.deviceId ?? part.devices?.[0]?.id,
      }));

      setDevices(deviceList);
      setParts(normalizedParts);
    } catch (err) {
      console.error('Error loading options:', err);
    }
  }, [devices.length, parts.length]);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadIssues(1);
      return;
    }
    try {
      setLoading(true);
      setIsAiSearching(true);
      const results = await issueService.searchAi(searchQuery.trim());
      setIssues(results || []);
      setMeta(null);
    } catch (err) {
      console.error('AI search error:', err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    loadIssues(1);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await issueService.deleteIssue(deletingId);
      setIssues((prev) => prev.filter((item) => item.id !== deletingId));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete issue record.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (formData: CreateIssueInput) => {
    try {
      setSubmitting(true);
      const payload: CreateIssueInput = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        symptoms: formData.symptoms?.trim() || undefined,
        causes: formData.causes?.trim() || undefined,
        solutions: formData.solutions?.trim() || undefined,
        deviceId: formData.deviceId || undefined,
        partIds: formData.partIds || [],
      };

      if (selectedIssue) {
        await issueService.updateIssue(selectedIssue.id, payload);
      } else {
        await issueService.createIssue(payload);
      }

      setIsModalOpen(false);
      setSelectedIssue(null);

      if (isAiSearching && searchQuery.trim()) {
        const results = await issueService.searchAi(searchQuery.trim());
        setIssues(results || []);
      } else {
        await loadIssues(meta?.currentPage || 1);
      }
    } catch (err: any) {
      console.error('Error saving issue:', err);
      const serverMessage = err.response?.data?.message || err.message;
      alert(`Save failed: ${Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedIssue(null);
    setIsModalOpen(true);
  };

  const openEditModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadIssues(1);
    loadOptions();
  }, [loadIssues, loadOptions]);

  return {
    issues,
    meta,
    loading,
    submitting,
    isModalOpen,
    setIsModalOpen,
    selectedIssue,
    deletingId,
    setDeletingId,
    devices,
    parts,
    searchQuery,
    setSearchQuery,
    isAiSearching,
    loadIssues,
    handleAiSearch,
    handleResetSearch,
    handleConfirmDelete,
    handleFormSubmit,
    openCreateModal,
    openEditModal,
  };
}

// Export alias for backward compatibility with existing imports
export { useTechIssues as useAdminIssues };