import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingDisplay } from './StarRating';
import { ratingApi, ChefRatingStats, MenuItemRatingStats } from '@/services/ratingApi';
import { ChefHat, UtensilsCrossed, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface RatingsDisplayProps {
  type: 'chef' | 'menuItem' | 'all';
  itemId?: number;
  token?: string;
}

export const RatingsDisplay: React.FC<RatingsDisplayProps> = ({ type, itemId, token }) => {
  const [chefRatings, setChefRatings] = useState<ChefRatingStats[]>([]);
  const [menuItemRatings, setMenuItemRatings] = useState<MenuItemRatingStats[]>([]);
  const [singleChefRating, setSingleChefRating] = useState<ChefRatingStats | null>(null);
  const [singleMenuItemRating, setSingleMenuItemRating] = useState<MenuItemRatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('RatingsDisplay mounted/updated', { type, itemId, hasToken: !!token });
    
    if (type === 'all' && !token) {
      console.error('Token is required for type="all"');
      setLoading(false);
      return;
    }
    
    loadRatings().catch(err => {
      console.error('loadRatings failed:', err);
      setLoading(false);
    });
  }, [type, itemId, token]);

  const loadRatings = async () => {
    try {
      console.log('loadRatings started');
      setLoading(true);
      
      if (type === 'all' && token) {
        console.log('Fetching all ratings with token');
        try {
          const data = await ratingApi.getAllRatings(token);
          console.log('Raw API response:', data);
          
          if (!data) {
            console.warn('No data received from API');
            setChefRatings([]);
            setMenuItemRatings([]);
            return;
          }
          
          const chefs = Array.isArray(data.chefRatings) ? data.chefRatings : [];
          const items = Array.isArray(data.menuItemRatings) ? data.menuItemRatings : [];
          
          console.log(`Setting ${chefs.length} chef ratings and ${items.length} menu item ratings`);
          setChefRatings(chefs);
          setMenuItemRatings(items);
        } catch (apiError: any) {
          console.error('API call failed:', apiError);
          throw apiError;
        }
      } else if (type === 'chef' && itemId) {
        console.log(`Loading chef ratings for chef ${itemId}...`);
        const data = await ratingApi.getChefRatings(itemId, token);
        console.log('Chef rating data:', data);
        setSingleChefRating(data || null);
      } else if (type === 'menuItem' && itemId) {
        console.log(`Loading menu item ratings for item ${itemId}...`);
        const data = await ratingApi.getMenuItemRatings(itemId, token);
        console.log('Menu item rating data:', data);
        setSingleMenuItemRating(data || null);
      }
    } catch (error: any) {
      console.error('loadRatings error:', error);
      console.error('Error stack:', error.stack);
      toast({
        variant: "destructive",
        title: "Error Loading Ratings",
        description: error.message || "Failed to load ratings. Check console for details."
      });
    } finally {
      console.log('loadRatings finished, setting loading to false');
      setLoading(false);
    }
  };

  // Handle missing token for 'all' type
  if (type === 'all' && !token) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-destructive">Authentication required to view ratings</p>
          <p className="text-sm text-muted-foreground mt-2">Please log in again</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading ratings...</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (type === 'chef' && singleChefRating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Chef Ratings - {singleChefRating.chefName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RatingDisplay 
              rating={singleChefRating.averageRating} 
              totalRatings={singleChefRating.totalRatings}
              size="lg"
            />
          </div>
          
          {singleChefRating.ratings.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Recent Reviews</h4>
              {singleChefRating.ratings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="border-l-4 border-orange-200 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <RatingDisplay rating={rating.rating} size="sm" />
                    <span className="text-xs text-gray-500">{formatDate(rating.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{rating.studentName}</p>
                  {rating.comment && (
                    <p className="text-sm text-gray-700 mt-1">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === 'menuItem' && singleMenuItemRating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
            Menu Item Ratings - {singleMenuItemRating.menuItemName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RatingDisplay 
              rating={singleMenuItemRating.averageRating} 
              totalRatings={singleMenuItemRating.totalRatings}
              size="lg"
            />
          </div>
          
          {singleMenuItemRating.ratings.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Recent Reviews</h4>
              {singleMenuItemRating.ratings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="border-l-4 border-orange-200 pl-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <RatingDisplay rating={rating.rating} size="sm" />
                    <span className="text-xs text-gray-500">{formatDate(rating.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{rating.studentName}</p>
                  {rating.comment && (
                    <p className="text-sm text-gray-700 mt-1">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === 'all') {
    try {
      return (
        <div className="space-y-6">
          {/* Chef Ratings with Detailed Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                Chef Ratings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chefRatings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No chef ratings yet</p>
              ) : (
                <div className="space-y-6">
                  {chefRatings.map((chef) => (
                    <div key={chef.chefId} className="border rounded-lg p-4 bg-gray-50">
                      <div className="mb-4">
                        <h4 className="font-semibold text-lg mb-2">{chef.chefName}</h4>
                        <RatingDisplay 
                          rating={chef.averageRating} 
                          totalRatings={chef.totalRatings}
                          size="md"
                        />
                    </div>
                    
                    {/* Individual Reviews for this Chef */}
                    {chef.ratings && chef.ratings.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <h5 className="font-semibold text-sm text-gray-700">Recent Reviews</h5>
                        {chef.ratings.slice(0, 5).map((rating) => (
                          <div key={rating.id} className="border-l-4 border-orange-200 pl-3 py-2 bg-white rounded-r">
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
                        {chef.ratings.length > 5 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            Showing 5 of {chef.ratings.length} reviews
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

        {/* Menu Item Ratings with Detailed Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-green-600" />
              Menu Item Ratings Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {menuItemRatings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No menu item ratings yet</p>
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
    } catch (error) {
      console.error('Error rendering ratings:', error);
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading ratings display</p>
            <p className="text-sm text-muted-foreground mt-2">Please refresh the page</p>
          </CardContent>
        </Card>
      );
    }
  }

  return null;
};
