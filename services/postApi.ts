import axios, { InternalAxiosRequestConfig } from 'axios';
import type { 
  Post, 
  CreatePostInput, 
  UpdatePostInput, 
  QueryPostParams, 
  PostListResponse 
} from '@/types/post';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postApi = {
  // Public APIs
  getPosts: (params?: { page?: number; limit?: number; search?: string; tagId?: string }) =>
    api.get('/posts', { params }),

  getPostBySlugOrId: (idOrSlug: string) => 
    api.get<Post>(`/posts/${idOrSlug}`),

  // Auth APIs (Admin & Technician)
  createPost: (data: CreatePostInput) => 
    api.post<Post>('/posts', data),

  updatePost: (id: string, data: Partial<CreatePostInput>) => 
    api.patch<Post>(`/posts/${id}`, data),

  deletePost: (id: string) => 
    api.delete<{ message: string }>(`/posts/${id}`),

  // Admin API
  getAdminPosts: (params?: QueryPostParams) =>
    api.get<PostListResponse>('/posts/admin/all', { params }),
};