"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  Megaphone,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { DonationChart } from "@/components/dashboard/donation-chart";
import { RecentDonationsTable } from "@/components/dashboard/recent-donations-table";

export default function DashboardPage() {
  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data?.data || response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const [donationsRes, eventsRes, announcementsRes] = await Promise.all([
        api.get("/admin/donations/stats"),
        api.get("/admin/events?status=upcoming&limit=5"),
        api.get("/admin/announcements?active=true&limit=5"),
      ]);
      return {
        donations: donationsRes.data?.data || donationsRes.data,
        events: eventsRes.data?.data || eventsRes.data,
        announcements: announcementsRes.data?.data || announcementsRes.data,
      };
    },
  });

  const { data: recentDonations } = useQuery({
    queryKey: ["dashboard", "recent-donations"],
    queryFn: async () => {
      const response = await api.get("/admin/donations?limit=10");
      return response.data?.data || response.data;
    },
  });

  const greeting = user?.full_name
    ? `Assalamu'alaikum, ${user.full_name}`
    : "Assalamu'alaikum";

  const totalDonation = stats?.donations?.total_amount || 0;
  const upcomingEvents = stats?.events?.length || 0;
  const activeAnnouncements = stats?.announcements?.length || 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 pattern-islamic"
      >
        <div className="relative z-10">
          <h1 className="font-heading text-2xl md:text-4xl font-bold mb-2">
            {greeting}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Selamat datang di dashboard Masjid Baiturrahim
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Donasi (Bulan Ini)"
          value={`Rp ${totalDonation.toLocaleString("id-ID")}`}
          icon={DollarSign}
          trend={{ value: "+12%", isPositive: true }}
          description="Dari bulan lalu"
        />
        <StatsCard
          title="Kegiatan Mendatang"
          value={upcomingEvents.toString()}
          icon={Calendar}
          description="Event yang akan datang"
        />
        <StatsCard
          title="Pengumuman Aktif"
          value={activeAnnouncements.toString()}
          icon={Megaphone}
          description="Pengumuman yang aktif"
        />
        <StatsCard
          title="Jamaah Terdaftar"
          value="1,234"
          icon={Users}
          trend={{ value: "+5%", isPositive: true }}
          description="Total jamaah"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Trend Donasi</CardTitle>
          </CardHeader>
          <CardContent>
            <DonationChart />
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading">Donasi Terbaru</CardTitle>
            <Link href="/dashboard/donasi">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RecentDonationsTable donations={recentDonations || []} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/dashboard/pengumuman">
              <Button className="w-full justify-start gap-2 h-auto py-4" variant="outline">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Buat Pengumuman</div>
                  <div className="text-xs text-muted-foreground">
                    Tambah pengumuman baru
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/kegiatan">
              <Button className="w-full justify-start gap-2 h-auto py-4" variant="outline">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Tambah Kegiatan</div>
                  <div className="text-xs text-muted-foreground">
                    Buat event baru
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/donasi">
              <Button className="w-full justify-start gap-2 h-auto py-4" variant="outline">
                <DollarSign className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Konfirmasi Donasi</div>
                  <div className="text-xs text-muted-foreground">
                    Review donasi pending
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      {stats?.events && stats.events.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading">Kegiatan Mendatang</CardTitle>
            <Link href="/dashboard/kegiatan">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.events.slice(0, 5).map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(event.event_date),
                        "EEEE, d MMMM yyyy",
                        { locale: idLocale }
                      )}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/kegiatan/${event.id}`}>
                      Lihat
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
