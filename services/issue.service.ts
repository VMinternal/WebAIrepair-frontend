import axios from 'axios';
import { Issue, UpdateIssueInput } from '@/types/issue';
import { PaginatedResponse } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Định nghĩa Interface ở BÊN NGOÀI object service
export interface CreateIssueInput {
  title: string;
  description?: string;
  causes?: string;
  solutions?: string;
  deviceId?: string;
  partIds?: string[];
}

export const issueService = {
  // Get a paginated list of incidents
  async getIssues(page = 1, limit = 10, deviceId?: string): Promise<PaginatedResponse<Issue>> {
    const res = await axios.get<PaginatedResponse<Issue>>(`${API_URL}/issues`, {
      ...getAuthHeader(),
      params: { page, limit, deviceId },
    });
    return res.data;
  },

  // AI-powered search (Vector Search)
  async searchAi(query: string, limit = 5): Promise<Issue[]> {
    const res = await axios.get<Issue[]>(`${API_URL}/issues/search-ai`, {
      ...getAuthHeader(),
      params: { query, limit },
    });
    return res.data;
  },

  // Create a new incident
  async createIssue(data: CreateIssueInput): Promise<Issue> {
    const res = await axios.post<Issue>(`${API_URL}/issues`, data, getAuthHeader());
    return res.data;
  },

  // Update the issue.
  async updateIssue(id: string, data: UpdateIssueInput): Promise<Issue> {
    const res = await axios.patch<Issue>(`${API_URL}/issues/${id}`, data, getAuthHeader());
    return res.data;
  },

  // Remove the issue.
  async deleteIssue(id: string): Promise<void> {
    await axios.delete(`${API_URL}/issues/${id}`, getAuthHeader());
  },
};