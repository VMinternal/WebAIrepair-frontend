'use client';

import { useState, useEffect } from 'react';
import { Device } from '@/types/device';
import { PaginationMeta } from '@/types/user';
import { deviceService } from '@/services/device.service';

export interface DeviceFormData {
  brand: string;
  model: string;
}

export function useAdminDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadDevices = async (page = 1, search = searchQuery) => {
    try {
      setLoading(true);
      const res = await deviceService.getDevices(page, 10, search);
      setDevices(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error('Error loading device list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDevices(1, searchQuery);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    loadDevices(1, '');
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deviceService.deleteDevice(deletingId);
      setDevices((prev) => prev.filter((item) => item.id !== deletingId));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Delete failed!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (formData: DeviceFormData) => {
    try {
      if (selectedDevice) {
        await deviceService.updateDevice(selectedDevice.id, formData);
      } else {
        await deviceService.createDevice(formData);
      }

      setIsModalOpen(false);
      await loadDevices(meta?.currentPage || 1);
    } catch (err: any) {
      console.error('Error saving device:', err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      let errorMessage = 'Lưu thiết bị thất bại!';

      if (status === 409) {
        errorMessage = 'This device already exists in the system!';
      } else if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.join('\n');
      } else if (typeof serverMessage === 'string') {
        errorMessage = serverMessage;
      }

      alert(errorMessage);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return {
    devices,
    meta,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedDevice,
    setSelectedDevice,
    deletingId,
    setDeletingId,
    searchQuery,
    setSearchQuery,
    loadDevices,
    handleSearch,
    handleResetSearch,
    handleConfirmDelete,
    handleFormSubmit,
  };
}