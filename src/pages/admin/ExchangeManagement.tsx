import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { exchangeMethods, swapRequests, users } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
export function ExchangeManagement() {
  const [activeTab, setActiveTab] = useState('meetup');
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

  const filteredExchanges = exchangeMethods.filter(
    (ex) => ex.method === activeTab
  );
  const handleResolveDispute = () => {
    toast.success('Dispute resolution initiated');
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
              {filteredExchanges.map((exchange) => {
                const swap = swapRequests.find(
                  (s) => s.id === exchange.swapRequestId
                );
                const requester = users.find((u) => u.id === swap?.requesterId);
                return (
                  <tr
                    key={exchange.id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4 font-mono text-xs text-warmGray-500">
                      {exchange.swapRequestId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={requester?.avatar}
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
                          {exchange.details.location}
                        </p>
                        <p className="text-xs text-warmGray-500">
                          {exchange.details.date} at {exchange.details.time}
                        </p>
                      </td>
                    }

                    {activeTab === 'delivery' &&
                    <td className="px-6 py-4">
                        <p className="text-warmGray-900">
                          {exchange.details.courier}
                        </p>
                        <p className="text-xs font-mono text-warmGray-500">
                          {exchange.details.trackingNumber || 'Pending'}
                        </p>
                      </td>
                    }

                    {activeTab === 'collection_point' &&
                    <td className="px-6 py-4">
                        <p className="text-warmGray-900">
                          {exchange.details.pointName}
                        </p>
                      </td>
                    }

                    <td className="px-6 py-4">
                      <StatusBadge status={exchange.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-warmGray-200 rounded-lg text-warmGray-600 hover:bg-warmGray-50 transition-colors">
                          Update <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={handleResolveDispute}
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