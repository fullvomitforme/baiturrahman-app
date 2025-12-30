import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Megaphone } from "lucide-react";

// Mock announcements - in production, fetch from API
const announcements = [
  {
    id: 1,
    title: "Pengumuman Sholat Jumat",
    content: "Sholat Jumat akan dilaksanakan pada pukul 12:00 WIB. Jamaah diharapkan hadir lebih awal.",
    date: new Date(),
    category: "Pengumuman",
  },
  {
    id: 2,
    title: "Kajian Rutin Jumat Malam",
    content: "Kajian rutin Jumat malam akan membahas tema 'Keutamaan Sholat Berjamaah'.",
    date: new Date(Date.now() - 86400000),
    category: "Kegiatan",
  },
];

export function Announcements() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-heading text-3xl md:text-4xl flex items-center justify-center gap-2">
          <Megaphone className="h-8 w-8" />
          Pengumuman
        </h2>
        <p className="text-muted-foreground">
          Informasi dan pengumuman terbaru dari masjid
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="font-heading">
                  {announcement.title}
                </CardTitle>
                <Badge variant="secondary">{announcement.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{announcement.content}</p>
              <p className="text-sm text-muted-foreground">
                {format(announcement.date, "dd MMMM yyyy", { locale: idLocale })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

