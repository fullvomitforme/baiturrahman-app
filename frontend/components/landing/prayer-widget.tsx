"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

// Mock prayer times - in production, fetch from API
const prayerTimes = [
  { name: "Subuh", time: "04:30" },
  { name: "Dzuhur", time: "12:15" },
  { name: "Ashar", time: "15:30" },
  { name: "Maghrib", time: "18:20" },
  { name: "Isya", time: "19:35" },
];

export function PrayerWidget() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Jadwal Sholat Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {prayerTimes.map((prayer) => {
            const isNext = prayer.time > currentTimeString;
            return (
              <div
                key={prayer.name}
                className={`text-center p-4 rounded-lg border ${
                  isNext ? "bg-primary/10 border-primary" : ""
                }`}
              >
                <p className="font-heading font-semibold text-lg">
                  {prayer.name}
                </p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {prayer.time}
                </p>
                {isNext && (
                  <Badge variant="secondary" className="mt-2">
                    Selanjutnya
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

