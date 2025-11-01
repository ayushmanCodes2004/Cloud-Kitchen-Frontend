import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

interface CreateMenuItemModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const CreateMenuItemModal = ({ onClose, onSuccess, onError }: CreateMenuItemModalProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    vegetarian: false,
    preparationTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      preparationTime: parseInt(formData.preparationTime) || 0
    };

    try {
      const result = await api.createMenuItem(token!, data);
      if (result.success) {
        onSuccess();
      } else {
        onError(result.message || 'Failed to create menu item');
      }
    } catch (error) {
      onError('Failed to create menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-card rounded-2xl shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border sticky top-0 bg-card">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-foreground">Create Menu Item</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Dish Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="e.g., Margherita Pizza"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              rows={3}
              placeholder="Describe your dish..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="e.g., Italian, Indian"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prep Time (mins)</label>
              <input
                type="number"
                min="0"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vegetarian}
                  onChange={(e) => setFormData({ ...formData, vegetarian: e.target.checked })}
                  className="w-5 h-5 text-primary border-input rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm font-medium text-foreground">Vegetarian</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-soft"
          >
            {loading ? 'Creating...' : 'Create Menu Item'}
          </button>
        </form>
      </div>
    </div>
  );
};
