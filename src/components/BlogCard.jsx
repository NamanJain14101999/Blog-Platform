import { Link } from 'react-router-dom';
export default function BlogCard({ post }) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className='group flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-50'
    >
      <img
        src={post.coverUrl}
        alt='cover'
        className='h-40 w-full rounded-xl object-cover transition group-hover:scale-105'
      />
      <h3 className='mt-3 line-clamp-2 text-lg font-bold group-hover:text-indigo-600'>
        {post.title}
      </h3>
      <p className='mt-1 line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400'>
        {post.content}
      </p>
      <span className='mt-2 text-xs text-zinc-400'>
        {post.createdAt?.toDate().toLocaleDateString()}
      </span>
    </Link>
  );
}
