import React from 'react';
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
import { adminStats, swapRequests, users } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
const chartData = [
{
  name: 'Mon',
  swaps: 12
},
{
  name: 'Tue',
  swaps: 19
},
{
  name: 'Wed',
  swaps: 15
},
{
  name: 'Thu',
  swaps: 22
},
{
  name: 'Fri',
  swaps: 28
},
{
  name: 'Sat',
  swaps: 35
},
{
  name: 'Sun',
  swaps: 30
}];

export function AdminDashboard() {
  const statCards = [
  {
    label: 'Total Users',
    value: adminStats.totalUsers,
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    label: 'Total Clothes',
    value: adminStats.totalClothes,
    icon: Shirt,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    label: 'Pending Listings',
    value: adminStats.pendingListings,
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  {
    label: 'Pending Swaps',
    value: adminStats.pendingSwaps,
    icon: Repeat,
    color: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  {
    label: 'Completed Swaps',
    value: adminStats.completedSwaps,
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100'
  },
  {
    label: 'Complaints',
    value: adminStats.complaints,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100'
  },
  {
    label: 'Delivery Issues',
    value: adminStats.deliveryIssues,
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
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <span className="font-medium text-warmGray-700 group-hover:text-primary-700">
                  Review Pending Listings
                </span>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                {adminStats.pendingListings}
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <span className="font-medium text-warmGray-700 group-hover:text-primary-700">
                  Handle Complaints
                </span>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {adminStats.complaints}
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Truck size={16} />
                </div>
                <span className="font-medium text-warmGray-700 group-hover:text-primary-700">
                  Delivery Issues
                </span>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-1 rounded-full">
                {adminStats.deliveryIssues}
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
          <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {swapRequests.slice(0, 5).map((swap) => {
                const requester = users.find((u) => u.id === swap.requesterId);
                const owner = users.find((u) => u.id !== swap.requesterId); // simplified for mock
                return (
                  <tr key={swap.id} className="hover:bg-warmGray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
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
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>);

}