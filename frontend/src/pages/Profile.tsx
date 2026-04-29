import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Star, Calendar, Package } from 'lucide-react';
import { toast } from 'sonner';
import {
  swapRequests,
  reviews,
  clothes,
  users
} from
  '../data/mockData';
import { getAuthenticatedUser, getAvatarUrl, getInitials, isRealProfilePic } from '../lib/auth';
import { getCurrentUser, updateCurrentUser, getMyClothes } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';
type TabType = 'edit' | 'history' | 'reviews';

export function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('edit');
  const storedUser = getAuthenticatedUser();
  const [profileUser, setProfileUser] = useState<any>(storedUser);
  const [myClothesCount, setMyClothesCount] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    location: storedUser?.location || '',
    address: (storedUser as any)?.address || '',
    profilePic: isRealProfilePic((storedUser as any)?.profilePic) ? (storedUser as any)?.profilePic : ''
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCurrentUser();
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data);
          setFormData((f) => ({
            ...f,
            name: data.name || f.name,
            email: data.email || f.email,
            phone: data.phone || f.phone || '',
            location: data.location || f.location || '',
            address: data.address || f.address || '',
            profilePic: isRealProfilePic(data.profilePic) ? data.profilePic : f.profilePic || ''
          }));
        }
      } catch (err) {
        // ignore
      }
    })();

    return () => { mounted = false; };
  }, []);
  const userId = (profileUser && (profileUser._id || profileUser.id)) || undefined;
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId) return;
      try {
        const res = await getMyClothes();
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setMyClothesCount(data.length);
          else if (typeof data.count === 'number') setMyClothesCount(data.count);
        }
      } catch (err) {
        // ignore
      }
    })();

    return () => { mounted = false; };
  }, [userId]);
  const completedSwaps = swapRequests.filter(
    (s) =>
      s.status === 'completed' && (
        s.requesterId === userId ||
        clothes.find((c) => c.id === s.requestedItemId)?.ownerId === userId)
  );
  const myReviews = reviews.filter((r) => r.revieweeId === userId);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        address: formData.address,
        profilePic: formData.profilePic
      };

      const res = await updateCurrentUser(payload);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Failed to update profile');
        return;
      }

      const updated = await res.json();
      // update local storage user copy so app reflects changes
      try {
        const raw = window.localStorage.getItem('clothswap_token');
        const token = raw && raw !== 'null' ? raw : null;
        if (token) {
          window.localStorage.setItem('clothswap_user', JSON.stringify(updated));
        }
      } catch { }

      setProfileUser(updated);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-warmGray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary-100 to-secondary-100" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className="relative group">
            {isRealProfilePic(profileUser?.profilePic || formData.profilePic) ? (
              <img
                src={profileUser?.profilePic || formData.profilePic}
                alt={profileUser?.name || formData.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-primary-500 text-white text-3xl font-semibold">
                {getInitials(profileUser?.name || formData.name)}
              </div>
            )}

            <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
              {profileUser?.name || formData.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-warmGray-600">
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {profileUser?.location || formData.location}
              </span>
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" />
                Joined{' '}
                {profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ''}
              </span>
              <span className="flex items-center text-yellow-500 font-medium">
                <Star size={16} className="mr-1 fill-current" />
                {myReviews.length} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-warmGray-100 text-center">
          <div>
            <p className="text-2xl font-bold text-warmGray-900">
              {myClothesCount || clothes.filter((c) => c.ownerId === userId).length}
            </p>
            <p className="text-sm text-warmGray-500">Items Listed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warmGray-900">
              {completedSwaps.length}
            </p>
            <p className="text-sm text-warmGray-500">Swaps Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warmGray-900">
              {myReviews.length}
            </p>
            <p className="text-sm text-warmGray-500">Reviews Received</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-warmGray-200 mb-8">
        {[
          {
            id: 'edit',
            label: 'Edit Profile'
          },
          {
            id: 'history',
            label: 'Swap History'
          },
          {
            id: 'reviews',
            label: 'My Reviews'
          }].
          map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-primary-600' : 'text-warmGray-500 hover:text-warmGray-900'}`}>

              {tab.label}
              {activeTab === tab.id &&
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
              }
            </button>
          )}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
        {activeTab === 'edit' &&
          <form onSubmit={handleSave} className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-warmGray-300 bg-warmGray-50 cursor-not-allowed" />

              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  City, State
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />

              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Full Address (For Delivery)
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />

              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">

                Save Changes
              </button>
            </div>
          </form>
        }

        {activeTab === 'history' &&
          <div className="space-y-4">
            {completedSwaps.length === 0 ?
              <div className="text-center py-12 text-warmGray-500">
                No completed swaps yet.
              </div> :

              completedSwaps.map((swap) => {
                const requestedItem = clothes.find(
                  (c) => c.id === swap.requestedItemId
                );
                const offeredItem = clothes.find(
                  (c) => c.id === swap.offeredItemId
                );
                const otherUserId =
                  swap.requesterId === userId ?
                    requestedItem?.ownerId :
                    swap.requesterId;
                const otherUser = users.find((u) => u.id === otherUserId);
                if (!requestedItem || !offeredItem || !otherUser) return null;
                return (
                  <div
                    key={swap.id}
                    className="flex items-center justify-between p-4 border border-warmGray-100 rounded-xl hover:bg-warmGray-50 transition-colors">

                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-4">
                        <img
                          src={offeredItem.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white" />

                        <img
                          src={requestedItem.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white" />

                      </div>
                      <div>
                        <p className="font-medium text-warmGray-900">
                          Swapped with {otherUser.name}
                        </p>
                        <p className="text-sm text-warmGray-500">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status="completed" />
                  </div>);

              })
            }
          </div>
        }

        {activeTab === 'reviews' &&
          <div className="space-y-6">
            {myReviews.length === 0 ?
              <div className="text-center py-12 text-warmGray-500">
                No reviews received yet.
              </div> :

              myReviews.map((review) => {
                const reviewer = users.find((u) => u.id === review.reviewerId);
                return (
                  <div
                    key={review.id}
                    className="border-b border-warmGray-100 last:border-0 pb-6 last:pb-0">

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatarUrl(reviewer)}
                          alt=""
                          className="w-10 h-10 rounded-full" />

                        <div>
                          <p className="font-medium text-warmGray-900">
                            {reviewer?.name}
                          </p>
                          <p className="text-xs text-warmGray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) =>
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating ?
                                'fill-current' :
                                'text-warmGray-200'
                            } />

                        )}
                      </div>
                    </div>
                    <p className="text-warmGray-600 text-sm">
                      {review.comment}
                    </p>
                  </div>);

              })
            }
          </div>
        }
      </div>
    </div>);

}
