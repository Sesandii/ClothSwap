import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { getAvatarUrl, getStoredToken, getStoredUser } from '../lib/auth';

type ClothesUser = {
  _id?: string;
  name?: string;
  location?: string;
  profilePic?: string;
};

type ClothesItem = {
  _id: string;
  title: string;
  brand?: string;
  size: string;
  status: 'available' | 'swapped' | 'hidden';
  images?: string[];
  location?: string;
  user?: ClothesUser | string;
};

type SwapSummary = {
  _id: string;
  offeredClothes?: ClothesItem;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
};

const placeholderImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

export function SwapRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [requestedItem, setRequestedItem] = useState<ClothesItem | null>(null);
  const [myAvailableClothes, setMyAvailableClothes] = useState<ClothesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSwapRequestData = async () => {
      const token = getStoredToken();

      if (!token) {
        toast.error('Please sign in to request a swap');
        navigate('/login');
        return;
      }

      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [requestedResponse, myClothesResponse, swapsResponse] = await Promise.all([
          apiFetch(`/api/clothes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          apiFetch('/api/clothes/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          apiFetch('/api/swapRequests/mine', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        if (requestedResponse.status === 404) {
          setRequestedItem(null);
          setMyAvailableClothes([]);
          return;
        }

        if (!requestedResponse.ok || !myClothesResponse.ok || !swapsResponse.ok) {
          throw new Error('Unable to load swap request details');
        }

        const requestedData = (await requestedResponse.json()) as ClothesItem;
        const myClothesData = (await myClothesResponse.json()) as ClothesItem[];
        const swapsData = (await swapsResponse.json()) as SwapSummary[];
        const alreadyOfferedIds = new Set(
          swapsData
            .filter((swap) => ['pending', 'accepted'].includes(swap.status))
            .map((swap) => swap.offeredClothes?._id)
            .filter(Boolean)
        );
        const requestedOwner =
          typeof requestedData.user === 'object' && requestedData.user
            ? requestedData.user._id
            : undefined;

        if (requestedOwner && currentUser._id && requestedOwner === currentUser._id) {
          toast.error('You cannot request a swap for your own item');
          navigate(`/edit-clothes/${requestedData._id}`);
          return;
        }

        setRequestedItem(requestedData);
        setMyAvailableClothes(
          myClothesData.filter(
            (item) =>
              item.status === 'available' &&
              item._id !== requestedData._id &&
              !alreadyOfferedIds.has(item._id)
          )
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Unable to load swap request details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadSwapRequestData();
  }, [currentUser._id, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId || !requestedItem) {
      return;
    }

    const token = getStoredToken();

    if (!token) {
      toast.error('Please sign in to request a swap');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/api/swapRequests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          offeredClothes: selectedItemId,
          requestedClothes: requestedItem._id,
          message
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send swap request');
      }

      toast.success('Swap request sent successfully!');
      navigate('/my-swaps');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send swap request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center text-warmGray-600">
        Loading swap request...
      </div>
    );
  }

  const itemOwner =
    requestedItem && typeof requestedItem.user === 'object' ? requestedItem.user : null;

  if (!requestedItem || !itemOwner) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
          Item Not Found
        </h2>
        <button
          onClick={() => navigate('/browse')}
          className="text-primary-500 hover:underline"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-warmGray-500 hover:text-warmGray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          Request Swap
        </h1>
        <p className="text-warmGray-500">
          Select an item from your wardrobe to offer in exchange.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 sticky top-24">
            <h3 className="text-sm font-semibold text-warmGray-900 uppercase tracking-wider mb-4">
              Requested Item
            </h3>
            <div className="flex gap-4 mb-4">
              <img
                src={requestedItem.images?.[0] || placeholderImage}
                alt={requestedItem.title}
                className="w-20 h-24 object-cover rounded-lg bg-warmGray-100"
              />

              <div>
                <h4 className="font-medium text-warmGray-900 line-clamp-2">
                  {requestedItem.title}
                </h4>
                <p className="text-sm text-warmGray-500 mt-1">
                  {(requestedItem.brand || 'Clothes')} - {requestedItem.size}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-warmGray-100 flex items-center gap-3">
              <img
                src={getAvatarUrl(itemOwner)}
                alt={itemOwner.name || 'User'}
                className="w-8 h-8 rounded-full"
              />

              <div className="text-sm">
                <p className="font-medium text-warmGray-900">{itemOwner.name}</p>
                <p className="text-warmGray-500">{itemOwner.location}</p>
              </div>
            </div>

            <Link
              to={`/chat/${itemOwner._id}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-warmGray-200 bg-white px-4 py-2.5 text-sm font-medium text-warmGray-700 transition-colors hover:bg-warmGray-50"
            >
              Message owner
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 mb-6">
              <h3 className="text-lg font-serif font-bold text-warmGray-900 mb-4">
                1. Select an item to offer
              </h3>

              {myAvailableClothes.length === 0 ? (
                <div className="text-center py-8 bg-warmGray-50 rounded-xl border border-dashed border-warmGray-200">
                  <p className="text-warmGray-500 mb-4">
                    You do not have any available items that are not already offered in an active swap.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/add-clothes')}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    Add an Item
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {myAvailableClothes.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedItemId(item._id)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedItemId === item._id
                          ? 'border-primary-500 shadow-md'
                          : 'border-transparent hover:border-warmGray-200'
                        }`}
                    >
                      <img
                        src={item.images?.[0] || placeholderImage}
                        alt={item.title}
                        className="w-full aspect-[4/5] object-cover bg-warmGray-100"
                      />

                      {selectedItemId === item._id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-sm">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                        <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 mb-6">
              <h3 className="text-lg font-serif font-bold text-warmGray-900 mb-4">
                2. Add a message (Optional)
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd love to swap my jacket for your dress..."
                className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-32"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedItemId || isSubmitting}
                className="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? 'Sending...' : 'Send Swap Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
