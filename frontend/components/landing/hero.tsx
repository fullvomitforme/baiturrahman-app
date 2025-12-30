"use client";

import { Button } from "@/components/ui/button";
import { DonationModal } from "./donation-modal";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pattern-islamic">
      <div className="container-islamic text-center space-y-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold">
            Masjid Baiturrahim
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Pusat kegiatan keislaman dan kemasyarakatan yang melayani umat dengan
            penuh dedikasi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DonationModal />
            <Link href="/kegiatan">
              <Button variant="outline" size="lg">
                Lihat Kegiatan
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

