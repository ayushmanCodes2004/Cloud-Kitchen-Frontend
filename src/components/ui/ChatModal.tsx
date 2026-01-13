import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { chatApi } from '@/services/chatApi';

interface ChatMessage {
  id: number;
  chatSessionId: number;
  senderUserId: number;
  senderName: string;
  message: string;
  messageType: string;
  sentAt: string;
  readStatus: boolean;
}

interface ChatModalProps {
  orderId: number;
  orderStatus: string;
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    chatWebSocket: WebSocket | null;
  }
}

export const ChatModal: React.FC<ChatModalProps> = ({
  orderId,
  orderStatus,
  isOpen,
  onClose
}) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat messages and initialize WebSocket connection
  useEffect(() => {
    if (!isOpen || !token) return;

    const loadChatData = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔍 Checking chat availability for order:', orderId);
        console.log('🔍 Order status:', orderStatus);
        
        // Check if chat is enabled for this order
        const chatEnabledResponse = await chatApi.isChatEnabled(orderId, token);
        
        console.log('🔍 Chat enabled API response:', chatEnabledResponse);
        console.log('🔍 Response structure:', JSON.stringify(chatEnabledResponse, null, 2));
        
        // The response structure is: { success: true, message: "...", data: true/false }
        // So we access chatEnabledResponse.data directly, not chatEnabledResponse.data.data
        const isChatAvailable = chatEnabledResponse.data;
        
        console.log('🔍 Chat enabled value:', isChatAvailable);
        
        // Check if the API call was successful
        if (!chatEnabledResponse.success) {
          console.error('❌ Chat enabled API failed:', chatEnabledResponse.message);
          setIsChatEnabled(false);
          return;
        }
        
        setIsChatEnabled(isChatAvailable);
        
        if (isChatAvailable) {
          console.log('✅ Chat is enabled, loading messages...');
          // Load existing messages
          const messagesResponse = await chatApi.getChatMessages(orderId, token);
          
          setMessages(messagesResponse.data || []);
          
          // Initialize WebSocket connection
          initializeWebSocket();
        } else {
          console.log('❌ Chat is disabled for this order');
          console.log('🔍 API Response:', chatEnabledResponse);
          
          // Try to get debug info if available
          try {
            const debugResponse = await fetch(
              `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/chat/order/${orderId}/debug`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const debugData = await debugResponse.json();
            console.log('🔍 Debug info:', debugData);
          } catch (debugError) {
            console.log('🔍 Debug endpoint not available');
          }
        }
      } catch (error) {
        console.error('❌ Error loading chat data:', error);
        setIsChatEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [orderId, token, isOpen]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeWebSocket = () => {
    if (typeof window === 'undefined' || !user) return;

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionStatus('connecting');

    // Get the backend URL from environment
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    
    // Convert HTTP/HTTPS URL to WebSocket URL
    let wsUrl: string;
    if (backendUrl.includes('onrender.com')) {
      // Production: Render backend
      const renderHost = backendUrl.replace(/^https?:\/\//, '').replace('/api', '');
      wsUrl = `wss://${renderHost}/ws/chat/order/${orderId}/${user.id}`;
    } else if (backendUrl.includes('localhost')) {
      // Development: Local backend
      const protocol = backendUrl.startsWith('https') ? 'wss:' : 'ws:';
      const host = backendUrl.replace(/^https?:\/\//, '').replace('/api', '');
      wsUrl = `${protocol}//${host}/ws/chat/order/${orderId}/${user.id}`;
    } else {
      // Fallback: Auto-detect protocol
      const protocol = backendUrl.startsWith('https') ? 'wss:' : 'ws:';
      const host = backendUrl.replace(/^https?:\/\//, '').replace('/api', '');
      wsUrl = `${protocol}//${host}/ws/chat/order/${orderId}/${user.id}`;
    }

    console.log('Backend URL:', backendUrl);
    console.log('Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Chat WebSocket connected to:', wsUrl);
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          console.log('Received WebSocket message:', messageData);
          
          // Only add to messages if it's not a system welcome message
          if (messageData.messageType !== 'SYSTEM' || messageData.message !== 'Chat connection established successfully!') {
            setMessages(prev => [...prev, messageData]);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('Chat WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect after 3 seconds if the modal is still open
        if (isOpen && event.code !== 1000) { // 1000 is normal closure
          console.log('Scheduling WebSocket reconnection in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            initializeWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('Chat WebSocket error:', error);
        setConnectionStatus('error');
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message: WebSocket not ready or message empty');
      return;
    }

    // Prepare message to send
    const messageToSend = {
      orderId: orderId,
      userId: user?.id,
      message: newMessage.trim()
    };

    console.log('Sending message:', messageToSend);

    // Send via WebSocket
    wsRef.current.send(JSON.stringify(messageToSend));

    // Clear input
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  // Show loading state or disabled message
  if (isLoading) {
    // Still loading, show loading indicator
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Chat</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show disabled message only after loading is complete and chat is confirmed disabled
  if (!isChatEnabled) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Chat</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">
            Chat is not available for this order. Chat is enabled when the order is confirmed and disabled when delivered.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-3/4 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Order #{orderId} Chat</h3>
            {connectionStatus === 'connected' && (
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected</span>
              </div>
            )}
            {connectionStatus === 'connecting' && (
              <div className="flex items-center space-x-1 text-yellow-600 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Connecting...</span>
              </div>
            )}
            {connectionStatus === 'disconnected' && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Disconnected</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Connection Error</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p>No messages yet. Be the first to start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderUserId.toString() === user?.id?.toString() ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderUserId.toString() === user?.id?.toString()
                            ? 'bg-orange-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">
                          {msg.senderName}
                        </div>
                        <p className="text-sm">{msg.message}</p>
                        <div className="text-xs opacity-70 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg p-2 resize-none h-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!isChatEnabled}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isChatEnabled || !newMessage.trim() || connectionStatus !== 'connected'}
              className="bg-orange-500 text-white rounded-lg p-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {!isChatEnabled && (
            <p className="text-xs text-gray-500 mt-2">
              Chat is disabled for this order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};