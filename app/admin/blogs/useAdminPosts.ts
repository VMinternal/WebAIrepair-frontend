'use client';

import { useState, useEffect } from 'react';
import type { Post, CreatePostInput, UpdatePostInput } from '@/types/post';
import type { PaginationMeta } from '@/types/common';
import { postApi } from '@/services/postApi';

export type PostFormData = CreatePostInput;

export function useAdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPosts = async (page = 1, search = searchQuery) => {
    try {
      setLoading(true);
      const res = await postApi.getAdminPosts({ page, limit: 10, search });
      setPosts(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error('Error loading post list:', err);
    } finally {
      setLoading(false);
    }
  };

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
      alert(err.response?.data?.message || 'Xóa bài viết thất bại!');
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
      await loadPosts(meta?.currentPage || 1);
    } catch (err: any) {
      console.error('Error saving post:', err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      let errorMessage = 'Lưu bài viết thất bại!';

      if (status === 409) {
        errorMessage = 'Bài viết hoặc đường dẫn (slug) đã tồn tại!';
      } else if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.join('\n');
      } else if (typeof serverMessage === 'string') {
        errorMessage = serverMessage;
      }

      alert(errorMessage);
    }
  };

  useEffect(() => {
    loadPosts();
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