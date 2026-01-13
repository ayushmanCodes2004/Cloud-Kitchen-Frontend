import { useState, useEffect } from 'react';
import { orderApi, OrderStatus } from '@/services/orderApi';
import { OrderResponse } from '@/types/api.types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Package, Loader2, RefreshCw, AlertCircle, TrendingUp, IndianRupee, XCircle, MessageCircle } from 'lucide-react';
import { VegIcon, NonVegIcon } from '@/components/ui/NonVegIcon';
import { ChatModal } from '@/components/ui/ChatModal';

export const ChefOrderManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // State for chat modal
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔍 Attempting to fetch chef orders...');
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      let response;
      let usedFallback = false;
      
      try {
        // Try chef-specific endpoint first
        console.log('📡 Calling /orders/chef/my-orders...');
        response = await orderApi.getChefOrders();
        console.log('📦 Response from /orders/chef/my-orders:', response);
      } catch (chefError: any) {
        console.warn('⚠️ Chef endpoint failed, trying fallback to /orders:', chefError);
        // Fallback to general orders endpoint
        try {
          response = await orderApi.getAllOrders();
          usedFallback = true;
          console.log('📦 Fallback response from /orders:', response);
        } catch (fallbackError: any) {
          console.error('❌ Both endpoints failed:', fallbackError);
          throw fallbackError;
        }
      }
      
      if (response && response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} orders${usedFallback ? ' (using fallback - showing ALL orders)' : ''}`);
        console.log('📋 Order data structure:', response.data[0]);
        
        setAllOrders(response.data);
        setLastRefresh(new Date());
        
        // Show warning if using fallback
        if (usedFallback && !isRefresh) {
          toast({
            title: "Using Fallback",
            description: "Showing all orders. Implement /orders/chef/my-orders for chef-specific filtering",
            variant: "default"
          });
        }
        
        // Show success toast on refresh
        if (isRefresh) {
          toast({
            title: "Refreshed",
            description: `Loaded ${response.data.length} orders`
          });
        }
      } else {
        console.error('❌ Invalid response structure:', response);
        toast({
          variant: "destructive",
          title: "Invalid Response",
          description: "The API returned an unexpected response format"
        });
      }
    } catch (error: any) {
      console.error('❌ Fatal error loading orders:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Failed to connect to the backend"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter orders when allOrders or filterStatus changes
  useEffect(() => {
    if (filterStatus === 'ALL') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.status === filterStatus));
    }
  }, [allOrders, filterStatus]);

  // Initial load
  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        loadOrders(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await orderApi.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        // Update the order in allOrders
        setAllOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus as string } : order
          )
        );
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status"
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      const response = await orderApi.cancelChefOrder(orderId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Order cancelled successfully!"
        });
        // Refresh orders list
        loadOrders(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || 'Failed to cancel order'
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to cancel order'
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (status: string): boolean => {
    return status === 'PENDING' || status === 'CONFIRMED';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      PREPARING: { color: 'bg-purple-100 text-purple-800', icon: Package },
      READY: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      DELIVERED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getOrderStats = () => {
    return {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'PENDING').length,
      confirmed: allOrders.filter(o => o.status === 'CONFIRMED').length,
      preparing: allOrders.filter(o => o.status === 'PREPARING').length,
      ready: allOrders.filter(o => o.status === 'READY').length,
      delivered: allOrders.filter(o => o.status === 'DELIVERED').length,
      totalRevenue: allOrders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
            {refreshing && <span className="ml-2 text-orange-500">• Refreshing...</span>}
          </p>
        </div>
        <Button
          onClick={() => loadOrders(true)}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Preparing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.preparing}</div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.ready}</div>
            <p className="text-xs text-gray-500 mt-1">For delivery</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{stats.totalRevenue}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.delivered} delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by Status:</label>
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as OrderStatus | 'ALL')}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Orders</SelectItem>
            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
            <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
            <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filterStatus === 'ALL' ? 'All Orders' : `${filterStatus} Orders`}
          </h3>
          <span className="text-sm text-gray-500">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>

        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm mt-2">
                  {filterStatus === 'ALL' 
                    ? "You don't have any orders yet" 
                    : `No ${filterStatus.toLowerCase()} orders`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              // Calculate chef's portion (sum of their items only)
              const chefItemsTotal = order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);
              const isMultiChefOrder = chefItemsTotal < order.totalAmount;
              
              return (
            <Card key={order.id} className={isMultiChefOrder ? 'border-l-4 border-l-yellow-500' : ''}>
              <CardContent className="p-6">
                {isMultiChefOrder && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-800">Multi-Chef Order</p>
                        <p className="text-yellow-700">This order contains items from multiple chefs. You're only responsible for your items shown below.</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-2">Order #{order.orderNumber}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Student:</span> {order.studentName}</p>
                      <p><span className="font-medium">Your Items:</span></p>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="text-xs pl-4 flex items-center gap-1">
                          {item.vegetarian ? (
                            <VegIcon size="sm" />
                          ) : (
                            <NonVegIcon size="sm" />
                          )}
                          <span>• {item.menuItemName} x{item.quantity} - ₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                    <p className="text-sm">{order.deliveryAddress}</p>
                    {order.specialInstructions && (
                      <p className="text-xs text-gray-500 mt-2 italic">Note: {order.specialInstructions}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Ordered: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {isMultiChefOrder ? 'Your Portion' : 'Total Amount'}
                      </p>
                      <p className="text-xl font-bold text-orange-600">₹{chefItemsTotal.toFixed(2)}</p>
                      {isMultiChefOrder && (
                        <p className="text-xs text-gray-500 mt-1">
                          (Full order: ₹{order.totalAmount})
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Current Status</p>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Update Status</p>
                        {isMultiChefOrder && (
                          <p className="text-xs text-yellow-700 mb-2 bg-yellow-50 p-2 rounded">
                            ⚠️ Status updates affect the entire order
                          </p>
                        )}
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                          disabled={updatingOrderId === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                            <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                            <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
                            <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
                            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                                            
                        {/* Show chat icon for active orders (CONFIRMED, PREPARING, READY) */}
                        {(order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY') && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setChatModalOpen(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            title="Chat with student"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </button>
                        )}
                      </div>
                                          
                      {canCancelOrder(order.status) && (
                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          variant="destructive"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
            })
        )}
        </div>
      </div>
      
      {/* Chat Modal */}
      {selectedOrderId && (
        <ChatModal
          orderId={selectedOrderId}
          orderStatus={allOrders.find(o => o.id === selectedOrderId)?.status || ''}
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
        />
      )}
    </div>
  );
};
