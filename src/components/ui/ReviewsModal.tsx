import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, User, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ratingApi, MenuItemRatingStats } from '@/services/ratingApi';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItemId: number;
  menuItemName: string;
}

export const ReviewsModal = ({ isOpen, onClose, menuItemId, menuItemName }: ReviewsModalProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState<MenuItemRatingStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && menuItemId) {
      loadReviews();
    }
  }, [isOpen, menuItemId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await ratingApi.getMenuItemRatings(menuItemId, token || undefined);
      setRatingStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-orange-500 text-orange-500'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Reviews for {menuItemName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : ratingStats ? (
          <div className="space-y-6">
            {/* Overall Rating Summary */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600">
                    {ratingStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {renderStars(Math.round(ratingStats.averageRating))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Based on <span className="font-semibold">{ratingStats.totalRatings}</span> review{ratingStats.totalRatings !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Reviews</h3>
              
              {ratingStats.ratings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                <div className="space-y-4">
                  {ratingStats.ratings.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{review.studentName}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(review.createdAt)}
                            </div>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2 pl-10">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
