import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { clothes, users, favorites } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { ClothesCard } from '../components/ClothesCard';
export function ClothesDetails() {
  const { id } = useParams<{
    id: string;
  }>();
  const item = clothes.find((c) => c.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(favorites.includes(id || ''));
  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
          Item Not Found
        </h2>
        <p className="text-warmGray-600 mb-6">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium">
          
          <ArrowLeft size={20} />
          Back to Browse
        </Link>
      </div>);

  }
  const owner = users.find((u) => u.id === item.ownerId);
  const similarItems = clothes.
  filter(
    (c) =>
    c.id !== item.id && (
    c.category === item.category || c.gender === item.gender)
  ).
  slice(0, 3);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-warmGray-600 hover:text-warmGray-900 mb-6 transition-colors">
        
        <ArrowLeft size={20} />
        Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="space-y-4">
          
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-warmGray-100">
            <img
              src={item.images[selectedImage]}
              alt={item.title}
              className="w-full h-full object-cover" />
            
          </div>
          {item.images.length > 1 &&
          <div className="flex gap-3">
              {item.images.map((image, index) =>
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-primary-500 scale-105' : 'border-transparent hover:border-warmGray-300'}`}>
              
                  <img
                src={image}
                alt={`${item.title} ${index + 1}`}
                className="w-full h-full object-cover" />
              
                </button>
            )}
            </div>
          }
        </motion.div>

        {/* Item Details */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="space-y-6">
          
          <div>
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl font-serif font-bold text-warmGray-900">
                {item.title}
              </h1>
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-warmGray-100 transition-colors">
                
                <Heart
                  size={24}
                  className={
                  isFavorite ?
                  'fill-primary-500 text-primary-500' :
                  'text-warmGray-400'
                  } />
                
              </button>
            </div>
            <p className="text-lg text-warmGray-600 mb-3">{item.brand}</p>
            <StatusBadge status={item.status} />
          </div>

          {/* Details Grid */}
          <div className="bg-warmGray-50 rounded-2xl p-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-warmGray-600 mb-1">Category</p>
              <p className="font-medium text-warmGray-900">{item.category}</p>
            </div>
            <div>
              <p className="text-sm text-warmGray-600 mb-1">Size</p>
              <p className="font-medium text-warmGray-900">{item.size}</p>
            </div>
            <div>
              <p className="text-sm text-warmGray-600 mb-1">Gender</p>
              <p className="font-medium text-warmGray-900">{item.gender}</p>
            </div>
            <div>
              <p className="text-sm text-warmGray-600 mb-1">Condition</p>
              <p className="font-medium text-warmGray-900">{item.condition}</p>
            </div>
            <div>
              <p className="text-sm text-warmGray-600 mb-1">Color</p>
              <p className="font-medium text-warmGray-900">{item.color}</p>
            </div>
            <div>
              <p className="text-sm text-warmGray-600 mb-1">Posted</p>
              <p className="font-medium text-warmGray-900">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-warmGray-900 mb-2">
              Description
            </h3>
            <p className="text-warmGray-700 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-warmGray-600">
            <MapPin size={20} />
            <span>{item.location}</span>
          </div>

          {/* Owner Card */}
          {owner &&
          <div className="bg-white rounded-2xl p-6 border border-warmGray-100">
              <h3 className="font-semibold text-warmGray-900 mb-4">
                Listed by
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                src={owner.avatar}
                alt={owner.name}
                className="w-16 h-16 rounded-full" />
              
                <div className="flex-1">
                  <p className="font-semibold text-warmGray-900">
                    {owner.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-warmGray-600">
                    <span>⭐ {owner.rating}</span>
                    <span>•</span>
                    <span>{owner.reviewsCount} reviews</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-warmGray-500 mt-1">
                    <MapPin size={14} />
                    <span>{owner.location}</span>
                  </div>
                </div>
              </div>
              <Link
              to={`/profile/${owner.id}`}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              
                View Profile →
              </Link>
            </div>
          }

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/swap-request/${item.id}`}
              className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-medium hover:bg-primary-600 transition-colors text-center shadow-sm hover:shadow-md">
              
              Request Swap
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Similar Items */}
      {similarItems.length > 0 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.2
        }}>
        
          <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-6">
            Similar Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarItems.map((similarItem) =>
          <ClothesCard
            key={similarItem.id}
            id={similarItem.id}
            title={similarItem.title}
            brand={similarItem.brand}
            size={similarItem.size}
            condition={similarItem.condition}
            location={similarItem.location}
            imageUrl={similarItem.images[0]}
            isFavorite={favorites.includes(similarItem.id)} />

          )}
          </div>
        </motion.div>
      }
    </div>);

}