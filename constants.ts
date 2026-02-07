import { Product, Vendor, Review, Conversation, Message } from './types';

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Thrifty Gabs',
    location: 'Gaborone',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://picsum.photos/seed/vendor1/400/400',
    bannerUrl: 'https://picsum.photos/seed/vendor1-banner/1200/400',
    description: 'Authentic vintage clothing sourced locally. We specialize in 90s streetwear and unique finds.',
    joinedDate: '2023-01-15',
    verified: true,
    followerCount: 1250,
  },
  {
    id: 'v2',
    name: "Kagiso's Kloset",
    location: 'Gaborone',
    rating: 4.9,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/seed/vendor2/400/400',
    bannerUrl: 'https://picsum.photos/seed/vendor2-banner/1200/400',
    description: 'Curated secondhand and reworked clothing. If it doesn\'t fit, we can alter it.',
    joinedDate: '2023-03-10',
    verified: true,
    followerCount: 890,
  },
  {
    id: 'v3',
    name: 'Boho Finds BW',
    location: 'Maun (Ships country-wide)',
    rating: 4.5,
    reviewCount: 45,
    imageUrl: 'https://picsum.photos/seed/vendor3/400/400',
    bannerUrl: 'https://picsum.photos/seed/vendor3-banner/1200/400',
    description: 'Handcrafted accessories and bohemian-style clothing from the heart of the Delta.',
    joinedDate: '2023-06-22',
    verified: false,
    followerCount: 430,
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Vintage Denim Jacket - Blue',
    price: 250,
    vendorId: 'v1',
    vendorName: 'Thrifty Gabs',
    description: 'Classic oversized denim jacket. Perfect for all seasons. Size L but fits like XL.',
    imageUrls: [
      'https://picsum.photos/seed/p1/600/600',
      'https://picsum.photos/seed/p1-2/600/600',
      'https://picsum.photos/seed/p1-3/600/600'
    ],
    category: 'Clothing',
    sizes: ['L', 'XL'],
    condition: 'Good',
    stock: 5,
    likeCount: 112,
  },
  {
    id: 'p2',
    title: 'Reworked Floral Dress',
    price: 450,
    vendorId: 'v2',
    vendorName: "Kagiso's Kloset",
    description: 'Beautifully tailored dress from a vintage pattern. Perfect for weddings or special events.',
    imageUrls: ['https://picsum.photos/seed/p2/600/600'],
    category: 'Clothing',
    sizes: ['M', 'L'],
    condition: 'Like New',
    stock: 3,
    likeCount: 230,
  },
  {
    id: 'p3',
    title: 'Leather Sandals',
    price: 180,
    vendorId: 'v3',
    vendorName: 'Boho Finds BW',
    description: 'Genuine leather sandals, durable and comfortable for the hot sun.',
    imageUrls: ['https://picsum.photos/seed/p3/600/600'],
    category: 'Accessories',
    sizes: ['42', '43', '44'],
    condition: 'New',
    stock: 0,
    likeCount: 78,
  },
  {
    id: 'p4',
    title: 'Woven Tote Bag',
    price: 300,
    vendorId: 'v3',
    vendorName: 'Boho Finds BW',
    description: 'Intricate design, takes 3 weeks to make. Great for daily use.',
    imageUrls: [
        'https://picsum.photos/seed/p4/600/600',
        'https://picsum.photos/seed/p4-2/600/600'
    ],
    category: 'Accessories',
    condition: 'New',
    stock: 10,
    likeCount: 156,
  },
  {
    id: 'p5',
    title: 'Graphic Tee - Gabs City',
    price: 120,
    vendorId: 'v1',
    vendorName: 'Thrifty Gabs',
    description: 'Local street culture t-shirt. 100% Cotton.',
    imageUrls: ['https://picsum.photos/seed/p5/600/600'],
    category: 'Clothing',
    sizes: ['S', 'M', 'L'],
    condition: 'New',
    stock: 0,
    likeCount: 45,
  },
  {
    id: 'p6',
    title: 'Alteration Service Deposit',
    price: 50,
    vendorId: 'v2',
    vendorName: "Kagiso's Kloset",
    description: 'Book a slot for resizing your clothes. Final price depends on complexity.',
    imageUrls: ['https://picsum.photos/seed/p6/600/600'],
    category: 'Services',
    condition: 'New',
    stock: 99,
    likeCount: 12,
  }
];

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'r1',
        productId: 'p1',
        userId: 'u1',
        userName: 'Thabo Moeng',
        rating: 5,
        comment: "Absolutely love this jacket! It's exactly as described and has become a staple in my wardrobe. Fast delivery too.",
        date: '2024-05-20T10:00:00Z',
    },
    {
        id: 'r2',
        productId: 'p1',
        userId: 'u-test',
        userName: 'Pula Buyer',
        rating: 4,
        comment: "Great quality, but it was a bit more oversized than I expected. Still, a very cool piece.",
        date: '2024-05-18T14:30:00Z',
    },
    {
        id: 'r3',
        productId: 'p2',
        userId: 'u-another',
        userName: 'Sarah P.',
        rating: 5,
        comment: "Wore this to a wedding and got so many compliments. The craftsmanship is amazing!",
        date: '2024-05-15T09:00:00Z',
    }
];


// --- MOCK DATA for MESSAGING ---
export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv1',
        participantIds: ['u1', 'user1'], // Seller is identified by their userId 'user1' now
        participants: {
            'u1': { name: 'Thabo Moeng', avatar: 'https://i.pravatar.cc/150?u=u1' },
            'user1': { name: 'Thrifty Gabs', avatar: 'https://picsum.photos/seed/vendor1/100/100' }
        },
        productId: 'p1',
        productTitle: 'Vintage Denim Jacket - Blue',
        productImage: 'https://picsum.photos/seed/p1/200/200',
        lastMessage: {
            text: "Okay, sounds good. I'll take it for P220.",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            senderId: 'u1'
        },
        unread: false,
    },
    {
        id: 'conv2',
        participantIds: ['u1', 'u2'], // Seller is identified by their userId 'u2'
         participants: {
            'u1': { name: 'Thabo Moeng', avatar: 'https://i.pravatar.cc/150?u=u1' },
            'u2': { name: "Kagiso's Kloset", avatar: 'https://picsum.photos/seed/vendor2/100/100' }
        },
        productId: 'p2',
        productTitle: 'Reworked Floral Dress',
        productImage: 'https://picsum.photos/seed/p2/200/200',
        lastMessage: {
            text: "Hi! Is this still available in a size M?",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            senderId: 'u1'
        },
        unread: true,
    }
];

export const MOCK_MESSAGES: { [conversationId: string]: Message[] } = {
    'conv1': [
        { id: 'm1', conversationId: 'conv1', senderId: 'u1', text: "Hey, would you consider P200 for this jacket?", timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
        { id: 'm2', conversationId: 'conv1', senderId: 'user1', text: "Hi there! Thanks for the offer. The lowest I can go is P220.", timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
        { id: 'm3', conversationId: 'conv1', senderId: 'u1', text: "Okay, sounds good. I'll take it for P220.", timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
        { id: 'm4', conversationId: 'conv1', senderId: 'user1', text: "Great! I've accepted your offer. You can now proceed to checkout from this chat.", timestamp: new Date(Date.now() - 4 * 60000).toISOString(), offer: { amount: 220, status: 'accepted' } }
    ],
    'conv2': [
         { id: 'm5', conversationId: 'conv2', senderId: 'u1', text: "Hi! Is this still available in a size M?", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
};


export const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Home', 'Services'];