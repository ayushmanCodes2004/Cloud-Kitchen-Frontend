interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

const StatsCard = ({ title, value, className }: StatsCardProps) => (
  <div className={`bg-card rounded-lg shadow-md p-6 ${className}`}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

interface DashboardStatsProps {
  totalUsers: number;
  totalChefs: number;
  activeUsers: number;
  verifiedChefs: number;
}

export const DashboardStats = ({ totalUsers, totalChefs, activeUsers, verifiedChefs }: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Users" value={totalUsers} />
      <StatsCard title="Total Chefs" value={totalChefs} />
      <StatsCard title="Active Users" value={activeUsers} />
      <StatsCard title="Verified Chefs" value={verifiedChefs} />
    </div>
  );
};