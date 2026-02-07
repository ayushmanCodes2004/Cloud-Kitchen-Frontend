import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import './FloatingChatWidget.css';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  sentAt: string;
  messageType: string;
}

interface FloatingChatWidgetProps {
  orderId: number | null;
  orderStatus: string;
  onOpenRequest?: number; // Timestamp to trigger reopen
}

const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  orderId,
  orderStatus,
  onOpenRequest
}) => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Get user info from localStorage
  const getUserId = (): number => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || 0;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    return 0;
  };

  const getUserName = (): string => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || 'User';
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    return 'User';
  };

  const userId = getUserId();
  const userName = getUserName();

  // Track if chat should be open based on orderId and onOpenRequest
  const shouldBeOpen = orderId !== null && (orderStatus === 'CONFIRMED' || orderStatus === 'PREPARING' || orderStatus === 'READY');

  // Open widget when onOpenRequest changes (user clicks "Chat with Chef")
  useEffect(() => {
    if (onOpenRequest && shouldBeOpen) {
      setIsWidgetOpen(true);
      setUnreadCount(0);
    }
  }, [onOpenRequest, shouldBeOpen]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to WebSocket
  const connectWebSocket = () => {
    if (isConnecting || isConnected || !orderId) {
      console.log('⚠️ Already connecting or connected, or no orderId');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setIsConnecting(false);
        return;
      }

      // Use environment variable for WebSocket URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const baseUrl = apiUrl.replace('/api', '').replace('http://', '').replace('https://', '');
      const protocol = apiUrl.startsWith('https://') ? 'wss://' : 'ws://';
      const wsUrl = `${protocol}${baseUrl}/ws/chat?orderId=${orderId}&userId=${userId}&token=${token}`;
      
      console.log('🔌 Connecting to WebSocket:', wsUrl);

      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      websocket.onmessage = (event) => {
        try {
          console.log('📨 Received raw message:', event.data);

          if (!event.data || event.data.trim() === '') {
            console.warn('⚠️ Received empty message data');
            return;
          }

          const data = JSON.parse(event.data);
          console.log('📨 Parsed message:', data);

          // Handle system messages
          if (data.messageType === 'SYSTEM') {
            console.log('ℹ️ System message:', data.message);
            return;
          }

          // Handle error messages
          if (data.messageType === 'ERROR') {
            console.error('❌ Error message:', data.error);
            setError(data.error);
            return;
          }

          // Handle chat messages
          if (data.message && data.senderName) {
            setMessages(prev => {
              // Avoid duplicates
              if (prev.some(msg => msg.id === data.id)) {
                return prev;
              }
              return [...prev, data];
            });

            // Increment unread count if widget is closed and message is from other user
            if (!isWidgetOpen && data.senderId !== userId) {
              setUnreadCount(prev => prev + 1);
            }
          } else {
            console.warn('⚠️ Message missing required fields:', data);
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setError('Connection error');
        setIsConnecting(false);
      };

      websocket.onclose = (event) => {
        console.log('❌ WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS && shouldBeOpen && isWidgetOpen) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setError('Connection lost. Please refresh the page.');
        }
      };

      setWs(websocket);
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setError('Failed to connect');
      setIsConnecting(false);
    }
  };

  // Connect when widget opens and orderId is available
  useEffect(() => {
    if (isWidgetOpen && orderId && shouldBeOpen) {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [isWidgetOpen, orderId, shouldBeOpen]);

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !ws || !isConnected) {
      console.warn('⚠️ Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasWs: !!ws, 
        isConnected 
      });
      return;
    }

    try {
      const messageData = {
        orderId,
        userId,
        message: newMessage.trim()
      };

      console.log('📤 Sending message:', messageData);
      ws.send(JSON.stringify(messageData));
      setNewMessage('');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      setError('Failed to send message');
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle widget open/close
  const toggleWidget = () => {
    setIsWidgetOpen(!isWidgetOpen);
    if (!isWidgetOpen) {
      setUnreadCount(0); // Reset unread count when opening
    }
  };

  if (!shouldBeOpen) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleWidget}
        className="chat-toggle-button"
        aria-label="Toggle chat"
      >
        {isWidgetOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </>
        )}
      </button>

      {/* Chat Widget */}
      {isWidgetOpen && (
        <div className="floating-chat-widget">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chef-avatar">👨‍🍳</div>
              <div>
                <h3>Chef Chat</h3>
                <p className="chat-status">
                  {isConnecting && 'Connecting...'}
                  {isConnected && (
                    <>
                      <span className="status-dot status-online"></span>
                      Online • Ready to help
                    </>
                  )}
                  {!isConnecting && !isConnected && (
                    <>
                      <span className="status-dot status-offline"></span>
                      Offline
                    </>
                  )}
                </p>
              </div>
            </div>
            <button onClick={toggleWidget} className="close-button">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="chat-error">
              <span>⚠️ {error}</span>
              <button onClick={connectWebSocket} className="retry-button">
                Retry
              </button>
            </div>
          )}

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <div className="welcome-icon">👋</div>
                <h4>Welcome to Chef Chat!</h4>
                <p>Ask questions about your order and get real-time responses from your chef.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.senderId === userId ? 'message-user' : 'message-chef'}`}
                >
                  {msg.senderId !== userId && (
                    <div className="message-avatar">👨‍🍳</div>
                  )}
                  <div className="message-content-wrapper">
                    <div className="message-content">{msg.message}</div>
                    <div className="message-time">
                      {new Date(msg.sentAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected}
              className="chat-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
