"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { getCurrentUser } from "@/store/slices/authSlice";
import { Loader2 } from "lucide-react";
import { is } from "zod/v4/locales";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, token } = useSelector(
    (state) => state.auth
  );

  // If not authenticated, redirect to login
  useEffect(() => {
    //if no token found in local storage, redirect to login
    if (!token) {
      router.push("/login");
      return;
    }
    //if token exists but user data not loaded, fetch user data
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, router, dispatch, token]);

  // While checking auth status, you can show a loading indicator
  if (isLoading || (!isAuthenticated && token)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>children</>;
  }
  return null;
};

export default ProtectedRoute;
