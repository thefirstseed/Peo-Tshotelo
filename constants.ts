import { Product, Vendor, Review, Conversation, Message, NavigationLink } from './types';

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
    category: 'Jackets & Coats',
    department: 'men',
    brand: 'Unbranded',
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
    category: 'Dresses',
    department: 'women',
    brand: 'Unbranded',
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
    category: 'Shoes',
    department: 'men',
    brand: 'Zara',
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
    category: 'Bags',
    department: 'women',
    brand: 'Unbranded',
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
    category: 'T-Shirts & Vests',
    department: 'men',
    brand: 'Nike',
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
    department: 'women',
    brand: 'Unbranded',
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
        { id: 'm1', conversationId: 'conv1', senderId: 'u1', text: "Hey, would you consider P200 for this jacket?", timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
        { id: 'm2', conversationId: 'conv1', senderId: 'user1', text: "Hi Thabo, I can do P220. It's in really good condition.", timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
        { id: 'm3', conversationId: 'conv1', senderId: 'u1', text: "Okay, sounds good. I'll take it for P220.", timestamp: new Date(Date.now() - 5 * 60000).toISOString() }
    ],
    'conv2': [
        { id: 'm4', conversationId: 'conv2', senderId: 'u1', text: "Hi! Is this still available in a size M?", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
};

// --- NEW NAVIGATION & CATEGORY DATA ---

export const NAVIGATION_LINKS: NavigationLink[] = [
  {
    label: 'Women',
    href: '/category/women',
    megaMenu: [
      {
        title: 'Shop by Category',
        links: [
          { label: 'Dresses', href: '/category/women-dresses' },
          { label: 'Tops', href: '/category/women-tops' },
          { label: 'Pants & Jeans', href: '/category/women-pants' },
          { label: 'Skirts', href: '/category/women-skirts' },
          { label: 'Jackets & Coats', href: '/category/women-jackets' },
          { label: 'Shoes', href: '/category/women-shoes' },
          { label: 'Bags', href: '/category/women-bags' },
          { label: 'Accessories', href: '/category/women-accessories' },
        ],
      },
      {
        title: 'Shop Vintage',
        links: [
          { label: 'Vintage Dresses', href: '/category/women-vintage-dresses' },
          { label: 'Vintage Tops', href: '/category/women-vintage-tops' },
          { label: 'Vintage Denim', href: '/category/women-vintage-denim' },
          { label: 'Vintage Bags', href: '/category/women-vintage-bags' },
        ],
      },
      {
        title: 'Shop by Brand',
        links: [
            { label: 'Zara', href: '/category/women?brand=zara' },
            { label: 'H&M', href: '/category/women?brand=h&m' },
            { label: 'Forever 21', href: '/category/women?brand=forever 21' },
            { label: 'Unbranded', href: '/category/women?brand=unbranded' },
        ]
      },
      {
        title: 'Featured',
        links: [
          { label: 'New Arrivals', href: '/collections/women-new-in' },
          { label: 'Trending', href: '/collections/women-trending' },
          { label: 'Workwear', href: '/collections/women-workwear' },
          { label: 'Summer Edit', href: '/collections/women-summer' },
        ],
      },
    ],
  },
  {
    label: 'Men',
    href: '/category/men',
    megaMenu: [
      {
        title: 'Shop by Category',
        links: [
          { label: 'T-Shirts & Vests', href: '/category/men-tshirts' },
          { label: 'Shirts', href: '/category/men-shirts' },
          { label: 'Pants & Chinos', href: '/category/men-pants' },
          { label: 'Jeans', href: '/category/men-jeans' },
          { label: 'Jackets & Coats', href: '/category/men-jackets' },
          { label: 'Sneakers', href: '/category/men-sneakers' },
          { label: 'Shoes', href: '/category/men-shoes' },
          { label: 'Accessories', href: '/category/men-accessories' },
        ],
      },
      {
        title: 'Shop Vintage',
        links: [
          { label: 'Vintage T-Shirts', href: '/category/men-vintage-tshirts' },
          { label: 'Vintage Jackets', href: '/category/men-vintage-jackets' },
          { label: 'Vintage Jeans', href: '/category/men-vintage-jeans' },
        ],
      },
       {
        title: 'Shop by Brand',
        links: [
          { label: 'Nike', href: '/category/men?brand=nike' },
          { label: 'Adidas', href: '/category/men?brand=adidas' },
          { label: 'Levi\'s', href: '/category/men?brand=levi\'s' },
          { label: 'Unbranded', href: '/category/men?brand=unbranded' },
        ],
      },
    ],
  },
  {
    label: 'Kids',
    href: '/category/kids',
    megaMenu: [
        {
            title: 'Shop Girls',
            links: [
                { label: 'Dresses & Skirts', href: '/category/kids-girls-dresses' },
                { label: 'Tops & T-Shirts', href: '/category/kids-girls-tops' },
                { label: 'Pants & Leggings', href: '/category/kids-girls-pants' },
                { label: 'Shoes', href: '/category/kids-girls-shoes' },
            ]
        },
        {
            title: 'Shop Boys',
            links: [
                { label: 'T-Shirts & Polos', href: '/category/kids-boys-tops' },
                { label: 'Shorts & Pants', href: '/category/kids-boys-pants' },
                { label: 'Jackets', href: '/category/kids-boys-jackets' },
                { label: 'Sneakers', href: '/category/kids-boys-shoes' },
            ]
        },
        {
            title: 'Shop by Age',
            links: [
                { label: 'Baby (0-24m)', href: '/category/kids-baby' },
                { label: 'Toddler (2-4y)', href: '/category/kids-toddler' },
                { label: 'Kids (5-8y)', href: '/category/kids-5-8' },
                { label: 'Teens (9-14y)', href: '/category/kids-teens' },
            ]
        }
    ]
  },
];

// Flat list of product categories for use in forms, filtering, etc.
export const PRODUCT_CATEGORIES = [
  'Dresses', 'Tops', 'Pants & Jeans', 'Skirts', 'Jackets & Coats', 'Bags', 'Accessories',
  'T-Shirts & Vests', 'Shirts', 'Pants & Chinos', 'Jeans', 'Sneakers', 'Shoes',
  'Jewelry', 'Home', 'Crafts', 'Services',
];

// Simplified categories for homepage pills, for backward compatibility.
export const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Shoes', 'Services'];