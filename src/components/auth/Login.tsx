import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/Alert';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login = ({ onSwitchToRegister }: LoginProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const result = await api.login(formData);
      
      if (result.success) {
        login(result.data, result.data.token);
        setAlert({ type: 'success', message: 'Login successful!' });
        // Navigate to the appropriate dashboard based on user role
        const dashboardPath = `/dashboard/${result.data.role.toLowerCase()}`;
        navigate(dashboardPath, { replace: true });
      } else {
        setAlert({ type: 'error', message: result.message || 'Login failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please check if backend is running on port 8080.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4">
            <UtensilsCrossed className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CloudKitchen</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
