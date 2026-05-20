import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, Trash2, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
import { deleteAdminClothes, getAdminClothes, updateAdminClothesApproval } from '../../lib/api';
import { getAvatarUrl } from '../../lib/auth';
import { AdminDetailModal } from '../../components/AdminDetailModal';
type AdminClothes = {
  _id: string;
  title: string;
  brand?: string;
  category: string;
  status: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  images?: string[];
  user?: {
    name?: string;
    email?: string;
    profilePic?: string;
  };
};
export function ManageClothes() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [clothesList, setClothesList] = useState<AdminClothes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AdminClothes | null>(null);
  const tabs = ['All', 'Pending Approval', 'Approved', 'Rejected'];
  useEffect(() => {
    const loadClothes = async () => {
      try {
        const response = await getAdminClothes();
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load listings');
        }

        setClothesList(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load listings');
      } finally {
        setIsLoading(false);
      }
    };

    loadClothes();
  }, []);
  const handleAction = (
  id: string,
  action: 'approved' | 'rejected' | 'deleted') =>
  {
    if (action === 'deleted') {
      if (window.confirm('Are you sure you want to delete this listing?')) {
        deleteAdminClothes(id)
          .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Unable to delete listing');
            }

            setClothesList((prev) => prev.filter((c) => c._id !== id));
            toast.success('Listing deleted');
          })
          .catch((error) => {
            toast.error(error instanceof Error ? error.message : 'Unable to delete listing');
          });
      }
    } else {
      updateAdminClothesApproval(id, action)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Unable to update listing');
          }

          setClothesList((prev) =>
            prev.map((c) => (c._id === id ? data : c))
          );
          toast.success(`Listing ${action}`);
        })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to update listing');
        });
    }
  };
  const filteredClothes = clothesList.filter((c) => {
    const matchesSearch =
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending Approval')
    return matchesSearch && c.approvalStatus === 'pending';
    return matchesSearch && c.approvalStatus === activeTab.toLowerCase();
  });
  const handleView = (item: AdminClothes) => {
    setSelectedItem(item);
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
            placeholder="Search listings..."
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
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredClothes.map((item) => {
                return (
                  <tr
                    key={item._id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || getAvatarUrl({ name: item.title }, 'd6d3d1')}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-warmGray-100" />
                        
                        <div>
                          <p className="font-medium text-warmGray-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-warmGray-500">
                            {item.brand || 'No brand'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-warmGray-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(item.user, '292524')}
                          alt=""
                          className="w-6 h-6 rounded-full" />
                        
                        <span className="text-warmGray-900">{item.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge status={item.status} />
                        {item.approvalStatus === 'pending' &&
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </span>
                        }
                        {item.approvalStatus === 'rejected' &&
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                            Rejected
                          </span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details">
                          
                          <ExternalLink size={18} />
                        </button>
                        {item.approvalStatus === 'pending' &&
                        <>
                            <button
                            onClick={() => handleAction(item._id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve">
                            
                              <Check size={18} />
                            </button>
                            <button
                            onClick={() => handleAction(item._id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject">
                            
                              <X size={18} />
                            </button>
                          </>
                        }
                        <button
                          onClick={() => handleAction(item._id, 'deleted')}
                          className="p-2 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Listing">
                          
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
            Loading listings...
          </div>
        }
        {!isLoading && filteredClothes.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No listings found.
          </div>
        }
      </div>
      <AdminDetailModal
        isOpen={Boolean(selectedItem)}
        title={selectedItem?.title || 'Listing Details'}
        subtitle={selectedItem?.brand || 'No brand'}
        imageUrl={selectedItem?.images?.[0]}
        onClose={() => setSelectedItem(null)}
        details={[
          { label: 'Category', value: selectedItem?.category },
          { label: 'Owner', value: selectedItem?.user?.name },
          { label: 'Owner Email', value: selectedItem?.user?.email },
          { label: 'Listing Status', value: selectedItem?.status },
          { label: 'Approval Status', value: selectedItem?.approvalStatus }
        ]}
      />
    </motion.div>);

}
