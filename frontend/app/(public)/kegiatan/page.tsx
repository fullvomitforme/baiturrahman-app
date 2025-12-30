import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KegiatanPage() {
  const activities = [
    {
      title: "Kajian Rutin",
      schedule: "Setiap Jumat, 19:00 WIB",
      description: "Kajian keislaman dengan tema-tema aktual",
    },
    {
      title: "TPA (Taman Pendidikan Al-Quran)",
      schedule: "Setiap Sabtu-Minggu, 08:00-10:00 WIB",
      description: "Pendidikan Al-Quran untuk anak-anak",
    },
    {
      title: "Sholat Jumat",
      schedule: "Setiap Jumat, 12:00 WIB",
      description: "Sholat Jumat berjamaah",
    },
  ];

  return (
    <div className="container-islamic section-spacing">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl">Kegiatan Masjid</h1>
          <p className="text-lg text-muted-foreground">
            Program dan kegiatan rutin Masjid Baiturrahim
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {activities.map((activity, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-heading">{activity.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-primary">
                  {activity.schedule}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

