import { motion } from "framer-motion";
import { ChefHat, TrendingUp, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Access thousands of hungry customers daily"
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Cook on your own schedule"
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "24/7 partner success team"
  }
];

interface JoinAsChefProps {
  onBecomeChef: () => void;
}

const JoinAsChef = ({ onBecomeChef }: JoinAsChefProps) => {
  return (
    <section className="py-16 md:py-20 bg-charcoal text-white relative overflow-hidden" id="join-as-chef">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
              <ChefHat className="w-5 h-5" />
              <span className="font-medium">Partner With Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Share Your Culinary
              <span className="text-primary block">Passion With The World</span>
            </h2>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Join PlatePal as a home chef and turn your kitchen into a thriving business. 
              We handle delivery, marketing, and customer service — you focus on what you love: cooking!
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-white/60">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="text-lg px-8" onClick={onBecomeChef}>
              <ChefHat className="w-5 h-5 mr-2" />
              Apply to Join
            </Button>
          </motion.div>

          {/* Right Content - Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-8 text-center">Our Chef Community</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-white/70 text-sm">Partner Chefs</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">₹50K</div>
                  <div className="text-white/70 text-sm">Avg. Monthly Earnings</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
                  <div className="text-white/70 text-sm">Chef Satisfaction</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-white/70 text-sm">Orders Delivered</div>
                </motion.div>
              </div>

              <div className="mt-8 p-4 bg-primary/20 rounded-xl border border-primary/30">
                <p className="text-center text-sm">
                  <span className="text-primary font-semibold">🎉 Limited Time:</span>{" "}
                  Zero commission for first 3 months!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinAsChef;
