'use client';

import { useState, useEffect } from 'react';
import { Issue, DeviceOption, CreateIssueInput } from '@/types/issue';
import { PaginationMeta } from '@/types/user';
import { Part } from '@/types/part';
import { issueService } from '@/services/issue.service';
import { deviceService } from '@/services/device.service';
import { partService } from '@/services/partService';

export function useAdminIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [parts, setParts] = useState<Part[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  const loadIssues = async (page = 1) => {
    try {
      setLoading(true);
      setIsAiSearching(false);
      const res = await issueService.getIssues(page, 10);
      setIssues(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error('Error loading issue list:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
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
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadIssues(1);
      return;
    }
    try {
      setLoading(true);
      setIsAiSearching(true);
      const results = await issueService.searchAi(searchQuery);
      setIssues(results);
      setMeta(null);
    } catch (err) {
      console.error('AI search error:', err);
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
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed!');
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

      if (isAiSearching && searchQuery) {
        const results = await issueService.searchAi(searchQuery);
        setIssues(results);
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
    loadIssues();
    loadOptions();
  }, []);

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