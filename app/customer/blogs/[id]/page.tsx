'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Author {
  id: string;
  fullname: string;
  email?: string;
  role?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  createdAt: string;
  author?: Author;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetch(`http://localhost:8000/posts/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading article details:', err);
          setLoading(false);
        });
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">The article does not exist!</p>
        <Link 
          href="/customer/blogs" 
          className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm"
        >
          ← Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back button */}
        <Link
          href="/customer/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-sm font-semibold transition text-slate-300"
        >
          ← Return to the list of articles
        </Link>

        {/* Title and Author Information */}
        <header className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-emerald-400 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-6">
            <span>✍️ {post.author?.fullname || 'Author unknown'}</span>
            <span>•</span>
            <span>📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </header>

        {/* Thumbnail Image */}
        {post.thumbnailUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full max-h-[450px] object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-line space-y-4">
          {post.content}
        </div>
      </div>
    </div>
  );
}