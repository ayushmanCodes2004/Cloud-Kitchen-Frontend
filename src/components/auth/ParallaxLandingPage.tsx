import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  ChefHat, 
  Clock, 
  Star, 
  UtensilsCrossed, 
  Truck, 
  Shield, 
  Heart,
  Play,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface ParallaxLandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

export const ParallaxLandingPage: React.FC<ParallaxLandingPageProps> = ({
  onOrderNow,
  onBecomeChef,
  onSignIn
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms for different layers
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const middleY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const foregroundY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  
  // Hero section transforms
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 1.2]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.5], ["0%", "-50%"]);

  // Section reveals
  const section1Y = useTransform(smoothProgress, [0.1, 0.3], ["100%", "0%"]);
  const section2Y = useTransform(smoothProgress, [0.3, 0.5], ["100%", "0%"]);
  const section3Y = useTransform(smoothProgress, [0.5, 0.7], ["100%", "0%"]);
  const section4Y = useTransform(smoothProgress, [0.7, 0.9], ["100%", "0%"]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Student, IIT Delhi",
      content: "PlatePal transformed my college experience. Fresh, homemade meals delivered right to my hostel!",
      rating: 5,
      image: "/api/placeholder/80/80"
    },
    {
      name: "Priya Patel", 
      role: "Home Chef",
      content: "I've built my culinary business through PlatePal. Amazing platform for passionate cooks!",
      rating: 5,
      image: "/api/placeholder/80/80"
    },
    {
      name: "Ananya Reddy",
      role: "Student, NIT Mumbai", 
      content: "The variety is incredible! From North Indian to Continental, all at student-friendly prices.",
      rating: 5,
      image: "/api/placeholder/80/80"
    }
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Fixed Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <img src="/best.png" alt="PlatePal" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-2xl font-black text-white">PlatePal</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <button className="text-white/80 hover:text-white font-medium transition-colors">
                Menu
              </button>
              <button className="text-white/80 hover:text-white font-medium transition-colors">
                About
              </button>
              <button className="text-white/80 hover:text-white font-medium transition-colors">
                Contact
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onSignIn}
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                Sign In
              </button>
              <motion.button
                onClick={onOrderNow}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Order Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Layers */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{
              backgroundImage: "url('/8k.png')",
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-orange-900/40 to-red-900/60" />
        </motion.div>

        {/* Floating Food Elements */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ y: middleY }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                transform: `translate(${mousePosition.x * (0.05 + i * 0.01)}px, ${mousePosition.y * (0.03 + i * 0.005)}px)`
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-6xl">
                {['🍛', '🥘', '🍜', '🌮', '🍕', '🥗'][i]}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-20 text-center px-6 max-w-6xl mx-auto"
          style={{ 
            scale: heroScale, 
            opacity: heroOpacity, 
            y: heroY 
          }}
        >
          <motion.h1
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <span className="block text-white drop-shadow-2xl">
              TASTE THE
            </span>
            <span className="block bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text drop-shadow-2xl">
              EXTRAORDINARY
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-white/90 mb-12 font-light max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Experience culinary excellence delivered to your doorstep. 
            Fresh, authentic meals from passionate local chefs.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <motion.button
              onClick={onOrderNow}
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(249, 115, 22, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Order Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={() => setIsVideoPlaying(true)}
              className="group flex items-center gap-3 text-white hover:text-orange-300 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-6 h-6 ml-1" />
              </div>
              <span className="text-lg font-medium">Watch Our Story</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section with Parallax */}
      <motion.section 
        className="relative py-32 bg-gradient-to-b from-slate-900 to-slate-800"
        style={{ y: section1Y }}
      >
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: foregroundY }}
        >
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Why Choose PlatePal?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We're revolutionizing campus dining with fresh, authentic meals from passionate local chefs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <ChefHat className="w-12 h-12" />,
                title: "Expert Chefs",
                description: "Verified local chefs with authentic recipes and years of culinary expertise",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Clock className="w-12 h-12" />,
                title: "Lightning Fast",
                description: "Fresh meals delivered to your hostel in under 30 minutes with real-time tracking",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: "Quality Assured",
                description: "Rigorous quality checks and hygiene standards for every meal we deliver",
                color: "from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Menu Showcase with 3D Parallax */}
      <motion.section 
        className="relative py-32 bg-gradient-to-b from-slate-800 to-slate-900"
        style={{ y: section2Y }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Culinary Excellence
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover authentic flavors from every corner of India, crafted with love by expert home chefs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "North Indian",
                description: "Rich curries, fresh rotis, and aromatic biryanis",
                image: "/api/placeholder/400/300",
                color: "from-orange-400 to-red-500",
                dishes: ["Butter Chicken", "Dal Makhani", "Naan"]
              },
              {
                name: "South Indian", 
                description: "Crispy dosas, fluffy idlis, and spicy sambar",
                image: "/api/placeholder/400/300",
                color: "from-green-400 to-emerald-500",
                dishes: ["Masala Dosa", "Idli Sambar", "Coconut Chutney"]
              },
              {
                name: "Street Food",
                description: "Authentic chaat, momos, and regional specialties",
                image: "/api/placeholder/400/300", 
                color: "from-yellow-400 to-orange-500",
                dishes: ["Pani Puri", "Veg Momos", "Bhel Puri"]
              }
            ].map((cuisine, index) => (
              <motion.div
                key={index}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  y: -20, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 group-hover:border-white/40 transition-all duration-500">
                  {/* Image with Parallax */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={cuisine.image}
                      alt={cuisine.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cuisine.color} opacity-60 group-hover:opacity-40 transition-opacity duration-300`} />
                    
                    {/* Floating Badge */}
                    <motion.div
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span className="text-white font-bold text-sm">Popular</span>
                    </motion.div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-3xl font-black text-white mb-3">
                      {cuisine.name}
                    </h3>
                    
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {cuisine.description}
                    </p>

                    {/* Dish List */}
                    <div className="space-y-2 mb-6">
                      {cuisine.dishes.map((dish, dishIndex) => (
                        <motion.div
                          key={dishIndex}
                          className="flex items-center gap-2 text-slate-400"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + dishIndex * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-orange-400 rounded-full" />
                          <span>{dish}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-full font-bold transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore Menu
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials with Floating Cards */}
      <motion.section 
        className="relative py-32 bg-gradient-to-b from-slate-900 to-black overflow-hidden"
        style={{ y: section3Y }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Student Stories
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Hear from thousands of students who've made PlatePal their go-to dining solution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -15,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 group-hover:border-orange-400/50 transition-all duration-500 h-full">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    "
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-white text-lg leading-relaxed mb-8 flex-grow">
                    {testimonial.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-400"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section with Immersive Background */}
      <motion.section 
        className="relative py-32 overflow-hidden"
        style={{ y: section4Y }}
      >
        {/* Dynamic Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-orange-800" />
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
              Ready to Transform
              <br />
              Your Dining?
            </h2>
            
            <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who've discovered the joy of fresh, 
              authentic meals delivered with love.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                onClick={onOrderNow}
                className="group relative bg-white text-orange-600 px-12 py-5 rounded-full font-black text-xl shadow-2xl overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Ordering
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={onBecomeChef}
                className="group border-2 border-white text-white hover:bg-white hover:text-orange-600 px-12 py-5 rounded-full font-bold text-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3">
                  <ChefHat className="w-6 h-6" />
                  Become a Chef
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative bg-black py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <img src="/best.png" alt="PlatePal" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-3xl font-black text-white">PlatePal</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Revolutionizing campus dining with fresh, authentic meals from passionate local chefs.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <motion.div
                    key={social}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-5 h-5 bg-white rounded-sm" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Order Food', 'Become Chef', 'Track Order', 'Help Center'].map((link) => (
                  <li key={link}>
                    <button className="text-slate-400 hover:text-orange-400 transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cities */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Available In</h3>
              <ul className="space-y-3">
                {['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'].map((city) => (
                  <li key={city} className="text-slate-400">
                    {city}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span>hello@platepal.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500">
              © 2025 PlatePal. All rights reserved.
            </p>
            <div className="flex gap-6 text-slate-500 text-sm">
              <button className="hover:text-orange-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-orange-400 transition-colors">Terms of Service</button>
              <button className="hover:text-orange-400 transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full aspect-video"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ×
            </button>
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <p className="text-white text-xl">Video Player Placeholder</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};