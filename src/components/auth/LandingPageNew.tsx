import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import Header from "@/components/landing/Header";
import TextParallaxContent from "@/components/landing/TextParallaxContent";
import DishCard from "@/components/landing/DishCard";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import JoinAsChef from "@/components/landing/JoinAsChef";
import Footer from "@/components/landing/Footer";

const dishes = [
  {
    image: "/dish-curry.jpg",
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato-based gravy with aromatic spices",
    price: "₹349",
    rating: 4.9,
    prepTime: "25 min",
    calories: "520 cal",
    isVeg: false,
  },
  {
    image: "/dish-tandoori.jpg",
    name: "Tandoori Chicken",
    description: "Marinated chicken grilled to perfection in our traditional tandoor oven",
    price: "₹399",
    rating: 4.8,
    prepTime: "30 min",
    calories: "380 cal",
    isVeg: false,
  },
  {
    image: "/dish-thali.jpg",
    name: "Special Thali",
    description: "Complete meal with dal, sabzi, rice, roti, raita, pickle and dessert",
    price: "₹299",
    rating: 4.7,
    prepTime: "20 min",
    calories: "650 cal",
    isVeg: true,
  },
];

const stats = [
  { icon: Star, value: "4.9", label: "Customer Rating" },
  { icon: Clock, value: "30 min", label: "Avg. Delivery" },
  { icon: Users, value: "50K+", label: "Happy Customers" },
];

interface LandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

export const LandingPage = ({ onOrderNow, onBecomeChef, onSignIn }: LandingPageProps) => {
  return (
    <div className="bg-background min-h-screen">
      <Header onSignIn={onSignIn} onOrderNow={onOrderNow} />

      {/* Hero Section with Parallax */}
      <TextParallaxContent
        imgUrl="/hero-biryani.jpg"
        subheading="Premium Cloud Kitchen"
        heading="Fresh. Flavorful. Fast."
      >
        <div className="bg-background py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Experience restaurant-quality meals crafted by expert chefs, delivered hot to your doorstep. 
              PlatePal brings the finest flavors from our cloud kitchen to your table.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="lg" className="gap-2" onClick={onOrderNow}>
                Explore Menu <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </TextParallaxContent>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm">
              Signature Dishes
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2">
              Our Popular Menu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish) => (
              <DishCard key={dish.name} {...dish} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" onClick={onOrderNow}>
              View Full Menu
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Parallax Section - About */}
      <TextParallaxContent
        imgUrl="/dish-curry.jpg"
        subheading="Our Story"
        heading="Passion on Every Plate"
      >
        <div className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                Born from a love of authentic Indian cuisine, PlatePal is more than a cloud kitchen—
                it's a culinary journey. Our chefs bring decades of experience, crafting each dish 
                with fresh ingredients and time-honored recipes passed down through generations.
              </motion.p>
            </div>
          </div>
        </div>
      </TextParallaxContent>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* Join as Chef */}
      <JoinAsChef onBecomeChef={onBecomeChef} />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6">
              Ready to Order?
            </h2>
            <p className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers enjoying restaurant-quality meals at home.
            </p>
            <Button 
              size="lg" 
              className="bg-cream text-charcoal hover:bg-cream/90 font-semibold text-lg px-8"
              onClick={onOrderNow}
            >
              Order Your First Meal
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
