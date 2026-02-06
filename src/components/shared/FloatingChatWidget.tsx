import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'chef' | 'support';
  timestamp: string;
  senderName?: string;
}

interface FloatingChatWidgetProps {
  orderId?: number | null;
  orderStatus?: string;
}

export const FloatingChatWidget = ({ orderId, orderStatus }: FloatingChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user, token } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!isOpen || !orderId || !token) return;

    const wsUrl = `ws://localhost:8080/ws/chat/${orderId}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newMessage: Message = {
          id: Date.now().toString(),
          text: data.message || data.content,
          sender: data.sender === user?.email ? 'user' : 'chef',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          senderName: data.senderName
        };
        setMessages(prev => [...prev, newMessage]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [isOpen, orderId, token, user]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current || !isConnected) return;

    const message = {
      orderId: orderId,
      sender: user?.email,
      senderName: user?.name,
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(message));
    
    // Add message to local state immediately
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      senderName: user?.name
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't show widget if no active order
  if (!orderId || (orderStatus !== 'CONFIRMED' && orderStatus !== 'PREPARING' && orderStatus !== 'READY')) {
    return null;
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-[100] w-full max-w-[380px]">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    👨‍🍳
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-gray-400'} border-2 border-primary rounded-full`}></div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Chef Chat</h4>
                  <p className="text-white/80 text-[10px] uppercase tracking-wider font-semibold">
                    {isConnected ? 'Online • Ready to help' : 'Connecting...'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
              {messages.length === 0 && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs shrink-0">
                    👨‍🍳
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Hello! I'm your chef. How can I help you with your order today? 👋
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 max-w-[85%] ${
                    message.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {message.sender !== 'user' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs shrink-0 mt-1">
                      👨‍🍳
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none shadow-primary/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`text-[10px] mt-1 block ${
                        message.sender === 'user'
                          ? 'text-white/70 text-right'
                          : 'text-slate-400'
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="relative flex items-center gap-2">
                <input
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                  placeholder="Type a message..."
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="fixed bottom-8 right-8 z-[110]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              {/* Unread indicator */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
