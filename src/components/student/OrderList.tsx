interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderItems?: Array<{
    menuItem?: { name: string };
    quantity: number;
    subtotal: number;
  }>;
}

interface OrderListProps {
  orders: Order[];
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
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
              {order.orderItems && order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>{item.menuItem?.name || 'Item'} x {item.quantity}</span>
                  <span>₹{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
