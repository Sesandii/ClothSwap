import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ArrowRightLeft,
  MessageCircle,
  Truck,
  Star,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../lib/api';

type NotificationRecord = {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

const notifyNotificationChange = () => {
  window.dispatchEvent(new Event('clothswap:notifications-updated'));
};

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const response = await getNotifications();

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load notifications');
        }

        const data = (await response.json()) as NotificationRecord[];
        setNotifications(data);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Unable to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    void loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const response = await markAllNotificationsRead();

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to mark notifications as read');
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
      notifyNotificationChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update notifications');
    }
  };

  const handleOpenNotification = async (notification: NotificationRecord) => {
    if (!notification.read) {
      try {
        const response = await markNotificationRead(notification._id);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to mark notification as read');
        }

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );
        notifyNotificationChange();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to update notification');
        return;
      }
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'swap_request':
        return <ArrowRightLeft className="text-blue-500" />;
      case 'request_accepted':
        return <CheckCircle className="text-green-500" />;
      case 'new_message':
        return <MessageCircle className="text-purple-500" />;
      case 'delivery_update':
        return <Truck className="text-orange-500" />;
      case 'review_received':
        return <Star className="text-yellow-500" />;
      default:
        return <Bell className="text-warmGray-500" />;
    }
  };

  const grouped = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return notifications.reduce<Record<string, NotificationRecord[]>>((acc, notification) => {
      const date = notification.createdAt.split('T')[0];
      const group = date === today ? 'Today' : 'Earlier';

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(notification);
      return acc;
    }, {});
  }, [notifications]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            Notifications
          </h1>
          <p className="text-warmGray-500">
            Stay updated on your swaps and messages.
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={notifications.every((notification) => notification.read)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-warmGray-400 disabled:cursor-not-allowed"
        >
          Mark all as read
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-warmGray-200 p-8 text-center text-warmGray-500">
          Loading notifications...
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-2xl border border-warmGray-200 p-8 text-center">
          <p className="text-warmGray-700 font-medium mb-2">Unable to load notifications</p>
          <p className="text-sm text-warmGray-500">{loadError}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warmGray-200 p-12 text-center">
          <Bell className="mx-auto text-warmGray-300 mb-4" size={40} />
          <h2 className="text-lg font-medium text-warmGray-900 mb-1">No notifications yet</h2>
          <p className="text-warmGray-500 text-sm">
            New messages and swap updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, notifs]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-warmGray-500 uppercase tracking-wider mb-4">
                {group}
              </h3>
              <div className="bg-white rounded-2xl border border-warmGray-200 overflow-hidden shadow-sm divide-y divide-warmGray-100">
                {notifs.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => handleOpenNotification(notification)}
                    className={`w-full p-4 flex gap-4 text-left transition-colors ${
                      notification.read
                        ? 'bg-white hover:bg-warmGray-50'
                        : 'bg-primary-50/30 hover:bg-primary-50/50'
                    }`}
                  >
                    <div className="mt-1 shrink-0">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4
                          className={`text-sm ${
                            notification.read
                              ? 'font-medium text-warmGray-900'
                              : 'font-bold text-warmGray-900'
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-xs text-warmGray-400 whitespace-nowrap ml-2">
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          notification.read ? 'text-warmGray-500' : 'text-warmGray-700'
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
