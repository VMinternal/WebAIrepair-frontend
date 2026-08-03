import axios from 'axios';
import { User, CreateUserInput, UpdateUserInput, PaginatedResponse } from '@/types/user';

// NestJS Backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Function to retrieve the header and attach the authentication token.
const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const userService = {
  // Get a list of all users.
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
   const res = await axios.get<PaginatedResponse<User>>(`${API_URL}/users`, {
      ...getAuthHeader(),
      params: { page, limit }, 
    });
    return res.data;
  },

  // Create a new user
  async createUser(data: CreateUserInput): Promise<User> {
    const res = await axios.post<User>(`${API_URL}/users`, data, getAuthHeader());
    return res.data;
  },

  // Update User by ID
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const res = await axios.patch<User>(`${API_URL}/users/${id}`, data, getAuthHeader());
    return res.data;
  },

  // Delete a User by ID
  async deleteUser(id: string): Promise<{ message: string }> {
    const res = await axios.delete<{ message: string }>(`${API_URL}/users/${id}`, getAuthHeader());
    return res.data;
  },
};