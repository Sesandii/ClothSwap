import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  reviews,
  swapRequests,
  currentUser,
  users,
  clothes } from
'../data/mockData';
export function Reviews() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [expandedSwapId, setExpandedSwapId] = useState<string | null>(null);
  // Find completed swaps that haven't been reviewed by current user
  const swapsToReview = swapRequests.filter((s) => {
    if (s.status !== 'completed') return false;
    const isParticipant =
    s.requesterId === currentUser.id ||
    clothes.find((c) => c.id === s.requestedItemId)?.ownerId ===
    currentUser.id;
    if (!isParticipant) return false;
    const hasReviewed = reviews.some(
      (r) => r.swapId === s.id && r.reviewerId === currentUser.id
    );
    return !hasReviewed;
  });
  const myReviews = reviews.filter((r) => r.reviewerId === currentUser.id);
  const handleSubmit = (swapId: string) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    toast.success('Review submitted successfully!');
    setExpandedSwapId(null);
    setRating(0);
    setComment('');
  };
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

      <div className="space-y-12">
        {/* Leave a Review Section */}
        <section>
          <h2 className="text-xl font-semibold text-warmGray-900 mb-4">
            Needs Review
          </h2>
          {swapsToReview.length === 0 ?
          <div className="bg-warmGray-50 rounded-2xl p-8 text-center border border-warmGray-100">
              <p className="text-warmGray-500">
                You have no pending swaps to review.
              </p>
            </div> :

          <div className="space-y-4">
              {swapsToReview.map((swap) => {
              const requestedItem = clothes.find(
                (c) => c.id === swap.requestedItemId
              );
              const offeredItem = clothes.find(
                (c) => c.id === swap.offeredItemId
              );
              const otherUserId =
              swap.requesterId === currentUser.id ?
              requestedItem?.ownerId :
              swap.requesterId;
              const otherUser = users.find((u) => u.id === otherUserId);
              if (!otherUser) return null;
              const isExpanded = expandedSwapId === swap.id;
              return (
                <div
                  key={swap.id}
                  className="bg-white rounded-2xl border border-warmGray-200 overflow-hidden shadow-sm">
                  
                    <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-warmGray-50 transition-colors"
                    onClick={() =>
                    setExpandedSwapId(isExpanded ? null : swap.id)
                    }>
                    
                      <div className="flex items-center gap-4">
                        <img
                        src={otherUser.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full" />
                      
                        <div>
                          <p className="font-medium text-warmGray-900">
                            Swap with {otherUser.name}
                          </p>
                          <p className="text-xs text-warmGray-500">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-sm font-medium text-primary-600">
                        {isExpanded ? 'Cancel' : 'Leave Review'}
                      </button>
                    </div>

                    {isExpanded &&
                  <div className="p-6 border-t border-warmGray-100 bg-warmGray-50/50">
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-warmGray-700 mb-2 text-center">
                            How was your experience with {otherUser.name}?
                          </label>
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) =>
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110">
                          
                                <Star
                            size={32}
                            className={`${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-warmGray-300'} transition-colors`} />
                          
                              </button>
                        )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your feedback here..."
                        className="w-full px-4 py-3 rounded-xl border border-warmGray-300 focus:ring-primary-500 focus:border-primary-500 resize-none h-24" />
                      
                        </div>

                        <div className="flex justify-end">
                          <button
                        onClick={() => handleSubmit(swap.id)}
                        className="px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                        
                            Submit Review
                          </button>
                        </div>
                      </div>
                  }
                  </div>);

            })}
            </div>
          }
        </section>

        {/* My Reviews Section */}
        <section>
          <h2 className="text-xl font-semibold text-warmGray-900 mb-4">
            Reviews You've Given
          </h2>
          <div className="bg-white rounded-2xl border border-warmGray-200 shadow-sm overflow-hidden">
            {myReviews.length === 0 ?
            <div className="p-8 text-center text-warmGray-500">
                You haven't written any reviews yet.
              </div> :

            <div className="divide-y divide-warmGray-100">
                {myReviews.map((review) => {
                const reviewee = users.find((u) => u.id === review.revieweeId);
                return (
                  <div key={review.id} className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                          src={reviewee?.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full" />
                        
                          <span className="font-medium text-warmGray-900">
                            To {reviewee?.name}
                          </span>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) =>
                        <Star
                          key={i}
                          size={14}
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
                      <p className="text-xs text-warmGray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>);

              })}
              </div>
            }
          </div>
        </section>
      </div>
    </div>);

}