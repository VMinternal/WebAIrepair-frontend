'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { appointmentService } from '@/services/appointment.service';
import {
  Appointment,
  AppointmentStatus,
  UpdateTechReportInput,
} from '@/types/appointment';
import { PaginationMeta } from '@/types/common';

export function useTechAppointments() {
  // 1. Data States
  const [activeTab, setActiveTab] = useState<'AVAILABLE' | 'MY_JOBS'>('AVAILABLE');
  const [availableJobs, setAvailableJobs] = useState<Appointment[]>([]);
  const [myJobs, setMyJobs] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. Control States (Modal & Search)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use Ref to store the latest searchQuery value without triggering useCallback again
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  // 3. Fetch Data Functions
  const loadAvailableJobs = useCallback(async (page = 1, search?: string) => {
    try {
      setLoading(true);
      const querySearch = search !== undefined ? search : searchQueryRef.current;
      const res = await appointmentService.getAvailableJobs({ page, limit: 10, search: querySearch });
      setAvailableJobs(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error('Error loading available jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyJobs = useCallback(async (page = 1, search?: string) => {
    try {
      setLoading(true);
      const querySearch = search !== undefined ? search : searchQueryRef.current;
      const res = await appointmentService.getMyJobs({ page, limit: 10, search: querySearch });
      setMyJobs(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error('Error loading "My Tasks" list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = (page = (meta as any)?.page || (meta as any)?.currentPage || 1) => {
    if (activeTab === 'AVAILABLE') loadAvailableJobs(page);
    else loadMyJobs(page);
  };

  // 4. Search Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'AVAILABLE') loadAvailableJobs(1, searchQuery);
    else loadMyJobs(1, searchQuery);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    if (activeTab === 'AVAILABLE') loadAvailableJobs(1, '');
    else loadMyJobs(1, '');
  };

  // 5. Tech Action Handlers
  const handleClaimJob = async (id: string) => {
    try {
      await appointmentService.claimJob(id);
      await loadAvailableJobs(); // Reload chợ việc sau khi nhận đơn thành công
      return true;
    } catch (err: any) {
      alert(err.response?.data?.message || 'Unable to accept this order!');
      return false;
    }
  };

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await appointmentService.updateStatusByTech(id, { status });
      
      // If this order's Modal is open, update the Modal's state
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(updated);
      }
      await loadMyJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failure status!');
    }
  };

  const handleReportSubmit = async (formData: UpdateTechReportInput) => {
    if (!selectedAppointment) return;
    try {
      const updated = await appointmentService.updateReportByTech(selectedAppointment.id, formData);
      setSelectedAppointment(updated); // Cập nhật lại dữ liệu mới nhất cho Modal
      setIsModalOpen(false);
      await loadMyJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Unable to save the report!');
    }
  };

  // 6. Auto Fetching theo Tab khi chuyển giữa "Chợ việc" và "Việc của tôi"
  useEffect(() => {
    setSearchQuery('');
    if (activeTab === 'AVAILABLE') {
      loadAvailableJobs(1, '');
    } else {
      loadMyJobs(1, '');
    }
  }, [activeTab, loadAvailableJobs, loadMyJobs]);

  return {
    activeTab,
    setActiveTab,
    availableJobs,
    myJobs,
    meta,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedAppointment,
    setSelectedAppointment,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleResetSearch,
    handleClaimJob,
    handleUpdateStatus,
    handleReportSubmit,
    refreshData,
  };
}