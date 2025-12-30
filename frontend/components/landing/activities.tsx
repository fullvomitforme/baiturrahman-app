import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Users, BookOpen } from "lucide-react";

const activities = [
  {
    icon: Calendar,
    title: "Kajian Rutin",
    description: "Kajian keislaman setiap Jumat malam",
    schedule: "Jumat, 19:00 WIB",
  },
  {
    icon: Users,
    title: "TPA",
    description: "Taman Pendidikan Al-Quran untuk anak-anak",
    schedule: "Sabtu-Minggu, 08:00-10:00 WIB",
  },
  {
    icon: BookOpen,
    title: "Kelas Tahsin",
    description: "Pembelajaran membaca Al-Quran dengan benar",
    schedule: "Selasa & Kamis, 19:00 WIB",
  },
];

export function Activities() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-heading text-3xl md:text-4xl">Kegiatan Rutin</h2>
        <p className="text-muted-foreground">
          Program dan kegiatan yang diselenggarakan secara rutin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-heading">{activity.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{activity.description}</p>
                <p className="text-sm font-medium text-primary">
                  {activity.schedule}
                </p>
                <Link href="/kegiatan">
                  <Button variant="outline" size="sm" className="w-full">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

