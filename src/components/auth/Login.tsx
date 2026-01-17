import { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Mail, Lock, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/Alert';

interface LoginProps {
  onSwitchToRegister: () => void;
}

// Animation configurations
const springConfig = {
  type: "spring" as const,
  damping: 30,
  stiffness: 200,
  mass: 0.8
};

const elasticEase = {
  type: "spring" as const,
  damping: 15,
  stiffness: 300,
  mass: 0.5
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as any }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as any }
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Food Background Image with Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1920&q=80')",
            filter: "blur(4px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-slate-900/40 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-orange-400/10"
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles size={60} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-amber-400/10"
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Star size={50} />
        </motion.div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Card */}
        <motion.div 
          {...fadeInUp}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-slate-800"
        >
          <div className="text-center">
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 300,
                delay: 0.2
              }}
              className="mb-6"
            >
              <motion.div 
                className="relative inline-block"
                whileHover={{ scale: 1.1 }}
                transition={elasticEase}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="/best.png" 
                    alt="PlatePal Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.3
              }}
              className="text-4xl md:text-5xl font-bold mb-3"
            >
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 text-transparent bg-clip-text">
                Welcome Back!
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-slate-400 text-lg"
            >
              Sign in to continue to PlatePal
            </motion.p>
          </div>
        </motion.div>

        {/* Main Login Card */}
        <motion.div 
          {...scaleIn}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-800"
        >
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: '0.3s' }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: '0.4s' }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={elasticEase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: '0.5s' }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
                style={{ opacity: 0.3 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                )}
              </span>
            </motion.button>
          </form>

          <motion.div 
            className="mt-6 text-center pt-6 border-t border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-slate-400">
              Don't have an account?{' '}
              <motion.button 
                onClick={onSwitchToRegister} 
                className="text-orange-400 font-semibold hover:text-orange-300 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-amber-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
