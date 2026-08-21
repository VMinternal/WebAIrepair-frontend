'use client';

import React from 'react';
import { useAdminPosts } from './useTechPosts.ts'; // Rename to useTechPosts if maintaining a separate tech hook
import PostModal from './PostModal';
import { PostStatus } from '@/types/post';

export default function TechPostsPage() {
  const {
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
  } = useAdminPosts();

  // Safe Date formatting helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return '-';

    return parsedDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Technical Knowledge & Post Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage technical articles, documentation status, and knowledge base content
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedPost(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>+</span>
          <span>Add New Post</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-2xl shadow-xl backdrop-blur-xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search by post title, author, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all cursor-pointer"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-all cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Posts Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800/80 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    Loading data...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    No posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Thumbnail & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-[10px] font-medium shrink-0">
                            No Img
                          </div>
                        )}
                        <span className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 max-w-xs">
                          {post.title}
                        </span>
                      </div>
                    </td>

                    {/* Author Details & Role Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium text-sm">
                          {typeof post.author === 'object'
                            ? post.author?.fullname || 'Unknown'
                            : post.authorName || post.author || 'N/A'}
                        </span>

                        {typeof post.author === 'object' && post.author?.role && (
                          <span className="mt-1 inline-flex items-center">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                post.author.role.toUpperCase() === 'ADMIN'
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {post.author.role.toUpperCase() === 'ADMIN'
                                ? '👑 Admin'
                                : '🛠️ Tech'}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                          post.status === PostStatus.PUBLISHED
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    {/* Creation Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {formatDate(post.createdAt)}
                    </td>

                    {/* Operations */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-medium transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(post.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-medium transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400 px-2">
          <div>
            Page {meta.currentPage} of {meta.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.currentPage <= 1}
              onClick={() => loadPosts(meta.currentPage - 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => loadPosts(meta.currentPage + 1)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedPost}
      />

      {/* Confirm Deletion Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Confirm Post Deletion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to remove this post? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Agree to Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}