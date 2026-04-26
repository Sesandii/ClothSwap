import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { collectionPoints as initialPoints } from '../../data/mockData';
import { toast } from 'sonner';
export function AdminSettings() {
  const [points, setPoints] = useState(initialPoints);
  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="max-w-4xl space-y-8 pb-12">
      
      {/* System Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900">
            System Settings
          </h2>
          <p className="text-sm text-warmGray-500">
            Manage core platform configuration
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                defaultValue="ClothSwap"
                className="w-full px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue="support@clothswap.com"
                className="w-full px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">
                Max Images per Listing
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
              
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-warmGray-100">
            <div>
              <p className="font-medium text-warmGray-900">
                Auto-approve Listings
              </p>
              <p className="text-sm text-warmGray-500">
                Automatically approve new clothes uploads
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-warmGray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleSave('System')}
              className="flex items-center gap-2 bg-warmGray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </section>

      {/* Collection Points */}
      <section className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-serif font-semibold text-warmGray-900">
              Collection Points
            </h2>
            <p className="text-sm text-warmGray-500">
              Manage admin drop-off locations
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus size={18} /> Add Point
          </button>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Address</th>
                <th className="px-6 py-3 font-medium">Hours</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {points.map((point) =>
              <tr key={point.id} className="hover:bg-warmGray-50">
                  <td className="px-6 py-4 font-medium text-warmGray-900">
                    {point.name}
                  </td>
                  <td className="px-6 py-4 text-warmGray-600">
                    {point.address}
                  </td>
                  <td className="px-6 py-4 text-warmGray-600">{point.hours}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900">
            Admin Notifications
          </h2>
          <p className="text-sm text-warmGray-500">
            Configure when you receive alerts
          </p>
        </div>
        <div className="p-6 space-y-4">
          {[
          {
            label: 'Email Notifications',
            desc: 'Receive daily summary emails',
            defaultChecked: true
          },
          {
            label: 'New Swap Alerts',
            desc: 'Notify on every new swap request',
            defaultChecked: false
          },
          {
            label: 'Complaint Alerts',
            desc: 'Immediate notification for new complaints',
            defaultChecked: true
          },
          {
            label: 'New User Alerts',
            desc: 'Notify when a new user registers',
            defaultChecked: false
          }].
          map((item, i) =>
          <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-warmGray-900">{item.label}</p>
                <p className="text-sm text-warmGray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="sr-only peer" />
              
                <div className="w-11 h-6 bg-warmGray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-warmGray-100">
            <button
              onClick={() => handleSave('Notification')}
              className="flex items-center gap-2 bg-warmGray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </section>
    </motion.div>);

}