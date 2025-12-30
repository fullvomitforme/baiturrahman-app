"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const categoryColors = {
  kajian: "bg-primary text-primary-foreground",
  sosial: "bg-accent text-accent-foreground",
  pendidikan: "bg-secondary text-secondary-foreground",
  other: "bg-muted text-muted-foreground",
};

export function UpcomingEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => {
      const response = await api.get("/events?status=upcoming&limit=6");
      // Handle both response formats: { data: [...] } or [...]
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
  });

  if (isLoading) {
    return (
      <section className="container-islamic section-spacing">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 h-64 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!events || !Array.isArray(events) || events.length === 0) {
    return (
      <section className="container-islamic section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Kegiatan Mendatang
          </h2>
          <p className="text-muted-foreground">
            Tidak ada kegiatan yang dijadwalkan saat ini.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="container-islamic section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Kegiatan Mendatang
          </h2>
          <Link href="/kegiatan">
            <Button variant="ghost" className="hidden md:flex">
              Lihat Semua
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {events.map((event: any, index: number) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 snap-start"
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  {event.image_url ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-primary/20 to-transparent" />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-heading text-lg line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <Badge
                      className={`${
                        categoryColors[event.category as keyof typeof categoryColors] ||
                        categoryColors.other
                      } flex-shrink-0`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(
                        new Date(event.event_date),
                        "EEEE, d MMMM yyyy",
                        { locale: idLocale }
                      )}
                    </span>
                  </div>
                  {event.event_time && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.event_time), "HH:mm")} WIB
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden text-center">
          <Link href="/kegiatan">
            <Button variant="outline" className="w-full">
              Lihat Semua Kegiatan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

