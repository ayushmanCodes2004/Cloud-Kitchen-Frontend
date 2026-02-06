import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/components/auth/LandingPage';
import { LoginNew } from '@/components/auth/LoginNew';
import { RegisterNew } from '@/components/auth/RegisterNew';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewParam = searchParams.get('view');
  
  // Determine view from URL parameter
  const getViewFromUrl = (): 'landing' | 'login' | 'register-student' | 'register-chef' => {
    if (viewParam === 'login') return 'login';
    if (viewParam === 'register-student') return 'register-student';
    if (viewParam === 'register-chef') return 'register-chef';
    return 'landing';
  };

  const [view, setView] = useState<'landing' | 'login' | 'register-student' | 'register-chef'>(getViewFromUrl());

  // Update view when URL changes (for back/forward navigation)
  useEffect(() => {
    setView(getViewFromUrl());
  }, [location.search]);

  // Helper to update URL and view
  const changeView = (newView: 'landing' | 'login' | 'register-student' | 'register-chef') => {
    if (newView === 'landing') {
      navigate('/', { replace: false });
    } else {
      navigate(`/?view=${newView}`, { replace: false });
    }
    setView(newView);
  };
  
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
          onOrderNow={() => changeView('register-student')}
          onBecomeChef={() => changeView('register-chef')}
          onSignIn={() => changeView('login')}
        />
      );
    }

    if (view === 'login') {
      return <LoginNew onSwitchToRegister={() => changeView('landing')} />;
    }

    return (
      <RegisterNew 
        onSwitchToLogin={() => changeView('login')} 
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
