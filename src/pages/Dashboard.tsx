import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { createListing, claimListing, subscribeToListings, updateListingStatus } from '../lib/services';
import { FoodListing } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    expiryTime: '',
    description: ''
  });

  useEffect(() => {
    const unsubscribe = subscribeToListings((newListings) => {
      setListings(newListings);
    });
    return () => unsubscribe();
  }, []);

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createListing({
        restaurantId: user.uid,
        restaurantName: user.displayName,
        foodType: formData.foodType,
        quantity: formData.quantity,
        expiryTime: new Date(formData.expiryTime).toISOString(),
        description: formData.description,
        status: 'available'
      });
      setIsAddingFood(false);
      setFormData({ foodType: '', quantity: '', expiryTime: '', description: '' });
    } catch (err) {
      console.error("Error creating listing:", err);
    }
  };

  const handleClaim = async (listingId: string) => {
    if (!user || user.role !== 'ngo') return;
    try {
      await claimListing(listingId, user.uid, user.displayName);
    } catch (err) {
      console.error("Error claiming listing:", err);
    }
  };

  const filteredListings = listings.filter(l => 
    l.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedListings = user?.role === 'restaurant' 
    ? listings.filter(l => l.restaurantId === user.uid)
    : filteredListings.filter(l => l.status === 'available' || l.claimedBy === user?.uid);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Hello, {user?.displayName}!
          </h1>
          <p className="text-gray-500">
            {user?.role === 'restaurant' 
              ? "See your active listings and donate fresh surplus food." 
              : "Find and claim available food in your area."}
          </p>
        </div>
        
        {user?.role === 'restaurant' && (
          <button 
            onClick={() => setIsAddingFood(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Surplus Food
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Your Impact
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500 font-medium">Listings</span>
                <span className="text-lg font-bold text-gray-900">
                  {user?.role === 'restaurant' 
                    ? listings.filter(l => l.restaurantId === user.uid).length
                    : listings.filter(l => l.claimedBy === user?.uid).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500 font-medium">Status</span>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <h3 className="font-bold text-white mb-2 relative z-10">Pro Tip</h3>
            <p className="text-gray-400 text-sm relative z-10 leading-relaxed">
              Adding a clear description and accurate expiry time helps NGOs plan their pickups more efficiently.
            </p>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search food type or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all border-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedListings.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">No listings found</h3>
              </div>
            ) : displayedListings.map((listing) => (
              <motion.div 
                layout
                key={listing.id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-6 group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight text-sm">
                        {listing.foodType}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{listing.restaurantName}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    listing.status === 'available' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                  )}>
                    {listing.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {listing.description}
                </p>

                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span>Best before: {new Date(listing.expiryTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <span>Quantity: {listing.quantity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {user?.role === 'ngo' && listing.status === 'available' ? (
                    <button 
                      onClick={() => handleClaim(listing.id)}
                      className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
                    >
                      Claim Food <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {listing.status === 'claimed' ? `Claimed by ${listing.ngoName}` : 'Available'}
                      </span>
                      {user?.role === 'restaurant' && listing.status === 'claimed' && (
                         <button 
                          onClick={() => updateListingStatus(listing.id, 'completed')}
                          className="text-green-600 text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                          Complete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setIsAddingFood(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">List Food</h2>
                <button onClick={() => setIsAddingFood(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleAddFood} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Food Type / Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.foodType}
                    onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none" 
                    placeholder="e.g. Fresh Salad Boxes" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                    <input 
                      type="text" 
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none" 
                      placeholder="e.g. 15 packs" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Time</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={formData.expiryTime}
                      onChange={(e) => setFormData({...formData, expiryTime: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea 
                    rows={3} 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none resize-none" 
                    placeholder="What's included? Any allergens?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg active:scale-[0.98]"
                >
                  Post Listing
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
