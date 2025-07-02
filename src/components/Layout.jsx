import { Link, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const navItem = (to, label, onClick) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? 'font-semibold text-indigo-600' : ''
      }
    >
      {label}
    </NavLink>
  );

  return (
    <>
      <header className='flex items-center justify-between border-b p-4 dark:border-zinc-700'>
        <Link to={isAdmin ? '/admin' : '/'} className='text-2xl font-bold'>
          MyBlogs
        </Link>

        <nav className='hidden gap-6 md:flex'>
          {!isAdmin && navItem('/', 'Home')}
          {user && !isAdmin && navItem('/new-blog', 'New Blog')}
          {isAdmin && navItem('/admin', 'Admin')}
        </nav>

        <div className='flex items-center gap-4'>
          {user ? (
            <>
              <span className='hidden text-sm md:block'>Hi, {user.name}</span>
              <AnimatedButton onClick={logout}>Logout</AnimatedButton>
            </>
          ) : (
            <Link to='/login'>
              <AnimatedButton>Login</AnimatedButton>
            </Link>
          )}

          <button className='md:hidden' onClick={() => setOpen(true)}>
            <Menu />
          </button>
        </div>
      </header>

      {open && (
        <aside className='fixed inset-0 z-50 flex flex-col bg-white p-6 dark:bg-zinc-500'>
          <button className='self-end' onClick={() => setOpen((prev) => !prev)}>
            <X />
          </button>
          <nav className='mt-6 space-y-4 text-lg'>
            {!isAdmin && navItem('/', 'Home', () => setOpen(false))}
            {user &&
              !isAdmin &&
              navItem('/new-blog', 'New Blog', () => setOpen(false))}
            {isAdmin && navItem('/admin', 'Admin', () => setOpen(false))}
          </nav>
        </aside>
      )}

      <main className='min-h-[calc(100vh-64px)] bg-zinc-50'>
        <Outlet />
      </main>
    </>
  );
}
