"use client";
import { useState, useEffect } from 'react';
import { FaUser, FaHome, FaCalendarAlt, FaCommentAlt } from 'react-icons/fa';
import Link from 'next/link';
import { auth, googleProvider } from '../../../lib/firebase';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-blue-400 h-8 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
        
          
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{user.email}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 transform transition-all duration-200">
                    <Link 
                      href="/profile" 
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <FaUser className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm"
              >
                <FaUser className="h-4 w-4" />
                <span className="font-medium">Login with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 