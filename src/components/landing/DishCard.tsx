import { motion } from "framer-motion";
import { Star, Clock, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DishCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  prepTime: string;
  chefName: string;
  isVeg?: boolean;
}

const DishCard = ({
  image,
  name,
  description,
  price,
  rating,
  prepTime,
  chefName,
  isVeg = false,
}: DishCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isVeg
                ? "bg-green-500 text-white"
                : "bg-terracotta text-cream"
            }`}
          >
            {isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-charcoal/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-cream text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{chefName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{price}</span>
          <Button variant="warm" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;
