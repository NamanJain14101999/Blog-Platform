import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedButton from '../components/AnimatedButton';

export default function RegisterPage() {
  const { user, register, loading, saveDraft, loadDraft, clearDraft } =
    useAuth();
  const [form, setForm] = useState(() =>
    loadDraft('registerForm', { name: '', email: '', password: '' })
  );

  useEffect(() => saveDraft('registerForm', form), [form, saveDraft]);
  if (user) return <Navigate to='/' replace />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form).then(() => clearDraft('registerForm'));
  };

  return (
    <div className='mx-auto max-w-md p-6'>
      <h1 className='mb-6 text-2xl font-bold text-center'>Register</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          name='name'
          placeholder='Name'
          required
          className='w-full rounded-lg border p-2'
          value={form.name}
          onChange={handleChange}
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          required
          className='w-full rounded-lg border p-2'
          value={form.email}
          onChange={handleChange}
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          required
          className='w-full rounded-lg border p-2'
          value={form.password}
          onChange={handleChange}
        />
        <AnimatedButton type='submit' disabled={loading} className='w-full'>
          {loading ? 'Loading…' : 'Register'}
        </AnimatedButton>
        <p className='text-center text-sm'>
          Already have an account?{' '}
          <Link to='/login' className='text-indigo-600 hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
