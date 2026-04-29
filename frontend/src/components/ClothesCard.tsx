import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
interface ClothesCardProps {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  location: string;
  imageUrl: string;
  isFavorite?: boolean;
  isOwnItem?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
}
export function ClothesCard({
  id,
  title,
  brand,
  size,
  condition,
  location,
  imageUrl,
  isFavorite = false,
  isOwnItem = false,
  onFavoriteToggle
}: ClothesCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -5
      }}
      transition={{
        duration: 0.2
      }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-warmGray-100 flex flex-col h-full">

      <div className="relative aspect-[4/5] overflow-hidden bg-warmGray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        <span
          title={isOwnItem ? 'You cannot favorite your own items' : ''}
          className="absolute top-3 right-3 inline-block">
          <button
            onClick={onFavoriteToggle}
            disabled={isOwnItem}
            aria-label={isOwnItem ? 'You cannot favorite your own items' : 'Toggle favorite'}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors shadow-sm ${isOwnItem
              ? 'cursor-not-allowed opacity-50 text-warmGray-400'
              : 'hover:bg-white text-warmGray-600 hover:text-primary-500'
            }`}>

            <Heart
              size={18}
              className={isFavorite ? 'fill-primary-500 text-primary-500' : ''} />

          </button>
        </span>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-md shadow-sm">
            {size}
          </span>
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-md shadow-sm">
            {condition}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif font-semibold text-lg text-warmGray-900 line-clamp-1">
            <Link
              to={`/clothes/${id}`}
              className="hover:text-primary-500 transition-colors">

              {title}
            </Link>
          </h3>
        </div>
        <p className="text-sm text-warmGray-500 mb-3">{brand}</p>

        <div className="mt-auto flex items-center text-xs text-warmGray-400">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </motion.div>);

}