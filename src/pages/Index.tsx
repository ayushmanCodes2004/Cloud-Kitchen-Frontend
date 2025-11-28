import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/components/auth/LandingPage';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';

type ViewState = 'landing' | 'login' | 'register-student' | 'register-chef';

const Index = () => {
  const [view, setView] = useState<ViewState>('landing');
  
  try {
    const { user } = useAuth();

    if (user) {
      return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
    }
  } catch (error) {
    console.error('Auth error:', error);
  }

  try {
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
  } catch (error) {
    console.error('Render error:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Error Loading Page</h1>
        <p>There was an error loading the page. Please check the browser console for details.</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
};

export default Index;
