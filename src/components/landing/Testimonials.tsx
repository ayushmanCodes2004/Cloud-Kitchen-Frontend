import { motion, useMotionValue, animate } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, User, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";
import { TestimonialResponse } from "@/services/testimonialApi";

interface TestimonialsProps {
  testimonials?: TestimonialResponse[];
  loading?: boolean;
}

const CARD_WIDTH = 380;
const GAP = 24;

const Testimonials = ({ testimonials: apiTestimonials = [], loading = false }: TestimonialsProps) => {
  // Additional fake testimonials to supplement API data
  const fakeTestimonials: TestimonialResponse[] = [
    {
      id: 1001,
      userName: "Priya Sharma",
      userRole: "STUDENT" as const,
      institution: "Food Blogger",
      content: "PlatePal's biryani is absolutely divine! The flavors are authentic and remind me of my grandmother's cooking. Best cloud kitchen in the city!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1002,
      userName: "Rahul Mehta",
      userRole: "STUDENT" as const,
      institution: "Regular Customer",
      content: "I've been ordering from PlatePal for 6 months now. The consistency in quality and taste is remarkable. Their butter chicken is to die for!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1003,
      userName: "Ananya Patel",
      userRole: "STUDENT" as const,
      institution: "Working Professional",
      content: "As someone who works late, PlatePal is a lifesaver. Hot, fresh, homestyle food delivered right to my doorstep. The thali is my absolute favorite!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1004,
      userName: "Vikram Singh",
      userRole: "CHEF" as const,
      institution: "Family Man",
      content: "My entire family loves PlatePal! From my kids to my parents, everyone finds something they love. The portion sizes are generous and prices fair.",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1005,
      userName: "Meera Joshi",
      userRole: "STUDENT" as const,
      institution: "Health Enthusiast",
      content: "Finally, a cloud kitchen that understands flavor AND nutrition! Their meals are balanced and delicious. I order their thali every single week!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1006,
      userName: "Arjun Kapoor",
      userRole: "STUDENT" as const,
      institution: "College Student",
      content: "Being a student on a budget, PlatePal is perfect! Affordable, tasty, and delivered fast. The paneer tikka masala is my go-to comfort food.",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1007,
      userName: "Sneha Reddy",
      userRole: "CHEF" as const,
      institution: "Home Chef",
      content: "As a chef myself, I'm impressed by PlatePal's attention to detail. The spices are perfectly balanced and ingredients are always fresh!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
    {
      id: 1008,
      userName: "Karthik Iyer",
      userRole: "STUDENT" as const,
      institution: "Tech Professional",
      content: "Late night coding sessions are made better with PlatePal! Quick delivery, hot food, and amazing taste. The dal makhani is heavenly!",
      rating: 5,
      createdAt: new Date().toISOString(),
      approved: true,
    },
  ];

  // Combine API testimonials with fake ones, prioritizing real testimonials
  const allTestimonials = [...apiTestimonials, ...fakeTestimonials];
  
  // Use combined testimonials, or just fake ones if API returns empty
  const testimonials = allTestimonials.length > 0 ? allTestimonials : fakeTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);

  const maxIndex = testimonials.length - 1;

  useEffect(() => {
    const controls = animate(x, -currentIndex * (CARD_WIDTH + GAP), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    return controls.stop;
  }, [currentIndex, x]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <section className="py-20 bg-gradient-to-b from-cream to-cream-light relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-spice/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-terracotta/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-spice font-medium tracking-widest uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            What Our <span className="text-terracotta">Customers</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Don't just take our word for it – hear from our happy customers who've made PlatePal their go-to for delicious homestyle meals.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-warm flex items-center justify-center text-foreground hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-warm flex items-center justify-center text-foreground hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-8">
            <motion.div
              className="flex gap-6"
              style={{ x }}
            >
              {testimonials.map((testimonial, index) => {
                // Determine icon and styling based on user role
                const Icon = testimonial.userRole === 'CHEF' ? ChefHat : User;
                const isChef = testimonial.userRole === 'CHEF';
                
                return (
                  <motion.div
                    key={testimonial.id}
                    className="flex-shrink-0 w-[380px] bg-white rounded-2xl p-8 shadow-warm relative group hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Quote icon */}
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-spice/20 group-hover:text-spice/30 transition-colors" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(Math.min(5, Math.max(0, testimonial.rating || 5)))].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Testimonial text - flexible height with minimum */}
                    <div className="flex-1 mb-6">
                      <p className="text-foreground/80 text-lg leading-relaxed italic line-clamp-4">
                        "{testimonial.content}"
                      </p>
                    </div>

                    {/* Author - always at bottom */}
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex-shrink-0">
                        <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">
                          {testimonial.userName}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {testimonial.institution || (testimonial.userRole === 'CHEF' ? 'Chef' : 'Customer')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-terracotta w-8"
                    : "bg-terracotta/30 hover:bg-terracotta/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: "10K+", label: "Happy Customers" },
            { number: "50K+", label: "Orders Delivered" },
            { number: "4.9", label: "Average Rating" },
            { number: "30+", label: "Dishes Available" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-terracotta mb-1">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
