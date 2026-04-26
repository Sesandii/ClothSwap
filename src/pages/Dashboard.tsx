import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  Star,
  Plus,
  Search,
  RefreshCw,
  Bell,
  MessageSquare,
  TrendingUp } from
'lucide-react';
import { motion } from 'framer-motion';
import {
  currentUser,
  clothes,
  swapRequests,
  notifications } from
'../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
export function Dashboard() {
  const myClothes = clothes.filter((item) => item.ownerId === currentUser.id);
  const pendingRequests = swapRequests.filter((req) => req.status === 'pending');
  const acceptedSwaps = swapRequests.filter((req) => req.status === 'accepted');
  const completedSwaps = swapRequests.filter(
    (req) => req.status === 'completed'
  );
  const recentNotifications = notifications.slice(0, 5);
  const recentSwaps = swapRequests.slice(0, 4);
  const stats = [
  {
    label: 'Total Uploaded',
    value: myClothes.length,
    icon: Package,
    color: 'text-primary-500',
    bg: 'bg-primary-50'
  },
  {
    label: 'Pending Requests',
    value: pendingRequests.length,
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50'
  },
  {
    label: 'Accepted Swaps',
    value: acceptedSwaps.length,
    icon: TrendingUp,
    color: 'text-secondary-500',
    bg: 'bg-secondary-50'
  },
  {
    label: 'Completed Swaps',
    value: completedSwaps.length,
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50'
  }];

  const quickActions = [
  {
    title: 'Add Clothes',
    description: 'List a new item',
    icon: Plus,
    link: '/add-clothes',
    color: 'bg-primary-500'
  },
  {
    title: 'Browse Clothes',
    description: 'Find items to swap',
    icon: Search,
    link: '/browse',
    color: 'bg-secondary-500'
  },
  {
    title: 'My Swaps',
    description: 'View swap requests',
    icon: RefreshCw,
    link: '/my-swaps',
    color: 'bg-warmGray-700'
  }];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request':
        return RefreshCw;
      case 'request_accepted':
      case 'request_rejected':
        return CheckCircle;
      case 'new_message':
        return MessageSquare;
      case 'review_received':
        return Star;
      default:
        return Bell;
    }
  };
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mb-8">
        
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          Welcome back, {currentUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-warmGray-600">
          Here's what's happening with your swaps today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {stats.map((stat, index) =>
        <motion.div
          key={index}
          variants={item}
          className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
          
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`${stat.color}`} size={24} />
              </div>
              <span className="text-3xl font-bold text-warmGray-900">
                {stat.value}
              </span>
            </div>
            <p className="text-sm font-medium text-warmGray-600">
              {stat.label}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.2
        }}
        className="mb-8">
        
        <h2 className="text-xl font-serif font-bold text-warmGray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) =>
          <Link
            key={index}
            to={action.link}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 hover:shadow-md transition-all">
            
              <div
              className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              
                <action.icon className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-warmGray-900 mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-warmGray-600">{action.description}</p>
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notifications */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3
          }}>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-warmGray-900">
              Recent Notifications
            </h2>
            <Link
              to="/notifications"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              
              View all
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 divide-y divide-warmGray-100">
            {recentNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-warmGray-50 transition-colors ${!notification.read ? 'bg-primary-50/30' : ''}`}>
                  
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${!notification.read ? 'bg-primary-100' : 'bg-warmGray-100'}`}>
                      
                      <Icon
                        size={16}
                        className={
                        !notification.read ?
                        'text-primary-500' :
                        'text-warmGray-600'
                        } />
                      
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warmGray-900 mb-1">
                        {notification.title}
                      </p>
                      <p className="text-sm text-warmGray-600 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-warmGray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read &&
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    }
                  </div>
                </div>);

            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-warmGray-900">
              Recent Activity
            </h2>
            <Link
              to="/my-swaps"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              
              View all
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 divide-y divide-warmGray-100">
            {recentSwaps.map((swap) => {
              const requestedItem = clothes.find(
                (c) => c.id === swap.requestedItemId
              );
              return (
                <div
                  key={swap.id}
                  className="p-4 hover:bg-warmGray-50 transition-colors">
                  
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-warmGray-900">
                      Swap Request
                    </p>
                    <StatusBadge status={swap.status} />
                  </div>
                  <p className="text-sm text-warmGray-600 mb-2">
                    {requestedItem?.title}
                  </p>
                  <p className="text-xs text-warmGray-400">
                    {new Date(swap.createdAt).toLocaleDateString()}
                  </p>
                </div>);

            })}
          </div>
        </motion.div>
      </div>
    </div>);

}