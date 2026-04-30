import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { getAvatarUrl, getStoredUser } from '../lib/auth';
import { StatusBadge } from '../components/StatusBadge';

type UserRef = {
  _id: string;
  name?: string;
  location?: string;
  profilePic?: string;
};

type ClothesItem = {
  _id: string;
  title: string;
  images?: string[];
  user?: UserRef | string;
};

type SwapRequestItem = {
  _id: string;
  requester: UserRef;
  offeredOwner?: UserRef;
  requestedOwner?: UserRef;
  offeredClothes: ClothesItem | null;
  requestedClothes: ClothesItem | null;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  exchangeMethod?: {
    method?: 'meetup' | 'delivery' | 'collection';
  };
  createdAt: string;
};

type TabType = 'sent' | 'received';
type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected' | 'completed';

const placeholderImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

const getUserId = () => getStoredUser()._id || getStoredUser().id || '';

const getRefId = (value?: UserRef | string) =>
  typeof value === 'string' ? value : value?._id || '';

const getRequestSide = (request: SwapRequestItem, currentUserId: string): TabType | null => {
  const offeredOwnerId = getRefId(request.offeredOwner) || getRefId(request.requester);
  const requestedOwnerId =
    getRefId(request.requestedOwner) || getRefId(request.requestedClothes?.user);

  if (offeredOwnerId === currentUserId) {
    return 'sent';
  }

  if (requestedOwnerId === currentUserId) {
    return 'received';
  }

  if (request.status === 'completed') {
    const offeredCurrentOwnerId = getRefId(request.offeredClothes?.user);
    const requestedCurrentOwnerId = getRefId(request.requestedClothes?.user);

    if (requestedCurrentOwnerId === currentUserId) {
      return 'sent';
    }

    if (offeredCurrentOwnerId === currentUserId) {
      return 'received';
    }
  }

  return null;
};

export function MySwapRequests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [swapRequests, setSwapRequests] = useState<SwapRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const currentUserId = getUserId();

  const loadSwaps = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch('/api/swapRequests/mine');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load swap requests');
      }

      setSwapRequests(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load swap requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSwaps();
  }, []);

  const filteredRequests = useMemo(() => {
    return swapRequests
      .filter((request) => getRequestSide(request, currentUserId) === activeTab)
      .filter((request) => statusFilter === 'all' || request.status === statusFilter);
  }, [activeTab, currentUserId, statusFilter, swapRequests]);

  const updateStatus = async (
    id: string,
    status: 'accepted' | 'rejected' | 'completed'
  ) => {
    try {
      setBusyId(id);
      const response = await apiFetch(`/api/swapRequests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update swap request');
      }

      setSwapRequests((requests) =>
        requests.map((request) => (request._id === id ? data : request))
      );
      toast.success(`Swap request ${status}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update swap request');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            Swap Requests
          </h1>
          <p className="text-warmGray-500">
            Manage your sent and received swap offers.
          </p>
        </div>
        <button
          onClick={() => void loadSwaps()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-warmGray-200 rounded-lg text-sm font-medium text-warmGray-700 hover:bg-warmGray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="flex space-x-1 bg-warmGray-100 p-1 rounded-xl mb-6 max-w-md">
        {(['received', 'sent'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-warmGray-900 shadow-sm'
                : 'text-warmGray-500 hover:text-warmGray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'pending', 'accepted', 'rejected', 'completed'] as StatusFilter[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-warmGray-900 text-white'
                  : 'bg-white border border-warmGray-200 text-warmGray-600 hover:bg-warmGray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16 text-warmGray-500">Loading swap requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-warmGray-100">
            <ArrowRightLeft className="mx-auto h-12 w-12 text-warmGray-300 mb-4" />
            <h3 className="text-lg font-medium text-warmGray-900 mb-1">
              No requests found
            </h3>
            <p className="text-warmGray-500">
              You do not have any {statusFilter !== 'all' ? statusFilter : ''}{' '}
              {activeTab} requests.
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const requestedItem = request.requestedClothes;
            const offeredItem = request.offeredClothes;
            const requestSide = getRequestSide(request, currentUserId) || activeTab;
            const otherUser =
              requestSide === 'sent'
                ? request.requestedOwner || (typeof requestedItem?.user === 'object' ? requestedItem.user : undefined)
                : request.offeredOwner || request.requester;
            const isBusy = busyId === request._id;

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="flex items-center gap-4 flex-1 w-full justify-center md:justify-start">
                  <SwapItem
                    item={requestSide === 'sent' ? offeredItem : requestedItem}
                    label={requestSide === 'sent' ? 'You offer' : 'Your item'}
                  />
                  <div className="flex flex-col items-center px-2">
                    <ArrowRightLeft className="text-warmGray-300 mb-1" />
                    <StatusBadge status={request.status} />
                  </div>
                  <SwapItem
                    item={requestSide === 'sent' ? requestedItem : offeredItem}
                    label={requestSide === 'sent' ? 'You want' : 'They offer'}
                  />
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-warmGray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(otherUser)}
                      alt={otherUser?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-sm text-left">
                      <p className="font-medium text-warmGray-900">{otherUser?.name}</p>
                      <p className="text-warmGray-500 text-xs">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {request.message && (
                    <p className="max-w-xs text-sm text-warmGray-500 text-center md:text-right">
                      {request.message}
                    </p>
                  )}

                  <div className="flex gap-2 w-full md:w-auto">
                    {activeTab === 'received' && request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => void updateStatus(request._id, 'rejected')}
                          disabled={isBusy}
                          className="flex-1 md:flex-none px-4 py-2 border border-warmGray-200 text-warmGray-700 rounded-lg text-sm font-medium hover:bg-warmGray-50 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => void updateStatus(request._id, 'accepted')}
                          disabled={isBusy}
                          className="flex-1 md:flex-none px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                        >
                          Accept
                        </button>
                      </>
                    )}

                    {request.status === 'accepted' && (
                      <button
                        onClick={() =>
                          navigate(
                            request.exchangeMethod?.method
                              ? `/exchange-tracking/${request._id}`
                              : `/exchange/${request._id}`
                          )
                        }
                        className="w-full px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm font-medium hover:bg-secondary-600 transition-colors"
                      >
                        {request.exchangeMethod?.method ? 'Track Exchange' : 'Choose Exchange Method'}
                      </button>
                    )}

                    {request.status === 'completed' && (
                      <button
                        onClick={() => navigate('/reviews')}
                        className="w-full px-4 py-2 border border-primary-200 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SwapItem({ item, label }: { item: ClothesItem | null; label: string }) {
  if (!item) {
    return (
      <div className="text-center w-24">
        <div className="w-20 h-24 rounded-lg mx-auto mb-2 bg-warmGray-100 flex items-center justify-center text-[11px] text-warmGray-400 px-2">
          Item unavailable
        </div>
        <p className="text-xs text-warmGray-500 truncate">{label}</p>
        <p className="text-xs font-medium text-warmGray-400 truncate">Removed item</p>
      </div>
    );
  }

  return (
    <div className="text-center w-24">
      <img
        src={item.images?.[0] || placeholderImage}
        alt={item.title}
        className="w-20 h-24 object-cover rounded-lg mx-auto mb-2 bg-warmGray-100"
      />
      <p className="text-xs text-warmGray-500 truncate">{label}</p>
      <p className="text-xs font-medium text-warmGray-800 truncate">{item.title}</p>
    </div>
  );
}
