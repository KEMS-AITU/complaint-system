import { Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/LoginForm';
import { RegisterForm } from '../features/auth/RegisterForm';
import { useAuth } from '../shared/auth/AuthContext';
import { Section } from '../shared/ui/Section';

export const AuthPage = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="stack">
      <Section
        title="Sign in or register"
        description="Sign in to continue or create a new account in seconds."
      >
        <div className="grid grid-2">
          <LoginForm />
          <RegisterForm />
        </div>
      </Section>
    </div>
  );
};
