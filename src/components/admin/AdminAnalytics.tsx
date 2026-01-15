import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orderApi } from '@/services/orderApi';
import { adminApi } from '@/services/adminApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { OrderResponse } from '@/types/api.types';
import { TrendingUp, Users, ChefHat, ShoppingBag } from 'lucide-react';
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

export const AdminAnalytics = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!token) return;
      
      const response = await orderApi.getAllOrders();
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

  const getAnalyticsData = () => {
    // Total revenue across platform
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

    // Daily orders trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const dailyRevenue = last7Days.map(date => {
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      const revenue = dayOrders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue),
        orders: dayOrders.length
      };
    });

    // Peak hours analysis
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

    // Weekly trend
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyOrders = dayNames.map((day, index) => {
      const orderCount = orders.filter(o => {
        const orderDay = new Date(o.createdAt).getDay();
        return orderDay === index;
      }).length;
      const revenue = orders
        .filter(o => {
          const orderDay = new Date(o.createdAt).getDay();
          return orderDay === index && o.status === 'DELIVERED';
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      return { 
        day, 
        orders: orderCount,
        revenue: Math.round(revenue)
      };
    });

    return {
      totalRevenue,
      statusData,
      dailyRevenue,
      hourlyOrders,
      weeklyOrders,
      totalOrders: orders.length,
      deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length
    };
  };

  const analytics = getAnalyticsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No orders data available</p>
        <p className="text-gray-500 text-sm mt-2">Analytics will appear once orders are placed</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{analytics.totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.deliveredOrders}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.totalOrders > 0 
                    ? Math.round((analytics.deliveredOrders / analytics.totalOrders) * 100)
                    : 0}%
                </p>
              </div>
              <ChefHat className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
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
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Orders */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Orders & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="#f97316" name="Orders" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        {analytics.hourlyOrders.length > 0 && (
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.hourlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
