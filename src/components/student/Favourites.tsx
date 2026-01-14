import { useState, useEffect } from 'react';
import { favouriteApi, Favourite } from '@/services/favouriteApi';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Package, Clock, User, ShoppingCart, Loader2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MenuItemResponse } from '@/services/chefApi';

interface FavouritesProps {
  onAddToCart: (item: MenuItemResponse) => void;
}

export const Favourites = ({ onAddToCart }: FavouritesProps) => {
  const { toast } = useToast();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      setLoading(true);
      const response = await favouriteApi.getMyFavourites();
      if (response.success && response.data) {
        setFavourites(response.data);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load favourites',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (menuItemId: number) => {
    try {
      setRemovingId(menuItemId);
      await favouriteApi.removeFavourite(menuItemId);
      setFavourites(favourites.filter(fav => fav.menuItem.id !== menuItemId));
      toast({
        title: 'Removed',
        description: 'Item removed from favourites',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to remove favourite',
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (item: MenuItemResponse) => {
    onAddToCart(item);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favourites Yet</h3>
          <p className="text-gray-500">Start adding your favorite menu items!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Favourites</h2>
        <Badge variant="secondary" className="text-sm">
          {favourites.length} {favourites.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {favourites.map((favourite) => {
          const item = favourite.menuItem;
          return (
            <Card key={favourite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-56 bg-gray-200 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {item.vegetarian ? (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    🌱 Veg
                  </Badge>
                ) : (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    🥩 Non-Veg
                  </Badge>
                )}
                <button
                  onClick={() => handleRemoveFavourite(item.id)}
                  disabled={removingId === item.id}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition disabled:opacity-50"
                  title="Remove from favourites"
                >
                  {removingId === item.id ? (
                    <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                  ) : (
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  )}
                </button>
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg">Unavailable</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-base line-clamp-1">{item.name}</h3>
                  <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                    {item.category.replace('_', ' ')}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <User className="w-3 h-3" />
                    <span className="line-clamp-1">Chef {item.chefName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{item.preparationTime} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xl font-bold text-orange-600">₹{item.price}</span>
                  {item.available && (
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-xs h-8 px-3"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
