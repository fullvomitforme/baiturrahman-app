"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OrganizationPreview() {
  const { data: structures, isLoading } = useQuery({
    queryKey: ["structure", "preview"],
    queryFn: async () => {
      const response = await api.get("/structure?limit=3");
      return response.data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="container-islamic section-spacing">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!structures || structures.length === 0) {
    return null;
  }

  return (
    <section className="container-islamic section-spacing bg-muted/30 py-16 rounded-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Struktur Organisasi
          </h2>
          <p className="text-muted-foreground">
            Pengurus Masjid Baiturrahim
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {structures.map((member: any, index: number) => (
            <motion.div
              key={member.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center hover:shadow-lg transition-all border-2 h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                      <AvatarImage
                        src={member.photo_url}
                        alt={member.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold mb-1">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="text-sm">
                      {member.position}
                    </Badge>
                    {member.department && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {member.department}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/tentang">
            <Button variant="outline" size="lg">
              <Users className="h-4 w-4 mr-2" />
              Lihat Struktur Lengkap
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

