"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Coins } from "lucide-react";
import { DonationModal } from "./donation-modal";
import { useState } from "react";

export function DonationCTA() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-primary via-emerald-primary/90 to-teal-600" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pattern-islamic-alt" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container-islamic section-spacing relative z-10 text-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block mb-6"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Coins className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
          Berbagi untuk Sesama
        </h2>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          Setiap sedekah yang Anda berikan adalah investasi untuk akhirat.
          Mari bersama-sama membangun dan mengembangkan Masjid Baiturrahim
          untuk kemaslahatan umat.
        </p>
        <p className="text-base md:text-lg text-white/80 italic mb-8">
          "Sesungguhnya sedekah itu akan memadamkan panasnya kubur bagi
          pelakunya. Sesungguhnya orang mukmin kelak pada hari kiamat akan
          bernaung di bawah naungan sedekahnya." (HR. Thabrani)
        </p>

        <DonationModal />
      </motion.div>
    </section>
  );
}

