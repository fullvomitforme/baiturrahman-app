"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, AlertCircle, Info, Gift } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

const priorityColors = {
  urgent: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  normal: "bg-primary text-primary-foreground",
  low: "bg-muted text-muted-foreground",
};

const categoryIcons = {
  info: Info,
  warning: AlertCircle,
  event: Megaphone,
  donation: Gift,
};

export function AnnouncementsSection() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: async () => {
      const response = await api.get("/announcements?active=true&limit=5");
      return response.data?.data || response.data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="container-islamic section-spacing">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </section>
    );
  }

  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Sort: pinned first, then by priority, then by date
  const sortedAnnouncements = [...announcements].sort((a: any, b: any) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    return new Date(b.published_at || b.created_at).getTime() - 
           new Date(a.published_at || a.created_at).getTime();
  });

  return (
    <section className="container-islamic section-spacing bg-muted/30 py-16 rounded-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" />
            Pengumuman
          </h2>
          <p className="text-muted-foreground">
            Informasi dan pengumuman terbaru dari masjid
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {sortedAnnouncements.map((announcement: any, index: number) => {
            const Icon = categoryIcons[announcement.category as keyof typeof categoryIcons] || Info;
            const priorityColor = priorityColors[announcement.priority as keyof typeof priorityColors] || priorityColors.normal;
            
            return (
              <motion.div
                key={announcement.id || index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${announcement.id || index}`}
                  className={cn(
                    "border-2 rounded-lg px-4",
                    announcement.is_pinned && "border-primary bg-primary/5"
                  )}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-base md:text-lg line-clamp-1">
                            {announcement.title}
                          </h3>
                          {announcement.is_pinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                          <Badge className={cn("text-xs", priorityColor)}>
                            {announcement.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {announcement.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(
                            new Date(announcement.published_at || announcement.created_at),
                            "dd MMMM yyyy",
                            { locale: idLocale }
                          )}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-4">
                      {announcement.image_url && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <div className="relative aspect-video w-full bg-muted">
                            <span className="text-muted-foreground text-sm">
                              Image: {announcement.image_url}
                            </span>
                          </div>
                        </div>
                      )}
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                        {announcement.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </motion.div>
    </section>
  );
}

