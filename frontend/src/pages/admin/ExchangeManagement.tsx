import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
import { getAdminSwaps, updateAdminSwap } from '../../lib/api';
import { getAvatarUrl } from '../../lib/auth';
export function ExchangeManagement() {
  const [activeTab, setActiveTab] = useState('meetup');
  const [swaps, setSwaps] = useState<any[]>([]);
  const tabs = [
  {
    id: 'meetup',
    label: 'Meetup Swaps'
  },
  {
    id: 'delivery',
    label: 'Delivery Swaps'
  },
  {
    id: 'collection_point',
    label: 'Collection Point Swaps'
  }];

  useEffect(() => {
    const loadSwaps = async () => {
      const response = await getAdminSwaps();
      const data = await response.json();

      if (response.ok) {
        setSwaps(data);
      }
    };

    loadSwaps();
  }, []);
  const methodForTab = activeTab === 'collection_point' ? 'collection' : activeTab;
  const filteredExchanges = swaps.filter((swap) => swap.exchangeMethod?.method === methodForTab);
  const handleUpdateStatus = async (swapId: string, exchangeStatus: string) => {
    try {
      const response = await updateAdminSwap(swapId, { exchangeStatus });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update exchange');
      }

      setSwaps((prev) => prev.map((swap) => (swap._id === swapId ? data : swap)));
      toast.success('Exchange updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update exchange');
    }
  };
  const handleResolveDispute = async (swapId: string) => {
    await handleUpdateStatus(swapId, 'accepted');
  };
  const handleTrackingUpdate = async (swap: any) => {
    const trackingNumber = window.prompt('Tracking number', swap.exchangeMethod?.details?.trackingNumber || '');
    if (trackingNumber === null) return;

    const courier = window.prompt('Courier', swap.exchangeMethod?.details?.courier || '');
    if (courier === null) return;

    try {
      const response = await updateAdminSwap(swap._id, { trackingNumber, courier });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update tracking');
      }

      setSwaps((prev) => prev.map((item) => (item._id === swap._id ? data : item)));
      toast.success('Tracking updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update tracking');
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-6">
      
      <div className="flex gap-2 border-b border-warmGray-200">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-warmGray-500 hover:text-warmGray-700 hover:border-warmGray-300'}`}>
          
            {tab.label}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Swap ID</th>
                <th className="px-6 py-4 font-medium">Users</th>
                {activeTab === 'meetup' &&
                <th className="px-6 py-4 font-medium">Location & Time</th>
                }
                {activeTab === 'delivery' &&
                <th className="px-6 py-4 font-medium">Courier & Tracking</th>
                }
                {activeTab === 'collection_point' &&
                <th className="px-6 py-4 font-medium">Collection Point</th>
                }
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredExchanges.map((swap) => {
                const exchange = swap.exchangeMethod;
                const requester = swap.requester;
                return (
                  <tr
                    key={swap._id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4 font-mono text-xs text-warmGray-500">
                      {swap._id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(requester)}
                          alt=""
                          className="w-6 h-6 rounded-full" />
                        
                        <span className="font-medium text-warmGray-900">
                          {requester?.name}
                        </span>
                        <span className="text-warmGray-400 text-xs">
                          and 1 other
                        </span>
                      </div>
                    </td>

                    {activeTab === 'meetup' &&
                    <td className="px-6 py-4">
                        <p className="text-warmGray-900">
                          {exchange.details?.location || 'Not set'}
                        </p>
                        <p className="text-xs text-warmGray-500">
                          {exchange.details?.date || 'No date'} at {exchange.details?.time || 'No time'}
                        </p>
                      </td>
                    }

                    {activeTab === 'delivery' &&
                    <td className="px-6 py-4">
                        <p className="text-warmGray-900">
                          {exchange.details?.courier || 'Not set'}
                        </p>
                        <p className="text-xs font-mono text-warmGray-500">
                          {exchange.details?.trackingNumber || 'Pending'}
                        </p>
                      </td>
                    }

                    {activeTab === 'collection_point' &&
                    <td className="px-6 py-4">
                        <p className="text-warmGray-900">
                          {exchange.details?.collectionPoint || 'Not set'}
                        </p>
                      </td>
                    }

                    <td className="px-6 py-4">
                      <StatusBadge status={exchange.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={exchange.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(swap._id, e.target.value)}
                          className="px-3 py-1.5 border border-warmGray-200 rounded-lg text-warmGray-600 bg-white">
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {activeTab === 'delivery' &&
                        <button
                          onClick={() => handleTrackingUpdate(swap)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-warmGray-200 rounded-lg text-warmGray-600 hover:bg-warmGray-50 transition-colors">
                          Update <ChevronDown size={14} />
                        </button>
                        }
                        <button
                          onClick={() => handleResolveDispute(swap._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Resolve Dispute">
                          
                          <AlertCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {filteredExchanges.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No exchanges found for this method.
          </div>
        }
      </div>
    </motion.div>);

}
