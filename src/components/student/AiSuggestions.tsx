import { useState } from 'react';
import { aiApi, MenuCombination, MenuItem } from '@/services/aiApi';
import { MenuItemResponse } from '@/services/chefApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Helper function to format explanation as bullet points
const formatExplanation = (text: string): string[] => {
  if (!text) return [];
  
  // Remove JSON-like content
  let cleanText = text
    .replace(/```json[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\{[\s\S]*?\}/g, '') // Remove JSON objects
    .replace(/\[[\s\S]*?\]/g, '') // Remove JSON arrays
    .trim();
  
  // Split by newlines first to preserve paragraph structure
  const paragraphs = cleanText.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  
  // For each paragraph, split by bullet points or dashes if it contains multiple items
  const bullets: string[] = [];
  paragraphs.forEach(para => {
    if (para.includes('•') || para.includes('-') || para.includes('*')) {
      const items = para.split(/[•\-\*]/).map(item => item.trim()).filter(item => item.length > 0);
      bullets.push(...items);
    } else {
      bullets.push(para);
    }
  });
  
  return bullets.length > 0 ? bullets : [cleanText];
};

interface AiSuggestionsProps {
  onAddToCart: (item: MenuItemResponse) => void;
}

export const AiSuggestions = ({ onAddToCart }: AiSuggestionsProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'combinations' | 'recommendations'>('combinations');
  const [combinations, setCombinations] = useState<MenuItem[]>([]);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleGetCombinations = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await aiApi.getSuggestedCombinations(3);
      if (result.success && result.explanation) {
        // Result now has explanation and items
        setExplanation(result.explanation);
        setCombinations(result.items || []); // Set actual menu items
        setActiveTab('combinations');
        setOpen(true);
      } else {
        setError(result.error || result.message || 'Failed to get combinations');
      }
    } catch (error) {
      setError('Error fetching combinations');
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch AI suggestions'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError('');
    setExplanation(''); // Clear previous explanation
    try {
      console.log('Fetching recommendations...');
      const result = await aiApi.getMealRecommendations({
        vegetarian: false,
        maxBudget: 500
      });
      console.log('Recommendations result:', result);
      
      if (result.success && result.explanation) {
        // Result now has explanation and items
        console.log('Setting explanation:', result.explanation);
        console.log('Setting items:', result.items);
        setExplanation(result.explanation);
        setCombinations(result.items || []); // Set actual menu items
        setActiveTab('recommendations');
        setOpen(true);
        toast({
          title: 'Success',
          description: 'Recommendations loaded!'
        });
      } else {
        const errorMsg = result.error || result.message || 'Failed to get recommendations';
        console.error('Error:', errorMsg);
        setError(errorMsg);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Exception:', errorMsg);
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch recommendations'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="transition-all duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50"
        title="AI Suggestions"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-medium hidden md:inline">AI Suggestions</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              AI Menu Suggestions
            </DialogTitle>
            <DialogDescription>
              Get personalized menu suggestions powered by AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b">
              <button
                onClick={handleGetCombinations}
                disabled={loading}
                className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
                  activeTab === 'combinations'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Get Combinations
              </button>
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
                  activeTab === 'recommendations'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Get Recommendations
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-600">Getting AI suggestions...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Suggestions Display */}
            {!loading && explanation && explanation.trim().length > 0 && (
              <div className="space-y-4">
                {/* Explanation */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="mb-3">
                    <p className="font-semibold text-orange-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      AI Recommendation
                    </p>
                  </div>
                  {formatExplanation(explanation).length > 0 ? (
                    <ul className="space-y-2">
                      {formatExplanation(explanation).map((bullet, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500 font-bold mt-0.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700">{explanation}</p>
                  )}
                </div>

                {/* Suggestions List - Menu Order Style */}
                <div className="space-y-3">
                  {combinations.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {/* Menu Item Card */}
                      <div className="flex-1 p-4 border border-orange-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-orange-50 to-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-500">{item.vegetarian ? '🌱 Veg' : '🥩 Non-Veg'}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">Chef: {item.chefName} ⭐ {item.chefAverageRating}</p>
                            <p className="text-lg font-bold text-orange-600">₹{Math.round(item.price)}</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap flex-shrink-0"
                            onClick={() => {
                              // Convert MenuItem to MenuItemResponse for adding to cart
                              const cartItem: MenuItemResponse = {
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                vegetarian: item.vegetarian,
                                category: item.category,
                                description: '',
                                available: true,
                                chefId: 0,
                                chefName: item.chefName,
                                imageUrl: undefined,
                                preparationTime: 30
                              };
                              onAddToCart(cartItem);
                              toast({
                                title: 'Added to cart',
                                description: `${item.name} added to cart!`
                              });
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && combinations.length === 0 && (!explanation || explanation.trim().length === 0) && !error && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {activeTab === 'combinations'
                    ? 'Click "Get Combinations" to see AI-suggested menu combinations'
                    : 'Click "Get Recommendations" to see personalized meal recommendations'}
                </p>
                <Button
                  onClick={activeTab === 'combinations' ? handleGetCombinations : handleGetRecommendations}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {activeTab === 'combinations' ? 'Get Combinations' : 'Get Recommendations'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
