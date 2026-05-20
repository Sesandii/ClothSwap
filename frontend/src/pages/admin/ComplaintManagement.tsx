import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, Search as SearchIcon } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';
import { getAdminComplaints, updateAdminComplaintStatus } from '../../lib/api';
import { getAvatarUrl } from '../../lib/auth';
import { AdminDetailModal } from '../../components/AdminDetailModal';
export function ComplaintManagement() {
  const [activeTab, setActiveTab] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const tabs = ['All', 'Pending', 'Investigating', 'Resolved'];
  const types = [
  'All Types',
  'fake_item',
  'damaged_item',
  'wrong_item',
  'delivery_not_received',
  'user_no_show',
  'bad_behavior'];

  const [complaintList, setComplaintList] = useState<any[]>([]);
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await getAdminComplaints();
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load complaints');
        }

        setComplaintList(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load complaints');
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, []);
  const handleAction = async (id: string, action: 'investigating' | 'resolved') => {
    try {
      const response = await updateAdminComplaintStatus(id, action);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update complaint');
      }

      setComplaintList((prev) =>
        prev.map((c) => (c._id === id ? data : c))
      );
      toast.success(`Complaint marked as ${action}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update complaint');
    }
  };
  const handleView = (complaint: any) => {
    setSelectedComplaint(complaint);
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
                const user = complaint.user;
                return (
                  <tr
                    key={complaint._id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(user)}
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
                          onClick={() => handleView(complaint)}
                          className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details">
                          
                          <Eye size={18} />
                        </button>
                        {complaint.status === 'pending' &&
                        <button
                          onClick={() =>
                          handleAction(complaint._id, 'investigating')
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Investigate">
                          
                            <SearchIcon size={18} />
                          </button>
                        }
                        {complaint.status !== 'resolved' &&
                        <button
                          onClick={() =>
                          handleAction(complaint._id, 'resolved')
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
        {isLoading &&
        <div className="p-8 text-center text-warmGray-500">
            Loading complaints...
          </div>
        }
        {!isLoading && filteredComplaints.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No complaints found.
          </div>
        }
      </div>
      <AdminDetailModal
        isOpen={Boolean(selectedComplaint)}
        title="Complaint Details"
        subtitle={selectedComplaint?.user?.name}
        imageUrl={getAvatarUrl(selectedComplaint?.user)}
        onClose={() => setSelectedComplaint(null)}
        details={[
          { label: 'Complainant', value: selectedComplaint?.user?.name },
          { label: 'Email', value: selectedComplaint?.user?.email },
          { label: 'Type', value: selectedComplaint?.type?.replace(/_/g, ' ') },
          { label: 'Status', value: selectedComplaint?.status },
          { label: 'Date', value: selectedComplaint ? new Date(selectedComplaint.createdAt).toLocaleString() : undefined },
          { label: 'Description', value: selectedComplaint?.description }
        ]}
      />
    </motion.div>);

}
