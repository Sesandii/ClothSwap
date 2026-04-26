import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink } from 'lucide-react';
import { swapRequests, clothes, users } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
export function ManageSwaps() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const tabs = [
  'All',
  'Pending',
  'Accepted',
  'Rejected',
  'Completed',
  'Cancelled'];

  const filteredSwaps = swapRequests.filter((swap) => {
    const requester = users.find((u) => u.id === swap.requesterId)?.name || '';
    const matchesSearch = requester.
    toLowerCase().
    includes(searchTerm.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && swap.status === activeTab.toLowerCase();
  });
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {tabs.map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-warmGray-900 text-white' : 'bg-white text-warmGray-600 border border-warmGray-200 hover:bg-warmGray-50'}`}>
            
              {tab}
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray-400"
            size={20} />
          
          <input
            type="text"
            placeholder="Search by user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm" />
          
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Requester</th>
                <th className="px-6 py-4 font-medium">Exchange Items</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredSwaps.map((swap) => {
                const requester = users.find((u) => u.id === swap.requesterId);
                const requestedItem = clothes.find(
                  (c) => c.id === swap.requestedItemId
                );
                const offeredItem = clothes.find(
                  (c) => c.id === swap.offeredItemId
                );
                const owner = users.find((u) => u.id === requestedItem?.ownerId);
                return (
                  <tr
                    key={swap.id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={requester?.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full" />
                        
                        <span className="font-medium text-warmGray-900">
                          {requester?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-warmGray-100 p-1.5 rounded-lg">
                          <img
                            src={offeredItem?.images[0]}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                            title="Offered" />
                          
                          <span className="text-warmGray-400">⇄</span>
                          <img
                            src={requestedItem?.images[0]}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                            title="Requested" />
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={owner?.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full" />
                        
                        <span className="font-medium text-warmGray-900">
                          {owner?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={swap.status} />
                    </td>
                    <td className="px-6 py-4 text-warmGray-500">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details">
                          
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {filteredSwaps.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No swap requests found.
          </div>
        }
      </div>
    </motion.div>);

}