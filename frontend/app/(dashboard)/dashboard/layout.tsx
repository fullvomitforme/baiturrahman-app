"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage or cookie
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token && !cookieToken) {
        // No token found, redirect to login
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  // If not authenticated, don't render (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
