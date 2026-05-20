import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shirt,
  Repeat,
  AlertTriangle,
  Truck,
  CheckCircle,
  Clock } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { StatusBadge } from '../../components/StatusBadge';
import { AdminDetailModal } from '../../components/AdminDetailModal';
import { getAdminDashboard } from '../../lib/api';
import { getAvatarUrl } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

const getSwapItemImage = (item: any) =>
  item?.images?.[0] || getAvatarUrl({ name: item?.title }, 'd6d3d1');

function DashboardSwapItemsPreview({ swap }: { swap: any }) {
  if (!swap) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
      <div className="rounded-xl border border-warmGray-100 bg-warmGray-50 p-4">
        <p className="text-xs font-medium uppercase text-warmGray-500 mb-3">Offered Item</p>
        <img
          src={getSwapItemImage(swap.offeredClothes)}
          alt=""
          className="w-full h-40 object-cover rounded-lg bg-warmGray-100 mb-3"
        />
        <p className="font-medium text-warmGray-900">{swap.offeredClothes?.title || 'Unknown item'}</p>
        <p className="text-sm text-warmGray-500">{swap.offeredOwner?.name || swap.requester?.name || 'Unknown owner'}</p>
      </div>
      <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
        Swap
      </div>
      <div className="rounded-xl border border-warmGray-100 bg-warmGray-50 p-4">
        <p className="text-xs font-medium uppercase text-warmGray-500 mb-3">Requested Item</p>
        <img
          src={getSwapItemImage(swap.requestedClothes)}
          alt=""
          className="w-full h-40 object-cover rounded-lg bg-warmGray-100 mb-3"
        />
        <p className="font-medium text-warmGray-900">{swap.requestedClothes?.title || 'Unknown item'}</p>
        <p className="text-sm text-warmGray-500">{swap.requestedOwner?.name || 'Unknown owner'}</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClothes: 0,
    pendingListings: 0,
    pendingSwaps: 0,
    completedSwaps: 0,
    complaints: 0,
    deliveryIssues: 0
  });
  const [recentSwaps, setRecentSwaps] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ name: string; date: string; swaps: number }[]>([]);
  const [selectedSwap, setSelectedSwap] = useState<any | null>(null);
  useEffect(() => {
    const loadDashboard = async () => {
      const response = await getAdminDashboard();
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
        setRecentSwaps(data.recentSwaps);
        setChartData(data.chartData || []);
      }
    };

    loadDashboard();
  }, []);
  const statCards = [
  {
    label: 'Total Users',
    value: stats.totalUsers,
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Total Clothes',
    value: stats.totalClothes,
    icon: Shirt,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Pending Listings',
    value: stats.pendingListings,
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  {
    label: 'Pending Swaps',
    value: stats.pendingSwaps,
    icon: Repeat,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  {
    label: 'Completed Swaps',
    value: stats.completedSwaps,
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  {
    label: 'Complaints',
    value: stats.complaints,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    label: 'Delivery Issues',
    value: stats.deliveryIssues,
    icon: Truck,
    color: 'text-rose-600',
    bg: 'bg-rose-100'
  }];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.05
              }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-warmGray-100 flex items-center gap-4">
              
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-warmGray-500 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-warmGray-900">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </motion.div>);

        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900 mb-6">
            Swap Activity (Last 7 Days)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f5f5f4" />
                
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#78716c'
                  }} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#78716c'
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#f5f5f4'
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Bar dataKey="swaps" fill="#e8786f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/clothes')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <span className="font-medium text-warmGray-700 group-hover:text-primary-700">
                  Review Pending Listings
                </span>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingListings}
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <span className="font-medium text-warmGray-700 group-hover:text-primary-700">
                  Handle Complaints
                </span>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {stats.complaints}
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/exchange')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Truck size={16} />
                </div>
                <span className="font-medium text-warmGray-700 group-hover:text-primary-700">
                  Delivery Issues
                </span>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-1 rounded-full">
                {stats.deliveryIssues}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100 flex justify-between items-center">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900">
            Recent Swap Activity
          </h2>
            <button
              onClick={() => navigate('/admin/swaps')}
              className="text-sm text-primary-600 font-medium hover:text-primary-700">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-warmGray-50 text-warmGray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Requester</th>
                <th className="px-6 py-3 font-medium">Owner</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {recentSwaps.map((swap) => {
                const requester = swap.requester;
                const owner = swap.requestedOwner;
                return (
                  <tr key={swap._id} className="hover:bg-warmGray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
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
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSwap(swap)}
                        className="text-sm text-primary-600 font-medium hover:text-primary-700">
                        Details
                      </button>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {recentSwaps.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No recent swap activity yet.
          </div>
        }
      </div>
      <AdminDetailModal
        isOpen={Boolean(selectedSwap)}
        title="Swap Details"
        subtitle={selectedSwap?._id}
        onClose={() => setSelectedSwap(null)}
        details={[
          { label: 'Requester', value: selectedSwap?.requester?.name },
          { label: 'Offered Owner', value: selectedSwap?.offeredOwner?.name || selectedSwap?.requester?.name },
          { label: 'Requested Owner', value: selectedSwap?.requestedOwner?.name },
          { label: 'Offered Item', value: selectedSwap?.offeredClothes?.title },
          { label: 'Requested Item', value: selectedSwap?.requestedClothes?.title },
          { label: 'Status', value: selectedSwap?.status },
          { label: 'Created', value: selectedSwap ? new Date(selectedSwap.createdAt).toLocaleString() : undefined },
          { label: 'Exchange Method', value: selectedSwap?.exchangeMethod?.method },
          { label: 'Exchange Status', value: selectedSwap?.exchangeMethod?.status }
        ]}
      >
        <DashboardSwapItemsPreview swap={selectedSwap} />
      </AdminDetailModal>
    </motion.div>);

}
