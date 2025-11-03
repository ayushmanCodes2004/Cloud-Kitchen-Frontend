import { useState } from 'react';
import { UtensilsCrossed, User, ChefHat } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Alert } from '@/components/Alert';

interface RegisterProps {
  onSwitchToLogin: () => void;
  chefOnly?: boolean;
  studentOnly?: boolean;
}

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
    studentId: '',
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
      studentId: formData.studentId,
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4">
            {chefOnly ? (
              <ChefHat className="w-8 h-8 text-orange-500" />
            ) : studentOnly ? (
              <User className="w-8 h-8 text-orange-500" />
            ) : (
              <UtensilsCrossed className="w-8 h-8 text-orange-500" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {chefOnly ? 'Become a Chef' : studentOnly ? 'Order Delicious Food' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {chefOnly ? 'Join our team of culinary experts' : studentOnly ? 'Sign up to start ordering' : 'Join CloudKitchen today'}
          </p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {!chefOnly && !studentOnly && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all duration-300 ${
                userType === 'student'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="inline w-5 h-5 mr-2" />
              Student
            </button>
            <button
              onClick={() => setUserType('chef')}
              className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all duration-300 ${
                userType === 'chef'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChefHat className="inline w-5 h-5 mr-2" />
              Chef
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {userType === 'student' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College *</label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                  <input
                    type="text"
                    value={formData.hostelName}
                    onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  rows={2}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="e.g., Italian Cuisine"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  rows={3}
                  placeholder="Tell us about your cooking experience..."
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
