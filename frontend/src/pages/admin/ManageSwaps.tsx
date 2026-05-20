import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Trash2 } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { deleteAdminSwap, getAdminSwaps, updateAdminSwap } from '../../lib/api';
import { getAvatarUrl } from '../../lib/auth';
import { toast } from 'sonner';
import { AdminDetailModal } from '../../components/AdminDetailModal';

const getItemImage = (item: any) =>
  item?.images?.[0] || getAvatarUrl({ name: item?.title }, 'd6d3d1');

function SwapItemsPreview({ swap }: { swap: any }) {
  if (!swap) return null;

  const offeredItem = swap.offeredClothes;
  const requestedItem = swap.requestedClothes;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
      <div className="rounded-xl border border-warmGray-100 bg-warmGray-50 p-4">
        <p className="text-xs font-medium uppercase text-warmGray-500 mb-3">Offered Item</p>
        <img
          src={getItemImage(offeredItem)}
          alt=""
          className="w-full h-40 object-cover rounded-lg bg-warmGray-100 mb-3"
        />
        <p className="font-medium text-warmGray-900">{offeredItem?.title || 'Unknown item'}</p>
        <p className="text-sm text-warmGray-500">{swap.offeredOwner?.name || swap.requester?.name || 'Unknown owner'}</p>
      </div>
      <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
        Swap
      </div>
      <div className="rounded-xl border border-warmGray-100 bg-warmGray-50 p-4">
        <p className="text-xs font-medium uppercase text-warmGray-500 mb-3">Requested Item</p>
        <img
          src={getItemImage(requestedItem)}
          alt=""
          className="w-full h-40 object-cover rounded-lg bg-warmGray-100 mb-3"
        />
        <p className="font-medium text-warmGray-900">{requestedItem?.title || 'Unknown item'}</p>
        <p className="text-sm text-warmGray-500">{swap.requestedOwner?.name || 'Unknown owner'}</p>
      </div>
    </div>
  );
}

export function ManageSwaps() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [swapList, setSwapList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSwap, setSelectedSwap] = useState<any | null>(null);
  const tabs = [
  'All',
  'Pending',
  'Accepted',
  'Rejected',
  'Completed'];

  useEffect(() => {
    const loadSwaps = async () => {
      try {
        const response = await getAdminSwaps();
        const data = await response.json();

        if (response.ok) {
          setSwapList(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSwaps();
  }, []);
  const handleStatusChange = async (swapId: string, status: string) => {
    try {
      const response = await updateAdminSwap(swapId, { status });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update swap');
      }

      setSwapList((prev) => prev.map((swap) => (swap._id === swapId ? data : swap)));
      toast.success('Swap updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update swap');
    }
  };
  const handleDelete = async (swapId: string) => {
    if (!window.confirm('Are you sure you want to delete this swap request?')) return;

    try {
      const response = await deleteAdminSwap(swapId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete swap');
      }

      setSwapList((prev) => prev.filter((swap) => swap._id !== swapId));
      toast.success('Swap deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete swap');
    }
  };
  const handleView = (swap: any) => {
    setSelectedSwap(swap);
  };

  const filteredSwaps = swapList.filter((swap) => {
    const requester = swap.requester?.name || '';
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
                <th className="px-6 py-4 font-medium">Update</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredSwaps.map((swap) => {
                const requester = swap.requester;
                const requestedItem = swap.requestedClothes;
                const offeredItem = swap.offeredClothes;
                const owner = swap.requestedOwner;
                return (
                  <tr
                    key={swap._id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(requester)}
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
                            src={offeredItem?.images?.[0] || getAvatarUrl({ name: offeredItem?.title }, 'd6d3d1')}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                            title="Offered" />
                          
                          <span className="text-warmGray-400">⇄</span>
                          <img
                            src={requestedItem?.images?.[0] || getAvatarUrl({ name: requestedItem?.title }, 'd6d3d1')}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                            title="Requested" />
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(owner, '292524')}
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
                      <select
                        value={swap.status}
                        onChange={(e) => handleStatusChange(swap._id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-warmGray-200 bg-white text-sm">
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(swap)}
                          className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details">
                          
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(swap._id)}
                          className="p-2 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Swap">
                          
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {isLoading &&
        <div className="p-8 text-center text-warmGray-500">
            Loading swap requests...
          </div>
        }
        {!isLoading && filteredSwaps.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No swap requests found.
          </div>
        }
      </div>
      <AdminDetailModal
        isOpen={Boolean(selectedSwap)}
        title="Swap Request Details"
        subtitle={selectedSwap?._id}
        onClose={() => setSelectedSwap(null)}
        details={[
          { label: 'Requester', value: selectedSwap?.requester?.name },
          { label: 'Offered Owner', value: selectedSwap?.offeredOwner?.name || selectedSwap?.requester?.name },
          { label: 'Requested Owner', value: selectedSwap?.requestedOwner?.name },
          { label: 'Offered Item', value: selectedSwap?.offeredClothes?.title },
          { label: 'Requested Item', value: selectedSwap?.requestedClothes?.title },
          { label: 'Swap Status', value: selectedSwap?.status },
          { label: 'Created', value: selectedSwap ? new Date(selectedSwap.createdAt).toLocaleString() : undefined },
          { label: 'Exchange Method', value: selectedSwap?.exchangeMethod?.method },
          { label: 'Exchange Status', value: selectedSwap?.exchangeMethod?.status }
        ]}
      >
        <SwapItemsPreview swap={selectedSwap} />
      </AdminDetailModal>
    </motion.div>);

}
