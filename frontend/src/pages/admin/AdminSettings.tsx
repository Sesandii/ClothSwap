import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  createAdminCollectionPoint,
  deleteAdminCollectionPoint,
  getAdminSettings,
  updateAdminCollectionPoint,
  updateAdminSettings
} from '../../lib/api';

const defaultSettings = {
  platformName: 'ClothSwap',
  contactEmail: 'support@clothswap.com',
  maxImagesPerListing: 5,
  autoApproveListings: true,
  notifications: {
    emailNotifications: true,
    newSwapAlerts: false,
    complaintAlerts: true,
    newUserAlerts: false
  }
};

type CollectionPoint = {
  _id: string;
  name: string;
  address: string;
  hours: string;
};

const emptyPoint = { name: '', address: '', hours: '' };

export function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [draftPoint, setDraftPoint] = useState(emptyPoint);
  const [editingPointId, setEditingPointId] = useState<string | null>(null);
  const [editPoint, setEditPoint] = useState(emptyPoint);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [savingPointId, setSavingPointId] = useState<string | null>(null);
  const [deletingPointId, setDeletingPointId] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const response = await getAdminSettings();
      const data = await response.json();

      if (response.ok) {
        setSettings({ ...defaultSettings, ...data.settings });
        setPoints(data.collectionPoints || []);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const response = await updateAdminSettings(settings);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save settings');
      }

      setSettings({ ...defaultSettings, ...data });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save settings');
    }
  };

  const validatePoint = (point: typeof emptyPoint) => {
    if (!point.name.trim() || !point.address.trim() || !point.hours.trim()) {
      toast.error('Please fill name, address, and hours');
      return false;
    }

    return true;
  };

  const handleAddPoint = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!validatePoint(draftPoint)) return;

    try {
      setIsAddingPoint(true);
      const response = await createAdminCollectionPoint({
        name: draftPoint.name.trim(),
        address: draftPoint.address.trim(),
        hours: draftPoint.hours.trim()
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to add collection point');
      }

      setPoints((prev) => [...prev, data]);
      setDraftPoint(emptyPoint);
      toast.success('Collection point added');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to add collection point');
    } finally {
      setIsAddingPoint(false);
    }
  };

  const handleUpdatePoint = async (id: string) => {
    if (!validatePoint(editPoint)) return;

    try {
      setSavingPointId(id);
      const response = await updateAdminCollectionPoint(id, {
        name: editPoint.name.trim(),
        address: editPoint.address.trim(),
        hours: editPoint.hours.trim()
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update collection point');
      }

      setPoints((prev) => prev.map((point) => (point._id === id ? data : point)));
      setEditingPointId(null);
      setEditPoint(emptyPoint);
      toast.success('Collection point updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update collection point');
    } finally {
      setSavingPointId(null);
    }
  };

  const handleDeletePoint = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collection point?')) return;

    try {
      setDeletingPointId(id);
      const response = await deleteAdminCollectionPoint(id);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete collection point');
      }

      setPoints((prev) => prev.filter((point) => point._id !== id));
      toast.success('Collection point deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete collection point');
    } finally {
      setDeletingPointId(null);
    }
  };

  const updateNotification = (key: keyof typeof defaultSettings.notifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const notificationRows = [
    ['emailNotifications', 'Email Notifications', 'Receive daily summary emails'],
    ['newSwapAlerts', 'New Swap Alerts', 'Notify on every new swap request'],
    ['complaintAlerts', 'Complaint Alerts', 'Immediate notification for new complaints'],
    ['newUserAlerts', 'New User Alerts', 'Notify when a new user registers']
  ] as const;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-8 pb-12">
      <section className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900">System Settings</h2>
          <p className="text-sm text-warmGray-500">Manage core platform configuration</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">Max Images per Listing</label>
              <input
                type="number"
                value={settings.maxImagesPerListing}
                onChange={(e) => setSettings({ ...settings, maxImagesPerListing: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-warmGray-100">
            <div>
              <p className="font-medium text-warmGray-900">Auto-approve Listings</p>
              <p className="text-sm text-warmGray-500">Automatically approve new clothes uploads</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApproveListings}
              onChange={(e) => setSettings({ ...settings, autoApproveListings: e.target.checked })}
              className="h-5 w-5 rounded border-warmGray-300 text-primary-500 focus:ring-primary-500" />
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={handleSave} className="flex items-center gap-2 bg-warmGray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900">Collection Points</h2>
          <p className="text-sm text-warmGray-500">Manage admin drop-off locations</p>
        </div>
        <form
          onSubmit={handleAddPoint}
          className="p-6 grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-warmGray-100">
          {(['name', 'address', 'hours'] as const).map((field) => (
            <input
              key={field}
              value={draftPoint[field]}
              onChange={(e) => setDraftPoint({ ...draftPoint, [field]: e.target.value })}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="px-3 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 outline-none" />
          ))}
          <button
            type="submit"
            disabled={isAddingPoint}
            className="flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            <Plus size={18} /> {isAddingPoint ? 'Adding...' : 'Add Point'}
          </button>
        </form>
        <div className="overflow-x-auto">
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
              {points.map((point) => (
                <tr key={point._id} className="hover:bg-warmGray-50">
                  {editingPointId === point._id ? (
                    <>
                      {(['name', 'address', 'hours'] as const).map((field) => (
                        <td key={field} className="px-6 py-4">
                          <input
                            value={editPoint[field]}
                            onChange={(e) => setEditPoint({ ...editPoint, [field]: e.target.value })}
                            className="w-full min-w-40 px-3 py-1.5 rounded-lg border border-primary-200 focus:border-primary-500 outline-none" />
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdatePoint(point._id)}
                            disabled={savingPointId === point._id}
                            title="Save collection point"
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg disabled:opacity-60">
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPointId(null);
                              setEditPoint(emptyPoint);
                            }}
                            title="Cancel edit"
                            className="p-1.5 text-warmGray-500 hover:bg-warmGray-200 rounded-lg">
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-warmGray-900">{point.name}</td>
                      <td className="px-6 py-4 text-warmGray-600">{point.address}</td>
                      <td className="px-6 py-4 text-warmGray-600">{point.hours}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPointId(point._id);
                              setEditPoint({ name: point.name, address: point.address, hours: point.hours });
                            }}
                            title="Edit collection point"
                            className="p-1.5 text-warmGray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePoint(point._id)}
                            disabled={deletingPointId === point._id}
                            title="Delete collection point"
                            className="p-1.5 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-60">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {points.length === 0 && (
          <div className="p-8 text-center text-warmGray-500">
            No collection points added yet.
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="p-6 border-b border-warmGray-100">
          <h2 className="text-lg font-serif font-semibold text-warmGray-900">Admin Notifications</h2>
          <p className="text-sm text-warmGray-500">Configure when you receive alerts</p>
        </div>
        <div className="p-6 space-y-4">
          {notificationRows.map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-warmGray-900">{label}</p>
                <p className="text-sm text-warmGray-500">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications[key]}
                onChange={(e) => updateNotification(key, e.target.checked)}
                className="h-5 w-5 rounded border-warmGray-300 text-primary-500 focus:ring-primary-500" />
            </div>
          ))}
          <div className="flex justify-end pt-4 border-t border-warmGray-100">
            <button onClick={handleSave} className="flex items-center gap-2 bg-warmGray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
