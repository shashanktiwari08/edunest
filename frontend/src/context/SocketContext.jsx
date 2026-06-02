import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const wsRef = useRef(null);

  const addToast = (type, title, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    // Auto-remove toast after 8 seconds for perfect user readability
    setTimeout(() => {
      removeToast(id);
    }, 8000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const wsBase = baseApiUrl.replace(/^http/, 'ws');
    const wsUrl = `${wsBase}?userId=${user.id}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket client connection established.');
      // Register with active user ID
      ws.send(JSON.stringify({ type: 'REGISTER', userId: user.id }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);

        if (data.type === 'NEW_LECTURE') {
          addToast(
            'warning',
            `📅 New Lecture Scheduled!`,
            `"${data.topic}" has been added to ${data.batchName} on ${data.date} at ${data.start_time}.`
          );
        } else if (data.type === 'NEW_BATCH') {
          addToast(
            'success',
            `🎓 New Batch Enrollment!`,
            data.message
          );
        } else if (data.type === 'BROADCAST_NOTICE') {
          addToast(
            'success',
            `📣 Broadcast from ${data.batchName}`,
            data.message
          );
        } else if (data.type === 'LEAVE_STATUS_UPDATE') {
          addToast(
            data.status === 'approved' ? 'success' : 'danger',
            `🍁 Leave Application Reviewed`,
            data.message
          );
        } else if (data.type === 'FINANCE_UPDATE') {
          addToast(
            data.status === 'paid' ? 'success' : 'warning',
            `💳 Balance Activity Alert`,
            data.message
          );
        } else if (data.type === 'CREDENTIALS_UPDATE') {
          addToast(
            'danger',
            `🔐 Security Credentials Alert`,
            data.message
          );
        }
      } catch (err) {
        console.error('Error reading WebSocket packet:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket connection error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      {/* Global Glass Notification Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>
                {toast.title}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {toast.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
