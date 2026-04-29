import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClothesCard } from '../components/ClothesCard';
import { apiFetch, toggleFavorite } from '../lib/api';

type ClothesUser = {
  name?: string;
  location?: string;
  profilePic?: string;
};

type ClothesRecord = {
  _id: string;
  title: string;
  brand?: string;
  description: string;
  size: string;
  category: string;
  condition: string;
  gender?: string;
  color?: string;
  location?: string;
  images?: string[];
  createdAt: string;
  user?: ClothesUser | string;
};

type FavoriteItem = {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  gender: string;
  condition: string;
  description: string;
  location: string;
  images: string[];
  createdAt: string;
};

const placeholderImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

export function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/api/favorites');

        if (!response.ok) {
          throw new Error('Failed to load favorites');
        }

        const data = (await response.json()) as ClothesRecord[];
        const normalizedItems = data.map((item) => {
          const user = typeof item.user === 'object' ? item.user : undefined;

          return {
            id: item._id,
            title: item.title,
            brand: item.brand || user?.name || item.category,
            category: item.category,
            size: item.size,
            gender: item.gender || 'Unisex',
            condition: item.condition,
            description: item.description,
            location: item.location || user?.location || 'Online',
            images: item.images && item.images.length > 0 ? item.images : [placeholderImage],
            createdAt: item.createdAt
          };
        });

        setFavorites(normalizedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await toggleFavorite(id);
      if (response.ok) {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-16 text-center text-warmGray-600">Loading favorites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-16 text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          My Favorites
        </h1>
        <p className="text-warmGray-500">Items you've saved for later.</p>
      </div>

      {favorites.length === 0 ? (
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <ClothesCard
              key={item.id}
              id={item.id}
              title={item.title}
              brand={item.brand}
              size={item.size}
              condition={item.condition}
              location={item.location}
              imageUrl={item.images[0]}
              isFavorite={true}
              onFavoriteToggle={(e) => handleRemoveFavorite(item.id, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}