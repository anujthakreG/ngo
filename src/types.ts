export type UserRole = 'restaurant' | 'ngo';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  address?: string;
  phone?: string;
  createdAt: string;
}

export type ListingStatus = 'available' | 'claimed' | 'completed';

export interface FoodListing {
  id: string;
  restaurantId: string;
  restaurantName: string;
  foodType: string;
  description: string;
  quantity: string;
  expiryTime: string;
  status: ListingStatus;
  claimedBy?: string;
  ngoName?: string;
  createdAt: string;
  updatedAt: string;
}
