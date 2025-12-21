import { useState, useEffect } from 'react';
import { aiApi } from '@/services/aiApi';
import { MenuItemResponse } from '@/services/chefApi';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle, RotateCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AiRecommendationBannerProps {
  onAddToCart: (item: MenuItemResponse) => void;
}

export const AiRecommendationBanner = ({ onAddToCart }: AiRecommendationBannerProps) => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<{
    items: MenuItemResponse[];
    explanation: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  // Auto-fetch recommendations on component mount
  useEffect(() => {
    handleGetRecommendation();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (!recommendations || recommendations.items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const totalSlides = Math.min(recommendations.items.length, 3);
        return (prev + 1) % totalSlides;
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [recommendations]);

  const handleGetRecommendation = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await aiApi.getMealRecommendations({
        vegetarian: false,
        maxBudget: 500
      });

      if (result.success && result.items && result.items.length > 0) {
        // Convert all items to MenuItemResponse
        const cartItems: MenuItemResponse[] = result.items.slice(0, 5).map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          vegetarian: item.vegetarian,
          category: item.category,
          description: '',
          available: true,
          chefId: 0,
          chefName: item.chefName,
          imageUrl: item.imageUrl,
          preparationTime: 30
        }));
        setRecommendations({
          items: cartItems,
          explanation: result.explanation || 'AI recommended these delicious dishes for you!'
        });
      } else {
        setError(result.error || 'Failed to get recommendation');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch recommendation'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl">
      {/* Blurred Background with Menu Card - Always show */}
      <div
        className="absolute inset-0 blur-3xl opacity-50"
        style={{
          backgroundImage: recommendations?.items[0]?.imageUrl
            ? `url(${recommendations.items[0].imageUrl})`
            : 'linear-gradient(135deg, #ff8c42 0%, #ff6b6b 50%, #ffa500 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-5" />

      {/* Content Overlay */}
      <div className="relative z-10 bg-gradient-to-r from-orange-600/80 to-orange-700/80 backdrop-blur-lg p-8 rounded-xl">
        {loading && !recommendations ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">AI Food Recommendations</h3>
                <p className="text-orange-100 text-sm">Loading personalized meal suggestions...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Error</p>
              <p className="text-orange-100 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Title and Refresh Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">✨ AI Recommendations</p>
                <h3 className="text-2xl font-bold text-white">{recommendations.explanation}</h3>
              </div>
              <button
                onClick={handleGetRecommendation}
                disabled={loading}
                className="text-white hover:text-orange-100 transition flex-shrink-0"
                title="Refresh recommendations"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <RotateCw className="w-6 h-6" />
                )}
              </button>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Carousel Wrapper */}
              <div className="overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`
                  }}
                >
                  {recommendations.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex-shrink-0 relative"
                    >
                      {/* Blurred Background Image */}
                      <div
                        className="absolute inset-0 blur-sm opacity-60"
                        style={{
                          backgroundImage: item.imageUrl
                            ? `url(${item.imageUrl})`
                            : 'linear-gradient(135deg, #ff8c42 0%, #ff6b6b 50%, #ffa500 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black/40" />

                      {/* Card Content */}
                      <div className="relative z-10 p-4 flex items-center gap-4 min-h-56">
                        {/* Left: Item Image */}
                        <div className="flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden shadow-2xl">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                              <span className="text-white text-6xl">🍽️</span>
                            </div>
                          )}
                        </div>

                        {/* Right: Item Details */}
                        <div className="flex-1">
                          <p className="text-orange-200 text-xs mb-0.5 uppercase tracking-wide">Featured</p>
                          <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">{item.name}</h2>
                          <p className="text-orange-100 text-xs mb-2">Chef: <span className="font-semibold">{item.chefName}</span></p>
                          {item.description && (
                            <p className="text-orange-100 text-xs mb-4 line-clamp-3">{item.description}</p>
                          )}

                          {/* Add Button */}
                          <Button
                            onClick={() => {
                              onAddToCart(item);
                              toast({
                                title: 'Added to cart',
                                description: `${item.name} added to cart!`
                              });
                            }}
                            className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm px-4 py-1"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
