import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TentangPage() {
  return (
    <div className="container-islamic section-spacing">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl">Tentang Masjid</h1>
          <p className="text-lg text-muted-foreground">
            Sejarah dan visi misi Masjid Baiturrahim
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Sejarah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Masjid Baiturrahim didirikan pada tahun 1985 dengan tujuan
              menjadi pusat kegiatan keislaman dan kemasyarakatan di wilayah
              sekitar.
            </p>
            <p>
              Sejak berdiri, masjid ini telah menjadi tempat ibadah, pendidikan,
              dan kegiatan sosial yang melayani jamaah dari berbagai kalangan.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Visi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Menjadi masjid yang menjadi pusat peradaban Islam yang modern,
              inklusif, dan bermanfaat bagi umat.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Misi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>Menyelenggarakan ibadah dengan baik dan teratur</li>
              <li>Menyediakan pendidikan agama yang berkualitas</li>
              <li>Mengembangkan kegiatan sosial dan kemasyarakatan</li>
              <li>Menjadi pusat informasi keislaman</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

