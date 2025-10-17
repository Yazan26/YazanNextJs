"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function useRequireAuth(redirectPath = "/login") {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, router, redirectPath]);

  return {
    isAuthenticated,
    isChecking: isLoading,
    canAccess: !isLoading && isAuthenticated,
  };
}
