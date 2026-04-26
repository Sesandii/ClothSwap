import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, Trash2, ExternalLink } from 'lucide-react';
import { clothes, users } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
export function ManageClothes() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [clothesList, setClothesList] = useState(
    clothes.map((c) => ({
      ...c,
      approvalStatus: Math.random() > 0.8 ? 'pending' : 'approved'
    }))
  );
  const tabs = ['All', 'Pending Approval', 'Approved', 'Rejected'];
  const handleAction = (
  id: string,
  action: 'approved' | 'rejected' | 'deleted') =>
  {
    if (action === 'deleted') {
      if (window.confirm('Are you sure you want to delete this listing?')) {
        setClothesList((prev) => prev.filter((c) => c.id !== id));
        toast.success('Listing deleted');
      }
    } else {
      setClothesList((prev) =>
      prev.map((c) =>
      c.id === id ?
      {
        ...c,
        approvalStatus: action
      } :
      c
      )
      );
      toast.success(`Listing ${action}`);
    }
  };
  const filteredClothes = clothesList.filter((c) => {
    const matchesSearch =
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.brand.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending Approval')
    return matchesSearch && c.approvalStatus === 'pending';
    return matchesSearch && c.approvalStatus === activeTab.toLowerCase();
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
                const owner = users.find((u) => u.id === item.ownerId);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-warmGray-100" />
                        
                        <div>
                          <p className="font-medium text-warmGray-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-warmGray-500">
                            {item.brand}
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
                          src={owner?.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full" />
                        
                        <span className="text-warmGray-900">{owner?.name}</span>
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
                          className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details">
                          
                          <ExternalLink size={18} />
                        </button>
                        {item.approvalStatus === 'pending' &&
                        <>
                            <button
                            onClick={() => handleAction(item.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve">
                            
                              <Check size={18} />
                            </button>
                            <button
                            onClick={() => handleAction(item.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject">
                            
                              <X size={18} />
                            </button>
                          </>
                        }
                        <button
                          onClick={() => handleAction(item.id, 'deleted')}
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
        {filteredClothes.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No listings found.
          </div>
        }
      </div>
    </motion.div>);

}