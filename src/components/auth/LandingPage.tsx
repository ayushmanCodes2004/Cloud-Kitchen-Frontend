import { useState, useEffect } from 'react';
import { ArrowRight, Clock, UtensilsCrossed, Star, ChefHat } from 'lucide-react';
import { testimonialApi, TestimonialResponse } from '@/services/testimonialApi';

interface LandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

export const LandingPage = ({ onOrderNow, onBecomeChef, onSignIn }: LandingPageProps) => {
  const [realTestimonials, setRealTestimonials] = useState<TestimonialResponse[]>([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const testimonials = await testimonialApi.getApprovedTestimonials();
      console.log('Fetched approved testimonials:', testimonials);
      
      // Sort by newest first (redundant safety check in case backend isn't updated yet)
      const sortedTestimonials = (testimonials || []).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setRealTestimonials(sortedTestimonials);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      setRealTestimonials([]);
    }
  };

  // Static fallback testimonials
  const staticTestimonials = [
    {
      id: -1,
      userName: "Rahul Sharma",
      userRole: "STUDENT" as const,
      content: "PlatePal saved my life during exam season! Fresh home-cooked meals delivered right to my hostel room. No more instant noodles!",
      rating: 5,
      institution: "NIT Delhi"
    },
    {
      id: -2,
      userName: "Priya Patel",
      userRole: "CHEF" as const,
      content: "As a chef, PlatePal gave me the platform to showcase my authentic Biryani recipe. Now I have regular customers and a steady income!",
      rating: 5,
      institution: "Home Chef"
    },
    {
      id: -3,
      userName: "Ananya Reddy",
      userRole: "STUDENT" as const,
      content: "The variety is amazing! From North Indian to South Indian, Chinese to Continental. PlatePal has it all at student-friendly prices.",
      rating: 5,
      institution: "IIT Mumbai"
    },
    {
      id: -4,
      userName: "Vikram Singh",
      userRole: "STUDENT" as const,
      content: "Late night cravings? PlatePal got you covered! Got piping hot pizza at 2 AM during project deadline week. Absolute lifesaver!",
      rating: 5,
      institution: "DTU Delhi"
    },
    {
      id: -5,
      userName: "Meera Krishnan",
      userRole: "CHEF" as const,
      content: "PlatePal's analytics helped me understand peak hours and customer preferences. My revenue grew by 60% in just 3 months!",
      rating: 5,
      institution: "Professional Chef"
    },
    {
      id: -6,
      userName: "Arjun Mehta",
      userRole: "STUDENT" as const,
      content: "Being away from home, I missed mom's cooking. Found a chef on PlatePal who makes authentic Gujarati thali. Feels like home!",
      rating: 5,
      institution: "BITS Pilani"
    },
    {
      id: -7,
      userName: "Sneha Gupta",
      userRole: "STUDENT" as const,
      content: "The app is super easy to use. Track your order in real-time and the delivery is always on time. Plus, the food is delicious!",
      rating: 4,
      institution: "NSIT Delhi"
    },
    {
      id: -8,
      userName: "Rajesh Kumar",
      userRole: "CHEF" as const,
      content: "Started as a hobby during lockdown, now it's my full-time business. PlatePal made my culinary dreams come true!",
      rating: 5,
      institution: "Home Chef"
    },
    {
      id: -9,
      userName: "Kavya Nair",
      userRole: "STUDENT" as const,
      content: "Best thing about PlatePal? You can rate chefs and see reviews before ordering. Quality is consistently great!",
      rating: 5,
      institution: "IIT Delhi"
    },
    {
      id: -10,
      userName: "Amit Verma",
      userRole: "CHEF" as const,
      content: "The order management system is so intuitive! I can focus on cooking while PlatePal handles the rest. Highly recommend for chefs!",
      rating: 5,
      institution: "Cloud Kitchen Owner"
    },
    {
      id: -11,
      userName: "Riya Das",
      userRole: "STUDENT" as const,
      content: "Finally found authentic Bengali food near campus! The momos are incredible too. PlatePal connects you with amazing local chefs.",
      rating: 5,
      institution: "JNU Delhi"
    },
    {
      id: -12,
      userName: "Sanjay Iyer",
      userRole: "STUDENT" as const,
      content: "Affordable, quick, and tasty! Perfect for students on a budget. The variety keeps me coming back every day!",
      rating: 4,
      institution: "Jamia Millia"
    },
    {
      id: -13,
      userName: "Neha Kapoor",
      userRole: "CHEF" as const,
      content: "Love how PlatePal handles payments securely. No hassles, direct transfers. Great support team too!",
      rating: 5,
      institution: "Home Baker"
    },
    {
      id: -14,
      userName: "Karan Malhotra",
      userRole: "STUDENT" as const,
      content: "Group study sessions are incomplete without PlatePal! We order together and split the bill. So convenient!",
      rating: 5,
      institution: "Manipal University"
    },
    {
      id: -15,
      userName: "Divya Joshi",
      userRole: "STUDENT" as const,
      content: "As a health-conscious student, I appreciate the variety of healthy meal options. Fresh salads and protein bowls are my go-to!",
      rating: 5,
      institution: "Miranda House"
    },
    {
      id: -16,
      userName: "Harish Babu",
      userRole: "CHEF" as const,
      content: "Been cooking professionally for 15 years. PlatePal gave me direct access to customers without middlemen. Revenue increased by 3x!",
      rating: 5,
      institution: "Expert Chef"
    },
    {
      id: -17,
      userName: "Pooja Menon",
      userRole: "STUDENT" as const,
      content: "The customer service is amazing! Had an issue once and it was resolved within 10 minutes. Top-notch support!",
      rating: 5,
      institution: "Shri Ram College"
    },
    {
      id: -18,
      userName: "Aditya Saxena",
      userRole: "STUDENT" as const,
      content: "Game nights with friends always include PlatePal orders! Love the midnight delivery option. Burgers at 3 AM FTW!",
      rating: 5,
      institution: "VIT Vellore"
    },
    {
      id: -19,
      userName: "Lakshmi Rao",
      userRole: "CHEF" as const,
      content: "My signature Kerala cuisine is now reaching hundreds of students! PlatePal helped me build my brand from scratch.",
      rating: 5,
      institution: "Regional Cuisine Expert"
    },
    {
      id: -20,
      userName: "Rohan Bhatt",
      userRole: "STUDENT" as const,
      content: "International student here! PlatePal introduced me to authentic Indian cuisine. Every dish is an adventure!",
      rating: 5,
      institution: "Ashoka University"
    },
    {
      id: -21,
      userName: "Simran Kaur",
      userRole: "STUDENT" as const,
      content: "Living in a PG with no kitchen? PlatePal is a blessing! Homely food delivered fresh. My parents are relieved!",
      rating: 5,
      institution: "Lady Hardinge"
    },
    {
      id: -22,
      userName: "Deepak Singh",
      userRole: "CHEF" as const,
      content: "Started with just 5 menu items. Now I have 50+! PlatePal's menu management system makes it super easy to update.",
      rating: 5,
      institution: "Cloud Kitchen"
    },
    {
      id: -23,
      userName: "Tanvi Sharma",
      userRole: "STUDENT" as const,
      content: "Best part? No minimum order! Can order just a single item when broke. Plus loyalty rewards are awesome!",
      rating: 4,
      institution: "IP University"
    },
    {
      id: -24,
      userName: "Madhav Pillai",
      userRole: "STUDENT" as const,
      content: "The food quality is consistently excellent. You can tell the chefs really care about what they cook. Keep it up PlatePal!",
      rating: 5,
      institution: "St. Stephen's"
    },
    {
      id: -25,
      userName: "Fatima Khan",
      userRole: "CHEF" as const,
      content: "As a mother of two running a home kitchen, PlatePal lets me earn while managing my family. Flexible hours are perfect!",
      rating: 5,
      institution: "Home Chef"
    },
    {
      id: -26,
      userName: "Ishaan Roy",
      userRole: "STUDENT" as const,
      content: "Tried almost every chef on PlatePal! Each one has their specialty. Love the diversity and competition drives quality!",
      rating: 5,
      institution: "Hindu College"
    },
    {
      id: -27,
      userName: "Nisha Agarwal",
      userRole: "STUDENT" as const,
      content: "Weekend brunches sorted! The breakfast menu is fantastic. Pancakes, parathas, upma - everything fresh and hot!",
      rating: 5,
      institution: "Gargi College"
    },
    {
      id: -28,
      userName: "Varun Chopra",
      userRole: "CHEF" as const,
      content: "The real-time order notifications are perfect! I can prepare fresh food as orders come in. No wastage, happy customers!",
      rating: 5,
      institution: "Professional Chef"
    }
  ];

  // Combine real and static testimonials
  const allTestimonials = [...realTestimonials, ...staticTestimonials];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-orange-400 via-red-400 to-red-500">
        {/* Background Image with Blur and Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1920&q=80')",
              filter: 'blur(2px)',
              transform: 'scale(1.1)'
            }}
          ></div>
          {/* Orange/Red Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/95 via-red-400/95 to-red-500/95"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
          {/* Chef Hat Icon */}
          <div className="mb-8">
            <img 
              src="/best.png" 
              alt="Chef Hat" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to PlatePal
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10">
            Your kitchen, just a tap away
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't just take our word for it - hear from students and chefs who are already part of the PlatePal community
          </p>
          <p className="text-center text-orange-500 text-sm mb-8 font-medium">
            👈 Scroll to see more reviews 👉
          </p>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
            {allTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80 h-64 flex flex-col">
              <p className="text-gray-700 mb-6 italic flex-grow">
                "{testimonial.content}"
              </p>
              <div className="pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
                      {testimonial.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.userName}</p>
                      <p className="text-xs text-gray-500">
                        {testimonial.userRole === 'STUDENT' ? testimonial.institution || 'Student' : 'Chef'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            ))}
            </div>
          </div>

          {/* Trust Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">500+</p>
              <p className="text-gray-600 text-sm">Happy Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">50+</p>
              <p className="text-gray-600 text-sm">Verified Chefs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">10k+</p>
              <p className="text-gray-600 text-sm">Orders Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">4.8</p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            © 2025 PlatePal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
