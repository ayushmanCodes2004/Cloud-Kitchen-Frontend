import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import Header from "@/components/landing/Header";
import TextParallaxContent from "@/components/landing/TextParallaxContent";
import DishCard from "@/components/landing/DishCard";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import JoinAsChef from "@/components/landing/JoinAsChef";
import Footer from "@/components/landing/Footer";
import { menuApi } from "@/services/menuApi";
import { testimonialApi, TestimonialResponse } from "@/services/testimonialApi";
import { MenuItemResponse } from "@/services/chefApi";

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
  const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menu items and testimonials in parallel
        const [menuResponse, testimonialsData] = await Promise.all([
          menuApi.getAvailableMenuItems(),
          testimonialApi.getApprovedTestimonials()
        ]);

        // Get first 3 menu items for landing page
        if (menuResponse.data) {
          setMenuItems(menuResponse.data.slice(0, 3));
        }

        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform menu items to dish format
  const dishes = menuItems.map(item => ({
    image: item.imageUrl || "/dish-curry.jpg",
    name: item.name,
    description: item.description,
    price: `₹${item.price}`,
    rating: item.menuItemAverageRating || 4.5,
    prepTime: `${item.preparationTime || 25} min`,
    chefName: item.chefName || "Chef",
    isVeg: item.vegetarian,
  }));

  return (
    <div className="bg-background min-h-screen">
      <Header onSignIn={onSignIn} onOrderNow={onOrderNow} />

      {/* Hero Section with Parallax */}
      <TextParallaxContent
        videoUrl="/new2.mp4"
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
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-xl mb-4"></div>
                  <div className="bg-muted h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-muted h-4 rounded w-full"></div>
                </div>
              ))
            ) : dishes.length > 0 ? (
              dishes.map((dish) => (
                <DishCard key={dish.name} {...dish} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No menu items available at the moment.</p>
              </div>
            )}
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
      <div id="about">
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
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials testimonials={testimonials} loading={loading} />

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
