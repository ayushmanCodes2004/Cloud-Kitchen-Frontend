import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orderApi } from '@/services/orderApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { OrderResponse } from '@/types/api.types';
import { TrendingUp, DollarSign, Package, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#f97316', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export const ChefAnalytics = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getChefOrders(token!);
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load analytics data"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data
  const getAnalyticsData = () => {
    // Date calculations for revenue comparison
    const today = new Date();
    const lastWeekStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = today;
    const previousWeekStart = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000);
    const previousWeekEnd = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total revenue
    const totalRevenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Order status breakdown
    const statusData = [
      { name: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, color: '#f97316' },
      { name: 'Preparing', value: orders.filter(o => o.status === 'PREPARING').length, color: '#3b82f6' },
      { name: 'Out for Delivery', value: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length, color: '#8b5cf6' },
      { name: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, color: '#10b981' },
      { name: 'Cancelled', value: orders.filter(o => o.status === 'CANCELLED').length, color: '#ef4444' }
    ].filter(item => item.value > 0);

    // Peak hours analysis (0-23 hours)
    const hourlyOrders = Array.from({ length: 24 }, (_, hour) => {
      const orderCount = orders.filter(o => {
        const orderHour = new Date(o.createdAt).getHours();
        return orderHour === hour;
      }).length;
      return {
        hour: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
        orders: orderCount
      };
    }).filter(h => h.orders > 0);

    // Peak days analysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyOrders = dayNames.map((day, index) => {
      const orderCount = orders.filter(o => {
        const orderDay = new Date(o.createdAt).getDay();
        return orderDay === index;
      }).length;
      return { day, orders: orderCount };
    });

    // Customer insights
    const uniqueCustomers = new Set(orders.map(o => o.studentId)).size;
    const repeatCustomers = orders.reduce((acc, order) => {
      const customerId = order.studentId;
      acc[customerId] = (acc[customerId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const repeatCustomerCount = Object.values(repeatCustomers).filter(count => count > 1).length;
    const repeatRate = uniqueCustomers > 0 ? ((repeatCustomerCount / uniqueCustomers) * 100).toFixed(1) : '0';

    // Weekly revenue comparison (Last 7 days vs Previous 7 days)
    const now = new Date();
    const lastWeekRevenue = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff < 7 && o.status === 'DELIVERED';
    }).reduce((sum, o) => sum + o.totalAmount, 0);

    const previousWeekRevenue = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 7 && daysDiff < 14 && o.status === 'DELIVERED';
    }).reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueGrowth = previousWeekRevenue > 0 
      ? (((lastWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100).toFixed(1)
      : lastWeekRevenue > 0 ? '+100.0' : '0.0';
    
    const hasWeeklyData = lastWeekRevenue > 0 || previousWeekRevenue > 0;

    // Cancellation rate
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
    const cancellationRate = orders.length > 0 ? ((cancelledOrders / orders.length) * 100).toFixed(1) : '0';

    // Revenue by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const revenueByDate = last7Days.map(date => {
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
        return orderDate === date && o.status === 'DELIVERED';
      });
      const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const orderCount = dayOrders.length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue,
        orders: orderCount
      };
    });

    // Top selling items
    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    orders.filter(o => o.status === 'DELIVERED').forEach(order => {
      order.orderItems.forEach(item => {
        const existing = itemSales.get(item.menuItemName);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          itemSales.set(item.menuItemName, {
            name: item.menuItemName,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          });
        }
      });
    });

    const topItems = Array.from(itemSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Daily order trend
    const orderTrend = last7Days.map(date => {
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
        return orderDate === date;
      });
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        delivered: dayOrders.filter(o => o.status === 'DELIVERED').length
      };
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
      statusData,
      revenueByDate,
      topItems,
      orderTrend,
      hourlyOrders,
      dailyOrders,
      uniqueCustomers,
      repeatRate,
      lastWeekRevenue,
      previousWeekRevenue,
      revenueGrowth,
      cancellationRate,
      hasWeeklyData,
      lastWeekStart,
      lastWeekEnd,
      previousWeekStart,
      previousWeekEnd
    };
  };

  const analytics = getAnalyticsData();

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{analytics.totalRevenue.toFixed(0)}</div>
            <p className="text-green-100 text-xs mt-1">From delivered orders</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalOrders}</div>
            <p className="text-blue-100 text-xs mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.deliveredOrders}</div>
            <p className="text-purple-100 text-xs mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-100 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{analytics.deliveredOrders > 0 ? (analytics.totalRevenue / analytics.deliveredOrders).toFixed(0) : 0}
            </div>
            <p className="text-orange-100 text-xs mt-1">Per order</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.revenueByDate}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Top 5 Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topItems} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#f97316" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Order Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Total Orders"
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="delivered" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Delivered"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer & Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Customer Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.uniqueCustomers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Repeat Customer Rate</p>
              <p className="text-2xl font-bold text-orange-600">{analytics.repeatRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Customers who ordered again</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Last 7 Days</p>
              <p className="text-2xl font-bold text-gray-900">₹{analytics.lastWeekRevenue.toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.lastWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {analytics.lastWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Growth vs Previous Week</p>
              {analytics.hasWeeklyData ? (
                <>
                  <p className={`text-2xl font-bold ${parseFloat(analytics.revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(analytics.revenueGrowth) >= 0 ? '+' : ''}{analytics.revenueGrowth}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Previous: ₹{analytics.previousWeekRevenue.toFixed(0)} ({analytics.previousWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {analytics.previousWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Not enough data</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Order Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.totalOrders > 0 
                  ? ((analytics.deliveredOrders / analytics.totalOrders) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cancellation Rate</p>
              <p className="text-2xl font-bold text-red-600">{analytics.cancellationRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Keep below 10% for best results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours & Days Analysis */}
      {analytics.hourlyOrders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">Peak Ordering Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.hourlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={70} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">Plan your availability during peak hours</p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">Orders by Day of Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.dailyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">Identify your busiest days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expanded Quick Summary Insights */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">Quick Summary & Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Best Seller */}
            {analytics.topItems.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-xs text-gray-600 mb-1 font-medium">🏆 Best Seller</p>
                <p className="text-base font-bold text-gray-900 truncate">{analytics.topItems[0]?.name}</p>
                <p className="text-sm text-orange-600 font-semibold">₹{analytics.topItems[0]?.revenue.toFixed(0)} revenue</p>
              </div>
            )}
            
            {/* Active Orders - Fixed */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 mb-1 font-medium">⚡ Active Orders</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY').length}
              </p>
              <p className="text-xs text-gray-500">Need attention now</p>
            </div>
            
            {/* Avg Order Value */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs text-gray-600 mb-1 font-medium">💰 Avg Order Value</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{analytics.deliveredOrders > 0 ? (analytics.totalRevenue / analytics.deliveredOrders).toFixed(0) : 0}
              </p>
              <p className="text-xs text-gray-500">Per delivered order</p>
            </div>

            {/* Today's Orders */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-gray-600 mb-1 font-medium">📅 Today's Orders</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => {
                  const today = new Date().toISOString().split('T')[0];
                  const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
                  return orderDate === today;
                }).length}
              </p>
              <p className="text-xs text-gray-500">
                ₹{orders.filter(o => {
                  const today = new Date().toISOString().split('T')[0];
                  const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
                  return orderDate === today && o.status === 'DELIVERED';
                }).reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)} revenue
              </p>
            </div>

            {/* Peak Hour */}
            {analytics.hourlyOrders.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-xs text-gray-600 mb-1 font-medium">🕐 Peak Hour</p>
                <p className="text-base font-bold text-gray-900">
                  {analytics.hourlyOrders.reduce((max, curr) => curr.orders > max.orders ? curr : max).hour}
                </p>
                <p className="text-xs text-gray-500">
                  {analytics.hourlyOrders.reduce((max, curr) => curr.orders > max.orders ? curr : max).orders} orders
                </p>
              </div>
            )}

            {/* Most Popular Day */}
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
              <p className="text-xs text-gray-600 mb-1 font-medium">📊 Busiest Day</p>
              <p className="text-base font-bold text-gray-900">
                {analytics.dailyOrders.reduce((max, curr) => curr.orders > max.orders ? curr : max).day}
              </p>
              <p className="text-xs text-gray-500">
                {analytics.dailyOrders.reduce((max, curr) => curr.orders > max.orders ? curr : max).orders} orders
              </p>
            </div>

            {/* Items Sold Today */}
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-xs text-gray-600 mb-1 font-medium">🍽️ Items Sold Today</p>
              <p className="text-2xl font-bold text-indigo-600">
                {orders.filter(o => {
                  const today = new Date().toISOString().split('T')[0];
                  const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
                  return orderDate === today;
                }).reduce((sum, o) => sum + o.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
              </p>
              <p className="text-xs text-gray-500">Total units</p>
            </div>

            {/* Pending Preparation */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs text-gray-600 mb-1 font-medium">👨‍🍳 Preparing Now</p>
              <p className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.status === 'PREPARING').length}
              </p>
              <p className="text-xs text-gray-500">In kitchen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
