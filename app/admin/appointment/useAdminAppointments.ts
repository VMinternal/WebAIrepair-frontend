'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { appointmentService } from '@/services/appointment.service';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { PaginationMeta } from '@/types/common';

//Helper to extract error message safely in TypeScript
function getErrorMessage(err: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || fallbackMessage;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallbackMessage;
}

export function useAdminAppointments() {
  // 1. Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. Control & Filter States
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // 3. Fetch Data
  const loadAppointments = useCallback(
    async (
      page = currentPage,
      search = searchQuery,
      status: AppointmentStatus | 'ALL' = statusFilter
    ) => {
      try {
        setLoading(true);
        const res = await appointmentService.getAppointments({
          page,
          limit: 10,
          search: search.trim() || undefined,
          status: status !== 'ALL' ? status : undefined,
        });

        setAppointments(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error('Error loading appointment list:', getErrorMessage(err, 'Failed to load list'));
      } finally {
        setLoading(false);
      }
    },
    [currentPage, searchQuery, statusFilter]
  );

  const refreshData = (page = meta?.currentPage || 1) => {
    setCurrentPage(page);
    loadAppointments(page);
  };

  // 4. Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAppointments(1);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
    loadAppointments(1, '', 'ALL');
  };

  const handleStatusFilterChange = (newStatus: AppointmentStatus | 'ALL') => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    loadAppointments(1, searchQuery, newStatus);
  };

  // 5. Admin Actions
  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointment(id, { status });
      await loadAppointments();
    } catch (err: unknown) {
      alert(getErrorMessage(err, 'Failed to update status!'));
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await appointmentService.deleteAppointment(id);
      await loadAppointments();
    } catch (err: unknown) {
      alert(getErrorMessage(err, 'Failed to delete appointment!'));
    }
  };

  // 6. Auto Fetching
  useEffect(() => {
    loadAppointments(1);
  }, []);

  return {
    appointments,
    meta,
    loading,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    isModalOpen,
    setIsModalOpen,
    selectedAppointment,
    setSelectedAppointment,
    handleSearch,
    handleResetSearch,
    handleUpdateStatus,
    handleDeleteAppointment,
    refreshData,
  };
}