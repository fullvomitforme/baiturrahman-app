"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function JadwalPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: prayerTimes, isLoading } = useQuery({
    queryKey: ["prayer-times", selectedDate],
    queryFn: async () => {
      const response = await api.get(
        `/prayer-times?date=${format(selectedDate, "yyyy-MM-dd")}`
      );
      const data = response.data?.data || response.data;
      return data;
    },
  });

  const prayers = [
    { name: "Subuh", key: "fajr" },
    { name: "Dzuhur", key: "dhuhr" },
    { name: "Ashar", key: "asr" },
    { name: "Maghrib", key: "maghrib" },
    { name: "Isya", key: "isha" },
  ];

  return (
    <div className="container-islamic section-spacing">
      <div className="mx-auto max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="font-heading text-4xl md:text-5xl">Jadwal Sholat</h1>
          <p className="text-lg text-muted-foreground">
            Jadwal sholat harian Masjid Baiturrahim
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Pilih Tanggal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "EEEE, d MMMM yyyy", {
                        locale: idLocale,
                      })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start" side="bottom" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Prayer Times */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Waktu Sholat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : prayerTimes ? (
                <div className="space-y-3">
                  {prayers.map((prayer) => {
                    const time = prayerTimes[prayer.key] || "--:--";
                    return (
                      <div
                        key={prayer.key}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                      >
                        <span className="font-heading font-semibold text-lg">
                          {prayer.name}
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {time}
                        </span>
                      </div>
                    );
                  })}
                  {prayerTimes?.location && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Lokasi: {prayerTimes.location}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Jadwal sholat tidak tersedia untuk tanggal ini
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

