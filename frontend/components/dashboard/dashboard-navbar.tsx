"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    content: "Konten",
    struktur: "Struktur",
    jadwal: "Jadwal Sholat",
    kegiatan: "Kegiatan",
    pengumuman: "Pengumuman",
    donasi: "Donasi",
    metode: "Metode Pembayaran",
    pengaturan: "Pengaturan",
    pengguna: "Pengguna",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {segments.map((segment, index) => (
        <span key={segment} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <span
            className={
              index === segments.length - 1
                ? "text-foreground font-medium"
                : ""
            }
          >
            {labels[segment] || segment}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function DashboardNavbar() {
  const { theme, setTheme } = useTheme();
  const [notifications] = useState(3); // Mock notification count

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data?.data || response.data;
    },
    retry: false,
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>

        {/* Breadcrumbs - Hidden on mobile */}
        <div className="hidden md:block">
          <Breadcrumbs />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari..."
                className="w-64 pl-10 h-9"
              />
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                Tidak ada notifikasi baru
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
