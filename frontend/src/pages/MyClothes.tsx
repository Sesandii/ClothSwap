import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ClothesCard } from '../components/ClothesCard';
import { apiFetch } from '../lib/api';
import { getStoredToken } from '../lib/auth';

type ClothesItem = {
  _id: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  location: string;
  images: string[];
  status: 'available' | 'swapped' | 'hidden';
};

const placeholderImage =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

export function MyClothes() {
  const [items, setItems] = useState<ClothesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMyClothes = async () => {
      const token = getStoredToken();

      if (!token) {
        setIsLoading(false);
        toast.error('Please sign in to view your clothes');
        return;
      }

      try {
        const response = await apiFetch('/api/clothes/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = (await response.json()) as ClothesItem[];

        if (!response.ok) {
          throw new Error('Unable to load your clothes');
        }

        setItems(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load your clothes');
      } finally {
        setIsLoading(false);
      }
    };

    void loadMyClothes();
  }, []);

  const toggleStatus = async (id: string, nextStatus: ClothesItem['status']) => {
    const token = getStoredToken();

    if (!token) return;

    try {
      const response = await apiFetch(`/api/clothes/${id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        throw new Error('Unable to update item status');
      }

      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: nextStatus } : item))
      );
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Status update failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    const token = getStoredToken();

    if (!token) return;

    try {
      const response = await apiFetch(`/api/clothes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Unable to delete item');
      }

      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            My Wardrobe
          </h1>
          <p className="text-warmGray-600">
            Manage your listed items ({items.length} total)
          </p>
        </div>
        <Link
          to="/add-clothes"
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Add Item
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-warmGray-600">Loading your clothes...</div>
      ) : items.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => (
            <div key={item._id} className="relative group">
              <ClothesCard
                id={item._id}
                title={item.title}
                brand={item.brand}
                size={item.size}
                condition={item.condition}
                location={item.location}
                imageUrl={item.images?.[0] || placeholderImage}
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                <Link
                  to={`/edit-clothes/${item._id}`}
                  className="p-3 bg-white rounded-xl hover:bg-warmGray-100 transition-colors"
                  title="Edit"
                >
                  <Edit size={20} className="text-warmGray-700" />
                </Link>
                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  className="p-3 bg-white rounded-xl hover:bg-primary-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} className="text-primary-500" />
                </button>
              </div>

              <div className="mt-3">
                <button
                  onClick={() =>
                    toggleStatus(
                      item._id,
                      item.status === 'available' ? 'swapped' : 'available'
                    )
                  }
                  className={`w-full py-2 px-4 rounded-xl font-medium text-sm transition-colors ${
                    item.status === 'available'
                      ? 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      : 'bg-warmGray-100 text-warmGray-700 hover:bg-warmGray-200'
                  }`}
                >
                  {item.status === 'available' ? 'Available' : 'Swapped'}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-warmGray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-warmGray-400" size={40} />
          </div>
          <h3 className="text-xl font-serif font-bold text-warmGray-900 mb-2">
            No items yet
          </h3>
          <p className="text-warmGray-600 mb-6">
            Start by adding your first clothing item to swap
          </p>
          <Link
            to="/add-clothes"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            Add Your First Item
          </Link>
        </motion.div>
      )}
    </div>
  );
}
