import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingDisplay } from '@/components/ui/StarRating';
import { chefApi, MenuItemResponse } from '@/services/chefApi';
import { ratingApi, MenuItemRatingStats } from '@/services/ratingApi';
import { ChefHat, UtensilsCrossed, MessageSquare, Calendar, TrendingUp, Award, Star, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // Calculate rating statistics
  const getRatingStatistics = () => {
    if (!chefRatingStats) return null;

    // Star distribution for chef ratings
    const starDistribution = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: chefRatingStats.ratings.filter(r => Math.floor(r.rating) === stars).length,
      percentage: chefRatingStats.totalRatings > 0
        ? ((chefRatingStats.ratings.filter(r => Math.floor(r.rating) === stars).length / chefRatingStats.totalRatings) * 100).toFixed(1)
        : '0'
    }));

    // Recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = chefRatingStats.ratings.filter(r => {
      const ratingDate = new Date(r.createdAt);
      const daysDiff = Math.floor((now.getTime() - ratingDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });
    const previous7Days = chefRatingStats.ratings.filter(r => {
      const ratingDate = new Date(r.createdAt);
      const daysDiff = Math.floor((now.getTime() - ratingDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7 && daysDiff <= 14;
    });

    const recentAvg = last7Days.length > 0
      ? (last7Days.reduce((sum, r) => sum + r.rating, 0) / last7Days.length)
      : 0;
    const previousAvg = previous7Days.length > 0
      ? (previous7Days.reduce((sum, r) => sum + r.rating, 0) / previous7Days.length)
      : 0;
    const trend = recentAvg - previousAvg;

    // Comments percentage
    const ratingsWithComments = chefRatingStats.ratings.filter(r => r.comment && r.comment.trim().length > 0).length;
    const commentsPercentage = chefRatingStats.totalRatings > 0
      ? ((ratingsWithComments / chefRatingStats.totalRatings) * 100).toFixed(1)
      : '0';

    return {
      starDistribution,
      recentAvg,
      previousAvg,
      trend,
      last7DaysCount: last7Days.length,
      commentsPercentage,
      ratingsWithComments
    };
  };

  const stats = getRatingStatistics();

  return (
    <div className="space-y-6">
      {/* Simple Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{chefRatingStats.averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-10 h-10 text-orange-500 fill-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{chefRatingStats.totalRatings}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">5-Star Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.starDistribution[0].count || 0}</p>
              </div>
              <Award className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chef Reviews */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {chefRatingStats.ratings.length > 0 ? (
            <div className="space-y-4">
              {chefRatingStats.ratings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <RatingDisplay rating={rating.rating} size="sm" />
                      <span className="text-sm font-medium text-gray-900">{rating.studentName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(rating.createdAt)}</span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 mt-2">"{rating.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Item Ratings */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">Menu Item Ratings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items yet</p>
            </div>
          ) : menuItemRatings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No ratings yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {menuItemRatings.map((item) => (
                <div key={item.menuItemId} className="pb-6 border-b last:border-b-0 last:pb-0">
                  <div className="mb-3">
                    <h4 className="font-semibold text-base mb-2">{item.menuItemName}</h4>
                    <RatingDisplay 
                      rating={item.averageRating} 
                      totalRatings={item.totalRatings}
                      size="sm"
                    />
                  </div>
                  
                  {item.ratings && item.ratings.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {item.ratings.slice(0, 3).map((rating) => (
                        <div key={rating.id} className="pl-4 border-l-2 border-gray-200">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <RatingDisplay rating={rating.rating} size="sm" />
                              <span className="text-sm text-gray-900">{rating.studentName}</span>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(rating.createdAt)}</span>
                          </div>
                          {rating.comment && (
                            <p className="text-sm text-gray-600 mt-1">"{rating.comment}"</p>
                          )}
                        </div>
                      ))}
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
