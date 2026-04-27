import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClothesCard } from '../components/ClothesCard';
import {
    categories,
    sizes,
    genders,
    conditions
} from '../data/mockData';
import { apiFetch } from '../lib/api';

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

type BrowseItem = {
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

export function BrowseClothes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [locationFilter, setLocationFilter] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [favoritedItems, setFavoritedItems] = useState<string[]>([]);
    const [items, setItems] = useState<BrowseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadClothes = async () => {
            try {
                setIsLoading(true);
                const response = await apiFetch('/api/clothes');
                const data = (await response.json()) as ClothesRecord[];

                if (!response.ok) {
                    throw new Error('Failed to load clothes');
                }

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

                setItems(normalizedItems);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unable to load clothes');
            } finally {
                setIsLoading(false);
            }
        };

        loadClothes();
    }, []);

    const filteredClothes = useMemo(() => {
        let filtered = [...items];

        if (searchQuery) {
            filtered = filtered.filter(
                (item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((item) => selectedCategories.includes(item.category));
        }

        if (selectedSizes.length > 0) {
            filtered = filtered.filter((item) => selectedSizes.includes(item.size));
        }

        if (selectedGender) {
            filtered = filtered.filter((item) => item.gender === selectedGender);
        }

        if (selectedConditions.length > 0) {
            filtered = filtered.filter((item) => selectedConditions.includes(item.condition));
        }

        if (locationFilter) {
            filtered = filtered.filter((item) =>
                item.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [
        items,
        searchQuery,
        selectedCategories,
        selectedSizes,
        selectedGender,
        selectedConditions,
        locationFilter,
        sortBy
    ]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const toggleCondition = (condition: string) => {
        setSelectedConditions((prev) =>
            prev.includes(condition)
                ? prev.filter((c) => c !== condition)
                : [...prev, condition]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedGender('');
        setSelectedConditions([]);
        setLocationFilter('');
        setSearchQuery('');
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedSizes.length +
        selectedConditions.length +
        (selectedGender ? 1 : 0) +
        (locationFilter ? 1 : 0);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setFavoritedItems((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
                    Browse Clothes
                </h1>
                <p className="text-warmGray-600">
                    Discover amazing items to swap from our community
                </p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-warmGray-400"
                        size={20} />

                    <input
                        type="text"
                        placeholder="Search by title, brand, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />

                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:w-auto px-6 py-3 rounded-xl border border-warmGray-200 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2 bg-white">

                    <SlidersHorizontal size={20} />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="sm:w-auto px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">

                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        className="mb-6 overflow-hidden">

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warmGray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-warmGray-900">Filters</h3>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-500 hover:text-primary-600 font-medium">

                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <h4 className="font-medium text-warmGray-900 mb-3 text-sm">
                                        Category
                                    </h4>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <label key={category} className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                    className="rounded border-warmGray-300 text-primary-500 focus:ring-primary-500" />

                                                <span className="ml-2 text-sm text-warmGray-700">
                                                    {category}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-warmGray-900 mb-3 text-sm">
                                        Size
                                    </h4>
                                    <div className="space-y-2">
                                        {sizes.map((size) => (
                                            <label key={size} className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSizes.includes(size)}
                                                    onChange={() => toggleSize(size)}
                                                    className="rounded border-warmGray-300 text-primary-500 focus:ring-primary-500" />

                                                <span className="ml-2 text-sm text-warmGray-700">
                                                    {size}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-warmGray-900 mb-3 text-sm">
                                        Gender
                                    </h4>
                                    <div className="space-y-2">
                                        {genders.map((gender) => (
                                            <label key={gender} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    checked={selectedGender === gender}
                                                    onChange={() => setSelectedGender(gender)}
                                                    className="border-warmGray-300 text-primary-500 focus:ring-primary-500" />

                                                <span className="ml-2 text-sm text-warmGray-700">
                                                    {gender}
                                                </span>
                                            </label>
                                        ))}
                                        {selectedGender && (
                                            <button
                                                onClick={() => setSelectedGender('')}
                                                className="text-xs text-primary-500 hover:text-primary-600">

                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-warmGray-900 mb-3 text-sm">
                                        Condition
                                    </h4>
                                    <div className="space-y-2">
                                        {conditions.map((condition) => (
                                            <label key={condition} className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConditions.includes(condition)}
                                                    onChange={() => toggleCondition(condition)}
                                                    className="rounded border-warmGray-300 text-primary-500 focus:ring-primary-500" />

                                                <span className="ml-2 text-sm text-warmGray-700">
                                                    {condition}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-warmGray-100">
                                <h4 className="font-medium text-warmGray-900 mb-3 text-sm">
                                    Location
                                </h4>
                                <input
                                    type="text"
                                    placeholder="Filter by location..."
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {activeFilterCount > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => (
                        <span
                            key={cat}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">

                            {cat}
                            <button onClick={() => toggleCategory(cat)}>
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {selectedSizes.map((size) => (
                        <span
                            key={size}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">

                            Size: {size}
                            <button onClick={() => toggleSize(size)}>
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {selectedGender && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                            {selectedGender}
                            <button onClick={() => setSelectedGender('')}>
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {selectedConditions.map((cond) => (
                        <span
                            key={cond}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">

                            {cond}
                            <button onClick={() => toggleCondition(cond)}>
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {locationFilter && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                            Location: {locationFilter}
                            <button onClick={() => setLocationFilter('')}>
                                <X size={14} />
                            </button>
                        </span>
                    )}
                </div>
            )}

            <div className="mb-6">
                <p className="text-warmGray-600">
                    <span className="font-semibold text-warmGray-900">
                        {filteredClothes.length}
                    </span>{' '}
                    {filteredClothes.length === 1 ? 'item' : 'items'} found
                </p>
            </div>

            {isLoading ? (
                <div className="py-16 text-center text-warmGray-600">Loading clothes...</div>
            ) : error ? (
                <div className="py-16 text-center text-red-600">{error}</div>
            ) : filteredClothes.length > 0 ? (
                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredClothes.map((item) => (
                        <ClothesCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            brand={item.brand}
                            size={item.size}
                            condition={item.condition}
                            location={item.location}
                            imageUrl={item.images[0]}
                            isFavorite={favoritedItems.includes(item.id)}
                            onFavoriteToggle={(e) => toggleFavorite(item.id, e)} />
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-warmGray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-warmGray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-warmGray-900 mb-2">
                        No items found
                    </h3>
                    <p className="text-warmGray-600 mb-4">
                        Try adjusting your filters or search query
                    </p>
                    <button
                        onClick={clearFilters}
                        className="text-primary-500 hover:text-primary-600 font-medium">

                        Clear all filters
                    </button>
                </div>
            )}
        </div>);

}
