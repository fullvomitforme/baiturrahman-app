"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Megaphone,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/content", label: "Konten", icon: FileText },
  { href: "/dashboard/struktur", label: "Struktur", icon: Users },
  { href: "/dashboard/jadwal", label: "Jadwal Sholat", icon: Calendar },
  { href: "/dashboard/kegiatan", label: "Kegiatan", icon: Megaphone },
  { href: "/dashboard/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/dashboard/donasi", label: "Donasi", icon: DollarSign },
  { href: "/dashboard/donasi/metode", label: "Metode Pembayaran", icon: CreditCard },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/dashboard/pengguna", label: "Pengguna", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data?.data || response.data;
    },
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-card transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-heading text-lg font-bold text-primary">
                  Masjid Admin
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center w-full"
              >
                <Building2 className="h-6 w-6 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 min-h-[48px]",
                      isActive && "bg-primary/10 text-primary border-l-4 border-primary"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Button>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t space-y-4">
          {!isCollapsed && user && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.role}
                </p>
              </div>
            </div>
          )}
          {isCollapsed && user && (
            <div className="flex justify-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[48px]"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Keluar</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
