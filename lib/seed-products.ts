export interface DemoProduct {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  sku: string;
  isDemoData?: boolean;
  enable_checkout: boolean;
  enable_search: boolean;
}

export const SEED_PRODUCTS: DemoProduct[] = [
  {
    id: 'seed-001',
    sku: 'JL-TOWEL-001',
    name: 'John Lewis Luxury Egyptian Cotton Bath Towel',
    price: '$24.99',
    imageUrl: 'https://placehold.co/400x400/1e293b/94a3b8?text=Bath+Towel',
    description: 'Supremely soft and absorbent bath towel crafted from 100% Egyptian cotton.',
    isDemoData: true,
    enable_checkout: true,
    enable_search: true,
  },
  {
    id: 'seed-002',
    sku: 'JL-KETTLE-002',
    name: 'John Lewis ANYDAY Jug Kettle, 1.7L',
    price: '$39.99',
    imageUrl: 'https://placehold.co/400x400/1e293b/94a3b8?text=Jug+Kettle',
    description: 'Stylish and efficient 1.7-litre jug kettle with rapid boil and quiet operation.',
    isDemoData: true,
    enable_checkout: true,
    enable_search: false,
  },
  {
    id: 'seed-003',
    sku: 'JL-CUSHION-003',
    name: 'John Lewis Velvet Cushion, 50x50cm, Teal',
    price: '$18.00',
    imageUrl: 'https://placehold.co/400x400/1e293b/94a3b8?text=Velvet+Cushion',
    description: 'Luxurious velvet cushion with feather pad filling in a rich teal colourway.',
    isDemoData: true,
    enable_checkout: false,
    enable_search: true,
  },
  {
    id: 'seed-004',
    sku: 'JL-LAMP-004',
    name: 'John Lewis ANYAS Table Lamp, Brushed Brass',
    price: '$65.00',
    imageUrl: 'https://placehold.co/400x400/1e293b/94a3b8?text=Table+Lamp',
    description: 'Contemporary table lamp with a brushed brass finish and white fabric shade.',
    isDemoData: true,
    enable_checkout: true,
    enable_search: true,
  },
  {
    id: 'seed-005',
    sku: 'JL-DUVET-005',
    name: 'John Lewis Natural Duck Feather & Down Duvet, 10.5 Tog',
    price: '$89.99',
    imageUrl: 'https://placehold.co/400x400/1e293b/94a3b8?text=Duvet',
    description: 'A classic all-season duvet filled with natural duck feather and down for warmth and comfort.',
    isDemoData: true,
    enable_checkout: false,
    enable_search: false,
  },
];
