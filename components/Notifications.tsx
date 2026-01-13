import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  projectId: string;
  projectName: string;
  type: 'progress' | 'photo' | 'comment' | 'milestone';
  message: string;
  timestamp: string;
  read: boolean;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem('buildtracker_notifications');
    if (saved) {
      const notifs = JSON.parse(saved);
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
    } else {
      // Demo notifications
      const demoNotifs: Notification[] = [
        {
          id: '1',
          projectId: '1',
          projectName: 'The Meridian Residences',
          type: 'progress',
          message: 'Foundation phase completed - now 65% done!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          projectId: '2',
          projectName: 'Queen Street Heritage Restoration',
          type: 'photo',
          message: 'New progress photo uploaded by Heritage Lover',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '3',
          projectId: '3',
          projectName: 'Yonge Street Mixed-Use Development',
          type: 'milestone',
          message: 'Excavation milestone reached!',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ];
      setNotifications(demoNotifs);
      setUnreadCount(2);
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('buildtracker_notifications', JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('buildtracker_notifications', JSON.stringify(updated));
      setUnreadCount(0);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('buildtracker_notifications');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'progress': return 'construction';
      case 'photo': return 'photo_camera';
      case 'comment': return 'chat_bubble';
      case 'milestone': return 'celebration';
      default: return 'notifications';
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'progress': return 'text-blue-400';
      case 'photo': return 'text-green-400';
      case 'comment': return 'text-purple-400';
      case 'milestone': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(true)}
        className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <span className="material-symbols-outlined text-white">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white">notifications</span>
                  <h2 className="text-xl font-black text-white">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-white">close</span>
                </button>
              </div>

              {notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark all as read
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12 px-4 text-slate-500">
                  <span className="material-symbols-outlined text-6xl mb-4 block text-slate-700">
                    notifications_off
                  </span>
                  <p className="text-lg font-bold mb-2">No notifications</p>
                  <p className="text-sm">
                    You'll get notified when there are updates on projects you follow
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full text-left p-4 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-b-0 ${
                        !notification.read ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                          <span className="material-symbols-outlined">
                            {getIcon(notification.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-sm text-white truncate">
                              {notification.projectName}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 mb-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Link */}
            <div className="p-4 border-t border-slate-800">
              <button className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">settings</span>
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Hook to add new notifications
export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const saved = localStorage.getItem('buildtracker_notifications');
    const existing = saved ? JSON.parse(saved) : [];
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updated = [newNotification, ...existing].slice(0, 50); // Keep max 50
    localStorage.setItem('buildtracker_notifications', JSON.stringify(updated));
    
    // Trigger custom event to update UI
    window.dispatchEvent(new Event('buildtracker-notification'));
  };

  return { addNotification };
};
