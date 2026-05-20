import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Ban, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { deleteAdminUser, getAdminUsers, updateAdminUserRole, updateAdminUserStatus } from '../../lib/api';
import { getAvatarUrl } from '../../lib/auth';
import { AdminDetailModal } from '../../components/AdminDetailModal';
type AdminUser = {
  _id: string;
  name: string;
  email: string;
  location?: string;
  profilePic?: string;
  status: 'active' | 'blocked';
  role?: 'user' | 'admin';
  rating: number;
  reviewsCount: number;
};
export function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAdminUsers();
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load users');
        }

        setUserList(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);
  const handleToggleBlock = async (id: string) => {
    const existing = userList.find((u) => u._id === id);
    if (!existing) return;

    const newStatus = existing.status === 'active' ? 'blocked' : 'active';

    try {
      const response = await updateAdminUserStatus(id, newStatus);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update user');
      }

      setUserList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: data.status } : u))
      );
      toast.success(`User ${newStatus === 'active' ? 'unblocked' : 'blocked'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update user');
    }
  };
  const handleRoleChange = async (id: string, role: 'user' | 'admin') => {
    try {
      const response = await updateAdminUserRole(id, role);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update role');
      }

      setUserList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: data.role } : u))
      );
      toast.success('Role updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update role');
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteAdminUser(id);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to delete user');
        }

        setUserList((prev) => prev.filter((u) => u._id !== id));
        toast.success('User deleted');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to delete user');
      }
    }
  };
  const handleView = (user: AdminUser) => {
    setSelectedUser(user);
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
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredUsers.map((user) =>
              <tr
                key={user._id}
                className="hover:bg-warmGray-50 transition-colors">
                
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                      src={getAvatarUrl(user)}
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
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                      className="px-3 py-1.5 rounded-lg border border-warmGray-200 bg-white text-sm">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
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
                      onClick={() => handleView(user)}
                      className="p-2 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Details">
                      
                        <Eye size={18} />
                      </button>
                      <button
                      onClick={() => handleToggleBlock(user._id)}
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
                      onClick={() => handleDelete(user._id)}
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
        {isLoading &&
        <div className="p-8 text-center text-warmGray-500">
            Loading users...
          </div>
        }
        {!isLoading && filteredUsers.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No users found matching your search.
          </div>
        }
      </div>
      <AdminDetailModal
        isOpen={Boolean(selectedUser)}
        title={selectedUser?.name || 'User Details'}
        subtitle={selectedUser?.email}
        imageUrl={getAvatarUrl(selectedUser)}
        onClose={() => setSelectedUser(null)}
        details={[
          { label: 'Email', value: selectedUser?.email },
          { label: 'Location', value: selectedUser?.location },
          { label: 'Role', value: selectedUser?.role || 'user' },
          { label: 'Status', value: selectedUser?.status },
          { label: 'Rating', value: selectedUser ? selectedUser.rating.toFixed(1) : undefined },
          { label: 'Reviews', value: selectedUser?.reviewsCount }
        ]}
      />
    </motion.div>);

}
