import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  categories,
  sizes,
  genders,
  conditions
} from
  '../data/mockData';
import { apiFetch } from '../lib/api';
import { getStoredUser, getStoredToken } from '../lib/auth';
export function AddClothes() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Only allow up to 4 images total
    const remainingSlots = 4 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      // Validate file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImages((prev) => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getStoredToken();

    if (!token) {
      toast.error('Please sign in to add clothes');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/api/clothes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to list item');
      }

      toast.success('Item listed successfully!', {
        description: 'Your item is now visible to other users.'
      });

      navigate('/my-clothes');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
          List a New Item
        </h1>
        <p className="text-warmGray-600 mb-8">
          Add your clothing item to start swapping
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-warmGray-700 mb-3">
              Photos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) =>
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl" />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-warmGray-100 transition-colors">

                    <X size={16} className="text-warmGray-600" />
                  </button>
                </div>
              )}
              {images.length < 4 &&
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square border-2 border-dashed border-warmGray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 text-warmGray-500 hover:text-primary-500">

                  <Upload size={24} />
                  <span className="text-xs font-medium">Upload</span>
                </button>
              }
            </div>
            <p className="text-xs text-warmGray-500 mt-2">
              Add up to 4 photos. First photo will be the cover image.
            </p>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

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
                  required />

              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required>

                  <option value="">Select category</option>
                  {categories.map((cat) =>
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="size"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required>

                  <option value="">Select size</option>
                  {sizes.map((size) =>
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

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
                  required />

              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

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
                  required />

              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required>

                  <option value="">Select gender</option>
                  {genders.map((gender) =>
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required>

                  <option value="">Select condition</option>
                  {conditions.map((cond) =>
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

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
                  required />

              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-warmGray-700 mb-2">

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
                  required />

              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/my-clothes')}
              className="px-6 py-3 rounded-xl border border-warmGray-200 hover:bg-warmGray-50 transition-colors font-medium text-warmGray-700">

              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">

              {isSubmitting ? 'Listing Item...' : 'List Item'}
            </button>
          </div>
        </form>

        {/* Hidden file input */}
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