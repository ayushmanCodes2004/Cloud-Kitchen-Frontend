import { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, User, ChefHat, Mail, Lock, Phone, Building2, Home, MapPin, Briefcase, Calendar, FileText, Sparkles, Star, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Alert } from '@/components/Alert';
import { emailService } from '@/services/emailService';

interface RegisterProps {
  onSwitchToLogin: () => void;
  chefOnly?: boolean;
  studentOnly?: boolean;
}

// Animation configurations - Figma-style
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

export const Register = ({ onSwitchToLogin, chefOnly = false, studentOnly = false }: RegisterProps) => {
  const { login } = useAuth();
  const [userType, setUserType] = useState<'student' | 'chef'>(chefOnly ? 'chef' : 'student');
  const [loading, setLoading] = useState(false);
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
    bio: ''
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
      bio: formData.bio
    };

    try {
      const result = await api.register(endpoint, data);
      
      if (result.success) {
        login(result.data, result.data.token);
        setAlert({ type: 'success', message: 'Registration successful!' });
        
        // Send welcome email
        emailService.sendWelcomeEmail({
          to_name: formData.name,
          to_email: formData.email,
          user_role: userType === 'student' ? 'Student' : 'Chef'
        }).catch(err => {
          console.error('Welcome email failed (non-critical):', err);
          // Don't show error to user - email is optional
        });
      } else {
        setAlert({ type: 'error', message: result.message || 'Registration failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please check if backend is running on port 8080.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Food Background Image with Blur - FULL SCREEN */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* Left Side - Branding Panel */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative z-10 p-12 flex-col justify-between">
        {/* Content */}
        <div>
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-500/30 backdrop-blur-xl flex items-center justify-center border border-orange-500/20"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <UtensilsCrossed className="w-7 h-7 text-orange-400" />
            </motion.div>
            <span className="text-2xl font-bold text-white">PlatePal</span>
          </motion.div>

          {/* Hero Content */}
          <motion.div 
            className="space-y-6 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              {userType === 'chef' ? 'Share Your Culinary Passion' : 'Discover Homemade Delights'}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              {userType === 'chef'
                ? 'Connect with food enthusiasts, share your expertise, and build your culinary brand in your community.'
                : 'Access delicious homemade meals from talented local chefs. Fresh, authentic, and delivered to your door.'}
            </p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-slate-400">{userType === 'chef' ? 'Active Chefs' : 'Dishes'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">2K+</div>
                <div className="text-sm text-slate-400">Students</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-sm text-slate-400">Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <blockquote className="text-slate-300 text-lg italic">
            "Food is not just eating energy. It's an experience."
          </blockquote>
          <p className="text-slate-500 mt-2">— Guy Fieri</p>
        </motion.div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-xl">{/* Mobile Logo (only visible on mobile) */}
          <motion.div 
            className="lg:hidden text-center mb-8"
            {...fadeInUp}
          >
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
                  className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {chefOnly ? (
                    <ChefHat className="w-8 h-8 text-white" />
                  ) : studentOnly ? (
                    <User className="w-8 h-8 text-white" />
                  ) : (
                    <UtensilsCrossed className="w-8 h-8 text-white" />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">
              {chefOnly ? 'Chef Registration' : studentOnly ? 'Student Registration' : 'Welcome to PlatePal'}
            </h2>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            {...scaleIn}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-slate-800"
          >
            {/* Desktop Header */}
            <motion.div 
              className="hidden lg:block mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">
                {userType === 'chef'
                  ? 'Join our community of talented chefs'
                  : 'Join our community of food lovers'}
              </p>
            </motion.div>
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

          {!chefOnly && !studentOnly && (
            <motion.div 
              className="flex gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => setUserType('student')}
                className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
                  userType === 'student'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={elasticEase}
              >
                {userType === 'student' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: 0.3 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <User className="inline w-5 h-5 mr-2" />
                  Student
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => setUserType('chef')}
                className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
                  userType === 'chef'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={elasticEase}
              >
                {userType === 'chef' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: 0.3 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <ChefHat className="inline w-5 h-5 mr-2" />
                  Chef
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* Dynamic message for chef selection */}
          {!chefOnly && !studentOnly && userType === 'chef' && (
            <motion.div 
              className="mb-6 p-5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20 rounded-xl relative overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <div className="flex items-start gap-3 relative z-10">
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-xl flex items-center justify-center border border-orange-500/20"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ChefHat className="w-5 h-5 text-orange-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Ready to Start Your Culinary Journey?</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Join PlatePal's community of passionate chefs! Share your signature dishes, build your culinary reputation, 
                    and earn from your cooking skills. We provide the platform, you bring the flavor. 
                    <span className="font-medium text-orange-400"> Start cooking, start earning!</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                    placeholder="john@example.com"
                  />
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </motion.div>
            </motion.div>

            {userType === 'student' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">College *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                      placeholder="University Name"
                    />
                  </div>
                </motion.div>

                {/* Hostel Information Section */}
                <motion.div 
                  className="space-y-3 p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 relative overflow-hidden"
                  whileHover={{ borderColor: "rgba(249, 115, 22, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="flex items-center justify-between relative z-10">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Home className="w-4 h-4 text-orange-400" />
                      Hostel Information
                    </label>
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">Optional</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Hostel Name</label>
                      <input
                        type="text"
                        value={formData.hostelName}
                        onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                        placeholder="North Campus Hostel"
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Room Number</label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                        placeholder="A-101"
                      />
                    </motion.div>
                  </div>

                  <p className="text-xs text-slate-500 flex items-start gap-2 relative z-10">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Skip if living in nearby residence
                  </p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    Delivery Address
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">Recommended</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500 resize-none"
                    rows={2}
                    placeholder="Enter your complete delivery address (hostel or nearby residence)"
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Specialization *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                        placeholder="Italian Cuisine"
                      />
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Experience (Years) *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full pl-10 px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500"
                        placeholder="5"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-400" />
                    Bio
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">Optional</span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 placeholder-slate-500 resize-none"
                    rows={3}
                    placeholder="Tell us about your cooking experience..."
                  />
                </motion.div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-orange-500/30 relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={elasticEase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: '0.6s' }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
                style={{ opacity: 0.3 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Check className="ml-2 w-5 h-5" />
                  </motion.div>
                )}
              </span>
            </motion.button>
          </form>

          <motion.div 
            className="mt-6 text-center pt-6 border-t border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-slate-400">
              Already have an account?{' '}
              <motion.button 
                onClick={onSwitchToLogin} 
                className="text-orange-400 font-semibold hover:text-orange-300 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
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

        {/* Footer Note */}
        <motion.p 
          className="text-center text-sm text-slate-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          By creating an account, you agree to our{' '}
          <button className="text-orange-400 hover:text-orange-300 hover:underline transition-colors">
            Terms of Service
          </button>
          {' '}and{' '}
          <button className="text-orange-400 hover:text-orange-300 hover:underline transition-colors">
            Privacy Policy
          </button>
        </motion.p>
      </div>
    </div>
    </div>
  );
};
