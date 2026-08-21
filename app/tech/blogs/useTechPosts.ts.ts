'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post, CreatePostInput, UpdatePostInput } from '@/types/post';
import type { PaginationMeta } from '@/types/common';
import { postApi } from '@/services/postApi';

export type PostFormData = CreatePostInput;

export function useTechPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Memoized loadPosts to prevent unnecessary re-fetches
  const loadPosts = useCallback(async (page = 1, search = searchQuery) => {
    try {
      setLoading(true);
      const res = await postApi.getAdminPosts({ page, limit: 10, search });
      setPosts(res.data?.data || []);
      setMeta(res.data?.meta || null);
    } catch (err) {
      console.error('Error loading post list:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts(1, searchQuery);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    loadPosts(1, '');
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await postApi.deletePost(deletingId);
      setPosts((prev) => prev.filter((item) => item.id !== deletingId));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete the post.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (formData: CreatePostInput | UpdatePostInput) => {
    try {
      if (selectedPost) {
        await postApi.updatePost(selectedPost.id, formData);
      } else {
        await postApi.createPost(formData as CreatePostInput);
      }

      setIsModalOpen(false);
      setSelectedPost(null);
      await loadPosts(meta?.currentPage || 1);
    } catch (err: any) {
      console.error('Error saving post:', err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      let errorMessage = 'Failed to save the post.';

      if (status === 409) {
        errorMessage = 'An article with this title or slug already exists.';
      } else if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.join('\n');
      } else if (typeof serverMessage === 'string') {
        errorMessage = serverMessage;
      }

      alert(errorMessage);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts(1, '');
  }, []);

  return {
    posts,
    meta,
    loading,
    isModalOpen,
    setIsModalOpen,
    selectedPost,
    setSelectedPost,
    deletingId,
    setDeletingId,
    searchQuery,
    setSearchQuery,
    loadPosts,
    handleSearch,
    handleResetSearch,
    handleConfirmDelete,
    handleFormSubmit,
  };
}

// Backward-compatibility export alias
export { useTechPosts as useAdminPosts };