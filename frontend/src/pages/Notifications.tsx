import React, { useState } from 'react';
import {
  Bell,
  ArrowRightLeft,
  MessageCircle,
  Truck,
  Star,
  CheckCircle } from
'lucide-react';
import { notifications as initialNotifications } from '../data/mockData';
export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: true
      }))
    );
  };
  const handleMarkRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
      n.id === id ?
      {
        ...n,
        read: true
      } :
      n
      )
    );
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
  // Group notifications by date (simplified for demo)
  const today = new Date().toISOString().split('T')[0];
  const grouped = notifications.reduce(
    (acc, notif) => {
      const date = notif.createdAt.split('T')[0];
      const group = date === today ? 'Today' : 'Earlier';
      if (!acc[group]) acc[group] = [];
      acc[group].push(notif);
      return acc;
    },
    {} as Record<string, typeof notifications>
  );
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            Notifications
          </h1>
          <p className="text-warmGray-500">
            Stay updated on your swaps and messages.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-sm font-medium text-primary-600 hover:text-primary-700">
          
          Mark all as read
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([group, notifs]) =>
        <div key={group}>
            <h3 className="text-sm font-semibold text-warmGray-500 uppercase tracking-wider mb-4">
              {group}
            </h3>
            <div className="bg-white rounded-2xl border border-warmGray-200 overflow-hidden shadow-sm divide-y divide-warmGray-100">
              {notifs.map((notif) =>
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`p-4 flex gap-4 cursor-pointer transition-colors ${notif.read ? 'bg-white hover:bg-warmGray-50' : 'bg-primary-50/30 hover:bg-primary-50/50'}`}>
              
                  <div className="mt-1 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                    className={`text-sm ${notif.read ? 'font-medium text-warmGray-900' : 'font-bold text-warmGray-900'}`}>
                    
                        {notif.title}
                      </h4>
                      <span className="text-xs text-warmGray-400 whitespace-nowrap ml-2">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </span>
                    </div>
                    <p
                  className={`text-sm ${notif.read ? 'text-warmGray-500' : 'text-warmGray-700'}`}>
                  
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read &&
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
              }
                </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>);

}