import { useState, useEffect } from 'react';
import { orderApi, OrderStatus } from '@/services/orderApi';
import { OrderResponse } from '@/types/api.types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { VegIcon, NonVegIcon } from '@/components/ui/NonVegIcon';

export const OrderManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = filterStatus === 'ALL' 
        ? await orderApi.getAllOrders(token!)
        : await orderApi.getOrdersByStatus(token!, filterStatus);
      
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token, filterStatus]);

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await orderApi.updateOrderStatus(token!, orderId, newStatus);
      
      if (response.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast({
          title: "Success",
          description: "Order status updated successfully"
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

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      PREPARING: { color: 'bg-purple-100 text-purple-800', icon: Package },
      READY: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      DELIVERED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status];
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
      total: orders.length,
      pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
      preparing: orders.filter(o => o.status === OrderStatus.PREPARING).length,
      delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.preparing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
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
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No orders found
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-2">Order #{order.orderNumber}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Order ID:</span> #{order.id}</p>
                      <p><span className="font-medium">Student:</span> {order.studentName}</p>
                      <p><span className="font-medium">Items:</span> {order.orderItems.length} item(s)</p>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="text-xs pl-4 flex items-center gap-1">
                          {item.vegetarian ? (
                            <VegIcon size="sm" />
                          ) : (
                            <NonVegIcon size="sm" />
                          )}
                          <span>• {item.menuItemName} x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                    <p className="text-sm">{order.deliveryAddress}</p>
                    {order.specialInstructions && (
                      <p className="text-xs text-gray-500 mt-2">Note: {order.specialInstructions}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-orange-600">₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      ETA: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Status</p>
                      {getStatusBadge(order.status as OrderStatus)}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Update Status</p>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                        disabled={updatingOrderId === order.id}
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
                          <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
