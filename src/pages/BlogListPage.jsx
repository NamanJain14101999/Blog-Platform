import { useEffect, useState } from 'react';
import { listenPosts } from '../services/blogApi';
import BlogCard from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function BlogListPage() {
  const [posts, setPosts] = useState(null);
  useEffect(() => listenPosts(setPosts), []);

  if (!posts) return <LoadingSpinner />;
  return (
    <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {posts?.map((p) => (
        <BlogCard key={p.id} post={p} />
      ))}
    </div>
  );
}
