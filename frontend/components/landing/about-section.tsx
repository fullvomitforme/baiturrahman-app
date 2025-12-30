"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  const { data: content, isLoading } = useQuery({
    queryKey: ["content", "about"],
    queryFn: async () => {
      const response = await api.get("/content?section_key=about");
      return response.data;
    },
  });

  // Mock images - replace with actual images from API
  const images = [
    "/placeholder-mosque-1.jpg",
    "/placeholder-mosque-2.jpg",
    "/placeholder-mosque-3.jpg",
  ];

  const aboutText =
    content?.body ||
    "Masjid Baiturrahim didirikan pada tahun 1985 dengan tujuan menjadi pusat kegiatan keislaman dan kemasyarakatan di wilayah sekitar. Sejak berdiri, masjid ini telah menjadi tempat ibadah, pendidikan, dan kegiatan sosial yang melayani jamaah dari berbagai kalangan. Masjid ini terus berkembang dan berkomitmen untuk memberikan pelayanan terbaik kepada umat.";

  const shouldTruncate = aboutText.length > maxLength;
  const displayText = isExpanded || !shouldTruncate
    ? aboutText
    : `${aboutText.substring(0, maxLength)}...`;

  return (
    <section className="container-islamic section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        {/* Image Gallery */}
        <div className="order-2 md:order-1">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="relative aspect-video w-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-primary/20 to-transparent" />
                      <div className="relative w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">
                          Foto Masjid {index + 1}
                        </span>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* About Text */}
        <div className="order-1 md:order-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tentang Masjid
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
              <div className="h-4 bg-muted animate-pulse rounded w-4/6" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {displayText}
              </p>
              {shouldTruncate && (
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:text-primary/80"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Tampilkan Lebih Sedikit
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Baca Selengkapnya
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

