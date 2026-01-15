import { useState } from 'react';
import { ChefHat, UtensilsCrossed, Star, CheckCircle, Badge as BadgeIcon, Edit, Trash2 } from 'lucide-react';
import { MenuItemResponse } from '@/types/menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MenuItemGridProps {
  menuItems: MenuItemResponse[];
  loading: boolean;
  onToggleAvailability: (id: number) => void;
  onEdit?: (item: MenuItemResponse) => void;
  onDelete?: (id: number) => void;
}

export const MenuItemGrid = ({ menuItems, loading, onToggleAvailability, onEdit, onDelete }: MenuItemGridProps) => {
  const [selectedItem, setSelectedItem] = useState<MenuItemResponse | null>(null);
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-card rounded-xl shadow-medium overflow-hidden hover:shadow-strong transition cursor-pointer flex flex-col h-full" onClick={() => setSelectedItem(item)}>
            <div className="w-full h-48 bg-gradient-warm flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-16 h-16 text-white opacity-60" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                  <div className="flex gap-2">
                    {item.vegetarian ? (
                      <span className="bg-success/20 text-success text-xs px-2 py-1 rounded font-medium">Veg</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-medium">Non-Veg</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      item.available ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{item.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-primary">₹{item.price.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">{item.preparationTime} mins</span>
                </div>
                {/* Ratings Display */}
                <div className="text-xs border-t border-gray-100 pt-2">
                  {(item.menuItemAverageRating && item.menuItemAverageRating > 0) ? (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Food Rating:</span>
                      <div className="flex items-center gap-1 text-orange-600">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-semibold">{item.menuItemAverageRating.toFixed(1)}</span>
                        <span className="text-gray-500">({item.menuItemTotalRatings} reviews)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic">
                      Awaiting customer feedback
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAvailability(item.id);
                  }}
                  className="flex-1 h-9 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 font-semibold"
                >
                  Toggle
                </Button>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="h-9 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{selectedItem.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <Badge className={selectedItem.vegetarian ? 'bg-green-500' : 'bg-red-500'}>
                      {selectedItem.vegetarian ? '🌱 Veg' : '🥩 Non-Veg'}
                    </Badge>
                    <Badge variant="outline">{selectedItem.category?.replace('_', ' ') || 'Category'}</Badge>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Full Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-2xl font-bold text-orange-600">₹{selectedItem.price.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Preparation Time</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedItem.preparationTime} min</p>
                </div>
              </div>

              {/* Food Rating */}
              {selectedItem.menuItemAverageRating !== undefined && selectedItem.menuItemAverageRating > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Food Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span className="font-semibold">{selectedItem.menuItemAverageRating.toFixed(1)}</span>
                    <span className="text-gray-600">({selectedItem.menuItemTotalRatings} ratings)</span>
                  </div>
                </div>
              )}

              {/* Availability Status */}
              <div className="p-4 rounded-lg border-2" style={{
                borderColor: selectedItem.available ? '#10b981' : '#ef4444',
                backgroundColor: selectedItem.available ? '#ecfdf5' : '#fef2f2'
              }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: selectedItem.available ? '#10b981' : '#ef4444' }} />
                  <span className="font-semibold" style={{ color: selectedItem.available ? '#10b981' : '#ef4444' }}>
                    {selectedItem.available ? 'Available' : 'Currently Unavailable'}
                  </span>
                </div>
              </div>

              {/* Toggle Availability Button */}
              <Button 
                onClick={() => {
                  onToggleAvailability(selectedItem.id);
                  setSelectedItem(null);
                }}
                size="lg"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Toggle Availability
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
