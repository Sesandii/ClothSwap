import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Truck, Building, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { swapRequests, clothes, collectionPoints } from '../data/mockData';
type MethodType = 'meetup' | 'delivery' | 'collection';
export function ExchangeMethod() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<MethodType | null>(null);
  const swap = swapRequests.find((s) => s.id === id);
  const requestedItem = swap ?
  clothes.find((c) => c.id === swap.requestedItemId) :
  null;
  const offeredItem = swap ?
  clothes.find((c) => c.id === swap.offeredItemId) :
  null;
  if (!swap || !requestedItem || !offeredItem) {
    return <div className="p-8 text-center">Swap not found.</div>;
  }
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;
    toast.success('Exchange method confirmed!');
    navigate(`/exchange-tracking/${id}`);
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
          Choose Exchange Method
        </h1>
        <p className="text-warmGray-500">
          How would you like to exchange these items?
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-warmGray-100 mb-8 flex items-center justify-center gap-6">
        <img
          src={offeredItem.images[0]}
          alt="Offered"
          className="w-16 h-16 object-cover rounded-lg" />
        
        <ArrowLeft size={20} className="text-warmGray-300" />
        <ArrowLeft size={20} className="text-warmGray-300 rotate-180 -ml-8" />
        <img
          src={requestedItem.images[0]}
          alt="Requested"
          className="w-16 h-16 object-cover rounded-lg" />
        
      </div>

      <form onSubmit={handleConfirm} className="space-y-6">
        {/* Meetup Option */}
        <div
          className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedMethod === 'meetup' ? 'border-primary-500 shadow-md' : 'border-warmGray-200 hover:border-warmGray-300'}`}>
          
          <div
            className="p-4 flex items-center cursor-pointer bg-white"
            onClick={() => setSelectedMethod('meetup')}>
            
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mr-4 shrink-0">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warmGray-900">
                Physical Meetup
              </h3>
              <p className="text-sm text-warmGray-500">
                Meet in person to exchange items
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'meetup' ? 'border-primary-500' : 'border-warmGray-300'}`}>
              
              {selectedMethod === 'meetup' &&
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              }
            </div>
          </div>

          {selectedMethod === 'meetup' &&
          <div className="p-4 bg-warmGray-50 border-t border-warmGray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Meetup Location
                </label>
                <input
                type="text"
                required
                placeholder="e.g. Central Park Cafe"
                className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warmGray-700 mb-1">
                    Date
                  </label>
                  <input
                  type="date"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-warmGray-700 mb-1">
                    Time
                  </label>
                  <input
                  type="time"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />
                
                </div>
              </div>
            </div>
          }
        </div>

        {/* Delivery Option */}
        <div
          className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedMethod === 'delivery' ? 'border-primary-500 shadow-md' : 'border-warmGray-200 hover:border-warmGray-300'}`}>
          
          <div
            className="p-4 flex items-center cursor-pointer bg-white"
            onClick={() => setSelectedMethod('delivery')}>
            
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-4 shrink-0">
              <Truck size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warmGray-900">
                Delivery / Courier
              </h3>
              <p className="text-sm text-warmGray-500">
                Ship items to each other
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'delivery' ? 'border-primary-500' : 'border-warmGray-300'}`}>
              
              {selectedMethod === 'delivery' &&
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              }
            </div>
          </div>

          {selectedMethod === 'delivery' &&
          <div className="p-4 bg-warmGray-50 border-t border-warmGray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Your Delivery Address
                </label>
                <textarea
                required
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500" />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Courier Service (Optional)
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select a courier</option>
                  <option value="fedex">FedEx</option>
                  <option value="ups">UPS</option>
                  <option value="usps">USPS</option>
                  <option value="dhl">DHL</option>
                </select>
              </div>
            </div>
          }
        </div>

        {/* Collection Point Option */}
        <div
          className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedMethod === 'collection' ? 'border-primary-500 shadow-md' : 'border-warmGray-200 hover:border-warmGray-300'}`}>
          
          <div
            className="p-4 flex items-center cursor-pointer bg-white"
            onClick={() => setSelectedMethod('collection')}>
            
            <div className="w-12 h-12 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-600 mr-4 shrink-0">
              <Building size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warmGray-900">
                Admin Collection Point
              </h3>
              <p className="text-sm text-warmGray-500">
                Drop off and pick up at a secure location
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'collection' ? 'border-primary-500' : 'border-warmGray-300'}`}>
              
              {selectedMethod === 'collection' &&
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              }
            </div>
          </div>

          {selectedMethod === 'collection' &&
          <div className="p-4 bg-warmGray-50 border-t border-warmGray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Select Collection Point
                </label>
                <select
                required
                className="w-full px-3 py-2 rounded-lg border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500">
                
                  <option value="">Choose a location...</option>
                  {collectionPoints.map((cp) =>
                <option key={cp.id} value={cp.id}>
                      {cp.name} - {cp.address}
                    </option>
                )}
                </select>
              </div>
            </div>
          }
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!selectedMethod}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            
            Confirm Exchange Method
          </button>
        </div>
      </form>
    </div>);

}