import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, Building, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusTimeline } from '../components/StatusTimeline';

type ClothesItem = {
  _id: string;
  title: string;
  images?: string[];
};

type ExchangeMethod = {
  method?: 'meetup' | 'delivery' | 'collection';
  status?: 'pending' | 'accepted' | 'rejected';
  details?: Record<string, string>;
  confirmedAt?: string;
};

type SwapRequestItem = {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  offeredClothes: ClothesItem;
  requestedClothes: ClothesItem;
  exchangeMethod?: ExchangeMethod;
};

const placeholderImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

export function ExchangeTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [swap, setSwap] = useState<SwapRequestItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  useEffect(() => {
    const loadSwap = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/swapRequests/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load exchange tracking');
        }

        setSwap(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load exchange tracking');
      } finally {
        setIsLoading(false);
      }
    };

    void loadSwap();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-warmGray-500">Loading tracking...</div>;
  }

  const isExchangeAgreed = Boolean(
    swap?.exchangeMethod?.method &&
      (swap.exchangeMethod.status === 'accepted' ||
        (!swap.exchangeMethod.status && swap.exchangeMethod.confirmedAt))
  );

  if (!swap || !swap.exchangeMethod?.method || !isExchangeAgreed) {
    return (
      <div className="p-8 text-center">
        <p className="text-warmGray-700 font-medium mb-3">Exchange method is not agreed yet.</p>
        <button
          onClick={() => navigate(id ? `/exchange/${id}` : '/my-swaps')}
          className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
        >
          Review Exchange Method
        </button>
      </div>
    );
  }

  const exchange = swap.exchangeMethod;
  const details = exchange.details || {};

  const getTimelineSteps = () => {
    const completed = swap.status === 'completed';

    if (exchange.method === 'meetup') {
      return [
        { label: 'Method Agreed', completed: true },
        {
          label: 'Meetup Scheduled',
          description: [details.date, details.time].filter(Boolean).join(' at '),
          completed: true
        },
        { label: 'Met Up', completed, current: !completed },
        { label: 'Swap Completed', completed }
      ];
    }

    if (exchange.method === 'delivery') {
      return [
        { label: 'Method Agreed', completed: true },
        { label: 'Shipment Details Added', completed: true },
        {
          label: 'In Transit',
          description: details.trackingNumber ? `Tracking: ${details.trackingNumber}` : undefined,
          completed,
          current: !completed
        },
        { label: 'Swap Completed', completed }
      ];
    }

    return [
      { label: 'Method Agreed', completed: true },
      { label: 'Collection Point Selected', description: details.collectionPoint, completed: true },
      { label: 'Items Exchanged', completed, current: !completed },
      { label: 'Swap Completed', completed }
    ];
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      const response = await apiFetch(`/api/swapRequests/${swap._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to complete swap');
      }

      setSwap(data);
      toast.success('Swap marked as completed!');
      navigate('/reviews');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to complete swap');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-warmGray-500 hover:text-warmGray-900 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          Exchange Tracking
        </h1>
        <p className="text-warmGray-500">Track the progress of your swap.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-warmGray-100">
              {exchange.method === 'meetup' && <MapPin className="text-primary-500" />}
              {exchange.method === 'delivery' && <Truck className="text-blue-500" />}
              {exchange.method === 'collection' && <Building className="text-secondary-600" />}
              <h3 className="font-semibold text-warmGray-900 capitalize">
                {exchange.method.replace('_', ' ')}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <img
                src={swap.offeredClothes.images?.[0] || placeholderImage}
                alt={swap.offeredClothes.title}
                className="w-16 h-20 object-cover rounded-lg bg-warmGray-100"
              />
              <ArrowLeft size={20} className="text-warmGray-300" />
              <ArrowLeft size={20} className="text-warmGray-300 rotate-180 -ml-6" />
              <img
                src={swap.requestedClothes.images?.[0] || placeholderImage}
                alt={swap.requestedClothes.title}
                className="w-16 h-20 object-cover rounded-lg bg-warmGray-100"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
            <h3 className="font-semibold text-warmGray-900 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              {Object.entries(details).filter(([, value]) => value).map(([key, value]) => (
                <p key={key}>
                  <span className="text-warmGray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>{' '}
                  {value}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
          <h3 className="font-semibold text-warmGray-900 mb-6">Status</h3>
          <StatusTimeline steps={getTimelineSteps()} />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/complaints')}
          className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center"
        >
          <AlertTriangle size={18} className="mr-2" />
          Report Issue
        </button>
        <button
          onClick={() => setShowCompleteConfirm(true)}
          disabled={swap.status === 'completed' || isCompleting}
          className="flex-1 py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors disabled:opacity-50"
        >
          {swap.status === 'completed' ? 'Completed' : isCompleting ? 'Completing...' : 'Mark as Completed'}
        </button>
      </div>
      <ConfirmDialog
        isOpen={showCompleteConfirm}
        title="Complete swap?"
        message="Mark this swap as completed? The exchanged items will move to each user's wardrobe."
        confirmLabel="Complete swap"
        onCancel={() => setShowCompleteConfirm(false)}
        onConfirm={() => {
          setShowCompleteConfirm(false);
          void handleComplete();
        }}
      />
    </div>
  );
}
