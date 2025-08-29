"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // get current page to redirect back after login
      const callbackUrl = window.location.pathname;
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>; // or a spinner
  }

  if (!session) return null; // prevents flashing protected content

  return children;
}
