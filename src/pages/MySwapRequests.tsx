import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { swapRequests, clothes, users, currentUser } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
type TabType = 'sent' | 'received';
type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected' | 'completed';
export function MySwapRequests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  // Filter requests based on tab
  const tabRequests = swapRequests.filter((req) =>
  activeTab === 'sent' ?
  req.requesterId === currentUser.id :
  clothes.find((c) => c.id === req.requestedItemId)?.ownerId ===
  currentUser.id
  );
  // Further filter by status
  const filteredRequests = tabRequests.filter(
    (req) => statusFilter === 'all' || req.status === statusFilter
  );
  const handleAccept = (id: string) => {
    toast.success('Swap request accepted!');
    // In a real app, update state/backend here
  };
  const handleReject = (id: string) => {
    toast.error('Swap request rejected.');
    // In a real app, update state/backend here
  };
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          Swap Requests
        </h1>
        <p className="text-warmGray-500">
          Manage your sent and received swap offers.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-1 bg-warmGray-100 p-1 rounded-xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'received' ? 'bg-white text-warmGray-900 shadow-sm' : 'text-warmGray-500 hover:text-warmGray-700'}`}>
          
          Received
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'sent' ? 'bg-white text-warmGray-900 shadow-sm' : 'text-warmGray-500 hover:text-warmGray-700'}`}>
          
          Sent
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map(
          (status) =>
          <button
            key={status}
            onClick={() => setStatusFilter(status as StatusFilter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === status ? 'bg-warmGray-900 text-white' : 'bg-white border border-warmGray-200 text-warmGray-600 hover:bg-warmGray-50'}`}>
            
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>

        )}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ?
        <div className="text-center py-16 bg-white rounded-2xl border border-warmGray-100">
            <ArrowRightLeft className="mx-auto h-12 w-12 text-warmGray-300 mb-4" />
            <h3 className="text-lg font-medium text-warmGray-900 mb-1">
              No requests found
            </h3>
            <p className="text-warmGray-500">
              You don't have any {statusFilter !== 'all' ? statusFilter : ''}{' '}
              {activeTab} requests.
            </p>
          </div> :

        filteredRequests.map((request) => {
          const requestedItem = clothes.find(
            (c) => c.id === request.requestedItemId
          );
          const offeredItem = clothes.find(
            (c) => c.id === request.offeredItemId
          );
          const otherUserId =
          activeTab === 'sent' ?
          requestedItem?.ownerId :
          request.requesterId;
          const otherUser = users.find((u) => u.id === otherUserId);
          if (!requestedItem || !offeredItem || !otherUser) return null;
          return (
            <motion.div
              key={request.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 flex flex-col md:flex-row gap-6 items-center">
              
                {/* Items Swap Visual */}
                <div className="flex items-center gap-4 flex-1 w-full justify-center md:justify-start">
                  {/* Left Item (What current user gives) */}
                  <div className="text-center w-24">
                    <img
                    src={
                    activeTab === 'sent' ?
                    offeredItem.images[0] :
                    requestedItem.images[0]
                    }
                    alt="Item"
                    className="w-20 h-24 object-cover rounded-lg mx-auto mb-2 bg-warmGray-100" />
                  
                    <p className="text-xs text-warmGray-500 truncate">
                      {activeTab === 'sent' ? 'You offer' : 'Your item'}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <ArrowRightLeft className="text-warmGray-300 mb-1" />
                    <StatusBadge status={request.status} />
                  </div>

                  {/* Right Item (What current user gets) */}
                  <div className="text-center w-24">
                    <img
                    src={
                    activeTab === 'sent' ?
                    requestedItem.images[0] :
                    offeredItem.images[0]
                    }
                    alt="Item"
                    className="w-20 h-24 object-cover rounded-lg mx-auto mb-2 bg-warmGray-100" />
                  
                    <p className="text-xs text-warmGray-500 truncate">
                      {activeTab === 'sent' ? 'You want' : 'They offer'}
                    </p>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-warmGray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-3">
                    <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-8 h-8 rounded-full" />
                  
                    <div className="text-sm text-left">
                      <p className="font-medium text-warmGray-900">
                        {otherUser.name}
                      </p>
                      <p className="text-warmGray-500 text-xs">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {activeTab === 'received' &&
                  request.status === 'pending' &&
                  <>
                          <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 md:flex-none px-4 py-2 border border-warmGray-200 text-warmGray-700 rounded-lg text-sm font-medium hover:bg-warmGray-50 transition-colors">
                      
                            Reject
                          </button>
                          <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                      
                            Accept
                          </button>
                        </>
                  }

                    {request.status === 'accepted' &&
                  <button
                    onClick={() => navigate(`/exchange/${request.id}`)}
                    className="w-full px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm font-medium hover:bg-secondary-600 transition-colors">
                    
                        Choose Exchange Method
                      </button>
                  }

                    {request.status === 'completed' &&
                  <button
                    onClick={() => navigate('/reviews')}
                    className="w-full px-4 py-2 border border-primary-200 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                    
                        Leave Review
                      </button>
                  }
                  </div>
                </div>
              </motion.div>);

        })
        }
      </div>
    </div>);

}