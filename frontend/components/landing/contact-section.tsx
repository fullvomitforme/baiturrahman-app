"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Youtube } from "lucide-react";
import { api } from "@/lib/api";

export function ContactSection() {
  const { data: mosqueInfo } = useQuery({
    queryKey: ["mosque"],
    queryFn: async () => {
      const response = await api.get("/mosque");
      return response.data;
    },
  });

  const socialMedia = mosqueInfo?.social_media || {};

  return (
    <section className="container-islamic section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Hubungi Kami
          </h2>
          <p className="text-muted-foreground">
            Kami siap membantu dan melayani Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Alamat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mosqueInfo?.address || "Jl. Masjid Raya No. 123"}
                  <br />
                  {mosqueInfo?.city || "Jakarta Selatan"}, {mosqueInfo?.province || "DKI Jakarta"}
                  <br />
                  {mosqueInfo?.postal_code || "12345"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Telepon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`tel:${mosqueInfo?.phone || "+62123456789"}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {mosqueInfo?.phone || "+62 123 456 789"}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`mailto:${mosqueInfo?.email || "info@masjidbaiturrahim.com"}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {mosqueInfo?.email || "info@masjidbaiturrahim.com"}
                </a>
              </CardContent>
            </Card>

            {socialMedia && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Media Sosial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialMedia.facebook && (
                      <a
                        href={socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {socialMedia.instagram && (
                      <a
                        href={socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {socialMedia.youtube && (
                      <a
                        href={socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video w-full">
                {mosqueInfo?.maps_embed_url ? (
                  <iframe
                    src={mosqueInfo.maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        Peta akan ditampilkan di sini
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}

