import axios from 'axios';
import {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  QueryAppointmentParams,
  UpdateStatusInput,
  UpdateTechReportInput,
  AppointmentListResponse,
} from '@/types/appointment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const appointmentService = {
  // Customer / Admin creates a new appointment.
  async createAppointment(data: CreateAppointmentInput): Promise<Appointment> {
    const res = await axios.post<Appointment>(
      `${API_URL}/appointments`,
      data,
      getAuthHeader(),
    );
    return res.data;
  },

  //TECH: Retrieve the list of UNCLAIMED tasks (Job Marketplace)
  async getAvailableJobs(
    params?: QueryAppointmentParams,
  ): Promise<AppointmentListResponse> {
    const res = await axios.get<AppointmentListResponse>(
      `${API_URL}/appointments/tech/available`,
      {
        ...getAuthHeader(),
        params,
      },
    );
    return res.data;
  },

  // TECH: Retrieve list of ACCEPTED tasks
  async getMyJobs(
    params?: QueryAppointmentParams,
  ): Promise<AppointmentListResponse> {
    const res = await axios.get<AppointmentListResponse>(
      `${API_URL}/appointments/tech/me`,
      {
        ...getAuthHeader(),
        params,
      },
    );
    return res.data;
  },

  // TECH: Tap "Accept Job" from the job marketplace.
  async claimJob(id: string): Promise<Appointment> {
    const res = await axios.patch<Appointment>(
      `${API_URL}/appointments/tech/${id}/claim`,
      {},
      getAuthHeader(),
    );
    return res.data;
  },

  // TECH: Progress update (Pending -> In Progress -> Completed)
  async updateStatusByTech(
    id: string,
    data: UpdateStatusInput,
  ): Promise<Appointment> {
    const res = await axios.patch<Appointment>(
      `${API_URL}/appointments/tech/${id}/status`,
      data,
      getAuthHeader(),
    );
    return res.data;
  },

  // TECH: Technical Report Update (Notes & Components)
  async updateReportByTech(
    id: string,
    data: UpdateTechReportInput,
  ): Promise<Appointment> {
    const res = await axios.patch<Appointment>(
      `${API_URL}/appointments/tech/${id}/report`,
      data,
      getAuthHeader(),
    );
    return res.data;
  },

  // ADMIN: Retrieve the full list of appointments.
  async getAppointments(
    params?: QueryAppointmentParams,
  ): Promise<AppointmentListResponse> {
    const res = await axios.get<AppointmentListResponse>(
      `${API_URL}/appointments`,
      {
        ...getAuthHeader(),
        params,
      },
    );
    return res.data;
  },

  //Retrieve details for one appointment
  async getAppointmentById(id: string): Promise<Appointment> {
    const res = await axios.get<Appointment>(
      `${API_URL}/appointments/${id}`,
      getAuthHeader(),
    );
    return res.data;
  },

  //ADMIN: Update appointment details
  async updateAppointment(
    id: string,
    data: UpdateAppointmentInput,
  ): Promise<Appointment> {
    const res = await axios.patch<Appointment>(
      `${API_URL}/appointments/${id}`,
      data,
      getAuthHeader(),
    );
    return res.data;
  },

  // ADMIN: Delete/Cancel appointment
  async deleteAppointment(id: string): Promise<void> {
    await axios.delete(`${API_URL}/appointments/${id}`, getAuthHeader());
  },
};