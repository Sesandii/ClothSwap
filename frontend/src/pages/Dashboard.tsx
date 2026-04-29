import React, { useEffect, useMemo, useState } from 'react';
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
  TrendingUp
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '../components/StatusBadge';
import { apiFetch } from '../lib/api';
import { getStoredUser } from '../lib/auth';

type UserRef = {
  _id?: string;
  name?: string;
  location?: string;
  profilePic?: string;
};

type ClothesRecord = {
  _id: string;
  title: string;
  brand?: string;
  description?: string;
  size?: string;
  category?: string;
  condition?: string;
  gender?: string;
  color?: string;
  location?: string;
  images?: string[];
  createdAt: string;
  user?: UserRef | string;
};

type SwapRequestRecord = {
  _id: string;
  requester?: UserRef | string;
  offeredClothes?: ClothesRecord | string;
  requestedClothes?: ClothesRecord | string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
};

type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'swap_request' | 'request_accepted' | 'request_rejected' | 'new_message' | 'review_received';
};

const getRecordId = (value: UserRef | ClothesRecord | string | undefined) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value._id || '';
};

const getItemOwnerId = (item: ClothesRecord | undefined) => {
  if (!item) {
    return '';
  }

  if (typeof item.user === 'string') {
    return item.user;
  }

  return item.user?._id || '';
};

const getItemTitle = (item: ClothesRecord | undefined, fallback = 'item') =>
  item?.title || fallback;

const sortByNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export function Dashboard() {
  const loggedInUser = getStoredUser();
  const currentUserId = loggedInUser._id ?? loggedInUser.id ?? '';
  const firstName = loggedInUser.name?.split(' ')[0] || 'there';
  const [myClothes, setMyClothes] = useState<ClothesRecord[]>([]);
  const [allClothes, setAllClothes] = useState<ClothesRecord[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setLoadError('');

        const [myClothesResponse, allClothesResponse, swapRequestsResponse] = await Promise.all([
          apiFetch('/api/clothes/me'),
          apiFetch('/api/clothes'),
          apiFetch('/api/swapRequests')
        ]);

        if (!myClothesResponse.ok) {
          throw new Error('Failed to load your clothes');
        }

        if (!allClothesResponse.ok) {
          throw new Error('Failed to load marketplace clothes');
        }

        if (!swapRequestsResponse.ok) {
          throw new Error('Failed to load swap requests');
        }

        const [myClothesData, allClothesData, swapRequestsData] = await Promise.all([
          myClothesResponse.json(),
          allClothesResponse.json(),
          swapRequestsResponse.json()
        ]);

        setMyClothes(myClothesData);
        setAllClothes(allClothesData);
        setSwapRequests(swapRequestsData);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Unable to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const clothesById = useMemo(() => {
    return new Map(allClothes.map((item) => [item._id, item] as const));
  }, [allClothes]);

  const relatedSwapRequests = useMemo(() => {
    return swapRequests
      .map((request) => {
        const requestedClothes =
          typeof request.requestedClothes === 'string'
            ? clothesById.get(request.requestedClothes)
            : request.requestedClothes;
        const offeredClothes =
          typeof request.offeredClothes === 'string'
            ? clothesById.get(request.offeredClothes)
            : request.offeredClothes;
        const requesterId = getRecordId(request.requester);
        const requestedOwnerId = getItemOwnerId(requestedClothes);
        const offeredOwnerId = getItemOwnerId(offeredClothes);
        const isCurrentUserInvolved =
          requesterId === currentUserId ||
          requestedOwnerId === currentUserId ||
          offeredOwnerId === currentUserId;

        return {
          ...request,
          requesterId,
          requestedClothes,
          offeredClothes,
          requestedOwnerId,
          offeredOwnerId,
          isCurrentUserInvolved
        };
      })
      .filter((request) => request.isCurrentUserInvolved)
      .sort(sortByNewest);
  }, [clothesById, currentUserId, swapRequests]);

  const recentNotifications = useMemo<DashboardNotification[]>(() => {
    return relatedSwapRequests.slice(0, 5).map((request) => {
      const requesterName =
        typeof request.requester === 'string' ? 'A user' : request.requester?.name || 'A user';
      const requestedTitle = getItemTitle(request.requestedClothes, 'an item');
      const offeredTitle = getItemTitle(request.offeredClothes, 'an item');

      if (request.status === 'pending' && request.requestedOwnerId === currentUserId) {
        return {
          id: request._id,
          title: 'New swap request',
          message: `${requesterName} wants to swap for ${requestedTitle}.`,
          createdAt: request.createdAt,
          read: false,
          type: 'swap_request'
        };
      }

      if (request.status === 'accepted' && request.requesterId === currentUserId) {
        return {
          id: request._id,
          title: 'Request accepted',
          message: `Your request for ${requestedTitle} was accepted.`,
          createdAt: request.createdAt,
          read: true,
          type: 'request_accepted'
        };
      }

      if (request.status === 'rejected' && request.requesterId === currentUserId) {
        return {
          id: request._id,
          title: 'Request rejected',
          message: `Your request for ${requestedTitle} was rejected.`,
          createdAt: request.createdAt,
          read: true,
          type: 'request_rejected'
        };
      }

      return {
        id: request._id,
        title: request.status === 'completed' ? 'Swap completed' : 'Swap update',
        message:
          request.requesterId === currentUserId
            ? `Your ${offeredTitle} swap is now ${request.status}.`
            : `${requesterName}'s swap involving ${requestedTitle} is now ${request.status}.`,
        createdAt: request.createdAt,
        read: request.status !== 'pending',
        type: request.status === 'completed' ? 'review_received' : 'swap_request'
      };
    });
  }, [currentUserId, relatedSwapRequests]);

  const recentSwaps = useMemo(() => relatedSwapRequests.slice(0, 4), [relatedSwapRequests]);
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
      value: relatedSwapRequests.filter((req) => req.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      label: 'Accepted Swaps',
      value: relatedSwapRequests.filter((req) => req.status === 'accepted').length,
      icon: TrendingUp,
      color: 'text-secondary-500',
      bg: 'bg-secondary-50'
    },
    {
      label: 'Completed Swaps',
      value: relatedSwapRequests.filter((req) => req.status === 'completed').length,
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
          Loading dashboard...
        </h2>
        <p className="text-warmGray-600">We are fetching your live swap and clothing data.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
          Unable to Load Dashboard
        </h2>
        <p className="text-warmGray-600 mb-6">{loadError}</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
        >
          <RefreshCw size={20} />
          Try browsing clothes instead
        </Link>
      </div>
    );
  }

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
          Welcome back, {firstName}! 👋
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
              const requestedItem =
                typeof swap.requestedClothes === 'string'
                  ? clothesById.get(swap.requestedClothes)
                  : swap.requestedClothes;
              return (
                <div
                  key={swap._id}
                  className="p-4 hover:bg-warmGray-50 transition-colors">

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-warmGray-900">
                      Swap Request
                    </p>
                    <StatusBadge status={swap.status} />
                  </div>
                  <p className="text-sm text-warmGray-600 mb-2">
                    {getItemTitle(requestedItem, 'Clothes swap')}
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