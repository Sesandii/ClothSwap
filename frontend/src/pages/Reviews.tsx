import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { getAvatarUrl, getStoredUser } from '../lib/auth';

type UserRef = {
  _id: string;
  name?: string;
  profilePic?: string;
};

type ClothesItem = {
  _id: string;
  title: string;
  images?: string[];
  user?: UserRef;
};

type SwapRequestItem = {
  _id: string;
  requester: UserRef;
  offeredOwner?: UserRef;
  requestedOwner?: UserRef;
  requestedClothes: ClothesItem;
  offeredClothes: ClothesItem;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
};

type ReviewItem = {
  _id: string;
  swapRequest: SwapRequestItem;
  reviewee: UserRef;
  rating: number;
  comment?: string;
  createdAt: string;
};

const getUserId = () => getStoredUser()._id || getStoredUser().id || '';

export function Reviews() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [expandedSwapId, setExpandedSwapId] = useState<string | null>(null);
  const [swaps, setSwaps] = useState<SwapRequestItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUserId = getUserId();

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const [swapsResponse, reviewsResponse] = await Promise.all([
        apiFetch('/api/swapRequests/mine'),
        apiFetch('/api/swapRequests/reviews/mine')
      ]);
      const swapsData = await swapsResponse.json();
      const reviewsData = await reviewsResponse.json();

      if (!swapsResponse.ok || !reviewsResponse.ok) {
        throw new Error(swapsData.message || reviewsData.message || 'Unable to load reviews');
      }

      setSwaps(swapsData);
      setReviews(reviewsData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const swapsToReview = useMemo(() => {
    const reviewedSwapIds = new Set(reviews.map((review) => review.swapRequest?._id));

    return swaps.filter(
      (swap) => swap.status === 'completed' && !reviewedSwapIds.has(swap._id)
    );
  }, [reviews, swaps]);

  const handleSubmit = async (swapId: string) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch(`/api/swapRequests/${swapId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit review');
      }

      setReviews((current) => [data, ...current]);
      toast.success('Review submitted successfully!');
      setExpandedSwapId(null);
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOtherUser = (swap: SwapRequestItem) =>
    (swap.offeredOwner?._id || swap.requester._id) === currentUserId
      ? swap.requestedOwner || swap.requestedClothes.user
      : swap.offeredOwner || swap.requester;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          Reviews
        </h1>
        <p className="text-warmGray-500">
          Leave feedback for your recent swaps and view your given reviews.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-warmGray-500">Loading reviews...</div>
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-semibold text-warmGray-900 mb-4">
              Needs Review
            </h2>
            {swapsToReview.length === 0 ? (
              <div className="bg-warmGray-50 rounded-2xl p-8 text-center border border-warmGray-100">
                <p className="text-warmGray-500">
                  You have no pending swaps to review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {swapsToReview.map((swap) => {
                  const otherUser = getOtherUser(swap);
                  const isExpanded = expandedSwapId === swap._id;

                  return (
                    <div
                      key={swap._id}
                      className="bg-white rounded-2xl border border-warmGray-200 overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        className="p-4 flex items-center justify-between w-full text-left hover:bg-warmGray-50 transition-colors"
                        onClick={() => {
                          setExpandedSwapId(isExpanded ? null : swap._id);
                          setRating(0);
                          setComment('');
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={getAvatarUrl(otherUser)}
                            alt={otherUser?.name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-warmGray-900">
                              Swap with {otherUser?.name || 'User'}
                            </p>
                            <p className="text-xs text-warmGray-500">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          {isExpanded ? 'Cancel' : 'Leave Review'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="p-6 border-t border-warmGray-100 bg-warmGray-50/50">
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-warmGray-700 mb-2 text-center">
                              How was your experience with {otherUser?.name || 'this swapper'}?
                            </label>
                            <div className="flex justify-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={32}
                                    className={`${
                                      star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-warmGray-300'
                                    } transition-colors`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your feedback here..."
                            className="w-full px-4 py-3 rounded-xl border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 resize-none h-24 mb-4"
                          />

                          <div className="flex justify-end">
                            <button
                              onClick={() => void handleSubmit(swap._id)}
                              disabled={isSubmitting}
                              className="px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-warmGray-900 mb-4">
              Reviews You Have Given
            </h2>
            <div className="bg-white rounded-2xl border border-warmGray-200 shadow-sm overflow-hidden">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-warmGray-500">
                  You have not written any reviews yet.
                </div>
              ) : (
                <div className="divide-y divide-warmGray-100">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(review.reviewee)}
                            alt={review.reviewee?.name || 'User'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-warmGray-900">
                            To {review.reviewee?.name || 'User'}
                          </span>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'fill-current' : 'text-warmGray-200'}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-warmGray-600 text-sm">{review.comment}</p>
                      )}
                      <p className="text-xs text-warmGray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
