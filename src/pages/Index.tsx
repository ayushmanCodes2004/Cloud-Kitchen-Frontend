import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { ChefDashboard } from '@/components/chef/ChefDashboard';

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { user } = useAuth();

  if (user) {
    if (user.role === 'STUDENT') {
      return <StudentDashboard />;
    } else if (user.role === 'CHEF') {
      return <ChefDashboard />;
    }
  }

  return showLogin ? (
    <Login onSwitchToRegister={() => setShowLogin(false)} />
  ) : (
    <Register onSwitchToLogin={() => setShowLogin(true)} />
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
