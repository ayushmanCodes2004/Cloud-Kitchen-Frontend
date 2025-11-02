import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { MenuItemResponse } from '@/types/menu';

interface MenuItemGridProps {
  menuItems: MenuItemResponse[];
  loading: boolean;
  onToggleAvailability: (id: number) => void;
}

export const MenuItemGrid = ({ menuItems, loading, onToggleAvailability }: MenuItemGridProps) => {
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
        <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">No menu items yet. Create your first dish!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div key={item.id} className="bg-card rounded-xl shadow-medium overflow-hidden hover:shadow-strong transition">
          <div className="h-48 bg-gradient-warm flex items-center justify-center">
            <UtensilsCrossed className="w-16 h-16 text-white opacity-60" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
              <div className="flex gap-2">
                {item.vegetarian && (
                  <span className="bg-success/20 text-success text-xs px-2 py-1 rounded font-medium">Veg</span>
                )}
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  item.available ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-primary">₹{item.price}</span>
              <span className="text-sm text-muted-foreground">{item.preparationTime} mins</span>
            </div>
            <button
              onClick={() => onToggleAvailability(item.id)}
              className="w-full bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg transition font-medium"
            >
              Toggle Availability
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
