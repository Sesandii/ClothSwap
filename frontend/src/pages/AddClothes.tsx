import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { categories, sizes, genders, conditions } from '../data/mockData';
import { apiFetch } from '../lib/api';
import { getStoredUser, getStoredToken } from '../lib/auth';

type ClothesItemResponse = {
  _id: string;
  title: string;
  category: string;
  size: string;
  brand?: string;
  color?: string;
  gender?: string;
  condition: string;
  description: string;
  location?: string;
  images?: string[];
  user?: {
    _id?: string;
  } | string;
};

export function AddClothes() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentUser = getStoredUser();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingItem, setIsLoadingItem] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    size: '',
    brand: '',
    color: '',
    gender: '',
    condition: '',
    description: '',
    location: currentUser.location || ''
  });

  useEffect(() => {
    const loadItemForEdit = async () => {
      if (!isEditMode || !id) {
        setIsLoadingItem(false);
        return;
      }

      const token = getStoredToken();

      if (!token) {
        toast.error('Please sign in to edit clothes');
        navigate('/login');
        return;
      }

      try {
        setIsLoadingItem(true);
        const response = await apiFetch(`/api/clothes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = (await response.json()) as ClothesItemResponse | { message?: string };

        if (!response.ok) {
          throw new Error('Unable to load item for editing');
        }

        const ownerId =
          typeof data.user === 'object' && data.user ? data.user._id : undefined;

        if (ownerId && currentUser._id && ownerId !== currentUser._id) {
          toast.error('You can only edit your own items');
          navigate('/my-clothes');
          return;
        }

        const item = data as ClothesItemResponse;
        setFormData({
          title: item.title || '',
          category: item.category || '',
          size: item.size || '',
          brand: item.brand || '',
          color: item.color || '',
          gender: item.gender || '',
          condition: item.condition || '',
          description: item.description || '',
          location: item.location || currentUser.location || ''
        });
        setImages(item.images || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load item');
        navigate('/my-clothes');
      } finally {
        setIsLoadingItem(false);
      }
    };

    void loadItemForEdit();
  }, [currentUser._id, currentUser.location, id, isEditMode, navigate]);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 4 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImages((prev) => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getStoredToken();

    if (!token) {
      toast.error('Please sign in to manage clothes');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch(
        isEditMode && id ? `/api/clothes/${id}` : '/api/clothes',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            images
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save item');
      }

      toast.success(isEditMode ? 'Item updated successfully!' : 'Item listed successfully!', {
        description: isEditMode
          ? 'Your changes have been saved.'
          : 'Your item is now visible to other users.'
      });

      navigate('/my-clothes');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-warmGray-600">
        Loading item details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          {isEditMode ? 'Edit Item' : 'List a New Item'}
        </h1>
        <p className="text-warmGray-600 mb-8">
          {isEditMode
            ? 'Update your clothing item details'
            : 'Add your clothing item to start swapping'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-3">
              Photos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-warmGray-100 transition-colors"
                  >
                    <X size={16} className="text-warmGray-600" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square border-2 border-dashed border-warmGray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 text-warmGray-500 hover:text-primary-500"
                >
                  <Upload size={24} />
                  <span className="text-xs font-medium">
                    {isEditMode ? 'Add photo' : 'Upload'}
                  </span>
                </button>
              )}
            </div>
            <p className="text-xs text-warmGray-500 mt-2">
              Add up to 4 photos. First photo will be the cover image.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-warmGray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Vintage Denim Jacket"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-warmGray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-warmGray-700 mb-2">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select size</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-warmGray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Levi's"
                  required
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-warmGray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Blue"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-warmGray-700 mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-warmGray-700 mb-2"
                >
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-warmGray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Describe your item, including any flaws or special features..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-warmGray-700 mb-2"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="City, State"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/my-clothes')}
              className="px-6 py-3 rounded-xl border border-warmGray-200 hover:bg-warmGray-50 transition-colors font-medium text-warmGray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditMode
                  ? 'Saving Changes...'
                  : 'Listing Item...'
                : isEditMode
                  ? 'Save Changes'
                  : 'List Item'}
            </button>
          </div>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          style={{ display: 'none' }}
        />
      </motion.div>
    </div>
  );
}
