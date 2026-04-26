export const currentUser = {
  id: 'u1',
  name: 'Emma Chamberlain',
  email: 'emma@example.com',
  phone: '+1 234 567 8900',
  location: 'Los Angeles, CA',
  address: '123 Fashion Ave, Apt 4B, Los Angeles, CA 90001',
  avatar:
  'https://ui-avatars.com/api/?name=Emma+Chamberlain&background=e8786f&color=fff',
  rating: 4.8,
  reviewsCount: 24,
  joinedDate: '2023-05-15'
};

export const users = [
currentUser,
{
  id: 'u2',
  name: 'Sarah Jenkins',
  location: 'New York, NY',
  avatar:
  'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=7da17d&color=fff',
  rating: 4.9,
  reviewsCount: 42
},
{
  id: 'u3',
  name: 'Michael Chen',
  location: 'San Francisco, CA',
  avatar:
  'https://ui-avatars.com/api/?name=Michael+Chen&background=a3a3a3&color=fff',
  rating: 4.5,
  reviewsCount: 18
},
{
  id: 'u4',
  name: 'Jessica Alba',
  location: 'Austin, TX',
  avatar:
  'https://ui-avatars.com/api/?name=Jessica+Alba&background=e8786f&color=fff',
  rating: 5.0,
  reviewsCount: 8
}];


export const categories = [
'Shirts',
'Dresses',
'Pants',
'Shoes',
'Jackets',
'Accessories',
'Sweaters',
'Skirts'];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
export const conditions = ['New with tags', 'Like new', 'Good', 'Fair'];
export const genders = ['Women', 'Men', 'Unisex'];

export const clothes = [
{
  id: 'c1',
  title: 'Vintage Denim Jacket',
  brand: "Levi's",
  category: 'Jackets',
  size: 'M',
  gender: 'Unisex',
  condition: 'Good',
  color: 'Blue',
  description:
  "Classic vintage Levi's denim jacket. Perfectly worn in with a great fade. Minor fraying on the cuffs which adds to the vintage look.",
  location: 'New York, NY',
  images: [
  'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u2',
  createdAt: '2023-10-01T10:00:00Z',
  status: 'available'
},
{
  id: 'c2',
  title: 'Floral Summer Midi Dress',
  brand: 'Reformation',
  category: 'Dresses',
  size: 'S',
  gender: 'Women',
  condition: 'Like new',
  color: 'Red/White',
  description:
  'Beautiful floral midi dress perfect for summer picnics or weddings. Worn only once. Features a sweetheart neckline and a subtle side slit.',
  location: 'Los Angeles, CA',
  images: [
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u1',
  createdAt: '2023-10-05T14:30:00Z',
  status: 'available'
},
{
  id: 'c3',
  title: 'Chunky Knit Sweater',
  brand: 'Zara',
  category: 'Sweaters',
  size: 'L',
  gender: 'Women',
  condition: 'Good',
  color: 'Cream',
  description:
  'Super cozy oversized chunky knit sweater. Perfect for fall and winter. Very warm and comfortable.',
  location: 'San Francisco, CA',
  images: [
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u3',
  createdAt: '2023-10-10T09:15:00Z',
  status: 'available'
},
{
  id: 'c4',
  title: 'High-Top Canvas Sneakers',
  brand: 'Converse',
  category: 'Shoes',
  size: '8',
  gender: 'Unisex',
  condition: 'Fair',
  color: 'Black',
  description:
  'Classic black high-top Converse. They have some wear and tear but still have plenty of life left in them.',
  location: 'Austin, TX',
  images: [
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u4',
  createdAt: '2023-10-12T16:45:00Z',
  status: 'available'
},
{
  id: 'c5',
  title: 'Tailored Wide-Leg Trousers',
  brand: 'Aritzia',
  category: 'Pants',
  size: 'S',
  gender: 'Women',
  condition: 'New with tags',
  color: 'Beige',
  description:
  'Brand new Effortless Pant from Aritzia. Tags still attached. Ordered the wrong size and missed the return window.',
  location: 'New York, NY',
  images: [
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u2',
  createdAt: '2023-10-15T11:20:00Z',
  status: 'available'
},
{
  id: 'c6',
  title: 'Graphic Print T-Shirt',
  brand: 'Urban Outfitters',
  category: 'Shirts',
  size: 'M',
  gender: 'Men',
  condition: 'Good',
  color: 'White',
  description:
  'Cool vintage-style graphic tee. Soft cotton, slightly oversized fit.',
  location: 'San Francisco, CA',
  images: [
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u3',
  createdAt: '2023-10-18T13:10:00Z',
  status: 'available'
},
{
  id: 'c7',
  title: 'Leather Ankle Boots',
  brand: 'Dr. Martens',
  category: 'Shoes',
  size: '7',
  gender: 'Women',
  condition: 'Good',
  color: 'Black',
  description:
  'Classic Dr. Martens ankle boots. Well-loved but still in great condition. Perfect for fall and winter.',
  location: 'Los Angeles, CA',
  images: [
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u1',
  createdAt: '2023-10-20T08:30:00Z',
  status: 'available'
},
{
  id: 'c8',
  title: 'Silk Slip Dress',
  brand: 'Free People',
  category: 'Dresses',
  size: 'M',
  gender: 'Women',
  condition: 'Like new',
  color: 'Emerald Green',
  description:
  'Gorgeous emerald green silk slip dress. Perfect for special occasions or date nights. Worn twice.',
  location: 'New York, NY',
  images: [
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u2',
  createdAt: '2023-10-22T15:45:00Z',
  status: 'available'
},
{
  id: 'c9',
  title: 'Wool Blend Blazer',
  brand: 'Massimo Dutti',
  category: 'Jackets',
  size: 'L',
  gender: 'Men',
  condition: 'Like new',
  color: 'Navy',
  description:
  'Professional navy blazer, perfect for work or formal events. Barely worn, excellent condition.',
  location: 'San Francisco, CA',
  images: [
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u3',
  createdAt: '2023-10-25T10:20:00Z',
  status: 'available'
},
{
  id: 'c10',
  title: 'Pleated Mini Skirt',
  brand: 'Brandy Melville',
  category: 'Skirts',
  size: 'One Size',
  gender: 'Women',
  condition: 'Good',
  color: 'Black',
  description:
  'Classic black pleated mini skirt. Super versatile and easy to style. Some minor wear but still looks great.',
  location: 'Austin, TX',
  images: [
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u4',
  createdAt: '2023-10-28T12:00:00Z',
  status: 'available'
},
{
  id: 'c11',
  title: 'Cashmere Scarf',
  brand: 'Everlane',
  category: 'Accessories',
  size: 'One Size',
  gender: 'Unisex',
  condition: 'New with tags',
  color: 'Camel',
  description:
  'Luxurious cashmere scarf in a beautiful camel color. Never worn, still has tags. Gift that I never used.',
  location: 'New York, NY',
  images: [
  'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u2',
  createdAt: '2023-10-30T09:15:00Z',
  status: 'available'
},
{
  id: 'c12',
  title: 'Athletic Running Shorts',
  brand: 'Nike',
  category: 'Pants',
  size: 'M',
  gender: 'Men',
  condition: 'Good',
  color: 'Gray',
  description:
  'Comfortable Nike running shorts with built-in liner. Great for workouts or casual wear.',
  location: 'Los Angeles, CA',
  images: [
  'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800'],

  ownerId: 'u1',
  createdAt: '2023-11-01T14:30:00Z',
  status: 'available'
}];


export const swapRequests = [
{
  id: 'sr1',
  requesterId: 'u1',
  requestedItemId: 'c1',
  offeredItemId: 'c2',
  status: 'pending',
  message:
  'Hi! I love your vintage denim jacket. Would you be interested in swapping for my floral dress?',
  createdAt: '2023-11-02T10:00:00Z'
},
{
  id: 'sr2',
  requesterId: 'u3',
  requestedItemId: 'c2',
  offeredItemId: 'c3',
  status: 'accepted',
  message:
  'Your dress is beautiful! I have this cozy sweater that might interest you.',
  createdAt: '2023-11-01T15:30:00Z'
},
{
  id: 'sr3',
  requesterId: 'u2',
  requestedItemId: 'c7',
  offeredItemId: 'c5',
  status: 'completed',
  message: "I'd love to swap my trousers for your boots!",
  createdAt: '2023-10-28T09:00:00Z'
},
{
  id: 'sr4',
  requesterId: 'u4',
  requestedItemId: 'c12',
  offeredItemId: 'c4',
  status: 'rejected',
  message: 'Interested in swapping my sneakers for your running shorts?',
  createdAt: '2023-10-30T11:20:00Z'
},
{
  id: 'sr5',
  requesterId: 'u1',
  requestedItemId: 'c9',
  offeredItemId: 'c7',
  status: 'accepted',
  message: 'Would you swap your blazer for my ankle boots?',
  createdAt: '2023-11-03T08:45:00Z'
},
{
  id: 'sr6',
  requesterId: 'u2',
  requestedItemId: 'c3',
  offeredItemId: 'c8',
  status: 'cancelled',
  message: 'Interested in your sweater! I have this silk dress.',
  createdAt: '2023-10-29T16:00:00Z'
},
{
  id: 'sr7',
  requesterId: 'u3',
  requestedItemId: 'c10',
  offeredItemId: 'c6',
  status: 'pending',
  message: 'Love the pleated skirt! Want to swap for my graphic tee?',
  createdAt: '2023-11-04T13:15:00Z'
},
{
  id: 'sr8',
  requesterId: 'u4',
  requestedItemId: 'c11',
  offeredItemId: 'c10',
  status: 'completed',
  message: 'That cashmere scarf is gorgeous! Interested in my skirt?',
  createdAt: '2023-10-26T10:30:00Z'
}];


export const conversations = [
{
  id: 'conv1',
  participants: ['u1', 'u2'],
  relatedSwapId: 'sr1',
  messages: [
  {
    id: 'm1',
    senderId: 'u1',
    text: "Hi! I'm interested in your denim jacket.",
    timestamp: '2023-11-02T10:05:00Z'
  },
  {
    id: 'm2',
    senderId: 'u2',
    text: 'Thanks! Your floral dress is lovely too. When would you like to meet?',
    timestamp: '2023-11-02T10:15:00Z'
  },
  {
    id: 'm3',
    senderId: 'u1',
    text: 'How about this weekend? I can meet in Manhattan.',
    timestamp: '2023-11-02T10:20:00Z'
  }]

},
{
  id: 'conv2',
  participants: ['u1', 'u3'],
  relatedSwapId: 'sr5',
  messages: [
  {
    id: 'm4',
    senderId: 'u3',
    text: 'I accepted your swap request! The blazer is all yours.',
    timestamp: '2023-11-03T09:00:00Z'
  },
  {
    id: 'm5',
    senderId: 'u1',
    text: 'Awesome! Should we do delivery or meetup?',
    timestamp: '2023-11-03T09:10:00Z'
  },
  {
    id: 'm6',
    senderId: 'u3',
    text: "I prefer delivery if that works for you. I'll ship it tomorrow.",
    timestamp: '2023-11-03T09:15:00Z'
  }]

},
{
  id: 'conv3',
  participants: ['u2', 'u1'],
  relatedSwapId: 'sr3',
  messages: [
  {
    id: 'm7',
    senderId: 'u2',
    text: 'The boots arrived! They fit perfectly, thank you!',
    timestamp: '2023-10-30T14:00:00Z'
  },
  {
    id: 'm8',
    senderId: 'u1',
    text: "So glad you love them! The trousers are perfect too. Let's leave reviews!",
    timestamp: '2023-10-30T14:30:00Z'
  }]

}];


export const notifications = [
{
  id: 'n1',
  type: 'swap_request',
  title: 'New Swap Request',
  message: 'Sarah Jenkins wants to swap for your Vintage Denim Jacket',
  read: false,
  createdAt: '2023-11-02T10:00:00Z'
},
{
  id: 'n2',
  type: 'request_accepted',
  title: 'Swap Request Accepted',
  message: 'Michael Chen accepted your swap request for Wool Blend Blazer',
  read: false,
  createdAt: '2023-11-03T09:00:00Z'
},
{
  id: 'n3',
  type: 'new_message',
  title: 'New Message',
  message: 'Sarah Jenkins sent you a message',
  read: true,
  createdAt: '2023-11-02T10:15:00Z'
},
{
  id: 'n4',
  type: 'exchange_selected',
  title: 'Exchange Method Selected',
  message: 'Michael Chen selected delivery as the exchange method',
  read: true,
  createdAt: '2023-11-03T09:15:00Z'
},
{
  id: 'n5',
  type: 'delivery_update',
  title: 'Delivery Update',
  message: 'Your item has been shipped and is in transit',
  read: true,
  createdAt: '2023-11-03T16:00:00Z'
},
{
  id: 'n6',
  type: 'review_received',
  title: 'New Review',
  message: 'Sarah Jenkins left you a 5-star review',
  read: true,
  createdAt: '2023-10-31T12:00:00Z'
},
{
  id: 'n7',
  type: 'request_rejected',
  title: 'Swap Request Declined',
  message: 'Jessica Alba declined your swap request',
  read: true,
  createdAt: '2023-10-30T14:00:00Z'
},
{
  id: 'n8',
  type: 'swap_request',
  title: 'New Swap Request',
  message: 'Michael Chen wants to swap for your Pleated Mini Skirt',
  read: false,
  createdAt: '2023-11-04T13:15:00Z'
},
{
  id: 'n9',
  type: 'delivery_update',
  title: 'Item Delivered',
  message: 'Your swap item has been delivered successfully',
  read: true,
  createdAt: '2023-10-29T10:30:00Z'
},
{
  id: 'n10',
  type: 'new_message',
  title: 'New Message',
  message: 'Michael Chen sent you a message',
  read: false,
  createdAt: '2023-11-03T09:10:00Z'
}];


export const reviews = [
{
  id: 'r1',
  swapId: 'sr3',
  reviewerId: 'u2',
  revieweeId: 'u1',
  rating: 5,
  comment:
  'Amazing swap experience! The boots were exactly as described and Emma was so friendly and communicative.',
  createdAt: '2023-10-31T12:00:00Z'
},
{
  id: 'r2',
  swapId: 'sr3',
  reviewerId: 'u1',
  revieweeId: 'u2',
  rating: 5,
  comment:
  'Perfect transaction! The trousers fit great and Sarah was very professional.',
  createdAt: '2023-10-31T12:30:00Z'
},
{
  id: 'r3',
  swapId: 'sr8',
  reviewerId: 'u4',
  revieweeId: 'u2',
  rating: 4,
  comment:
  'Great quality scarf! Delivery took a bit longer than expected but overall happy.',
  createdAt: '2023-10-28T15:00:00Z'
},
{
  id: 'r4',
  swapId: 'sr8',
  reviewerId: 'u2',
  revieweeId: 'u4',
  rating: 5,
  comment: 'Lovely skirt and Jessica was great to work with!',
  createdAt: '2023-10-28T15:30:00Z'
},
{
  id: 'r5',
  reviewerId: 'u3',
  revieweeId: 'u1',
  swapId: 'sr2',
  rating: 4,
  comment: 'Nice dress, good condition. Would swap again!',
  createdAt: '2023-10-25T10:00:00Z'
},
{
  id: 'r6',
  reviewerId: 'u1',
  revieweeId: 'u3',
  swapId: 'sr2',
  rating: 5,
  comment: 'The sweater is so cozy! Perfect for fall. Thanks Michael!',
  createdAt: '2023-10-25T10:30:00Z'
}];


export const complaints = [
{
  id: 'comp1',
  userId: 'u1',
  swapId: 'sr4',
  type: 'user_no_show',
  description:
  'The other user did not show up at the agreed meetup location and time.',
  status: 'investigating',
  createdAt: '2023-11-01T16:00:00Z'
},
{
  id: 'comp2',
  userId: 'u3',
  swapId: 'sr6',
  type: 'damaged_item',
  description:
  'The item received had a large stain that was not mentioned in the description.',
  status: 'resolved',
  createdAt: '2023-10-29T18:00:00Z'
},
{
  id: 'comp3',
  userId: 'u2',
  swapId: 'sr1',
  type: 'delivery_not_received',
  description: 'Tracking shows delivered but I never received the package.',
  status: 'pending',
  createdAt: '2023-11-04T09:00:00Z'
},
{
  id: 'comp4',
  userId: 'u4',
  swapId: 'sr7',
  type: 'bad_behavior',
  description: 'The other user was rude and unprofessional in our messages.',
  status: 'pending',
  createdAt: '2023-11-04T15:30:00Z'
}];


export const exchangeMethods = [
{
  id: 'ex1',
  swapRequestId: 'sr2',
  method: 'meetup',
  details: {
    location: 'Central Park, near Bethesda Fountain',
    date: '2023-11-05',
    time: '14:00',
    contactNumber: '+1 234 567 8901',
    notes: "I'll be wearing a red jacket"
  },
  status: 'scheduled'
},
{
  id: 'ex2',
  swapRequestId: 'sr3',
  method: 'delivery',
  details: {
    address: '123 Fashion Ave, Apt 4B, Los Angeles, CA 90001',
    courierService: 'USPS',
    trackingNumber: 'US1234567890',
    deliveryStatus: 'delivered'
  },
  status: 'completed'
},
{
  id: 'ex3',
  swapRequestId: 'sr5',
  method: 'delivery',
  details: {
    address: '456 Market St, San Francisco, CA 94102',
    courierService: 'FedEx',
    trackingNumber: 'FX9876543210',
    deliveryStatus: 'in_transit'
  },
  status: 'in_progress'
},
{
  id: 'ex4',
  swapRequestId: 'sr8',
  method: 'collection_point',
  details: {
    collectionPointId: 'cp1',
    dropOffStatus: 'both_dropped',
    collectionStatus: 'both_collected'
  },
  status: 'completed'
}];


export const collectionPoints = [
{
  id: 'cp1',
  name: 'Downtown Collection Hub',
  address: '789 Main St, New York, NY 10001',
  hours: 'Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-5PM'
},
{
  id: 'cp2',
  name: 'Westside Swap Center',
  address: '321 Ocean Ave, Los Angeles, CA 90001',
  hours: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM'
},
{
  id: 'cp3',
  name: 'Mission District Hub',
  address: '555 Valencia St, San Francisco, CA 94110',
  hours: 'Tue-Sun: 10AM-6PM, Closed Mondays'
}];


export const favorites = ['c1', 'c3', 'c8', 'c11'];

export const adminStats = {
  totalUsers: 1245,
  totalClothes: 4582,
  pendingListings: 34,
  pendingSwaps: 156,
  completedSwaps: 892,
  complaints: 12,
  deliveryIssues: 5
};