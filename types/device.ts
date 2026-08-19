import type { PaginatedResponse, PaginationMeta } from './common';

export interface Device {
  id: string;
  brand: string;
  model: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QueryDeviceParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateDeviceInput {
  brand: string;
  model: string;
}

export type UpdateDeviceInput = Partial<CreateDeviceInput>;

export type DeviceListResponse = PaginatedResponse<Device>;