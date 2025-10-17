"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

/**
 * Hook to protect admin routes. Redirects non-admin users to home page.
 */
export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return {
    isAdmin: isAuthenticated && user?.role === "admin",
    isLoading,
  };
}
