import { useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import AnimatedButton from '../components/AnimatedButton';
import toast from 'react-hot-toast';
import { approvePost, listenPendingPosts } from '../services/blogApi';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const [pending, setPending] = useState(null);
  const prevCount = useRef(0);

  useEffect(
    () =>
      listenPendingPosts((posts) => {
        if (prevCount.current && posts.length > prevCount.current) {
          toast.success('🆕 New post awaiting approval');
        }
        prevCount.current = posts.length;
        setPending(posts);
      }),
    []
  );

  const handleApprove = async (id) => {
    try {
      await approvePost(id);
      toast.success('Post approved');
      setPending((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Approval failed');
    }
  };

  if (!pending) return <LoadingSpinner />;

  return (
    <div className='space-y-6 p-6 mx-auto max-w-4xl'>
      <div className='flex items-center justify-between'>
        {pending.length === 0 ? (
          ''
        ) : (
          <h1 className='text-2xl font-bold'>Pending Approvals</h1>
        )}
        {pending.length > 0 && (
          <span className='flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 '>
            <Clock size={16} /> {pending.length}
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <p className='text-zinc-500'>No pending posts 🎉</p>
      ) : (
        <ul className='space-y-4'>
          {pending.map((p) => (
            <li
              key={p.id}
              className='group flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md '
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <h2 className='text-lg font-semibold leading-snug'>
                    <Link
                      to={`/posts/${p.id}`}
                      className='hover:underline'
                      target='_blank'
                    >
                      {p.title}
                    </Link>
                  </h2>
                  <p className='mt-0.5 text-xs text-zinc-500 dark:text-zinc-400'>
                    by {p.author || 'Unknown'} •{' '}
                    {p.createdAt?.seconds
                      ? new Date(
                          p.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : ''}
                  </p>
                </div>
                {p.coverUrl && (
                  <img
                    src={p.coverUrl}
                    alt='cover'
                    className='h-16 w-28 rounded object-cover opacity-90 group-hover:opacity-100'
                  />
                )}
              </div>

              <div className='flex justify-end'>
                <AnimatedButton
                  className='flex items-center gap-1'
                  onClick={() => handleApprove(p.id)}
                >
                  <CheckCircle size={16} /> Approve
                </AnimatedButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
