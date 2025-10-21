'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '@/store/slices/authSlice';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  console.log({user, token, isLoading})

  useEffect(() => {
    const initAuth = async () => {
      // No token = not logged in
      if (!token) {
        setLoading(false);
        router.push('/login');
        return;
      }

      // Have token but no user = need to fetch user
      if (token && !user) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.log('Auth error:', error);
          router.push('/login');
          return;
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [token, user, dispatch, router]); // Include dependencies

  // Show loading while fetching user data
  if (loading || isLoading || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If we have both token and user, render the protected content
  if (token && user) {
    return <>{children}</>;
  }

  // If no token, redirect to login (this should be handled by the first useEffect)
  return null;
}