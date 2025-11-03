import { ArrowRight, Clock, UtensilsCrossed, Star, ChefHat } from 'lucide-react';

interface LandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

export const LandingPage = ({ onOrderNow, onBecomeChef, onSignIn }: LandingPageProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background Image with Blur and Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&q=80')",
              filter: 'blur(2.5px)',
              transform: 'scale(1.1)'
            }}
          ></div>
          {/* Orange/Red Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 via-orange-600/80 to-red-500/80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to CloudKitchen
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10">
            Delicious meals delivered from cloud to your table
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onOrderNow}
              className="group px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Order Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onBecomeChef}
              className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Become a Chef
            </button>
          </div>
        </div>

        {/* Scroll indicator - Animated Mouse */}
        <div className="relative z-10 pb-8 animate-bounce">
          <div className="w-8 h-12 mx-auto border-2 border-white/60 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Join Our Platform Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Join Our Platform
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Students Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-8 h-8 text-orange-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Students
              </h3>
              
              <p className="text-gray-600 mb-6">
                Browse delicious meals, place orders, and get food delivered right to your hostel
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Quick delivery to hostel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Wide variety of cuisines</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Affordable student-friendly pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Real-time order tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>

            {/* For Chefs Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <ChefHat className="w-8 h-8 text-orange-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Chefs
              </h3>
              
              <p className="text-gray-600 mb-6">
                Create and manage your menu, receive orders, and showcase your culinary skills
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Manage your menu easily</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Reach more customers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Flexible working hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Real-time order management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Build your culinary brand</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSignIn}
                className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Fast Delivery */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick delivery to your hostel room within minutes
              </p>
            </div>

            {/* Expert Chefs */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Expert Chefs
              </h3>
              <p className="text-gray-600">
                Meals prepared by experienced professional chefs
              </p>
            </div>

            {/* Student Friendly */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Student Friendly
              </h3>
              <p className="text-gray-600">
                Affordable pricing perfect for student budgets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            © 2024 Cloud Kitchen Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
