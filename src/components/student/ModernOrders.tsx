import { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageCircle, 
  X, 
  RotateCcw,
  Clock,
  CheckCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  Star,
  ChefHat
} from 'lucide-react';
import { OrderResponse } from '@/types/api.types';
import { orderApi } from '@/services/orderApi';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { RatingModal } from '@/components/ui/RatingModal';
import { InvoiceViewer } from '@/components/shared/InvoiceViewer';
import { FloatingChatWidget } from '@/components/shared/FloatingChatWidget';
import { ratingApi } from '@/services/ratingApi';

interface ModernOrdersProps {
  orders: OrderResponse[];
  onReorder?: (order: OrderResponse) => void;
  onOrderCancelled?: () => void;
}

export const ModernOrders = ({ orders, onReorder, onOrderCancelled }: ModernOrdersProps) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [invoiceOrderId, setInvoiceOrderId] = useState<number | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<number | null>(null);
  const [activeChatOrderStatus, setActiveChatOrderStatus] = useState<string>('');
  const [ratedChefOrders, setRatedChefOrders] = useState<Set<number>>(new Set());
  const [ratedMenuItems, setRatedMenuItems] = useState<Set<string>>(new Set());
  const [loadingRatings, setLoadingRatings] = useState(true);
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
  
  const { toast } = useToast();
  const { token } = useAuth();
  const itemsPerPage = 5;

  const activeOrders = orders.filter(order => 
    order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
  );
  
  const pastOrders = orders.filter(order => 
    order.status === 'DELIVERED' || order.status === 'CANCELLED'
  );

  // Load rated orders and menu items from backend on mount
  useEffect(() => {
    const loadRatedData = async () => {
      try {
        const [ratedOrderIds, ratedMenuItemKeys] = await Promise.all([
          ratingApi.getMyRatedOrders(),
          ratingApi.getMyRatedMenuItems()
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

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;
  
  // Pagination
  const totalPages = Math.ceil(displayOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = displayOrders.slice(startIndex, endIndex);

  // Reset to page 1 when tab changes
  const handleTabChange = (tab: 'active' | 'history') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      const result = await orderApi.cancelOrder(orderId);
      if (result.success) {
        toast({
          title: 'Order cancelled',
          description: 'Your order has been cancelled successfully.'
        });
        if (onOrderCancelled) {
          onOrderCancelled();
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to cancel order'
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to cancel order'
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Preparing
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Confirmed
          </span>
        );
      case 'PREPARING':
        return (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Preparing
          </span>
        );
      case 'READY':
        return (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            Ready
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full uppercase tracking-wide">
            {status}
          </span>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'DELIVERED') {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <Truck className="w-5 h-5" />;
  };

  const formatDate = (dateArray: number[] | string) => {
    let date: Date;
    
    if (Array.isArray(dateArray)) {
      const [year, month, day, hour, minute] = dateArray;
      date = new Date(year, month - 1, day, hour, minute);
    } else {
      date = new Date(dateArray);
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' • ' + date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getOrderSummary = (order: OrderResponse) => {
    return order.orderItems
      .map(item => `${item.quantity}x ${item.menuItemName}`)
      .join(', ');
  };

  const canCancelOrder = (order: OrderResponse) => {
    return order.status === 'PENDING' || order.status === 'CONFIRMED';
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
      await ratingApi.rateChef({
        chefId: chefRatingModal.chefId,
        orderId: chefRatingModal.orderId,
        rating,
        comment
      });
      
      setRatedChefOrders(prev => new Set([...prev, chefRatingModal.orderId]));
      setChefRatingModal(prev => ({ ...prev, isOpen: false }));
      
      toast({
        title: "Success",
        description: "Chef rated successfully!"
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
      await ratingApi.rateMenuItem({
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

  const handleOpenChat = (orderId: number, orderStatus: string) => {
    setActiveChatOrderId(orderId);
    setActiveChatOrderStatus(orderStatus);
  };

  const handleViewInvoice = (orderId: number) => {
    setInvoiceOrderId(orderId);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Orders</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track and manage your recent cloud kitchen orders.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          <button
            onClick={() => handleTabChange('active')}
            className={`relative py-4 px-1 text-sm font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'active'
                ? 'text-primary border-primary'
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-primary'
            }`}
          >
            Active Orders
            {activeOrders.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`relative py-4 px-1 text-sm font-semibold transition-all duration-200 border-b-2 ${
              activeTab === 'history'
                ? 'text-primary border-primary'
                : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-primary'
            }`}
          >
            Order History
            {pastOrders.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                {pastOrders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {currentItems.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {activeTab === 'active' ? 'No active orders' : 'No order history'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {activeTab === 'active' 
              ? 'Start ordering from the menu to see your active orders here' 
              : 'Your past orders will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentItems.map((order) => (
            <div
              key={order.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                activeTab === 'active' 
                  ? 'border-primary/30 ring-1 ring-primary/10' 
                  : 'border-slate-200 dark:border-slate-800 opacity-90'
              }`}
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeTab === 'active' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="lg:col-span-2">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-[10px]">
                      Order Summary
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                      {getOrderSummary(order)}
                    </p>
                    
                    {/* Expandable Order Items */}
                    {expandedOrderId === order.id && (
                      <div className="mt-4 space-y-3">
                        {order.orderItems.map((item) => {
                          const isMenuItemRated = ratedMenuItems.has(`${order.id}-${item.menuItemId}`);
                          const isDelivered = order.status === 'DELIVERED';
                          
                          return (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.menuItemName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Qty: {item.quantity} • ₹{item.subtotal.toFixed(2)}
                                </p>
                              </div>
                              {isDelivered && item.menuItemId && (
                                <button
                                  onClick={() => handleRateMenuItem(item.menuItemId, item.menuItemName, order.id)}
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                                    isMenuItemRated
                                      ? 'text-yellow-600 bg-yellow-50 cursor-not-allowed'
                                      : 'text-slate-600 hover:text-yellow-600 hover:bg-yellow-50'
                                  }`}
                                  disabled={isMenuItemRated}
                                  title={isMenuItemRated ? 'Already rated' : 'Rate this item'}
                                >
                                  <Star className="w-3 h-3" fill={isMenuItemRated ? 'currentColor' : 'none'} />
                                  {isMenuItemRated ? 'Rated' : 'Rate'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Chef Rating Button */}
                        {order.status === 'DELIVERED' && order.orderItems.length > 0 && (() => {
                          const chefKeys = Array.from(new Set(order.orderItems.map(item => `${item.chefId}-${item.chefName}`)))
                            .filter(chef => chef !== 'undefined-undefined' && chef !== 'null-null');
                          
                          if (chefKeys.length === 0) return null;
                          
                          const isRated = ratedChefOrders.has(order.id);
                          return chefKeys.map(chefKey => {
                            const [chefId, chefName] = chefKey.split('-');
                            const chefIdNum = parseInt(chefId);
                            return (
                              <button
                                key={chefKey}
                                onClick={() => handleRateChef(chefIdNum, chefName, order.id)}
                                className={`w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
                                  isRated
                                    ? 'text-yellow-600 bg-yellow-50 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-yellow-600 hover:bg-yellow-50 border border-slate-200 dark:border-slate-700'
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
                  <div className="flex flex-col lg:items-end">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">
                      Total Amount
                    </p>
                    <p className={`text-2xl font-black ${
                      activeTab === 'active' ? 'text-primary' : 'text-slate-900 dark:text-white'
                    }`}>
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        if (order.status === 'DELIVERED') {
                          handleViewInvoice(order.id);
                        } else {
                          setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
                        }
                      }}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {order.status === 'DELIVERED' ? 'View Receipt' : (expandedOrderId === order.id ? 'Hide Details' : 'View Details')}
                    </button>
                    {(order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY') && (
                      <button 
                        onClick={() => handleOpenChat(order.id, order.status)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat with Chef
                      </button>
                    )}
                    {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                      <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Chat with Support
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 font-bold rounded-xl text-sm transition-all border border-transparent hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingOrderId === order.id ? (
                          'Cancelling...'
                        ) : (
                          <>
                            <X className="w-4 h-4 inline mr-1" />
                            Cancel Order
                          </>
                        )}
                      </button>
                    )}
                    {activeTab === 'active' && order.status === 'PREPARING' && (
                      <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        Track Live
                      </button>
                    )}
                    {order.status === 'DELIVERED' && onReorder && (
                      <button
                        onClick={() => onReorder(order)}
                        className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl text-sm hover:border-primary hover:text-primary transition-all"
                      >
                        <RotateCcw className="w-4 h-4 inline mr-1" />
                        Reorder Items
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Rating Modals */}
      <RatingModal
        isOpen={chefRatingModal.isOpen}
        onClose={() => setChefRatingModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitChefRating}
        type="chef"
        itemName={chefRatingModal.chefName}
      />
      
      <RatingModal
        isOpen={menuItemRatingModal.isOpen}
        onClose={() => setMenuItemRatingModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitMenuItemRating}
        type="menuItem"
        itemName={menuItemRatingModal.menuItemName}
      />
      
      {/* Floating Chat Widget */}
      <FloatingChatWidget 
        orderId={activeChatOrderId}
        orderStatus={activeChatOrderStatus}
      />
      
      {/* Invoice Viewer */}
      {invoiceOrderId && (
        <InvoiceViewer
          orderId={invoiceOrderId}
          isOpen={true}
          onClose={() => setInvoiceOrderId(null)}
        />
      )}
    </div>
  );
};
