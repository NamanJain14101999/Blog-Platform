import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/blogApi';
import toast from 'react-hot-toast';
import AnimatedButton from '../components/AnimatedButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';
import { MDComponents } from './BlogDetailPage';

export default function NewBlogPage() {
  const navigate = useNavigate();
  const { user, saveDraft, loadDraft, clearDraft } = useAuth();

  const [form, setForm] = useState(() =>
    loadDraft('blogDraft', { title: '', content: '', coverUrl: '' })
  );
  const [preview, setPreview] = useState(false);

  useEffect(() => saveDraft('blogDraft', form), [form, saveDraft]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ ...form, author: user?.name ?? 'Anonymous' });
      toast.success('Submitted for approval');
      clearDraft('blogDraft');
      navigate('/');
    } catch {
      toast.error('Submission failed');
    }
  };

  return (
    <div className='mx-auto max-w-3xl space-y-6 p-6'>
      <h1 className='text-2xl font-bold'>Submit Blog</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          name='title'
          placeholder='Title'
          required
          className='w-full rounded-lg border p-2'
          value={form.title}
          onChange={handleChange}
        />

        <input
          type='url'
          name='coverUrl'
          placeholder='Cover Image URL'
          className='w-full rounded-lg border p-2'
          value={form.coverUrl}
          onChange={handleChange}
        />

        <textarea
          name='content'
          placeholder='Markdown content (supports ```js code blocks```)'
          rows='10'
          required
          className='w-full rounded-lg border p-2 font-mono'
          value={form.content}
          onChange={handleChange}
        />

        <div className='flex gap-2'>
          <AnimatedButton type='submit'>Submit</AnimatedButton>
          <AnimatedButton type='button' onClick={() => setPreview((p) => !p)}>
            {preview ? 'Edit' : 'Preview'}
          </AnimatedButton>
        </div>
      </form>

      {preview && (
        <article className='prose lg:prose-lg dark:prose-invert'>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MDComponents}>
            {form.content}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}
