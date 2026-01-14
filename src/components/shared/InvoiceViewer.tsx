import { useEffect, useState } from 'react';
import { invoiceApi, Invoice } from '@/services/invoiceApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, Mail, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface InvoiceViewerProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceViewer = ({ orderId, isOpen, onClose }: InvoiceViewerProps) => {
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      loadInvoice();
    }
  }, [isOpen, orderId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceApi.getInvoice(orderId);
      if (response.success && response.data) {
        setInvoice(response.data);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load invoice',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow && invoice) {
      printWindow.document.write(generatePrintableHTML(invoice));
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePrintableHTML = (inv: Invoice) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${inv.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f97316; color: white; }
          .totals { text-align: right; margin-top: 20px; }
          .total-row { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🍽️ PlatePal</h1>
          <h2>INVOICE</h2>
        </div>
        <div class="invoice-details">
          <p><strong>Invoice Number:</strong> ${inv.invoiceNumber}</p>
          <p><strong>Order Number:</strong> ${inv.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(inv.invoiceDate).toLocaleDateString()}</p>
        </div>
        <div class="customer-details">
          <h3>Bill To:</h3>
          <p>${inv.customerName}</p>
          <p>${inv.customerEmail}</p>
          <p>${inv.customerPhone}</p>
          <p>${inv.deliveryAddress}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Chef</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(item => `
              <tr>
                <td>${item.itemName}</td>
                <td>${item.chefName}</td>
                <td>${item.quantity}</td>
                <td>₹${item.unitPrice.toFixed(2)}</td>
                <td>₹${item.totalPrice.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <p>Subtotal: ₹${inv.subtotal.toFixed(2)}</p>
          <p>Tax (2%): ₹${inv.taxAmount.toFixed(2)}</p>
          <p>Platform Fee: ₹${inv.platformFee.toFixed(2)}</p>
          <p class="total-row">Total: ₹${inv.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${inv.paymentMethod.replace('_', ' ')}</p>
          <p><strong>Payment Status:</strong> ${inv.paymentStatus}</p>
        </div>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6 bg-white">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-orange-600">🍽️ PlatePal</h1>
            <p className="text-gray-600 mt-2">Cloud Kitchen Platform</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Invoice Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
                <p><span className="font-medium">Order #:</span> {invoice.orderNumber}</p>
                <p><span className="font-medium">Date:</span> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {invoice.status}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Bill To</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{invoice.customerName}</p>
                <p className="text-gray-600">{invoice.customerEmail}</p>
                <p className="text-gray-600">{invoice.customerPhone}</p>
                <p className="text-gray-600 mt-2">{invoice.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Order Items</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-orange-50 border-b-2 border-orange-200">
                  <th className="text-left p-3 text-sm font-semibold">Item</th>
                  <th className="text-left p-3 text-sm font-semibold">Chef</th>
                  <th className="text-center p-3 text-sm font-semibold">Qty</th>
                  <th className="text-right p-3 text-sm font-semibold">Price</th>
                  <th className="text-right p-3 text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 text-sm">{item.itemName}</td>
                    <td className="p-3 text-sm text-gray-600">{item.chefName}</td>
                    <td className="p-3 text-sm text-center">{item.quantity}</td>
                    <td className="p-3 text-sm text-right">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-sm text-right font-medium">₹{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (2%):</span>
                <span>₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Fee:</span>
                <span>₹{invoice.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                <span>Total:</span>
                <span className="text-orange-600">₹{invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Payment Method:</span>
                <span className="ml-2">{invoice.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium">Payment Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  invoice.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {invoice.specialInstructions && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm"><span className="font-medium">Special Instructions:</span> {invoice.specialInstructions}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Thank you for your order!</p>
            <p className="mt-1">For any queries, contact us at support@platepal.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
