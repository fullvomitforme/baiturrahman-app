"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function UpcomingEventsList({ events }: { events: any[] }) {
  return (
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
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada kegiatan mendatang
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/kegiatan?id=${event.id}`}
                className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-heading font-semibold line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(
                            new Date(event.event_date),
                            "dd MMM yyyy",
                            { locale: idLocale }
                          )}
                        </span>
                      </div>
                      {event.event_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(event.event_time), "HH:mm")} WIB
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

