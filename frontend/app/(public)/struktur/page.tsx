"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function StrukturPage() {
  const { data: structures, isLoading } = useQuery({
    queryKey: ["structure", "all"],
    queryFn: async () => {
      const response = await api.get("/structure");
      // Handle both response formats: { data: [...] } or [...]
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
  });

  if (isLoading) {
    return (
      <div className="container-islamic section-spacing">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!structures || !Array.isArray(structures) || structures.length === 0) {
    return (
      <div className="container-islamic section-spacing">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="font-heading text-4xl md:text-5xl">
              Struktur Organisasi
            </h1>
            <p className="text-lg text-muted-foreground">
              Pengurus Masjid Baiturrahim
            </p>
          </motion.div>
          <Card>
            <CardContent className="py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Belum ada data struktur organisasi
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Group by department if available
  const groupedByDepartment = structures.reduce((acc: any, member: any) => {
    const dept = member.department || "Umum";
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {});

  const hasDepartments = Object.keys(groupedByDepartment).length > 1;

  return (
    <div className="container-islamic section-spacing">
      <div className="mx-auto max-w-6xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="font-heading text-4xl md:text-5xl">
            Struktur Organisasi
          </h1>
          <p className="text-lg text-muted-foreground">
            Pengurus dan Anggota Masjid Baiturrahim
          </p>
        </motion.div>

        {hasDepartments ? (
          // Display grouped by department
          Object.entries(groupedByDepartment).map(([department, members]: [string, any]) => (
            <motion.section
              key={department}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <h2 className="font-heading text-2xl md:text-3xl font-bold">
                  {department}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member: any, index: number) => (
                  <MemberCard key={member.id || index} member={member} index={index} />
                ))}
              </div>
            </motion.section>
          ))
        ) : (
          // Display all members in a grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structures.map((member: any, index: number) => (
              <MemberCard key={member.id || index} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member, index }: { member: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="text-center hover:shadow-lg transition-all border-2 h-full">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-28 w-28 border-4 border-primary">
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
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold">
              {member.name}
            </h3>
            <Badge variant="secondary" className="text-sm">
              {member.position}
            </Badge>
            {member.department && (
              <p className="text-sm text-muted-foreground">
                {member.department}
              </p>
            )}
          </div>
          {member.bio && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {member.bio}
            </p>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t">
            {member.email && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${member.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {member.phone}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

