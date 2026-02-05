import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { routes } from './routes';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: routes,
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/auth', element: <Navigate to="/login" replace /> },
]);
