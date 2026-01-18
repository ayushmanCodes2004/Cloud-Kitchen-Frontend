import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Star, 
  ChefHat, 
  Clock, 
  Shield, 
  Zap, 
  Heart,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';

interface ParallaxLandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

// Animation configurations
const springConfig = {
  type: "spring" as const,
  damping: 30,
  stiffness: 200,
  mass: 0.8
};

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export const ParallaxLandingPage = ({ onOrderNow, onBecomeChef, onSignIn }: ParallaxLandingPageProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  
  // Smooth spring animations
  const smoothY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 30 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setMousePosition({
        x: (clientX - innerWidth / 2) / innerWidth,
        y: (clientY - innerHeight / 2) / innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating elements data
  const floatingElements = [
    { icon: '🍕', delay: 0, x: 10, y: 20 },
    { icon: '🍔', delay: 1, x: 80, y: 15 },
    { icon: '🍜', delay: 2, x: 20, y: 70 },
    { icon: '🥗', delay: 3, x: 90, y: 60 },
    { icon: '🍰', delay: 4, x: 60, y: 25 },
    { icon: '🥘', delay: 5, x: 30, y: 80 }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: smoothEase }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <img src="/best.png" alt="PlatePal" className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white">PlatePal</span>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {['Menu', 'About', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-300 hover:text-orange-400 transition-colors duration-300 font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onSignIn}
                className="text-slate-300 hover:text-white transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={onOrderNow}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Order Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Multi-layer Parallax */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          opacity: smoothOpacity,
          scale: smoothScale,
          y: smoothY
        }}
      >
        {/* Background Layers */}
        <div className="absolute inset-0">
          {/* Base Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            style={{
              x: useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
            }}
          />
          
          {/* Food Background Image */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('/8k.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              x: useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
            }}
          />
          
          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/20"
            style={{
              x: useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
            }}
          />
        </div>

        {/* Floating Food Elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-6xl opacity-20 pointer-events-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              x: mousePosition.x * (20 + index * 5),
              y: mousePosition.y * (20 + index * 5)
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4 + element.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay
            }}
          >
            {element.icon}
          </motion.div>
        ))}

        {/* Hero Content */}
        <div className="container relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: smoothEase }}
            className="max-w-6xl mx-auto"
          >
            {/* Massive Typography */}
            <motion.h1
              className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-8 leading-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: smoothEase, delay: 0.2 }}
            >
              <motion.span 
                className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 text-transparent bg-clip-text"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                PLATE
              </motion.span>
              <motion.span 
                className="block text-white"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                PAL
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-2xl md:text-3xl text-slate-300 mb-12 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Experience culinary excellence delivered to your doorstep. 
              <span className="text-orange-400 font-medium"> Where hunger meets happiness.</span>
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.button
                onClick={onOrderNow}
                className="group relative bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl font-bold overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(249, 115, 22, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="relative z-10 flex items-center"
                  whileHover={{ x: -5 }}
                >
                  Order Now
                  <ArrowRight className="ml-3 w-6 h-6" />
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
                className="group px-12 py-6 text-xl rounded-2xl border-2 border-slate-600 hover:border-orange-500/50 text-white font-bold bg-slate-900/60 backdrop-blur-xl relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(249, 115, 22, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <span className="relative z-10 flex items-center">
                  Become a Chef
                  <ChefHat className="ml-3 w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>

            {/* Video Play Button */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <motion.button
                onClick={() => setIsVideoModalOpen(true)}
                className="group relative w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:border-orange-500/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </motion.button>
              <p className="text-slate-400 mt-4 text-sm">Watch Our Story</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-2 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </motion.section>
      {/* Features Showcase with 3D Effects */}
      <section className="relative py-32 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span 
              className="inline-block px-6 py-3 bg-orange-500/10 text-orange-400 rounded-full text-sm font-semibold mb-6 border border-orange-500/20"
              whileHover={{ scale: 1.05 }}
            >
              Why Choose PlatePal?
            </motion.span>
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Built for Excellence
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Experience the perfect blend of technology, taste, and convenience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ChefHat,
                title: "Expert Chefs",
                description: "Handpicked professional chefs who bring years of culinary expertise to every dish",
                color: "from-orange-500 to-amber-600",
                delay: 0.1
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Advanced logistics ensure your food arrives hot and fresh within minutes",
                color: "from-blue-500 to-cyan-600",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "Quality Assured",
                description: "Rigorous quality checks and hygiene standards for your peace of mind",
                color: "from-green-500 to-emerald-600",
                delay: 0.3
              }
            ].map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Menu Categories with 3D Cards */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              className="inline-block px-6 py-3 bg-amber-500/10 text-amber-400 rounded-full text-sm font-semibold mb-6 border border-amber-500/20"
              whileHover={{ scale: 1.05 }}
            >
              Explore Cuisines
            </motion.span>
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Taste the World
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From authentic regional flavors to international cuisines, discover your next favorite meal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "North Indian",
                image: "/api/placeholder/400/300",
                dishes: ["Butter Chicken", "Biryani", "Naan", "Dal Makhani"],
                color: "from-red-500 to-orange-600"
              },
              {
                title: "South Indian",
                image: "/api/placeholder/400/300", 
                dishes: ["Dosa", "Idli", "Sambar", "Rasam"],
                color: "from-green-500 to-teal-600"
              },
              {
                title: "Street Food",
                image: "/api/placeholder/400/300",
                dishes: ["Pani Puri", "Vada Pav", "Chaat", "Momos"],
                color: "from-purple-500 to-pink-600"
              }
            ].map((category, index) => (
              <MenuCard key={index} {...category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Floating Cards */}
      <section className="relative py-32 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              className="inline-block px-6 py-3 bg-purple-500/10 text-purple-400 rounded-full text-sm font-semibold mb-6 border border-purple-500/20"
              whileHover={{ scale: 1.05 }}
            >
              Success Stories
            </motion.span>
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Join our community of satisfied students and successful chefs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "Student, IIT Delhi",
                content: "PlatePal saved my life during exam season! Fresh home-cooked meals delivered right to my hostel room.",
                rating: 5,
                avatar: "R"
              },
              {
                name: "Priya Patel", 
                role: "Chef Partner",
                content: "As a chef, PlatePal gave me the platform to showcase my authentic recipes. Now I have regular customers!",
                rating: 5,
                avatar: "P"
              },
              {
                name: "Ananya Reddy",
                role: "Student, NIT Mumbai", 
                content: "The variety is amazing! From North Indian to Continental. PlatePal has it all at student-friendly prices.",
                rating: 5,
                avatar: "A"
              }
            ].map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>

          {/* Trust Statistics */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Users, value: "10K+", label: "Happy Students" },
              { icon: ChefHat, value: "500+", label: "Expert Chefs" },
              { icon: TrendingUp, value: "50K+", label: "Orders Delivered" },
              { icon: Award, value: "4.9", label: "Average Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-8 h-8 text-orange-400" />
                </motion.div>
                <motion.p
                  className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 text-transparent bg-clip-text mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Ready to Start?
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Join thousands of students and chefs who have made PlatePal their go-to food platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={onOrderNow}
                className="group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-12 py-6 text-xl rounded-2xl font-bold shadow-2xl"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(249, 115, 22, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  Start Ordering
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                onClick={onBecomeChef}
                className="px-12 py-6 text-xl rounded-2xl border-2 border-slate-600 hover:border-orange-500/50 text-white font-bold bg-slate-900/60 backdrop-blur-xl"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(249, 115, 22, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  Join as Chef
                  <ChefHat className="ml-3 w-6 h-6" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-slate-800/50 bg-slate-900/50">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <img src="/best.png" alt="PlatePal" className="w-8 h-8" />
                </div>
                <span className="text-2xl font-bold text-white">PlatePal</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Connecting hungry students with talented chefs. Experience the future of campus dining.
              </p>
              <div className="flex space-x-4">
                {[Instagram, Twitter, Facebook].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'How it Works', 'Pricing', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Delhi, India</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@platepal.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2025 PlatePal. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a key={link} href="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <motion.div
            className="bg-slate-900 rounded-3xl p-8 max-w-4xl w-full"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
              <p className="text-white text-xl">Video Player Placeholder</p>
            </div>
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color, delay }: {
  icon: any;
  title: string;
  description: string;
  color: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: smoothEase }}
      whileHover={{ 
        y: -12, 
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      className="group perspective-1000"
    >
      <div className="relative p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 transition-all duration-500 bg-slate-900/60 backdrop-blur-xl h-full">
        {/* Animated Background */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
        />
        
        {/* Icon */}
        <motion.div 
          className="mb-6"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30 rounded-2xl blur-xl`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            />
            <div className={`relative w-16 h-16 bg-gradient-to-br ${color} opacity-20 rounded-2xl flex items-center justify-center border border-orange-500/20`}>
              <Icon className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// Menu Card Component
const MenuCard = ({ title, image, dishes, color, index }: {
  title: string;
  image: string;
  dishes: string[];
  color: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ 
        y: -12, 
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className="group perspective-1000"
    >
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 hover:border-orange-500/30 transition-all duration-500 bg-slate-900/60 backdrop-blur-xl">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${color} opacity-80`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">{title} Cuisine</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <div className="space-y-2 mb-6">
            {dishes.map((dish, dishIndex) => (
              <motion.div
                key={dish}
                className="flex items-center text-slate-400"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 + dishIndex * 0.05 }}
              >
                <Heart className="w-4 h-4 text-orange-400 mr-2" />
                <span>{dish}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-orange-400 rounded-xl font-semibold border border-orange-500/20 hover:border-orange-500/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Menu
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, rating, avatar, index }: {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group"
    >
      <div className="relative p-6 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition-all duration-500 bg-slate-900/60 backdrop-blur-xl h-full flex flex-col">
        {/* Floating particles */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />

        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + i * 0.05 }}
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <p className="text-slate-300 mb-6 italic flex-grow leading-relaxed">
          "{content}"
        </p>

        {/* Author */}
        <div className="flex items-center pt-4 border-t border-slate-800">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {avatar}
          </motion.div>
          <div>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-slate-500">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};