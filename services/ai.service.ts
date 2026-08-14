import axios from 'axios';
import { AiStatus, TestSearchDto, TestSearchResponse, AiActionResponse } from '@/types/ai';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const aiService = {
  // Retrieve AI Model status & Vector DB statistics
  async getStatus(): Promise<AiStatus> {
    const res = await axios.get<AiStatus>(`${API_URL}/ai/status`, getAuthHeader());
    return res.data;
  },

  // Sync missing symptom vectors
  async syncMissing(): Promise<AiActionResponse> {
    const res = await axios.post<AiActionResponse>(`${API_URL}/ai/sync`, {}, getAuthHeader());
    return res.data;
  },

  // Re-index all symptom vectors from scratch
  async reindexAll(): Promise<AiActionResponse> {
    const res = await axios.post<AiActionResponse>(`${API_URL}/ai/reindex`, {}, getAuthHeader());
    return res.data;
  },

  // Test AI diagnostic vector search
  async testSearch(data: TestSearchDto): Promise<TestSearchResponse> {
   const res = await axios.post<TestSearchResponse>(
    `${API_URL}/symptoms/search`, 
    data, 
    getAuthHeader()
  );
    return res.data;
  },
};