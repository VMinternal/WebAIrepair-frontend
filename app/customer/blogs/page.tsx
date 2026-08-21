'use client';

import BlogList from '@/app/_components/BlogList';

export default function CustomerBlogsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <BlogList />
      </div>
    </main>
  );
}