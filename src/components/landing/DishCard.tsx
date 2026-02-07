import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Heart } from "lucide-react";

interface DishCardProps {
  id?: number;
  image: string;
  name: string;
  description: string;
  price: string | number;
  rating?: number;
  ratingCount?: number;
  prepTime?: string;
  chefName?: string;
  isVeg?: boolean;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  onAddToCart?: () => void;
}

const DishCard = ({
  id,
  image,
  name,
  description,
  price,
  rating,
  ratingCount,
  isVeg = false,
  isFavourite = false,
  onToggleFavourite,
  onAddToCart,
}: DishCardProps) => {
  const displayPrice = typeof price === 'string' ? price : `₹${price.toFixed(2)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
          }}
        />
        {onToggleFavourite && (
          <button 
            onClick={onToggleFavourite}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:scale-110"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavourite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-slate-400 hover:text-red-500'
              }`} 
            />
          </button>
        )}
        {isVeg && (
          <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase text-white">Veg</span>
          </div>
        )}
        {!isVeg && (
          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase text-white">Non-Veg</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{name}</h3>
          {rating !== undefined && ratingCount !== undefined && ratingCount > 0 ? (
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              {rating.toFixed(1)}
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-xs font-bold">
              <Star className="w-3 h-3" />
              New
            </div>
          )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {description || 'Delicious dish prepared with fresh ingredients'}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold">{displayPrice}</span>
          <button
            onClick={onAddToCart}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;
