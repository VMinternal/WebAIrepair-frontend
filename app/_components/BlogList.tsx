'use client';

import { useEffect, useState } from 'react';
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

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve data from the database via the NestJS backend API.
  useEffect(() => {
    fetch('http://localhost:8000/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, []);

  // Filter the list of articles by keyword using the search bar.
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Top Bar: Logo, Search Bar & Back Button */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-black text-xl text-emerald-400 tracking-wider">WA</span>
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Enterprise System</span>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <Link 
          href="/" 
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-sm font-semibold transition"
        >
          ← Back to Homepage
        </Link>
      </header>

      {/* Page title */}
      <div className="max-w-6xl mx-auto pt-8 pb-4">
        <h1 className="text-3xl font-black text-emerald-400">Tech Blog & Articles</h1>
        <p className="text-slate-400 text-sm mt-1">
          List of insights from our technical team.
        </p>
      </div>

      {/* List of articles */}
      <div className="max-w-6xl mx-auto py-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading article list...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            {searchQuery ? 'No matching articles found.' : 'No articles have been published yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              /* BỌC LINK Ở ĐÂY */
              <Link href={`/customer/blogs/${post.id}`} key={post.id} className="block group">
                <article 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-emerald-500/50 transition cursor-pointer flex flex-col h-full"
                >
                  {post.thumbnailUrl && (
                    <img 
                      src={post.thumbnailUrl} 
                      alt={post.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" 
                    />
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition">
                        {post.title}
                      </h2>
                      <p className="text-slate-400 text-sm mt-2 line-clamp-3">
                        {post.content}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-500">
                      <span>✍️ {post.author?.fullname || 'Author unknown'}</span>
                      <span>📅 {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}