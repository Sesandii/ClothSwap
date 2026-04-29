import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

type ClothesItem = {
  _id: string;
  title: string;
};

type SwapRequestItem = {
  _id: string;
  offeredClothes?: ClothesItem;
  requestedClothes?: ClothesItem;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
};

type ComplaintItem = {
  _id: string;
  swapRequest?: SwapRequestItem;
  type: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: string;
};

const issueTypes = [
  ['fake_item', 'Fake/Counterfeit Item'],
  ['damaged_item', 'Item Damaged/Not as Described'],
  ['wrong_item', 'Received Wrong Item'],
  ['delivery_not_received', 'Delivery Not Received'],
  ['user_no_show', 'User Did Not Show Up'],
  ['bad_behavior', 'Inappropriate Behavior']
];

export function Complaints() {
  const [swapId, setSwapId] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [mySwaps, setMySwaps] = useState<SwapRequestItem[]>([]);
  const [myComplaints, setMyComplaints] = useState<ComplaintItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComplaintsData = async () => {
    try {
      setIsLoading(true);
      const [swapsResponse, complaintsResponse] = await Promise.all([
        apiFetch('/api/swapRequests/mine'),
        apiFetch('/api/complaints/mine')
      ]);
      const swapsData = await swapsResponse.json();
      const complaintsData = await complaintsResponse.json();

      if (!swapsResponse.ok || !complaintsResponse.ok) {
        throw new Error(swapsData.message || complaintsData.message || 'Unable to load reports');
      }

      setMySwaps(swapsData);
      setMyComplaints(complaintsData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadComplaintsData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!swapId || !type || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/api/complaints', {
        method: 'POST',
        body: JSON.stringify({
          swapRequest: swapId,
          type,
          description
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit report');
      }

      setMyComplaints((current) => [data, ...current]);
      toast.success('Report submitted successfully. Our team will review it shortly.');
      setSwapId('');
      setType('');
      setDescription('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit report');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-red-600">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-semibold">File a Report</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-warmGray-700">
                Related Swap
                <select
                  value={swapId}
                  onChange={(e) => setSwapId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="">Select a swap...</option>
                  {mySwaps.map((swap) => (
                    <option key={swap._id} value={swap._id}>
                      {swap.requestedClothes?.title || 'Swap'} - {swap.status} (
                      {new Date(swap.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-warmGray-700">
                Issue Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="">Select issue type...</option>
                  {issueTypes.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-warmGray-700">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Please provide details about the issue..."
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-warmGray-900 mb-4">
            My Reports
          </h2>

          {isLoading ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-warmGray-100 text-warmGray-500">
              Loading reports...
            </div>
          ) : myComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-warmGray-100">
              <p className="text-warmGray-500">You have not filed any reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-2">
                        {formatType(complaint.type)}
                      </span>
                      <p className="text-xs text-warmGray-400">
                        Filed on {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-warmGray-500 mt-1">
                        Swap: {complaint.swapRequest?.requestedClothes?.title || 'Related swap'}
                      </p>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="text-sm text-warmGray-700 bg-warmGray-50 p-3 rounded-lg border border-warmGray-100">
                    {complaint.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatType(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
