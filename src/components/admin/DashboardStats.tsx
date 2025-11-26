import { Users, ChefHat, CheckCircle, Shield, ShoppingBag, MessageSquare, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatsCard = ({ title, value, icon, subtitle, trend }: StatsCardProps) => {
  const trendColors = {
    up: 'from-green-50 to-emerald-50 border-green-200',
    down: 'from-red-50 to-rose-50 border-red-200',
    neutral: 'from-blue-50 to-cyan-50 border-blue-200'
  };

  const trendBg = trend ? trendColors[trend] : trendColors.neutral;

  return (
    <Card className={`border shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${trendBg}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm">
              {icon}
            </div>
            {trend && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                trend === 'up' ? 'bg-green-100 text-green-700' : 
                trend === 'down' ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {trend === 'up' ? '↗ Growing' : trend === 'down' ? '↘ Declining' : '→ Stable'}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  totalUsers: number;
  totalChefs: number;
  activeUsers: number;
  verifiedChefs: number;
  totalOrders?: number;
  pendingTestimonials?: number;
  totalMenuItems?: number;
  pendingChefs?: number;
}

export const DashboardStats = ({ 
  totalUsers, 
  totalChefs, 
  activeUsers, 
  verifiedChefs,
  totalOrders = 0,
  pendingTestimonials = 0,
  totalMenuItems = 0,
  pendingChefs = 0
}: DashboardStatsProps) => {
  return (
    <div>
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <StatsCard 
          title="Total Users" 
          value={totalUsers} 
          icon={<Users className="w-10 h-10 text-blue-500" />}
          subtitle="Students registered"
          trend="up"
        />
        <StatsCard 
          title="Total Chefs" 
          value={totalChefs} 
          icon={<ChefHat className="w-10 h-10 text-orange-500" />}
          subtitle={`${verifiedChefs} verified`}
          trend={totalChefs > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={<ShoppingBag className="w-10 h-10 text-green-500" />}
          subtitle="Platform orders"
          trend={totalOrders > 50 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Menu Items" 
          value={totalMenuItems} 
          icon={<Package className="w-10 h-10 text-purple-500" />}
          subtitle="Available dishes"
          trend={totalMenuItems > 0 ? "up" : "neutral"}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Active Users" 
          value={activeUsers} 
          icon={<CheckCircle className="w-10 h-10 text-emerald-500" />}
          subtitle="Currently active"
        />
        <StatsCard 
          title="Verified Chefs" 
          value={verifiedChefs} 
          icon={<Shield className="w-10 h-10 text-indigo-500" />}
          subtitle={`${pendingChefs} pending`}
        />
        <StatsCard 
          title="Pending Reviews" 
          value={pendingTestimonials} 
          icon={<MessageSquare className="w-10 h-10 text-amber-500" />}
          subtitle="Awaiting approval"
        />
        <StatsCard 
          title="Growth" 
          value={Math.round((activeUsers / totalUsers) * 100) || 0} 
          icon={<TrendingUp className="w-10 h-10 text-rose-500" />}
          subtitle="Active user rate (%)"
          trend={activeUsers > totalUsers * 0.7 ? "up" : "neutral"}
        />
      </div>
    </div>
  );
};