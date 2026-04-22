import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Utensils, Heart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: any; // Will type properly once AuthContext is ready
  onLogout: () => void;
}

function Navbar({ user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Donate Food', href: '/donate', roles: ['restaurant'] },
    { name: 'Claim Food', href: '/claim', roles: ['ngo'] },
    { name: 'Dashboard', href: '/dashboard', roles: ['restaurant', 'ngo'] },
    { name: 'Contact', href: '/contact' },
  ];

  const filteredLinks = navLinks.filter(link => 
    !link.roles || (user && link.roles.includes(user.role))
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-bottom border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
              <Utensils className="h-6 w-6 text-orange-600" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
              FoodShare<span className="text-orange-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-600",
                  location.pathname === link.href ? "text-orange-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-bottom border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.href 
                      ? "bg-orange-50 text-orange-600" 
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-orange-600 text-white text-center shadow-sm"
                >
                  Sign In
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  Log out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Utensils className="h-6 w-6 text-orange-600" />
              <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
                FoodShare<span className="text-orange-600">Connect</span>
              </span>
            </Link>
            <p className="text-gray-600 max-w-sm leading-relaxed">
              Our mission is to reduce food waste and combat hunger by connecting restaurants with surplus food to NGOs dedicated to feeding those in need.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">Home</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-orange-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-orange-600 transition-colors">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-600 hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-orange-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 FoodShare Connect. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children, user, onLogout }: { children: ReactNode, user: any, onLogout: () => void }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
