import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, UtensilsCrossed, Star, ChefHat, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { testimonialApi, TestimonialResponse } from '@/services/testimonialApi';

interface LandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

// Animation configurations - Professional Figma-style easing
const springConfig = {
  type: "spring" as const,
  damping: 30,
  stiffness: 200,
  mass: 0.8
};

const smoothEase = {
  ease: [0.25, 0.1, 0.25, 1] as const, // Figma's ease-in-out
  duration: 0.8
};

const elasticEase = {
  type: "spring" as const,
  damping: 15,
  stiffness: 300,
  mass: 0.5
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Professional reveal animation
const revealAnimation = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: {
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

export const LandingPage = ({ onOrderNow, onBecomeChef, onSignIn }: LandingPageProps) => {
  const [realTestimonials, setRealTestimonials] = useState<TestimonialResponse[]>([]);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const testimonials = await testimonialApi.getApprovedTestimonials();
      console.log('Fetched approved testimonials:', testimonials);
      
      const sortedTestimonials = (testimonials || []).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setRealTestimonials(sortedTestimonials);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      setRealTestimonials([]);
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "from-orange-500 to-rose-600",
      "from-green-500 to-emerald-600",
      "from-blue-500 to-cyan-600",
      "from-purple-500 to-pink-600",
      "from-amber-500 to-yellow-600",
      "from-red-500 to-orange-600",
      "from-indigo-500 to-blue-600",
      "from-teal-500 to-green-600"
    ];
    return colors[index % colors.length];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Hero Background with Gradient Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 via-amber-600/30 to-rose-600/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-orange-400/20"
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles size={60} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-amber-400/20"
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Star size={50} />
        </motion.div>

        {/* Content */}
        <div className="container relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
            className="flex flex-col items-center max-w-5xl mx-auto"
          >
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
              className="mb-8"
            >
              <motion.div 
                className="relative"
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
                  <ChefHat className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Main Heading with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ 
                duration: 1,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.3
              }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <motion.span 
                className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 text-transparent bg-clip-text inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Welcome to
              </motion.span>
              <br />
              <motion.span 
                className="text-white inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                PlatePal
              </motion.span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.7,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl font-light"
            >
              Your kitchen, just a tap away. Delicious meals from talented chefs, delivered straight to your hostel room.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-20"
            >
              <motion.button
                onClick={onOrderNow}
                className="group relative bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-10 py-6 text-lg rounded-2xl shadow-2xl border-0 overflow-hidden font-semibold"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={elasticEase}
              >
                <motion.span 
                  className="relative z-10 flex items-center justify-center"
                  whileHover={{ x: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  Order Now
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                onClick={onBecomeChef}
                className="group px-10 py-6 text-lg rounded-2xl border-2 border-slate-700 hover:border-orange-500/50 transition-all bg-slate-900/60 backdrop-blur-xl text-white font-semibold relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(249, 115, 22, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={elasticEase}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  Become a Chef
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ChefHat className="ml-2 w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm"
            >
              {[
                { icon: Shield, text: "100% Safe & Hygienic", color: "text-green-500" },
                { icon: Zap, text: "Lightning Fast Delivery", color: "text-orange-500" },
                { icon: TrendingUp, text: "10,000+ Orders Delivered", color: "text-amber-500" }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  </motion.div>
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-10"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
                <motion.div
                  className="w-1.5 h-2 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"
                  animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Join Our Platform Section */}
      <section className="relative py-32 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springConfig}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-orange-500/10 text-orange-400 rounded-full text-sm font-semibold mb-4 border border-orange-500/20">
              Choose Your Path
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Join Our Platform
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Whether you're hungry or a culinary artist, we've got you covered
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Students Card */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1
              }}
              whileHover={{ 
                y: -12,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="group"
              style={{ perspective: "1000px" }}
            >
              <div className="rounded-3xl p-8 h-full border border-slate-800 hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
                {/* Animated gradient background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{
                    x: "100%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                  }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                  }}
                />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    className="mb-6 inline-block"
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-2xl blur-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-orange-500/20">
                        <UtensilsCrossed className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.h3 
                    className="text-3xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    For Students
                  </motion.h3>
                  <motion.p 
                    className="text-slate-400 mb-8 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Browse delicious meals, place orders, and get food delivered right to your hostel
                  </motion.p>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {[
                      "Quick delivery to hostel",
                      "Wide variety of cuisines",
                      "Affordable student-friendly pricing",
                      "Real-time order tracking",
                      "24/7 customer support"
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: 0.4 + index * 0.1,
                          duration: 0.5,
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        className="flex items-start group/item cursor-default"
                      >
                        <motion.div 
                          className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-lg"
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 360,
                            transition: { duration: 0.5 }
                          }}
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </motion.div>
                        <span className="text-slate-300 group-hover/item:text-white transition-colors duration-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* For Chefs Card */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.2
              }}
              whileHover={{ 
                y: -12,
                rotateY: -5,
                transition: { duration: 0.3 }
              }}
              className="group"
              style={{ perspective: "1000px" }}
            >
              <div className="rounded-3xl p-8 h-full border border-slate-800 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
                {/* Animated gradient background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{
                    x: "100%",
                    transition: { duration: 1.5, ease: "easeInOut" }
                  }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                  }}
                />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    className="mb-6 inline-block"
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-2xl blur-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5
                        }}
                      />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-amber-500/20">
                        <ChefHat className="w-8 h-8 text-amber-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.h3 
                    className="text-3xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    For Chefs
                  </motion.h3>
                  <motion.p 
                    className="text-slate-400 mb-8 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Create and manage your menu, receive orders, and showcase your culinary skills
                  </motion.p>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {[
                      "Manage your menu easily",
                      "Reach more customers",
                      "Flexible working hours",
                      "Real-time order management",
                      "Build your culinary brand"
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: 0.4 + index * 0.1,
                          duration: 0.5,
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        className="flex items-start group/item cursor-default"
                      >
                        <motion.div 
                          className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-lg"
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 360,
                            transition: { duration: 0.5 }
                          }}
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </motion.div>
                        <span className="text-slate-300 group-hover/item:text-white transition-colors duration-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-slate-400 text-lg">
              Already have an account?{" "}
              <button
                onClick={onSignIn}
                className="text-orange-400 font-semibold hover:text-orange-300 transition-colors inline-flex items-center group"
              >
                Sign In
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-32 px-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
        
        <div className="container max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springConfig}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-sm font-semibold mb-4 border border-amber-500/20">
              Why PlatePal?
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Built for Your Success
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Experience the difference with our premium features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Fast Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="rounded-3xl p-8 text-center border border-slate-800 hover:border-blue-500/30 transition-all duration-300 h-full relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
                {/* Gradient Orb */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-blue-500/20 mx-auto">
                        <Clock className="w-10 h-10 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Fast Delivery</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Quick delivery to your hostel room within minutes. Hot food, happy you!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Expert Chefs */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="rounded-3xl p-8 text-center border border-slate-800 hover:border-orange-500/30 transition-all duration-300 h-full relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
                {/* Gradient Orb */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-orange-500/20 mx-auto">
                        <ChefHat className="w-10 h-10 text-orange-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Expert Chefs</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Meals prepared by experienced professional chefs who pour their heart into every dish
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Student Friendly */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="rounded-3xl p-8 text-center border border-slate-800 hover:border-green-500/30 transition-all duration-300 h-full relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
                {/* Gradient Orb */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-block">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-green-500/20 mx-auto">
                        <Star className="w-10 h-10 text-green-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Student Friendly</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Affordable pricing perfect for student budgets without compromising on quality
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springConfig}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/20">
              Testimonials
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-6">
              Don't just take our word for it - hear from students and chefs who are already part of the PlatePal community
            </p>
            <p className="text-slate-500 text-sm">
              👈 Scroll to see more reviews 👉
            </p>
          </motion.div>

          {/* Horizontal Scrolling Testimonials */}
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <motion.div
              className="flex gap-6 px-4"
              style={{ width: "max-content" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {allTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="flex-shrink-0 w-80"
                >
                  <div className="rounded-3xl p-6 border border-slate-800 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col bg-slate-900/60 backdrop-blur-xl">
                    <p className="text-slate-300 mb-6 italic flex-grow leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="pt-4 border-t border-slate-800 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center text-white font-bold shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 360, transition: { duration: 0.5 } }}
                          >
                            {testimonial.userName.charAt(0).toUpperCase()}
                          </motion.div>
                          <div>
                            <p className="font-semibold text-white">{testimonial.userName}</p>
                            <p className="text-xs text-slate-500">
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
                  className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 text-transparent bg-clip-text mb-2"
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
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="container max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500"
          >
            © 2025 PlatePal. All rights reserved.
          </motion.p>
        </div>
      </footer>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
