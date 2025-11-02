import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';

const Index = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return showLogin ? (
    <Login onSwitchToRegister={() => setShowLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setShowLogin(true)} />
  );
};

export default Index;
