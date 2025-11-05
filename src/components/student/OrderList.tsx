import { OrderResponse, OrderItemResponse } from '@/types/api.types';
import { ChefHat, Star } from 'lucide-react';
import { VegIcon, NonVegIcon } from '@/components/ui/NonVegIcon';
import { RatingModal } from '@/components/ui/RatingModal';
import { ratingApi } from '@/services/ratingApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

interface OrderListProps {
  orders: OrderResponse[];
}

export const OrderList = ({ orders }: OrderListProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  
  // Debug: Log orders to see what data we have
  console.log('Orders received in OrderList:', orders);
  const [chefRatingModal, setChefRatingModal] = useState<{
    isOpen: boolean;
    chefId: number;
    chefName: string;
    orderId: number;
  }>({ isOpen: false, chefId: 0, chefName: '', orderId: 0 });
  
  const [menuItemRatingModal, setMenuItemRatingModal] = useState<{
    isOpen: boolean;
    menuItemId: number;
    menuItemName: string;
    orderId: number;
  }>({ isOpen: false, menuItemId: 0, menuItemName: '', orderId: 0 });
  
  const [ratedChefOrders, setRatedChefOrders] = useState<Set<number>>(new Set());
  const [ratedMenuItems, setRatedMenuItems] = useState<Set<string>>(new Set()); // Format: "orderId-menuItemId"
  const [loadingRatings, setLoadingRatings] = useState(true);

  // Load rated orders and menu items from backend on mount
  useEffect(() => {
    const loadRatedData = async () => {
      try {
        const [ratedOrderIds, ratedMenuItemKeys] = await Promise.all([
          ratingApi.getMyRatedOrders(token!),
          ratingApi.getMyRatedMenuItems(token!)
        ]);
        
        setRatedChefOrders(new Set(ratedOrderIds));
        setRatedMenuItems(new Set(ratedMenuItemKeys));
      } catch (error) {
        console.error('Failed to load rated data:', error);
      } finally {
        setLoadingRatings(false);
      }
    };

    if (token) {
      loadRatedData();
    }
  }, [token]);

  // Get unique chefs from all delivered orders for rating
  const getUniqueChefs = (orders: OrderResponse[]) => {
    const chefs = new Map<number, string>();
    orders.forEach(order => {
      if (order.status === 'DELIVERED') {
        order.orderItems.forEach(item => {
          if (item.chefId && item.chefName) {
            chefs.set(item.chefId, item.chefName);
          }
        });
      }
    });
    return Array.from(chefs.entries());
  };

  const handleRateChef = (chefId: number, chefName: string, orderId: number) => {
    setChefRatingModal({
      isOpen: true,
      chefId: chefId,
      chefName: chefName,
      orderId: orderId
    });
  };

  const handleRateMenuItem = (menuItemId: number, menuItemName: string, orderId: number) => {
    setMenuItemRatingModal({
      isOpen: true,
      menuItemId: menuItemId,
      menuItemName: menuItemName,
      orderId: orderId
    });
  };

  const handleSubmitChefRating = async (rating: number, comment?: string) => {
    try {
      await ratingApi.rateChef(token!, {
        chefId: chefRatingModal.chefId,
        orderId: chefRatingModal.orderId,
        rating,
        comment
      });
      
      setRatedChefOrders(prev => new Set([...prev, chefRatingModal.orderId]));
      setChefRatingModal(prev => ({ ...prev, isOpen: false }));
      
      toast({
        title: "Success",
        description: "Chef rated successfully! You can rate them again after your next order."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to submit rating'
      });
    }
  };

  const handleSubmitMenuItemRating = async (rating: number, comment?: string) => {
    try {
      await ratingApi.rateMenuItem(token!, {
        menuItemId: menuItemRatingModal.menuItemId,
        orderId: menuItemRatingModal.orderId,
        rating,
        comment
      });
      
      const ratingKey = `${menuItemRatingModal.orderId}-${menuItemRatingModal.menuItemId}`;
      setRatedMenuItems(prev => new Set([...prev, ratingKey]));
      setMenuItemRatingModal(prev => ({ ...prev, isOpen: false }));
      
      toast({
        title: "Success",
        description: "Menu item rated successfully!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to submit rating'
      });
    }
  };

  if (loadingRatings) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">My Orders</h2>
        <div className="text-center py-12 bg-card rounded-lg shadow-soft">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">My Orders</h2>
        <div className="text-center py-12 bg-card rounded-lg shadow-soft">
          <p className="text-muted-foreground">No orders yet. Start ordering from the menu!</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-success/20 text-success';
      case 'CANCELLED':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-accent/20 text-accent';
    }
  };

  // Group orders by base order number (e.g., ORD-ABC123-A and ORD-ABC123-B)
  const groupedOrders = orders.reduce((acc, order) => {
    const baseOrderNumber = order.orderNumber.split('-').slice(0, -1).join('-');
    const hasSubOrder = order.orderNumber.match(/-[A-Z]$/);
    const groupKey = hasSubOrder ? baseOrderNumber : order.orderNumber;
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(order);
    return acc;
  }, {} as Record<string, OrderResponse[]>);

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">My Orders</h2>
      <div className="space-y-6">
        {Object.entries(groupedOrders).map(([groupKey, groupOrders]) => {
          const isMultiChef = groupOrders.length > 1;
          const totalAmount = groupOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          
          return (
            <div key={groupKey} className={isMultiChef ? 'border-2 border-primary/30 rounded-xl p-4 bg-primary/5' : ''}>
              {isMultiChef && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-primary/20">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Multi-Chef Order ({groupOrders.length} chefs)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total: ₹{totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className={isMultiChef ? 'space-y-3' : 'space-y-4'}>
                {groupOrders.map((order) => (
                  <div key={order.id} className="bg-card rounded-lg shadow-medium p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="border-t border-border pt-4">
                      {order.orderItems && order.orderItems.map((item) => {
                        const isMenuItemRated = ratedMenuItems.has(`${order.id}-${item.menuItemId}`);
                        const isDelivered = order.status === 'DELIVERED';
                        
                        return (
                          <div key={item.id} className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              {item.vegetarian ? (
                                <VegIcon size="sm" />
                              ) : (
                                <NonVegIcon size="sm" />
                              )}
                              <span>{item.menuItemName} x {item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span>₹{item.subtotal.toFixed(2)}</span>
                              {isDelivered && item.menuItemId && (
                                <button
                                  onClick={() => handleRateMenuItem(item.menuItemId, item.menuItemName, order.id)}
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                                    isMenuItemRated
                                      ? 'text-yellow-600 bg-yellow-50 cursor-not-allowed'
                                      : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                  }`}
                                  disabled={isMenuItemRated}
                                  title={isMenuItemRated ? 'Already rated' : 'Rate this item'}
                                >
                                  <Star className="w-3 h-3" fill={isMenuItemRated ? 'currentColor' : 'none'} />
                                  {isMenuItemRated ? 'Rated' : 'Rate'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {order.status === 'DELIVERED' && order.orderItems.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border">
                          {(() => {
                            // Debug: Log order items to see what data we have
                            console.log('Order items for rating:', order.orderItems);
                            
                            // Get unique chefs from order items
                            const chefKeys = Array.from(new Set(order.orderItems.map(item => `${item.chefId}-${item.chefName}`)))
                              .filter(chef => chef !== 'undefined-undefined' && chef !== 'null-null');
                            
                            console.log('Chef keys found:', chefKeys);
                            
                            // If no chef info available, show fallback rating button
                            if (chefKeys.length === 0) {
                              console.log('No chef info found, showing fallback rating button');
                              const isRated = ratedChefOrders.has(order.id);
                              return (
                                <button
                                  onClick={() => handleRateChef(1, 'Chef', order.id)} // Fallback chef ID and name
                                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors mb-2 ${
                                    isRated
                                      ? 'text-yellow-600 bg-yellow-50 cursor-not-allowed'
                                      : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                  }`}
                                  disabled={isRated}
                                >
                                  <ChefHat className="w-4 h-4" />
                                  <span>{isRated ? 'Chef Rated' : 'Rate Chef'}</span>
                                  <Star className="w-4 h-4" fill={isRated ? 'currentColor' : 'none'} />
                                </button>
                              );
                            }
                            
                            // Show chef-specific rating buttons if chef info is available
                            const isRated = ratedChefOrders.has(order.id);
                            return chefKeys.map(chefKey => {
                              const [chefId, chefName] = chefKey.split('-');
                              const chefIdNum = parseInt(chefId);
                              return (
                                <button
                                  key={chefKey}
                                  onClick={() => handleRateChef(chefIdNum, chefName, order.id)}
                                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors mb-2 ${
                                    isRated
                                      ? 'text-yellow-600 bg-yellow-50 cursor-not-allowed'
                                      : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                  }`}
                                  disabled={isRated}
                                >
                                  <ChefHat className="w-4 h-4" />
                                  <span>{isRated ? `Chef ${chefName} Rated` : `Rate Chef ${chefName}`}</span>
                                  <Star className="w-4 h-4" fill={isRated ? 'currentColor' : 'none'} />
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Chef Rating Modal */}
      <RatingModal
        isOpen={chefRatingModal.isOpen}
        onClose={() => setChefRatingModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitChefRating}
        type="chef"
        itemName={chefRatingModal.chefName}
      />
      
      {/* Menu Item Rating Modal */}
      <RatingModal
        isOpen={menuItemRatingModal.isOpen}
        onClose={() => setMenuItemRatingModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitMenuItemRating}
        type="menuItem"
        itemName={menuItemRatingModal.menuItemName}
      />
    </div>
  );
};
