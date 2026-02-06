import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Building, Home, MapPin, ChefHat, Briefcase, FileText, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/ui/button';
import { emailService } from '@/services/emailService';

interface RegisterProps {
  onSwitchToLogin: () => void;
  chefOnly?: boolean;
  studentOnly?: boolean;
}

export const RegisterNew = ({ onSwitchToLogin, chefOnly = false, studentOnly = false }: RegisterProps) => {
  const { login } = useAuth();
  const [userType, setUserType] = useState<'student' | 'chef'>(chefOnly ? 'chef' : 'student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    college: '',
    hostelName: '',
    roomNumber: '',
    address: '',
    specialization: '',
    experienceYears: '',
    bio: '',
    chefAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const endpoint = userType === 'student' ? 'student' : 'chef';
    const data = userType === 'student' ? {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      college: formData.college,
      hostelName: formData.hostelName,
      roomNumber: formData.roomNumber,
      address: formData.address
    } : {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      specialization: formData.specialization,
      experienceYears: parseInt(formData.experienceYears) || 0,
      bio: formData.bio,
      address: formData.chefAddress
    };

    try {
      const result = await api.register(endpoint, data);
      
      if (result.success) {
        login(result.data, result.data.token);
        setAlert({ type: 'success', message: 'Registration successful!' });
        
        emailService.sendWelcomeEmail({
          to_name: formData.name,
          to_email: formData.email,
          user_role: userType === 'student' ? 'Student' : 'Chef'
        }).catch(err => console.error('Welcome email failed:', err));
      } else {
        setAlert({ type: 'error', message: result.message || 'Registration failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please check if backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Video/Image */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-charcoal"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/new2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/80 to-charcoal/60" />
        
        {/* Logo - Top Left */}
        <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
          <img 
            src="/best.png" 
            alt="PlatePal Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg font-bold text-white">
            Plate<span className="text-primary">Pal</span>
          </span>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">
              Join the
              <span className="text-primary block mt-2">PlatePal Family</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              {userType === 'chef' 
                ? 'Share your culinary passion with thousands of food lovers.'
                : 'Experience restaurant-quality meals from expert chefs.'}
            </p>
            
            <div className="mt-8 space-y-3">
              {(userType === 'chef' ? [
                "Reach thousands of customers",
                "Flexible working hours",
                "Grow your culinary business"
              ] : [
                "Order from expert chefs",
                "Fresh, homestyle meals",
                "Fast & reliable delivery"
              ]).map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-white/90 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-cream overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md py-3"
        >
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-1.5">
              {chefOnly ? 'Welcome, Chef!' : studentOnly ? 'Welcome!' : 'Join PlatePal'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {chefOnly 
                ? 'Start your culinary journey with us' 
                : studentOnly 
                ? 'Sign up to enjoy delicious meals' 
                : 'Create your account today'}
            </p>
          </div>

          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </motion.div>
          )}

          {/* User Type Selection */}
          {!chefOnly && !studentOnly && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                I want to register as
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition ${
                    userType === 'student'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-foreground hover:border-primary/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('chef')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 transition ${
                    userType === 'chef'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-foreground hover:border-primary/50'
                  }`}
                >
                  <ChefHat className="w-4 h-4" />
                  <span className="text-sm font-medium">Chef</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Common Fields - 2 columns for space efficiency */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="+91 98765"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-2 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Student-specific fields */}
            {userType === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">College</label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="Your College"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Hostel</label>
                    <div className="relative">
                      <Home className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={formData.hostelName}
                        onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                        className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="Hostel A"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Room</label>
                    <input
                      type="text"
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="101"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                      rows={2}
                      placeholder="Complete address"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Chef-specific fields */}
            {userType === 'chef' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Specialization</label>
                    <div className="relative">
                      <ChefHat className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="Italian"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Experience (yrs)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
                    <textarea
                      required
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                      rows={2}
                      placeholder="Tell us about your culinary journey..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Kitchen Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
                    <textarea
                      required
                      value={formData.chefAddress}
                      onChange={(e) => setFormData({ ...formData, chefAddress: e.target.value })}
                      className="w-full pl-9 pr-2 py-1.5 text-sm border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                      rows={2}
                      placeholder="Your kitchen/business address"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              variant="hero"
              size="default"
              className="w-full gap-2 mt-1"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* Footer Text */}
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>

          {/* Sign In Link */}
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary font-semibold hover:text-primary/80 transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
