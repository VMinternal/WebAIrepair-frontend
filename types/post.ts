import type { PaginatedResponse } from './common';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface Tag {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  fullName: string;
  role?: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  authorId: string;
  author?: Author | string;
  authorName?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}


export interface QueryPostParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  tagId?: string;
}


export interface CreatePostInput {
  title: string;
  content: string;
  status?: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  thumbnailUrl?: string;
  tagIds?: string[];
}


export type UpdatePostInput = Partial<CreatePostInput>;


export type PostListResponse = PaginatedResponse<Post>;