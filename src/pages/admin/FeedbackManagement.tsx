import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Star } from 'lucide-react';
import { reviews, users } from '../../data/mockData';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer } from
'recharts';
export function FeedbackManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [reviewList, setReviewList] = useState(reviews);
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this review?')) {
      setReviewList((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review removed');
    }
  };
  const filteredReviews = reviewList.filter((r) => {
    const reviewer = users.find((u) => u.id === r.reviewerId)?.name || '';
    const matchesSearch = reviewer.
    toLowerCase().
    includes(searchTerm.toLowerCase());
    const matchesRating =
    ratingFilter === 'All' || r.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });
  const avgRating = (
  reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).
  toFixed(1);
  const distributionData = [5, 4, 3, 2, 1].map((stars) => ({
    name: `${stars} Stars`,
    count: reviewList.filter((r) => r.rating === stars).length
  }));
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-warmGray-100 flex flex-col items-center justify-center">
          <h3 className="text-warmGray-500 font-medium mb-2">Average Rating</h3>
          <div className="text-4xl font-bold text-warmGray-900 flex items-center gap-2">
            {avgRating}{' '}
            <Star className="fill-yellow-400 text-yellow-400" size={32} />
          </div>
          <p className="text-sm text-warmGray-400 mt-2">
            Based on {reviewList.length} reviews
          </p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-warmGray-100">
          <h3 className="text-warmGray-900 font-medium mb-4">
            Rating Distribution
          </h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distributionData}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0
                }}>
                
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#78716c',
                    fontSize: 12
                  }}
                  width={60} />
                
                <Tooltip
                  cursor={{
                    fill: '#f5f5f4'
                  }} />
                
                <Bar
                  dataKey="count"
                  fill="#fbbf24"
                  radius={[0, 4, 4, 0]}
                  barSize={12} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm bg-white">
          
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray-400"
            size={20} />
          
          <input
            type="text"
            placeholder="Search by reviewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm" />
          
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-warmGray-50 text-warmGray-500 border-b border-warmGray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Reviewer</th>
                <th className="px-6 py-4 font-medium">Reviewee</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Comment</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmGray-100">
              {filteredReviews.map((review) => {
                const reviewer = users.find((u) => u.id === review.reviewerId);
                const reviewee = users.find((u) => u.id === review.revieweeId);
                return (
                  <tr
                    key={review.id}
                    className="hover:bg-warmGray-50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={reviewer?.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full" />
                        
                        <span className="font-medium text-warmGray-900">
                          {reviewer?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={reviewee?.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full" />
                        
                        <span className="text-warmGray-600">
                          {reviewee?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-warmGray-600 truncate max-w-[200px]">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-warmGray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-warmGray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Review">
                          
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {filteredReviews.length === 0 &&
        <div className="p-8 text-center text-warmGray-500">
            No reviews found.
          </div>
        }
      </div>
    </motion.div>);

}