import Link from "next/link";
import { Clock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#047857] text-white mt-16">
      <div className="container-islamic py-12 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-[#F59E0B]">
              Masjid Baiturrahim
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Pusat kegiatan keislaman dan kemasyarakatan yang melayani umat
              dengan penuh dedikasi. Mari bersama-sama membangun dan
              mengembangkan masjid untuk kemaslahatan umat.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-[#F59E0B]">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tentang"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  Tentang Masjid
                </Link>
              </li>
              <li>
                <Link
                  href="/kegiatan"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  Kontak
                </Link>
              </li>
              <li>
                <Link
                  href="/kegiatan"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  Jadwal Sholat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Prayer Times Quick View */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-[#F59E0B] flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Jadwal Sholat
            </h4>
            <div className="text-sm text-white/80 space-y-1">
              <p>Subuh: 04:30</p>
              <p>Dzuhur: 12:15</p>
              <p>Ashar: 15:30</p>
              <p>Maghrib: 18:20</p>
              <p>Isya: 19:35</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/60">
          <p>
            © {currentYear} Masjid Baiturrahim. All rights reserved.
          </p>
          <p className="mt-2">
            Dibuat dengan ❤️ untuk kemaslahatan umat
          </p>
        </div>
      </div>
    </footer>
  );
}
