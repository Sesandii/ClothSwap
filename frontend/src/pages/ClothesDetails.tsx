import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '../components/StatusBadge';
import { ClothesCard } from '../components/ClothesCard';
import { apiFetch } from '../lib/api';
import { getStoredUser } from '../lib/auth';

type ClothesUser = {
    _id?: string;
    name?: string;
    location?: string;
    profilePic?: string;
};

type ClothesItem = {
    _id: string;
    title: string;
    brand?: string;
    description: string;
    size: string;
    category: string;
    condition: string;
    status?: string;
    gender?: string;
    color?: string;
    location?: string;
    images?: string[];
    createdAt: string;
    user?: ClothesUser | string;
};

const placeholderImage =
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800';

export function ClothesDetails() {
    const { id } = useParams<{ id: string }>();

    const [item, setItem] = useState<ClothesItem | null>(null);
    const [similarItems, setSimilarItems] = useState<ClothesItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadItemDetails = async () => {
            if (!id) {
                setNotFound(true);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setNotFound(false);
                setLoadError('');
                setSelectedImage(0);

                const itemResponse = await apiFetch(`/api/clothes/${id}`);

                if (itemResponse.status === 404) {
                    setNotFound(true);
                    setItem(null);
                    setSimilarItems([]);
                    return;
                }

                if (!itemResponse.ok) {
                    throw new Error('Failed to load item details');
                }

                const itemData = (await itemResponse.json()) as ClothesItem;
                setItem(itemData);

                const clothesResponse = await apiFetch('/api/clothes');
                if (!clothesResponse.ok) {
                    setSimilarItems([]);
                    return;
                }

                const allItems = (await clothesResponse.json()) as ClothesItem[];
                const related = allItems
                    .filter(
                        (candidate) =>
                            candidate._id !== itemData._id &&
                            (candidate.category === itemData.category ||
                                (candidate.gender || 'Unisex') === (itemData.gender || 'Unisex'))
                    )
                    .slice(0, 3);

                setSimilarItems(related);
            } catch (error) {
                setLoadError(
                    error instanceof Error ? error.message : 'Unable to load item details'
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadItemDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
                    Loading item...
                </h2>
                <p className="text-warmGray-600">Please wait while we fetch the details.</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
                    Unable to Load Item
                </h2>
                <p className="text-warmGray-600 mb-6">{loadError}</p>
                <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Browse
                </Link>
            </div>
        );
    }

    if (notFound || !item) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-4">
                    Item Not Found
                </h2>
                <p className="text-warmGray-600 mb-6">
                    The item you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Browse
                </Link>
            </div>
        );
    }

    const owner = typeof item.user === 'object' ? item.user : undefined;
    const itemImages =
        item.images && item.images.length > 0 ? item.images : [placeholderImage];
    const currentUser = getStoredUser();
    const isOwner = Boolean(currentUser._id && owner?._id && currentUser._id === owner._id);

    const toggleFavorite = () => {
        setIsFavorite((current) => !current);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/browse"
                className="inline-flex items-center gap-2 text-warmGray-600 hover:text-warmGray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Browse
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-warmGray-100">
                        <img
                            src={itemImages[selectedImage] || itemImages[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {itemImages.length > 1 && (
                        <div className="flex gap-3">
                            {itemImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? 'border-primary-500 scale-105'
                                        : 'border-transparent hover:border-warmGray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${item.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <div className="flex items-start justify-between mb-3">
                            <h1 className="text-3xl font-serif font-bold text-warmGray-900">
                                {item.title}
                            </h1>
                            <button
                                onClick={toggleFavorite}
                                className="p-2 rounded-full hover:bg-warmGray-100 transition-colors"
                            >
                                <Heart
                                    size={24}
                                    className={
                                        isFavorite
                                            ? 'fill-primary-500 text-primary-500'
                                            : 'text-warmGray-400'
                                    }
                                />
                            </button>
                        </div>
                        <p className="text-lg text-warmGray-600 mb-3">
                            {item.brand || item.category}
                        </p>
                        <StatusBadge status={item.status || 'available'} />
                    </div>

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
                            <p className="font-medium text-warmGray-900">
                                {item.gender || 'Unisex'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-warmGray-600 mb-1">Condition</p>
                            <p className="font-medium text-warmGray-900">{item.condition}</p>
                        </div>
                        <div>
                            <p className="text-sm text-warmGray-600 mb-1">Color</p>
                            <p className="font-medium text-warmGray-900">
                                {item.color || 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-warmGray-600 mb-1">Posted</p>
                            <p className="font-medium text-warmGray-900">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-warmGray-900 mb-2">Description</h3>
                        <p className="text-warmGray-700 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-warmGray-600">
                        <MapPin size={20} />
                        <span>{item.location || owner?.location || 'Online'}</span>
                    </div>

                    {owner && (
                        <div className="bg-white rounded-2xl p-6 border border-warmGray-100">
                            <h3 className="font-semibold text-warmGray-900 mb-4">Listed by</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={owner.profilePic || placeholderImage}
                                    alt={owner.name || 'User'}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-warmGray-900">{owner.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-warmGray-500 mt-1">
                                        <MapPin size={14} />
                                        <span>{owner.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {isOwner ? (
                            <Link
                                to={`/edit-clothes/${item._id}`}
                                className="flex-1 bg-secondary-500 text-white py-4 rounded-xl font-medium hover:bg-secondary-600 transition-colors text-center shadow-sm hover:shadow-md"
                            >
                                Edit Item
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={`/swap-request/${item._id}`}
                                    className="flex-1 bg-primary-500 text-white py-4 rounded-xl font-medium hover:bg-primary-600 transition-colors text-center shadow-sm hover:shadow-md"
                                >
                                    Request Swap
                                </Link>
                                {owner?._id && (
                                    <Link
                                        to={`/chat/${owner._id}`}
                                        className="flex-1 bg-white border border-warmGray-200 text-warmGray-700 py-4 rounded-xl font-medium hover:bg-warmGray-50 transition-colors text-center shadow-sm hover:shadow-md"
                                    >
                                        Message Seller
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            {similarItems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-serif font-bold text-warmGray-900 mb-6">
                        Similar Items
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {similarItems.map((similarItem) => (
                            <ClothesCard
                                key={similarItem._id}
                                id={similarItem._id}
                                title={similarItem.title}
                                brand={similarItem.brand || similarItem.category}
                                size={similarItem.size}
                                condition={similarItem.condition}
                                location={similarItem.location || 'Online'}
                                imageUrl={
                                    similarItem.images && similarItem.images.length > 0
                                        ? similarItem.images[0]
                                        : placeholderImage
                                }
                                isFavorite={false}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
