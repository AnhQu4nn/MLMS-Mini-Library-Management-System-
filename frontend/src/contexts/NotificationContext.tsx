import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  bookTitle?: string;
  dueDate?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mlms_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // Add some initial sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: '📚 Sách sắp hết hạn',
          message: '"React.js Toàn tập" cần trả trong 2 ngày',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          bookTitle: 'React.js Toàn tập',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days from now
        },
        {
          id: '2',
          type: 'error',
          title: '⚠️ Sách quá hạn',
          message: '"Node.js và Express" đã quá hạn 1 ngày',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          bookTitle: 'Node.js và Express'
        },
        {
          id: '3',
          type: 'success',
          title: '✅ Sách mới có sẵn',
          message: '"Python cho người mới bắt đầu" đã có sẵn để mượn',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          bookTitle: 'Python cho người mới bắt đầu'
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('mlms_notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mlms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const refreshNotifications = () => {
    // This could fetch real notifications from API
    // For now, we'll just trigger a re-render
    setNotifications(prev => [...prev]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

