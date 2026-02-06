import { UtensilsCrossed, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-charcoal text-cream pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/best.png" 
                alt="PlatePal Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold">
                Plate<span className="text-primary">Pal</span>
              </span>
            </div>
            <p className="text-cream/70 mb-6">
              Premium cloud kitchen delivering happiness. Your kitchen, just a tap away.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary hover:text-charcoal transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="text-cream/70 hover:text-primary transition-colors text-left"
                >
                  Our Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-cream/70 hover:text-primary transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-cream/70 hover:text-primary transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-cream/70 hover:text-primary transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-cream/70">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 91081 57226</span>
              </li>
              <li className="flex items-center gap-3 text-cream/70">
                <Mail className="w-5 h-5 text-primary" />
                <span>ayushmanm678@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-cream/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-cream/70">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 text-center text-cream/50 text-sm">
          <p>© 2025 PlatePal. All rights reserved. Made with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
