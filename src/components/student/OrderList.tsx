import { OrderResponse, OrderItemResponse } from '@/types/api.types';
import { ChefHat } from 'lucide-react';

interface OrderListProps {
  orders: OrderResponse[];
}

export const OrderList = ({ orders }: OrderListProps) => {
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
                      {order.orderItems && order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>{item.menuItemName} x {item.quantity}</span>
                          <span>₹{item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
