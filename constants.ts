import { Product, Vendor } from './types';

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Thrifty Gabs',
    location: 'Gaborone',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://picsum.photos/seed/vendor1/800/400',
    description: 'Authentic vintage clothing sourced locally. We specialize in 90s streetwear and unique finds.',
    joinedDate: '2023-01-15',
    verified: true
  },
  {
    id: 'v2',
    name: "Kagiso's Kloset",
    location: 'Gaborone',
    rating: 4.9,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/seed/vendor2/800/400',
    description: 'Curated secondhand and reworked clothing. If it doesn\'t fit, we can alter it.',
    joinedDate: '2023-03-10',
    verified: true
  },
  {
    id: 'v3',
    name: 'Boho Finds BW',
    location: 'Maun (Ships country-wide)',
    rating: 4.5,
    reviewCount: 45,
    imageUrl: 'https://picsum.photos/seed/vendor3/800/400',
    description: 'Handcrafted accessories and bohemian-style clothing from the heart of the Delta.',
    joinedDate: '2023-06-22',
    verified: false
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
    condition: 'Good'
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
    condition: 'Like New'
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
    condition: 'New'
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
    condition: 'New'
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
    condition: 'New'
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
    condition: 'New'
  }
];

export const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Home', 'Services'];