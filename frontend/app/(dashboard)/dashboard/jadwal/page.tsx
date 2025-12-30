"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Download, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { GeneratePrayerTimesDialog } from "@/components/dashboard/generate-prayer-times-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function JadwalPage() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarMonth, setCalendarMonth] = useState<Date>(today);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Memoize date string to ensure stable query key
  const dateString = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );

  const { data: prayerTimes, isLoading } = useQuery({
    queryKey: ["prayer-times", dateString],
    queryFn: async () => {
      const response = await api.get(`/prayer-times?date=${dateString}`);
      return response.data?.data || response.data;
    },
    enabled: !!selectedDate,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Jadwal Sholat</h1>
          <p className="text-muted-foreground mt-1">
            Kelola jadwal sholat harian
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Bulanan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Pilih Tanggal</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              onSelect={(date) => {
                if (date) {
                  // Normalize date to start of day to avoid timezone issues
                  const normalizedDate = new Date(date);
                  normalizedDate.setHours(0, 0, 0, 0);
                  setSelectedDate(normalizedDate);
                  // Update calendar month to show the selected date's month
                  setCalendarMonth(normalizedDate);
                }
              }}
              className="rounded-md border"
              initialFocus
            />
          </CardContent>
        </Card>

        {/* Prayer Times Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">
                Jadwal Sholat - {format(selectedDate, "EEEE, d MMMM yyyy", {
                  locale: idLocale,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prayerTimes ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waktu Sholat</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Adzan</TableHead>
                      <TableHead>Iqamah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Subuh", key: "fajr" },
                      { name: "Dzuhur", key: "dhuhr" },
                      { name: "Ashar", key: "asr" },
                      { name: "Maghrib", key: "maghrib" },
                      { name: "Isya", key: "isha" },
                    ].map((prayer) => (
                      <TableRow key={prayer.key}>
                        <TableCell className="font-medium">
                          {prayer.name}
                        </TableCell>
                        <TableCell>
                          {prayerTimes[prayer.key]?.adhan_time || "-"}
                        </TableCell>
                        <TableCell>
                          {prayerTimes[prayer.key]?.adhan_time || "-"}
                        </TableCell>
                        <TableCell>
                          {prayerTimes[prayer.key]?.iqamah_time || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada jadwal untuk tanggal ini
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <GeneratePrayerTimesDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      />
    </div>
  );
}
