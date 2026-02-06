import { UtensilsCrossed } from 'lucide-react';

export const ModernFooter = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">PlatePal</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Elevating your home dining experience with chef-curated selections delivered to your door.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary transition-colors" href="#">Menu</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Gold Plan</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">AI Meal Builder</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Track Order</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Gift Cards</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm flex-1 focus:ring-primary px-3 py-2"
                placeholder="Your email"
                type="email"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 PlatePal Cloud Kitchen. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="#">Privacy Policy</a>
            <a className="hover:text-primary" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
