import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, Building, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { exchangeMethods, swapRequests, clothes } from '../data/mockData';
import { StatusTimeline } from '../components/StatusTimeline';
export function ExchangeTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exchange = exchangeMethods.find((e) => e.swapRequestId === id);
  const swap = swapRequests.find((s) => s.id === id);
  if (!exchange || !swap) {
    return <div className="p-8 text-center">Tracking info not found.</div>;
  }
  const requestedItem = clothes.find((c) => c.id === swap.requestedItemId);
  const offeredItem = clothes.find((c) => c.id === swap.offeredItemId);
  // Generate timeline steps based on method
  const getTimelineSteps = () => {
    if (exchange.method === 'meetup') {
      return [
      {
        label: 'Method Agreed',
        completed: true
      },
      {
        label: 'Meetup Scheduled',
        description: `${exchange.details.date} at ${exchange.details.time}`,
        completed: true
      },
      {
        label: 'Met Up',
        completed: false,
        current: true
      },
      {
        label: 'Swap Completed',
        completed: false
      }];

    }
    if (exchange.method === 'delivery') {
      return [
      {
        label: 'Method Agreed',
        completed: true
      },
      {
        label: 'Waiting for Shipment',
        completed: true
      },
      {
        label: 'Shipped',
        description: `Tracking: ${exchange.details.trackingNumber}`,
        completed: true
      },
      {
        label: 'In Transit',
        completed: false,
        current: true
      },
      {
        label: 'Delivered',
        completed: false
      }];

    }
    return [
    {
      label: 'Method Agreed',
      completed: true
    },
    {
      label: 'Items Dropped Off',
      completed: true
    },
    {
      label: 'Items Collected',
      completed: false,
      current: true
    },
    {
      label: 'Swap Completed',
      completed: false
    }];

  };
  const handleComplete = () => {
    toast.success('Swap marked as completed!');
    navigate('/my-swaps');
  };
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-warmGray-500 hover:text-warmGray-900 mb-6">
        
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
          {/* Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-warmGray-100">
              {exchange.method === 'meetup' &&
              <MapPin className="text-primary-500" />
              }
              {exchange.method === 'delivery' &&
              <Truck className="text-blue-500" />
              }
              {exchange.method === 'collection_point' &&
              <Building className="text-secondary-600" />
              }
              <h3 className="font-semibold text-warmGray-900 capitalize">
                {exchange.method.replace('_', ' ')}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <img
                src={offeredItem?.images[0]}
                alt="Offered"
                className="w-16 h-20 object-cover rounded-lg bg-warmGray-100" />
              
              <ArrowLeft size={20} className="text-warmGray-300" />
              <ArrowLeft
                size={20}
                className="text-warmGray-300 rotate-180 -ml-6" />
              
              <img
                src={requestedItem?.images[0]}
                alt="Requested"
                className="w-16 h-20 object-cover rounded-lg bg-warmGray-100" />
              
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
            <h3 className="font-semibold text-warmGray-900 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              {exchange.method === 'meetup' &&
              <>
                  <p>
                    <span className="text-warmGray-500">Location:</span>{' '}
                    {exchange.details.location}
                  </p>
                  <p>
                    <span className="text-warmGray-500">Date & Time:</span>{' '}
                    {exchange.details.date} at {exchange.details.time}
                  </p>
                </>
              }
              {exchange.method === 'delivery' &&
              <>
                  <p>
                    <span className="text-warmGray-500">Courier:</span>{' '}
                    {exchange.details.courier}
                  </p>
                  <p>
                    <span className="text-warmGray-500">Tracking:</span>{' '}
                    {exchange.details.trackingNumber}
                  </p>
                </>
              }
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
          <h3 className="font-semibold text-warmGray-900 mb-6">Status</h3>
          <StatusTimeline steps={getTimelineSteps()} />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/complaints')}
          className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center">
          
          <AlertTriangle size={18} className="mr-2" />
          Report Issue
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors">
          
          Mark as Completed
        </button>
      </div>
    </div>);

}