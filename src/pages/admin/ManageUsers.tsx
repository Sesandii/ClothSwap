import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Ban, Trash2, CheckCircle } from 'lucide-react';
import { users } from '../../data/mockData';
import { toast } from 'sonner';
export function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState(
    users.map((u) => ({
      ...u,
      status: 'active'
    }))
  );
  const handleToggleBlock = (id: string) => {
    setUserList((prev) =>
    prev.map((u) => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'blocked' : 'active';
        toast.success(
          `User ${newStatus === 'active' ? 'unblocked' : 'blocked'}`
        );
        return {
          ...u,
          status: newStatus
        };
      }
      return u;
    })
    );
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUserList((prev) => prev.filter((u) => u.id !== id));
      toast.success('User deleted');
    }
  };
  const filteredUsers = userList.filter(
    (u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray-400"
            size={20} />
          
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredUsers.map((user) =>
              <tr
                key={user.id}
                className="hover:bg-warmGray-50 transition-colors">
                
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                      src={user.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover" />
                    
                      <div>
                        <p className="font-medium text-warmGray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-warmGray-500">
                          {user.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-warmGray-600">
                    {user.location}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-warmGray-900 font-medium">
                      <span className="text-yellow-400">★</span>
                      {user.rating.toFixed(1)}
                      <span className="text-warmGray-400 text-xs font-normal">
                        ({user.reviewsCount})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                    
                      {user.status === 'active' ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                      className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details">
                      
                        <Eye size={18} />
                      </button>
                      <button
                      onClick={() => handleToggleBlock(user.id)}
                      className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'text-warmGray-400 hover:text-red-600 hover:bg-red-50' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                      title={
                      user.status === 'active' ?
                      'Block User' :
                      'Unblock User'
                      }>
                      
                        {user.status === 'active' ?
                      <Ban size={18} /> :

                      <CheckCircle size={18} />
                      }
                      </button>
                      <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User">
                      
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No users found matching your search.
          </div>
        }
      </div>
    </motion.div>);

}