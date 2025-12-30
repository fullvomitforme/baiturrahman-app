"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Megaphone,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/content", label: "Konten", icon: FileText },
  { href: "/dashboard/struktur", label: "Struktur", icon: Users },
  { href: "/dashboard/donasi", label: "Donasi", icon: DollarSign },
  { href: "/dashboard/jadwal", label: "Jadwal", icon: Calendar },
  { href: "/dashboard/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card min-h-screen p-4">
      <div className="space-y-4">
        <div className="mb-8">
          <h2 className="font-heading text-xl font-bold text-primary">
            Masjid Baiturrahim
          </h2>
          <p className="text-sm text-muted-foreground">Dashboard</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </div>
    </aside>
  );
}

