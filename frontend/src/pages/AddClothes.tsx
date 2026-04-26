import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  categories,
  sizes,
  genders,
  conditions,
  currentUser } from
'../data/mockData';
export function AddClothes() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    size: '',
    brand: '',
    color: '',
    gender: '',
    condition: '',
    description: '',
    location: currentUser.location
  });
  const handleImageUpload = () => {
    // Mock image upload - add placeholder images
    const placeholderImages = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800'];

    setImages(placeholderImages.slice(0, 1));
  };
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>

  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Item listed successfully!', {
      description: 'Your item is now visible to other users.'
    });
    setTimeout(() => {
      navigate('/my-clothes');
    }, 1500);
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
              className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md">
              
              List Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>);

}