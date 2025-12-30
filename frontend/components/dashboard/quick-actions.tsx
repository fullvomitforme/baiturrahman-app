"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const actions = [
  {
    label: "Buat Pengumuman",
    icon: Megaphone,
    href: "/dashboard/pengumuman?action=create",
    color: "bg-primary hover:bg-primary/90",
  },
  {
    label: "Tambah Kegiatan",
    icon: Calendar,
    href: "/dashboard/kegiatan?action=create",
    color: "bg-secondary hover:bg-secondary/90",
  },
  {
    label: "Konfirmasi Donasi",
    icon: DollarSign,
    href: "/dashboard/donasi?filter=pending",
    color: "bg-accent hover:bg-accent/90",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={action.href}>
                  <Button
                    className={`w-full ${action.color} text-white h-12 gap-2`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

