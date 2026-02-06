import { motion } from "framer-motion";
import { Smartphone, ChefHat, Truck, Utensils } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Browse & Order",
    description: "Explore our menu and pick your favorites with just a few taps",
  },
  {
    icon: ChefHat,
    title: "We Cook Fresh",
    description: "Our chefs prepare your meal with premium ingredients",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Hot and fresh, delivered to your door in 30 minutes",
  },
  {
    icon: Utensils,
    title: "Enjoy Your Meal",
    description: "Savor restaurant-quality food in the comfort of home",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6 shadow-warm"
                >
                  <step.icon className="w-10 h-10 text-charcoal" />
                </motion.div>
                <span className="absolute top-0 right-1/2 translate-x-[4.5rem] -translate-y-2 text-6xl font-bold text-primary/20">
                  {index + 1}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
