import type { PaginatedResponse } from './common';

export enum AppointmentStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  deviceId?: string;
  issueId?: string;
  issueDescription?: string;
  totalPrice: number;
  appointmentDate?: string;
  status: AppointmentStatus;
  technicianId?: string;
  techNotes?: string;
  usedParts?: string[];
  images?: string[];
  createdAt: string;
  device?: { id: string; model: string; brand?: string };
  issue?: { id: string; title: string };
  technician?: { id: string; fullName: string; email?: string };
}

export interface QueryAppointmentParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AppointmentStatus;
  phone?: string;
}

export interface CreateAppointmentInput {
  customerName: string;
  phone: string;
  deviceModel?: string;
  deviceId?: string;
  issueId?: string;
  issueDescription?: string;
  totalPrice?: number;
  appointmentDate?: string;
}

export type UpdateAppointmentInput = Partial<CreateAppointmentInput>;

export interface UpdateStatusInput {
  status: AppointmentStatus;
}

export interface UpdateTechReportInput {
  techNotes: string;
  usedParts?: string[];
  images?: string[];
}

export type AppointmentListResponse = PaginatedResponse<Appointment>;