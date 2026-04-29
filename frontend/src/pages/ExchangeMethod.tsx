import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Truck, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { collectionPoints } from '../data/mockData';

type MethodType = 'meetup' | 'delivery' | 'collection';

type ClothesItem = {
  _id: string;
  title: string;
  images?: string[];
};

type SwapRequestItem = {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  offeredClothes: ClothesItem;
  requestedClothes: ClothesItem;
};

const placeholderImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

const todayInputValue = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

export function ExchangeMethod() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<MethodType | null>(null);
  const [swap, setSwap] = useState<SwapRequestItem | null>(null);
  const [details, setDetails] = useState({
    location: '',
    date: '',
    time: '',
    address: '',
    courier: '',
    trackingNumber: '',
    collectionPoint: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minMeetupDate = todayInputValue();

  useEffect(() => {
    const loadSwap = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/swapRequests/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load swap request');
        }

        setSwap(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load swap request');
      } finally {
        setIsLoading(false);
      }
    };

    void loadSwap();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-warmGray-500">Loading exchange...</div>;
  }

  if (!swap) {
    return <div className="p-8 text-center">Swap not found.</div>;
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) return;

    if (selectedMethod === 'meetup' && details.date < minMeetupDate) {
      toast.error('Meetup date cannot be in the past');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch(`/api/swapRequests/${swap._id}/exchange-method`, {
        method: 'PATCH',
        body: JSON.stringify({
          method: selectedMethod,
          details
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to confirm exchange method');
      }

      toast.success('Exchange method confirmed!');
      navigate(`/exchange-tracking/${swap._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to confirm exchange method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDetail = (field: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
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
          Choose Exchange Method
        </h1>
        <p className="text-warmGray-500">
          How would you like to exchange these items?
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-warmGray-100 mb-8 flex items-center justify-center gap-6">
        <img
          src={swap.offeredClothes.images?.[0] || placeholderImage}
          alt={swap.offeredClothes.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <ArrowLeft size={20} className="text-warmGray-300" />
        <ArrowLeft size={20} className="text-warmGray-300 rotate-180 -ml-8" />
        <img
          src={swap.requestedClothes.images?.[0] || placeholderImage}
          alt={swap.requestedClothes.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>

      <form onSubmit={handleConfirm} className="space-y-6">
        <MethodOption
          active={selectedMethod === 'meetup'}
          icon={<MapPin size={24} />}
          title="Physical Meetup"
          description="Meet in person to exchange items"
          onSelect={() => setSelectedMethod('meetup')}
        >
          <div className="p-4 bg-warmGray-50 border-t border-warmGray-100 space-y-4">
            <Input label="Meetup Location" value={details.location} required onChange={(value) => updateDetail('location', value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" value={details.date} min={minMeetupDate} required onChange={(value) => updateDetail('date', value)} />
              <Input label="Time" type="time" value={details.time} required onChange={(value) => updateDetail('time', value)} />
            </div>
          </div>
        </MethodOption>

        <MethodOption
          active={selectedMethod === 'delivery'}
          icon={<Truck size={24} />}
          title="Delivery / Courier"
          description="Ship items to each other"
          onSelect={() => setSelectedMethod('delivery')}
          iconClassName="bg-blue-50 text-blue-500"
        >
          <div className="p-4 bg-warmGray-50 border-t border-warmGray-100 space-y-4">
            <label className="block text-sm font-medium text-warmGray-700">
              Your Delivery Address
              <textarea
                required
                rows={2}
                value={details.address}
                onChange={(e) => updateDetail('address', e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500"
              />
            </label>
            <Input label="Courier Service" value={details.courier} onChange={(value) => updateDetail('courier', value)} />
            <Input label="Tracking Number" value={details.trackingNumber} onChange={(value) => updateDetail('trackingNumber', value)} />
          </div>
        </MethodOption>

        <MethodOption
          active={selectedMethod === 'collection'}
          icon={<Building size={24} />}
          title="Admin Collection Point"
          description="Drop off and pick up at a secure location"
          onSelect={() => setSelectedMethod('collection')}
          iconClassName="bg-secondary-50 text-secondary-600"
        >
          <div className="p-4 bg-warmGray-50 border-t border-warmGray-100 space-y-4">
            <label className="block text-sm font-medium text-warmGray-700">
              Select Collection Point
              <select
                required
                value={details.collectionPoint}
                onChange={(e) => updateDetail('collectionPoint', e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Choose a location...</option>
                {collectionPoints.map((cp) => (
                  <option key={cp.id} value={cp.name}>
                    {cp.name} - {cp.address}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </MethodOption>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!selectedMethod || isSubmitting}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Exchange Method'}
          </button>
        </div>
      </form>
    </div>
  );
}

function MethodOption({
  active,
  icon,
  title,
  description,
  onSelect,
  children,
  iconClassName = 'bg-primary-50 text-primary-500'
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
  children: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div
      className={`border-2 rounded-2xl overflow-hidden transition-all ${
        active ? 'border-primary-500 shadow-md' : 'border-warmGray-200 hover:border-warmGray-300'
      }`}
    >
      <button type="button" className="p-4 flex items-center cursor-pointer bg-white w-full text-left" onClick={onSelect}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${iconClassName}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-warmGray-900">{title}</h3>
          <p className="text-sm text-warmGray-500">{description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'border-primary-500' : 'border-warmGray-300'}`}>
          {active && <div className="w-3 h-3 rounded-full bg-primary-500" />}
        </div>
      </button>
      {active && children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  min,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-warmGray-700">
      {label}
      <input
        type={type}
        min={min}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500"
      />
    </label>
  );
}
