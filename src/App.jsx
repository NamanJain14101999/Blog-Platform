import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import NewBlogPage from './pages/NewBlogPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { LoadingSpinner } from './components/LoadingSpinner';

export function NonAdminRoute({ children }) {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to='/admin' replace />;
  return children;
}

function InnnerApp() {
  const { initializing } = useAuth();

  if (initializing) return <LoadingSpinner fullscreen />;
  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <NonAdminRoute>
                <BlogListPage />
              </NonAdminRoute>
            }
          />
          <Route
            path='posts/:id'
            element={
              <NonAdminRoute>
                <BlogDetailPage />
              </NonAdminRoute>
            }
          />
          <Route
            path='new-blog'
            element={
              <ProtectedRoute>
                <NonAdminRoute>
                  <NewBlogPage />
                </NonAdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path='admin'
            element={
              <ProtectedRoute role='admin'>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='*' element={<div className='p-6'>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnnerApp />
    </AuthProvider>
  );
}
