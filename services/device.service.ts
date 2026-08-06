import axios from 'axios';
import { Device, CreateDeviceInput, UpdateDeviceInput } from '@/types/device';
import { PaginatedResponse } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const deviceService = {
  // Retrieve list of devices
  async getDevices(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Device>> {
    const res = await axios.get<PaginatedResponse<Device>>(`${API_URL}/devices`, {
      ...getAuthHeader(),
      params: { page, limit, search },
    });
    return res.data;
  },

  // Retrieve device details
  async getDeviceById(id: string): Promise<Device> {
    const res = await axios.get<Device>(`${API_URL}/devices/${id}`, getAuthHeader());
    return res.data;
  },

  // Create new device
  async createDevice(data: CreateDeviceInput): Promise<Device> {
    const res = await axios.post<Device>(`${API_URL}/devices`, data, getAuthHeader());
    return res.data;
  },

  // Update device information
  async updateDevice(id: string, data: UpdateDeviceInput): Promise<Device> {
    const res = await axios.patch<Device>(`${API_URL}/devices/${id}`, data, getAuthHeader());
    return res.data;
  },

  //Delete device
  async deleteDevice(id: string): Promise<void> {
    await axios.delete(`${API_URL}/devices/${id}`, getAuthHeader());
  },
};