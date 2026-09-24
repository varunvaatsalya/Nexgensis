"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { Header } from "@/components/header";
import { LocalProductsProvider } from "@/store/local-products";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-muted-foreground gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Verifying admin credentials...</p>
      </div>
    );
  }

  return (
    <LocalProductsProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </LocalProductsProvider>
  );
}
