import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatIconProps {
  onClick: () => void;
  isActive?: boolean;
  hasUnread?: boolean;
  className?: string;
}

export const ChatIcon: React.FC<ChatIconProps> = ({
  onClick,
  isActive = false,
  hasUnread = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 rounded-full transition-all duration-200
        ${isActive 
          ? 'bg-orange-500 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
        }
        ${className}
      `}
    >
      <MessageCircle className="w-5 h-5" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          !
        </span>
      )}
    </button>
  );
};