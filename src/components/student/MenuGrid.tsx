import { UtensilsCrossed } from 'lucide-react';
import { MenuItemResponse } from '@/services/chefApi';

interface MenuGridProps {
  menuItems: MenuItemResponse[];
  loading: boolean;
  onAddToCart: (item: MenuItemResponse) => void;
}

export const MenuGrid = ({ menuItems, loading, onAddToCart }: MenuGridProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg shadow-soft">
        <p className="text-muted-foreground">No menu items available. Ask a chef to create some!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Available Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-card rounded-xl shadow-medium overflow-hidden hover:shadow-strong transition group">
            <div className="h-48 bg-gradient-warm flex items-center justify-center">
              <UtensilsCrossed className="w-16 h-16 text-white opacity-60 group-hover:scale-110 transition" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                {item.vegetarian ? (
                  <span className="bg-success/20 text-success text-xs px-2 py-1 rounded font-medium">Veg</span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-medium">Non-Veg</span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">₹{item.price}</span>
                <button
                  onClick={() => onAddToCart(item)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition font-medium shadow-soft"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">by {item.chefName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
