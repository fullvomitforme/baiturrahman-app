"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ActivitiesBannerCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", "banner"],
    queryFn: async () => {
      const response = await api.get("/events?status=upcoming&limit=5");
      // Handle both response formats: { data: [...] } or [...]
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api || !events || events.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api, events]);

  if (isLoading) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] bg-muted animate-pulse">
        <div className="container-islamic h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-8 w-64 bg-muted-foreground/20 rounded mx-auto" />
            <div className="h-4 w-96 bg-muted-foreground/20 rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!events || !Array.isArray(events) || events.length === 0) {
    return null;
  }

  const categoryColors = {
    kajian: "bg-primary text-primary-foreground",
    sosial: "bg-accent text-accent-foreground",
    pendidikan: "bg-secondary text-secondary-foreground",
    other: "bg-muted text-muted-foreground",
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {events.map((event: any, index: number) => (
            <CarouselItem key={event.id || index} className="h-full">
              <div className="relative w-full h-full">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  {event.image_url ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${event.image_url})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 container-islamic h-full flex items-center">
                  <div className="max-w-3xl space-y-6 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge
                        className={cn(
                          "mb-4 text-sm",
                          categoryColors[
                            event.category as keyof typeof categoryColors
                          ] || categoryColors.other
                        )}
                      >
                        {event.category}
                      </Badge>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    >
                      {event.title}
                    </motion.h2>

                    {event.description && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-white/90 line-clamp-2"
                      >
                        {event.description}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap gap-4 text-white/90"
                    >
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span className="text-sm md:text-base">
                            {format(
                              new Date(event.event_date),
                              "EEEE, d MMMM yyyy",
                              { locale: idLocale }
                            )}
                          </span>
                        </div>
                      )}
                      {event.event_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="text-sm md:text-base">
                            {format(new Date(event.event_time), "HH:mm")} WIB
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          <span className="text-sm md:text-base">
                            {event.location}
                          </span>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex gap-4 pt-4"
                    >
                      <Link href="/kegiatan">
                        <Button
                          size="lg"
                          className="bg-white text-primary hover:bg-white/90"
                        >
                          Lihat Detail
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-8 bg-white/20 hover:bg-white/30 text-white border-white/30" />
        <CarouselNext className="right-4 md:right-8 bg-white/20 hover:bg-white/30 text-white border-white/30" />
      </Carousel>

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                current === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

