import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingDisplay } from '@/components/ui/StarRating';
import { chefApi, MenuItemResponse } from '@/services/chefApi';
import { ratingApi, MenuItemRatingStats } from '@/services/ratingApi';
import { ChefHat, UtensilsCrossed, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface RatingResponse {
  id: number;
  rating: number;
  comment?: string;
  studentName: string;
  createdAt: string;
}

interface ChefRatingStats {
  chefId: number;
  chefName: string;
  averageRating: number;
  totalRatings: number;
  ratings: RatingResponse[];
}

export const ChefRatingsDisplay: React.FC = () => {
  const { token } = useAuth();
  const [chefRatingStats, setChefRatingStats] = useState<ChefRatingStats | null>(null);
  const [menuItemRatings, setMenuItemRatings] = useState<MenuItemRatingStats[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      setLoading(true);
      console.log('Fetching chef and menu item ratings...');
      
      // Load chef ratings
      const chefData = await chefApi.getMyRatings();
      console.log('Chef ratings loaded:', chefData);
      setChefRatingStats(chefData);
      
      // Load menu items
      const items = await chefApi.getMyMenuItems();
      console.log('Menu items loaded:', items);
      setMenuItems(items);
      
      // Load ratings for each menu item
      const menuItemRatingsPromises = items.map(async (item) => {
        try {
          console.log(`Fetching ratings for menu item ${item.id} (${item.name})...`);
          const ratings = await ratingApi.getMenuItemRatings(item.id, token!);
          console.log(`Ratings for ${item.name}:`, ratings);
          return ratings;
        } catch (error) {
          console.error(`Failed to load ratings for menu item ${item.id}:`, error);
          return null;
        }
      });
      
      const menuItemRatingsData = await Promise.all(menuItemRatingsPromises);
      const validRatings = menuItemRatingsData.filter(r => r !== null) as MenuItemRatingStats[];
      console.log('Valid menu item ratings:', validRatings);
      setMenuItemRatings(validRatings);
      
    } catch (error: any) {
      console.error('Failed to load ratings - Full error:', error);
      toast({
        variant: "destructive",
        title: "Error Loading Ratings",
        description: error.message || "Failed to load ratings. Please check console for details."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading ratings...</p>
        </CardContent>
      </Card>
    );
  }

  if (!chefRatingStats) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No rating data available</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Chef Ratings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            My Chef Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Overall Rating Summary */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <RatingDisplay 
              rating={chefRatingStats.averageRating} 
              totalRatings={chefRatingStats.totalRatings}
              size="lg"
            />
          </div>
          
          {/* Individual Reviews */}
          {chefRatingStats.ratings.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-700">Recent Reviews</h4>
              {chefRatingStats.ratings.map((rating) => (
                <div key={rating.id} className="border-l-4 border-orange-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <RatingDisplay rating={rating.rating} size="sm" />
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{rating.studentName}</p>
                  {rating.comment && (
                    <div className="flex items-start gap-1 mt-1">
                      <MessageSquare className="w-3 h-3 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700 italic">"{rating.comment}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No chef reviews yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Keep cooking great food and students will start rating you!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Item Ratings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-green-600" />
            My Menu Item Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No menu items created yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Create menu items first to receive ratings!
              </p>
            </div>
          ) : menuItemRatings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No menu item ratings yet</p>
              <p className="text-sm text-gray-500 mt-2">
                You have {menuItems.length} menu item(s), but students haven't rated them yet!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {menuItemRatings.map((item) => (
                <div key={item.menuItemId} className="border rounded-lg p-4 bg-green-50">
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">{item.menuItemName}</h4>
                    <RatingDisplay 
                      rating={item.averageRating} 
                      totalRatings={item.totalRatings}
                      size="md"
                    />
                  </div>
                  
                  {/* Individual Reviews for this Menu Item */}
                  {item.ratings && item.ratings.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <h5 className="font-semibold text-sm text-gray-700">Recent Reviews</h5>
                      {item.ratings.slice(0, 5).map((rating) => (
                        <div key={rating.id} className="border-l-4 border-green-200 pl-3 py-2 bg-white rounded-r">
                          <div className="flex items-center justify-between mb-1">
                            <RatingDisplay rating={rating.rating} size="sm" />
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(rating.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{rating.studentName}</p>
                          {rating.comment && (
                            <div className="flex items-start gap-1 mt-1">
                              <MessageSquare className="w-3 h-3 text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-700 italic">"{rating.comment}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {item.ratings.length > 5 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          Showing 5 of {item.ratings.length} reviews
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
