export type ItemType = 'LOST' | 'FOUND';

export type ItemCategory = 
  | 'Electronics & Phones'
  | 'Wallets & Bags'
  | 'Official Documents'
  | 'Keys'
  | 'Pets & Animals'
  | 'Jewelry & Watches'
  | 'Luggage & Backpacks'
  | 'Other Items';

export interface LostFoundItem {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory | string;
  city: string;
  exactLocation?: string;
  date: string;
  description: string;
  image?: string;
  hasImage?: boolean;
  status: 'active' | 'reunited' | 'claimed';
  contactName?: string;
  contactPhone?: string;
  reward?: string;
  createdAt: string;
  viewsCount?: number;
  potentialMatchesCount?: number;
}
