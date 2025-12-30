"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrayerTime {
  name: string;
  time: string;
  datetime: Date;
}

function getNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = new Date();
  return prayers.find((p) => p.datetime > now) || null;
}

// Helper to parse time string (HH:mm) to Date object for today
function parseTimeString(timeStr: string | null | undefined, date: Date): Date | null {
  if (!timeStr || timeStr === "--:--") return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function PrayerTimesWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");
  const { data: prayerData, isLoading } = useQuery({
    queryKey: ["prayer-times", today],
    queryFn: async () => {
      const response = await api.get(`/prayer-times?date=${today}`);
      return response.data?.data || response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="container-islamic px-4 py-6">
        <Card className="bg-card/80 backdrop-blur-sm border-2">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayDate = new Date();
  const prayers: PrayerTime[] = prayerData
    ? [
        {
          name: "Subuh",
          time: prayerData.fajr || "--:--",
          datetime: parseTimeString(prayerData.fajr, todayDate) || new Date(todayDate.setHours(4, 30)),
        },
        {
          name: "Dzuhur",
          time: prayerData.dhuhr || "--:--",
          datetime: parseTimeString(prayerData.dhuhr, todayDate) || new Date(todayDate.setHours(12, 15)),
        },
        {
          name: "Ashar",
          time: prayerData.asr || "--:--",
          datetime: parseTimeString(prayerData.asr, todayDate) || new Date(todayDate.setHours(15, 30)),
        },
        {
          name: "Maghrib",
          time: prayerData.maghrib || "--:--",
          datetime: parseTimeString(prayerData.maghrib, todayDate) || new Date(todayDate.setHours(18, 20)),
        },
        {
          name: "Isya",
          time: prayerData.isha || "--:--",
          datetime: parseTimeString(prayerData.isha, todayDate) || new Date(todayDate.setHours(19, 35)),
        },
      ]
    : [];

  const nextPrayer = getNextPrayer(prayers);
  const minutesUntilNext = nextPrayer
    ? differenceInMinutes(nextPrayer.datetime, currentTime)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "container-islamic px-4 py-6 transition-all duration-300",
        isSticky && "sticky top-4 z-50"
      )}
    >
      <Card className="bg-card/95 backdrop-blur-md border-2 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-xl md:text-2xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Jadwal Sholat Hari Ini
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {prayerData?.location || "Jakarta"}
            </Badge>
          </div>
          {nextPrayer && minutesUntilNext !== null && minutesUntilNext > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Sholat {nextPrayer.name} dalam{" "}
              <span className="font-bold text-primary">
                {minutesUntilNext} menit
              </span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {prayers.map((prayer, index) => {
              const isNext =
                nextPrayer?.name === prayer.name &&
                minutesUntilNext !== null &&
                minutesUntilNext > 0;
              const isPast = prayer.datetime < currentTime;

              return (
                <motion.div
                  key={prayer.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "text-center p-4 rounded-lg border-2 transition-all",
                    isNext
                      ? "bg-primary/10 border-primary shadow-md scale-105"
                      : isPast
                      ? "bg-muted/50 border-muted opacity-60"
                      : "bg-background border-border hover:border-primary/50"
                  )}
                >
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {prayer.name}
                  </p>
                  <p
                    className={cn(
                      "text-2xl md:text-3xl font-bold",
                      isNext ? "text-primary" : "text-foreground"
                    )}
                  >
                    {prayer.time}
                  </p>
                  {isNext && (
                    <Badge
                      variant="default"
                      className="mt-2 text-xs bg-primary"
                    >
                      Selanjutnya
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
