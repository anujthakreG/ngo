import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderedBy, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  getDoc,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';
import { FoodListing, ListingStatus } from '../types';

const LISTINGS_COLLECTION = 'listings';

export const createListing = async (listingData: Omit<FoodListing, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
      ...listingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'available'
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', LISTINGS_COLLECTION);
  }
};

export const claimListing = async (listingId: string, ngoId: string, ngoName: string) => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(docRef, {
      status: 'claimed',
      claimedBy: ngoId,
      ngoName: ngoName,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'update', `${LISTINGS_COLLECTION}/${listingId}`);
  }
};

export const updateListingStatus = async (listingId: string, status: ListingStatus) => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'update', `${LISTINGS_COLLECTION}/${listingId}`);
  }
};

export function subscribeToListings(callback: (listings: FoodListing[]) => void) {
  const q = query(collection(db, LISTINGS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FoodListing));
    callback(listings);
  }, (error) => {
    console.error("Listings subscription error:", error);
  });
}
