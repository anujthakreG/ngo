import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  Utensils, 
  Heart, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole } from '../types';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('restaurant');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // If it's a new user via Google, we need to save their role
        // For Google login, we'll use the currently selected role in the UI
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          role: role,
          createdAt: new Date().toISOString(),
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError(err.message || "An error occurred during Google authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          role: role,
          createdAt: new Date().toISOString(),
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10"
      >
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-orange-50 rounded-2xl mb-6">
              {role === 'restaurant' ? (
                <Building2 className="h-8 w-8 text-orange-600" />
              ) : (
                <Heart className="h-8 w-8 text-orange-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Community'}
            </h1>
            <p className="text-gray-500">
              {isLogin ? 'Sign in to your account' : 'Register your organization to start'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex flex-col gap-2 text-sm border border-red-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
              {error.includes('operation-not-allowed') && (
                <div className="mt-2 p-3 bg-white/50 rounded-xl border border-red-200 text-red-800">
                  <p className="font-bold mb-1">To fix this:</p>
                  <p>You need to enable "Email/Password" in your Firebase Console.</p>
                  <a 
                    href="https://console.firebase.google.com/project/gen-lang-client-0792939957/authentication/providers" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block mt-2 font-bold underline"
                  >
                    Open Firebase Settings
                  </a>
                </div>
              )}
              {error.includes('unauthorized-domain') && (
                <div className="mt-2 p-3 bg-white/50 rounded-xl border border-red-200 text-red-800">
                  <p className="font-bold mb-1">Security Block: Domain not trusted</p>
                  <p className="mb-2">Firebase doesn't trust this website yet. Copy the domain below and add it to your Firebase Console:</p>
                  <code className="block p-2 bg-gray-900 text-green-400 rounded-lg mb-3 break-all select-all">
                    {window.location.hostname}
                  </code>
                  <a 
                    href="https://console.firebase.google.com/project/gen-lang-client-0792939957/authentication/settings" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block font-bold underline text-blue-600"
                  >
                    Go to Firebase Authorized Domains
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-white px-2 text-gray-400">Or with email</span>
              </div>
            </div>
          </div>

          {!isLogin && (
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
              <button
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                  role === 'restaurant' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setRole('restaurant')}
              >
                <Utensils className="h-4 w-4" />
                Restaurant
              </button>
              <button
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                  role === 'ngo' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setRole('ngo')}
              >
                <Heart className="h-4 w-4" />
                NGO / Charity
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={role === 'restaurant' ? "Restaurant Name" : "Organization Name"}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-12 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                {isLogin ? 'Sign up for free' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
