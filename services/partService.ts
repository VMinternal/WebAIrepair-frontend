import axios from 'axios';
import { Part, CreatePartInput, UpdatePartInput } from '@/types/part';
import { PaginatedResponse } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const partService = {
  // Get a paginated list of parts (with optional search)
  async getParts(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<PaginatedResponse<Part>> {
    const res = await axios.get<PaginatedResponse<Part>>(`${API_URL}/parts`, {
      ...getAuthHeader(),
      params: { page, limit, search },
    });
    return res.data;
  },

  // Get single part details by ID
  async getPartById(id: string): Promise<Part> {
    const res = await axios.get<Part>(`${API_URL}/parts/${id}`, getAuthHeader());
    return res.data;
  },

  // Create a new part
  async createPart(data: CreatePartInput): Promise<Part> {
    const res = await axios.post<Part>(`${API_URL}/parts`, data, getAuthHeader());
    return res.data;
  },

  // Update the part
  async updatePart(id: string, data: UpdatePartInput): Promise<Part> {
    const res = await axios.patch<Part>(`${API_URL}/parts/${id}`, data, getAuthHeader());
    return res.data;
  },

  // Remove the part
  async deletePart(id: string): Promise<void> {
    await axios.delete(`${API_URL}/parts/${id}`, getAuthHeader());
  },
};