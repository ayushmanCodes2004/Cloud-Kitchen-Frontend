import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/components/auth/LandingPage';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';

type ViewState = 'landing' | 'login' | 'register-student' | 'register-chef';

const Index = () => {
  const [view, setView] = useState<ViewState>('landing');
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onOrderNow={() => setView('register-student')}
        onBecomeChef={() => setView('register-chef')}
        onSignIn={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return <Login onSwitchToRegister={() => setView('landing')} />;
  }

  return (
    <Register 
      onSwitchToLogin={() => setView('login')} 
      chefOnly={view === 'register-chef'}
      studentOnly={view === 'register-student'}
    />
  );
};

export default Index;
