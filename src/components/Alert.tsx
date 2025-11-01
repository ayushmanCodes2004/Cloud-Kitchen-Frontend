import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

export const Alert = ({ type, message, onClose }: AlertProps) => {
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-start transition-all ${
      type === 'success' 
        ? 'bg-success/10 border-success/30' 
        : 'bg-destructive/10 border-destructive/30'
    }`}>
      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
        type === 'success' ? 'text-success' : 'text-destructive'
      }`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          type === 'success' ? 'text-success' : 'text-destructive'
        }`}>
          {message}
        </p>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className={`hover:opacity-70 transition ${
            type === 'success' ? 'text-success' : 'text-destructive'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
