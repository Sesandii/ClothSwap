require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Clothes = require('../models/Clothes');
const SwapRequest = require('../models/SwapRequest');

const seed = async () => {
    try {
        await connectDB();

        // Clear collections
        await SwapRequest.deleteMany({});
        await Clothes.deleteMany({});
        await User.deleteMany({});

        // Create test user
        const password = await bcrypt.hash('password123', 10);
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password,
            phone: '1234567890',
            location: 'Test City',
        });

        // Create clothes items
        const clothes1 = await Clothes.create({
            user: user._id,
            title: 'Vintage Jacket',
            brand: 'Levi\'s',
            description: 'Warm and stylish vintage jacket.',
            size: 'M',
            category: 'Jackets',
            condition: 'Good',
            gender: 'Unisex',
            color: 'Blue',
            location: 'Test City',
            images: [],
        });

        const clothes2 = await Clothes.create({
            user: user._id,
            title: 'Denim Jeans',
            brand: 'Wrangler',
            description: 'Comfortable blue jeans.',
            size: '32',
            category: 'Pants',
            condition: 'Like New',
            gender: 'Men',
            color: 'Blue',
            location: 'Test City',
            images: [],
        });

        // Create a swap request (requester is same test user for demo)
        await SwapRequest.create({
            requester: user._id,
            offeredClothes: clothes1._id,
            requestedClothes: clothes2._id,
            status: 'pending',
        });

        console.log('Seeding complete. Test user: test@example.com / password123');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
