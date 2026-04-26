import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, Search as SearchIcon } from 'lucide-react';
import { complaints, users } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
export function ComplaintManagement() {
  const [activeTab, setActiveTab] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const tabs = ['All', 'Pending', 'Investigating', 'Resolved'];
  const types = [
  'All Types',
  'fake_item',
  'damaged_item',
  'wrong_item',
  'delivery_not_received',
  'user_no_show',
  'bad_behavior'];

  const [complaintList, setComplaintList] = useState(complaints);
  const handleAction = (id: string, action: 'investigating' | 'resolved') => {
    setComplaintList((prev) =>
    prev.map((c) =>
    c.id === id ?
    {
      ...c,
      status: action
    } :
    c
    )
    );
    toast.success(`Complaint marked as ${action}`);
  };
  const filteredComplaints = complaintList.filter((c) => {
    const matchesTab =
    activeTab === 'All' || c.status.toLowerCase() === activeTab.toLowerCase();
    const matchesType = typeFilter === 'All Types' || c.type === typeFilter;
    return matchesTab && matchesType;
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm bg-white">
          
          {types.map((t) =>
          <option key={t} value={t}>
              {t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          )}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Complainant</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredComplaints.map((complaint) => {
                const user = users.find((u) => u.id === complaint.userId);
                return (
                  <tr
                    key={complaint.id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={user?.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full" />
                        
                        <span className="font-medium text-warmGray-900">
                          {user?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                        {complaint.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-warmGray-600 truncate max-w-xs">
                        {complaint.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-warmGray-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details">
                          
                          <Eye size={18} />
                        </button>
                        {complaint.status === 'pending' &&
                        <button
                          onClick={() =>
                          handleAction(complaint.id, 'investigating')
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Investigate">
                          
                            <SearchIcon size={18} />
                          </button>
                        }
                        {complaint.status !== 'resolved' &&
                        <button
                          onClick={() =>
                          handleAction(complaint.id, 'resolved')
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark Resolved">
                          
                            <CheckCircle size={18} />
                          </button>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {filteredComplaints.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No complaints found.
          </div>
        }
      </div>
    </motion.div>);

}