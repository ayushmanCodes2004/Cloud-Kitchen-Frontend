import { useState, useEffect } from 'react';
import { favouriteApi, Favourite } from '@/services/favouriteApi';
import { customMealApi, CustomMealResponse } from '@/services/customMealApi';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Package, Clock, User, ShoppingCart, Loader2, Trash2, Sparkles, Star, BookMarked } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItemResponse } from '@/services/chefApi';

interface FavouritesProps {
  onAddToCart: (item: MenuItemResponse) => void;
  onAddMealToCart?: (meal: CustomMealResponse) => void;
}

export const Favourites = ({ onAddToCart, onAddMealToCart }: FavouritesProps) => {
  const { toast } = useToast();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [savedMeals, setSavedMeals] = useState<CustomMealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [deletingMealId, setDeletingMealId] = useState<number | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<CustomMealResponse | null>(null);

  useEffect(() => {
    loadFavourites();
    loadSavedMeals();
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

  const loadSavedMeals = async () => {
    try {
      setMealsLoading(true);
      const data = await customMealApi.getMyCustomMeals();
      setSavedMeals(data);
    } catch (error: any) {
      console.error('Failed to load saved meals:', error);
    } finally {
      setMealsLoading(false);
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

  const handleDeleteMeal = async (mealId: number) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;

    try {
      setDeletingMealId(mealId);
      await customMealApi.deleteCustomMeal(mealId);
      setSavedMeals(savedMeals.filter(meal => meal.id !== mealId));
      toast({
        title: 'Meal deleted',
        description: 'Your saved meal has been deleted successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete meal. Please try again.',
      });
    } finally {
      setDeletingMealId(null);
    }
  };

  const handleAddMealToCart = (meal: CustomMealResponse) => {
    if (onAddMealToCart) {
      onAddMealToCart(meal);
    }
    toast({
      title: 'Added to cart',
      description: `${meal.name} has been added to your cart!`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Favourites</h2>
      </div>

      <Tabs defaultValue="liked" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="liked" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
          >
            <Heart className="w-4 h-4 mr-2" />
            Liked Meals
            {favourites.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {favourites.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 rounded-md"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Saved Meals
            {savedMeals.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {savedMeals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Liked Meals Tab */}
        <TabsContent value="liked" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : favourites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Liked Meals Yet</h3>
                <p className="text-gray-500">Start adding your favorite menu items!</p>
              </CardContent>
            </Card>
          ) : (
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
          )}
        </TabsContent>

        {/* Saved Meals Tab */}
        <TabsContent value="saved" className="mt-6">
          {mealsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : savedMeals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Meals Yet</h3>
                <p className="text-gray-500 mb-4">Create your first AI-powered meal and save it for quick ordering!</p>
                <Button
                  onClick={() => window.location.href = '/student/ai-meal-builder'}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create AI Meal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {savedMeals.map((meal) => (
                <Card key={meal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base mb-2 line-clamp-1">{meal.name}</h3>
                        {meal.aiGenerated && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      {meal.nutritionalScore && (
                        <Badge variant="outline" className="ml-2 shrink-0">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {meal.nutritionalScore}/10
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meal.description}</p>

                    {meal.aiPrompt && (
                      <div className="bg-orange-50 border-l-2 border-orange-500 p-2 mb-3 rounded">
                        <p className="text-xs text-gray-600 italic line-clamp-2">
                          💡 {meal.aiPrompt}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Items ({meal.items.length}):
                      </p>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {meal.items.slice(0, 2).map((item) => (
                          <li key={item.id}>• {item.menuItemName} × {item.quantity}</li>
                        ))}
                        {meal.items.length > 2 && (
                          <li className="text-orange-600 font-medium">
                            +{meal.items.length - 2} more items
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Ordered {meal.timesOrdered} times
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        ₹{meal.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddMealToCart(meal)}
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-xs h-8"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => setSelectedMeal(meal)}
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs h-8"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleDeleteMeal(meal.id)}
                        disabled={deletingMealId === meal.id}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        {deletingMealId === meal.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Meal Details Modal */}
      {selectedMeal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMeal(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedMeal.name}</h2>
                <Button
                  onClick={() => setSelectedMeal(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <p className="text-gray-600 mb-4">{selectedMeal.description}</p>

              {selectedMeal.aiPrompt && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4 rounded">
                  <p className="font-semibold text-sm mb-1">💡 AI Prompt:</p>
                  <p className="text-sm text-gray-700 italic">{selectedMeal.aiPrompt}</p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-3">🍽️ Meal Items:</h3>
                <div className="space-y-3">
                  {selectedMeal.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menuItemName}</h4>
                        {item.aiReason && (
                          <p className="text-sm text-gray-600 italic mt-1">💡 {item.aiReason}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Chef: {item.chefName}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-600">× {item.quantity}</p>
                        <p className="font-bold text-orange-600">₹{item.menuItemPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-500 text-white p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold">₹{selectedMeal.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  handleAddMealToCart(selectedMeal);
                  setSelectedMeal(null);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
