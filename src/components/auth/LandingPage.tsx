import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, UtensilsCrossed, Star, ChefHat } from 'lucide-react';
import { testimonialApi, TestimonialResponse } from '@/services/testimonialApi';

interface LandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

// Animation configurations
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
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
        </motion.div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
          {/* Chef Hat Icon */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <img 
              src="/best.png" 
              alt="Chef Hat" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-2xl"
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Welcome to PlatePal
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Your kitchen, just a tap away
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button
              onClick={onOrderNow}
              className="group px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Order Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={onBecomeChef}
              className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Become a Chef
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator - Animated Mouse */}
        <motion.div 
          className="relative z-10 pb-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-8 h-12 mx-auto border-2 border-white/60 rounded-full flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-2.5 bg-white/80 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Join Our Platform Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            {...fadeInUp}
            viewport={{ once: true, margin: "-100px" }}
            whileInView="animate"
            initial="initial"
          >
            Join Our Platform
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* For Students Card */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <motion.div 
                className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6"
                whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
              >
                <UtensilsCrossed className="w-8 h-8 text-orange-500" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Students
              </h3>
              
              <p className="text-gray-600 mb-6">
                Browse delicious meals, place orders, and get food delivered right to your hostel
              </p>

              <div className="space-y-3">
                {[
                  "Quick delivery to hostel",
                  "Wide variety of cuisines",
                  "Affordable student-friendly pricing",
                  "Real-time order tracking",
                  "24/7 customer support"
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* For Chefs Card */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <motion.div 
                className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6"
                whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
              >
                <ChefHat className="w-8 h-8 text-orange-500" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Chefs
              </h3>
              
              <p className="text-gray-600 mb-6">
                Create and manage your menu, receive orders, and showcase your culinary skills
              </p>

              <div className="space-y-3">
                {[
                  "Manage your menu easily",
                  "Reach more customers",
                  "Flexible working hours",
                  "Real-time order management",
                  "Build your culinary brand"
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSignIn}
                className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            {...fadeInUp}
            viewport={{ once: true, margin: "-100px" }}
            whileInView="animate"
            initial="initial"
          >
            Why Choose Us?
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Fast Delivery */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.6 } }}
              >
                <Clock className="w-10 h-10 text-orange-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick delivery to your hostel room within minutes
              </p>
            </motion.div>

            {/* Expert Chefs */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.6 } }}
              >
                <ChefHat className="w-10 h-10 text-orange-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Expert Chefs
              </h3>
              <p className="text-gray-600">
                Meals prepared by experienced professional chefs
              </p>
            </motion.div>

            {/* Student Friendly */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.6 } }}
              >
                <Star className="w-10 h-10 text-orange-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Student Friendly
              </h3>
              <p className="text-gray-600">
                Affordable pricing perfect for student budgets
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-4"
            {...fadeInUp}
            viewport={{ once: true, margin: "-100px" }}
            whileInView="animate"
            initial="initial"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Don't just take our word for it - hear from students and chefs who are already part of the PlatePal community
          </motion.p>
          <motion.p 
            className="text-center text-orange-500 text-sm mb-8 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            👈 Scroll to see more reviews 👉
          </motion.p>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <motion.div 
              className="flex gap-6 min-w-max"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            {allTestimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id} 
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80 h-64 flex flex-col"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <p className="text-gray-700 mb-6 italic flex-grow">
                "{testimonial.content}"
              </p>
              <div className="pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold"
                      whileHover={{ scale: 1.1, rotate: 360, transition: { duration: 0.5 } }}
                    >
                      {testimonial.userName.charAt(0).toUpperCase()}
                    </motion.div>
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
            </motion.div>
            ))}
            </motion.div>
          </div>

          {/* Trust Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { value: "500+", label: "Happy Students" },
              { value: "50+", label: "Verified Chefs" },
              { value: "10k+", label: "Orders Delivered" },
              { value: "4.8", label: "Average Rating" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <motion.p 
                  className="text-4xl font-bold text-orange-500 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.1 
                  }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
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
