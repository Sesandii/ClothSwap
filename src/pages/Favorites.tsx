import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clothes, favorites } from '../data/mockData';
import { ClothesCard } from '../components/ClothesCard';
export function Favorites() {
  const favoriteClothes = clothes.filter((c) => favorites.includes(c.id));
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          My Favorites
        </h1>
        <p className="text-warmGray-500">Items you've saved for later.</p>
      </div>

      {favoriteClothes.length === 0 ?
      <div className="text-center py-20 bg-white rounded-2xl border border-warmGray-100">
          <Heart className="mx-auto h-12 w-12 text-warmGray-300 mb-4" />
          <h3 className="text-lg font-medium text-warmGray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-warmGray-500 mb-6">
            Start browsing and save items you like.
          </p>
          <Link
          to="/browse"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-500 hover:bg-primary-600 transition-colors">
          
            Browse Clothes
          </Link>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteClothes.map((item) =>
        <ClothesCard
          key={item.id}
          id={item.id}
          title={item.title}
          brand={item.brand}
          size={item.size}
          condition={item.condition}
          location={item.location}
          imageUrl={item.images[0]}
          isFavorite={true} />

        )}
        </div>
      }
    </div>);

}