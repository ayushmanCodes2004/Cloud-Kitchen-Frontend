import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Navigation, Info, Star, UtensilsCrossed, Loader2, ChefHat, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Map, Marker } from 'pigeon-maps';
import { chefLocationApi, ChefLocationDTO } from '../../services/chefLocationApi';
import './NearbyChefs.css';

interface Chef {
  id: number;
  name: string;
  cuisine: string;
  specialty: string;
  rating: number;
  distance: string;
  imageUrl: string;
  position: { lat: number; lng: number };
}

// Component to handle map zoom controls
interface ChefMarkerProps {
  chef: Chef;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ChefMarker = ({ chef, isSelected, onClick, onMouseEnter, onMouseLeave }: ChefMarkerProps) => {
  return (
    <div
      className={`flex flex-col items-center cursor-pointer transition-transform ${
        isSelected ? 'scale-110' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onMouseEnter();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        onMouseLeave();
      }}
      style={{ 
        pointerEvents: 'auto',
        position: 'absolute',
        transform: 'translate(-50%, -100%)', // Center the marker and position above the point
        zIndex: isSelected ? 1000 : 999
      }}
    >
      <div className="bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
        <ChefHat className="w-5 h-5" />
      </div>
    </div>
  );
};

export const NearbyChefs = () => {
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default Delhi coordinates
  const [nearbyChefs, setNearbyChefs] = useState<Chef[]>([]); // Chefs within 5km for sidebar
  const [allChefs, setAllChefs] = useState<Chef[]>([]); // All chefs for map
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]); // Filtered chefs for sidebar
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null); // Selected cuisine filter
  const [showCuisineFilter, setShowCuisineFilter] = useState(false); // Show cuisine filter modal
  const [cityName, setCityName] = useState<string>(''); // Current city name
  const [loadingCity, setLoadingCity] = useState(false); // Loading state for city name

  // Reverse geocode to get city name from coordinates
  const getCityName = async (lat: number, lng: number) => {
    setLoadingCity(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch city name');
      }

      const data = await response.json();
      
      // Extract city name from response (try multiple fields)
      const city = data.address?.city || 
                   data.address?.town || 
                   data.address?.village || 
                   data.address?.state_district ||
                   data.address?.state ||
                   'Unknown Location';
      
      setCityName(city);
    } catch (error) {
      console.error('Error fetching city name:', error);
      setCityName('Location');
    } finally {
      setLoadingCity(false);
    }
  };

  // Get user's current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Showing default area.');
          // Use default location (Delhi)
          fetchChefs(28.6139, 77.2090);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      fetchChefs(28.6139, 77.2090);
    }
  }, []);

  // Fetch nearby chefs when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchChefs(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // Filter chefs based on search query and cuisine filter
  useEffect(() => {
    let filtered = nearbyChefs;

    // Apply cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter(chef => chef.cuisine === selectedCuisine);
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(chef => 
        chef.name.toLowerCase().includes(query) ||
        chef.cuisine.toLowerCase().includes(query) ||
        chef.specialty.toLowerCase().includes(query)
      );
    }

    setFilteredChefs(filtered);
  }, [searchQuery, nearbyChefs, selectedCuisine]);

  // Get unique cuisines from nearby chefs
  const uniqueCuisines = Array.from(new Set(nearbyChefs.map(chef => chef.cuisine))).sort();

  const fetchChefs = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch nearby chefs (within 5km) for sidebar
      const nearbyResponse = await chefLocationApi.getNearbyChefs({
        latitude: lat,
        longitude: lng,
        radiusKm: 5, // Fixed 5km radius
      });

      // Fetch all chefs for map
      const allResponse = await chefLocationApi.getAllChefsWithLocation();

      if (nearbyResponse.success && nearbyResponse.data) {
        const mappedNearby: Chef[] = nearbyResponse.data.map((chef: ChefLocationDTO) => ({
          id: chef.id,
          name: chef.name,
          cuisine: chef.specialization || 'Multi-Cuisine',
          specialty: `${chef.experienceYears} years experience`,
          rating: chef.rating,
          distance: `${chef.distance.toFixed(1)} km away`,
          imageUrl: `https://images.unsplash.com/photo-${1577219491135 + chef.id}?w=400`,
          position: { lat: chef.latitude, lng: chef.longitude },
        }));
        setNearbyChefs(mappedNearby);
        setFilteredChefs(mappedNearby);
      }

      if (allResponse.success && allResponse.data) {
        const mappedAll: Chef[] = allResponse.data.map((chef: ChefLocationDTO) => ({
          id: chef.id,
          name: chef.name,
          cuisine: chef.specialization || 'Multi-Cuisine',
          specialty: `${chef.experienceYears} years experience`,
          rating: chef.rating,
          distance: chef.distance ? `${chef.distance.toFixed(1)} km away` : 'N/A',
          imageUrl: `https://images.unsplash.com/photo-${1577219491135 + chef.id}?w=400`,
          position: { lat: chef.latitude, lng: chef.longitude },
        }));
        setAllChefs(mappedAll);
      }

      if (!nearbyResponse.success) {
        setError(nearbyResponse.message || 'Failed to fetch nearby chefs');
      }
    } catch (err) {
      setError('An error occurred while fetching chefs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setCenter([latitude, longitude]);
          fetchChefs(latitude, longitude);
          getCityName(latitude, longitude); // Fetch city name
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location');
          setLoading(false);
        }
      );
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 10));
  };

  return (
    <div className="flex h-[calc(100vh-128px)] overflow-hidden">
      {/* Sidebar with Chef List */}
      <aside className="w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-col mb-6">
            <h1 className="text-2xl font-bold mb-1">Nearby Chefs</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {loading ? 'Finding chefs near you...' : error ? error : `Found ${filteredChefs.length} chefs within 5km`}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading nearby chefs...</p>
            </div>
          ) : filteredChefs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                {searchQuery ? 'No chefs match your search.' : 'No chefs found in your area.'}<br />
                {searchQuery ? 'Try a different search term.' : 'Try adjusting your location.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredChefs.map((chef) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chef.id * 0.1 }}
                className="flex flex-col gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => setSelectedChef(chef)}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold">{chef.name}</p>
                      <div className="flex items-center gap-1 text-primary">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold">{chef.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {chef.cuisine} • {chef.specialty}
                    </p>
                    <p className="text-primary text-xs font-medium mt-1">
                      {chef.distance}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Add navigation to chef's menu page
                    console.log('View menu for chef:', chef.name);
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-primary/10 text-primary text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all"
                >
                  View Menu
                </button>
              </motion.div>
            ))}
          </div>
          )}
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          {selectedCuisine && (
            <div className="mb-3 flex items-center justify-between bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm">
              <span className="font-medium">Filtered: {selectedCuisine}</span>
              <button
                onClick={() => setSelectedCuisine(null)}
                className="hover:bg-primary/20 rounded p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowCuisineFilter(true)}
            className="w-full py-3 px-4 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <UtensilsCrossed className="w-5 h-5" />
            Filter by Cuisine
          </button>
        </div>

        {/* Cuisine Filter Modal */}
        {showCuisineFilter && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Filter by Cuisine</h2>
                <button
                  onClick={() => setShowCuisineFilter(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCuisine(null);
                      setShowCuisineFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      !selectedCuisine
                        ? 'bg-primary text-white font-bold'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    All Cuisines ({nearbyChefs.length})
                  </button>
                  {uniqueCuisines.map((cuisine) => {
                    const count = nearbyChefs.filter(chef => chef.cuisine === cuisine).length;
                    return (
                      <button
                        key={cuisine}
                        onClick={() => {
                          setSelectedCuisine(cuisine);
                          setShowCuisineFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedCuisine === cuisine
                            ? 'bg-primary text-white font-bold'
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{cuisine}</span>
                          <span className="text-sm opacity-75">({count})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </aside>

      {/* Map Section */}
      <section className="flex-1 relative">
        {/* Pigeon Maps */}
        <div className="absolute inset-0">
          <Map
            center={center}
            zoom={zoom}
            onBoundsChanged={({ zoom: newZoom }) => setZoom(newZoom)}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                anchor={[userLocation.lat, userLocation.lng]}
              >
                <div
                  className="flex flex-col items-center"
                  style={{ 
                    pointerEvents: 'auto',
                    position: 'absolute',
                    transform: 'translate(-50%, -100%)',
                    zIndex: 1001
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-blue-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Marker>
            )}

            {/* Chef Markers - Show ALL chefs on map */}
            {allChefs.map((chef) => (
              <Marker
                key={chef.id}
                anchor={[chef.position.lat, chef.position.lng]}
                payload={chef}
              >
                <ChefMarker
                  chef={chef}
                  isSelected={selectedChef?.id === chef.id}
                  onClick={() => setSelectedChef(chef)}
                  onMouseEnter={() => setSelectedChef(chef)}
                  onMouseLeave={() => setSelectedChef(null)}
                />
              </Marker>
            ))}
          </Map>
        </div>

        {/* Search Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-center pointer-events-none z-[40]">
          <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-2 flex items-center pointer-events-auto border border-slate-200 dark:border-slate-700">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                className="w-full py-2 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
                placeholder="Search for cloud kitchens, chefs, or cuisines..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button 
              onClick={handleUseMyLocation}
              disabled={loading || loadingCity}
              className="px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || loadingCity ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {cityName ? cityName : 'Use my location'}
              </span>
            </button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-[1000]">
          <div className="flex flex-col rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={handleZoomIn}
              className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Card */}
        {selectedChef && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-8 w-80 pointer-events-none z-[1000]"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 border-l-4 border-primary pointer-events-auto">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    Currently Viewing
                  </p>
                  <h3 className="text-slate-900 dark:text-slate-100 font-bold">
                    {selectedChef.name}'s Area
                  </h3>
                </div>
                <Info className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {selectedChef.name} is famous for {selectedChef.specialty.toLowerCase()}. 
                Order within 15 minutes for express delivery.
              </p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};
