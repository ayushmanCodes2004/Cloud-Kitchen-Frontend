import { Clock, CheckCircle, XCircle, Clock4, Truck } from 'lucide-react';
import { OrderResponse } from '@/services/orderApi';

const statusIcons = {
  PENDING: <Clock4 className="w-4 h-4 text-amber-500" />,
  PREPARING: <Clock className="w-4 h-4 text-blue-500" />,
  OUT_FOR_DELIVERY: <Truck className="w-4 h-4 text-indigo-500" />,
  DELIVERED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
};

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

interface RecentOrdersProps {
  orders: OrderResponse[];
  onReorder?: (order: OrderResponse) => void;
}

export const RecentOrders = ({ orders, onReorder }: RecentOrdersProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No recent orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600"
                      >
                        {item.quantity}x
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {statusIcons[order.status as keyof typeof statusIcons]}
                    <span className="ml-1">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {order.status === 'DELIVERED' && onReorder && (
                    <button
                      onClick={() => onReorder(order)}
                      className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                    >
                      Reorder
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t text-right">
        <button className="text-sm font-medium text-orange-600 hover:text-orange-800">
          View All Orders
        </button>
      </div>
    </div>
  );
};
