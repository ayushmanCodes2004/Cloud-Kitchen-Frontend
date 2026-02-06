import { motion } from "framer-motion";
import { UtensilsCrossed, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  onSignIn: () => void;
  onOrderNow: () => void;
}

const Header = ({ onSignIn, onOrderNow }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src="/best.png" 
            alt="PlatePal Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl font-bold text-white">
            Plate<span className="text-primary">Pal</span>
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <motion.a
            href="#menu"
            className="text-white/90 hover:text-primary transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            Menu
          </motion.a>
          <motion.a
            href="#about"
            className="text-white/90 hover:text-primary transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            About
          </motion.a>
          <motion.a
            href="#how-it-works"
            className="text-white/90 hover:text-primary transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            How It Works
          </motion.a>
          <motion.a
            href="#contact"
            className="text-white/90 hover:text-primary transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            Contact
          </motion.a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-primary hover:bg-white/10"
            onClick={onSignIn}
          >
            Sign In
          </Button>
          <Button variant="hero" onClick={onOrderNow}>
            Order Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-charcoal/95 backdrop-blur-md border-t border-white/20"
        >
          <nav className="flex flex-col p-4 gap-4">
            <a
              href="#menu"
              className="text-white/90 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </a>
            <a
              href="#about"
              className="text-white/90 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-white/90 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="text-white/90 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <Button 
              variant="ghost" 
              className="text-white hover:text-primary hover:bg-white/10 justify-start"
              onClick={() => { onSignIn(); setIsOpen(false); }}
            >
              Sign In
            </Button>
            <Button variant="hero" onClick={() => { onOrderNow(); setIsOpen(false); }}>
              Order Now
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
