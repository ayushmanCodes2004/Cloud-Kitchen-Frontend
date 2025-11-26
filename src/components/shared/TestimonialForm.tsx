import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, Trash2, Edit2, RefreshCw } from 'lucide-react';
import { testimonialApi, TestimonialResponse } from '@/services/testimonialApi';
import { useToast } from '@/components/ui/use-toast';

export const TestimonialForm = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [existingTestimonial, setExistingTestimonial] = useState<TestimonialResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMyTestimonial();
  }, []);

  const loadMyTestimonial = async () => {
    try {
      const testimonial = await testimonialApi.getMyTestimonial();
      if (testimonial) {
        setExistingTestimonial(testimonial);
        setContent(testimonial.content);
        setRating(testimonial.rating);
      }
    } catch (error) {
      console.error('Failed to load testimonial:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please write your testimonial"
      });
      return;
    }

    if (content.length < 20) {
      toast({
        variant: "destructive",
        title: "Too Short",
        description: "Please write at least 20 characters"
      });
      return;
    }

    setLoading(true);

    try {
      if (existingTestimonial) {
        // Update existing
        const updated = await testimonialApi.updateTestimonial(existingTestimonial.id, {
          content,
          rating
        });
        setExistingTestimonial(updated);
        setIsEditing(false);
        toast({
          title: "✅ Updated",
          description: "Your testimonial has been updated successfully"
        });
      } else {
        // Create new
        const newTestimonial = await testimonialApi.submitTestimonial({
          content,
          rating
        });
        setExistingTestimonial(newTestimonial);
        toast({
          title: "✅ Submitted",
          description: "Your testimonial has been submitted for approval"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit testimonial. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingTestimonial) return;

    if (!confirm('Are you sure you want to delete your testimonial?')) return;

    setLoading(true);

    try {
      await testimonialApi.deleteTestimonial(existingTestimonial.id);
      setExistingTestimonial(null);
      setContent('');
      setRating(5);
      toast({
        title: "Deleted",
        description: "Your testimonial has been deleted"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete testimonial"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (existingTestimonial) {
      setContent(existingTestimonial.content);
      setRating(existingTestimonial.rating);
      setIsEditing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          Share Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        {existingTestimonial && !isEditing ? (
          // Display existing testimonial
          <div className="space-y-4">
            {/* Success Message when Approved */}
            {existingTestimonial.approved ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">🎉 Testimonial Approved!</h3>
                    <p className="text-green-700 text-sm">Your testimonial is now live on the landing page. Thank you for sharing your experience!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 text-base">Awaiting Approval</h3>
                      <p className="text-amber-700 text-sm">Your testimonial is being reviewed by our admin team.</p>
                    </div>
                  </div>
                  <button
                    onClick={loadMyTestimonial}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm"
                    title="Check approval status"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < existingTestimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 italic">"{existingTestimonial.content}"</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  existingTestimonial.approved 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {existingTestimonial.approved ? '✓ Approved' : '⏳ Pending Approval'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(existingTestimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          // Show form (create new or edit)
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({rating} {rating === 1 ? 'star' : 'stars'})
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Testimonial
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with PlatePal... (minimum 20 characters)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/500 characters
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Submitting...' : existingTestimonial ? 'Update' : 'Submit'} Testimonial
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 italic">
              💡 Your testimonial will be reviewed by our team before appearing on the landing page
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
