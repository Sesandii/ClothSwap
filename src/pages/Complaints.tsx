import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  complaints,
  swapRequests,
  clothes,
  currentUser,
  users } from
'../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
export function Complaints() {
  const [swapId, setSwapId] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  // Get user's swaps for the dropdown
  const mySwaps = swapRequests.filter(
    (s) =>
    s.requesterId === currentUser.id ||
    clothes.find((c) => c.id === s.requestedItemId)?.ownerId ===
    currentUser.id
  );
  const myComplaints = complaints.filter((c) => c.userId === currentUser.id);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapId || !type || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(
      'Complaint submitted successfully. Our team will review it shortly.'
    );
    setSwapId('');
    setType('');
    setDescription('');
  };
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          Complaints & Reports
        </h1>
        <p className="text-warmGray-500">
          Report issues with swaps or users. We take all reports seriously.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Complaint Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-red-600">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-semibold">File a Report</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Related Swap
                </label>
                <select
                  value={swapId}
                  onChange={(e) => setSwapId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 text-sm">
                  
                  <option value="">Select a swap...</option>
                  {mySwaps.map((swap) => {
                    const reqItem = clothes.find(
                      (c) => c.id === swap.requestedItemId
                    );
                    return (
                      <option key={swap.id} value={swap.id}>
                        Swap: {reqItem?.title} (
                        {new Date(swap.createdAt).toLocaleDateString()})
                      </option>);

                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Issue Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 text-sm">
                  
                  <option value="">Select issue type...</option>
                  <option value="fake_item">Fake/Counterfeit Item</option>
                  <option value="damaged_item">
                    Item Damaged/Not as Described
                  </option>
                  <option value="wrong_item">Received Wrong Item</option>
                  <option value="delivery_not_received">
                    Delivery Not Received
                  </option>
                  <option value="user_no_show">User Did Not Show Up</option>
                  <option value="bad_behavior">Inappropriate Behavior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Please provide details about the issue..."
                  className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none" />
                
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                
                Submit Report
              </button>
            </form>
          </div>
        </div>

        {/* My Complaints List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-warmGray-900 mb-4">
            My Reports
          </h2>

          {myComplaints.length === 0 ?
          <div className="bg-white rounded-2xl p-8 text-center border border-warmGray-100">
              <p className="text-warmGray-500">
                You haven't filed any reports.
              </p>
            </div> :

          <div className="space-y-4">
              {myComplaints.map((complaint) =>
            <div
              key={complaint.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
              
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-2">
                        {complaint.type.
                    replace(/_/g, ' ').
                    replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      <p className="text-xs text-warmGray-400">
                        Filed on{' '}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="text-sm text-warmGray-700 bg-warmGray-50 p-3 rounded-lg border border-warmGray-100">
                    {complaint.description}
                  </p>
                </div>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

}