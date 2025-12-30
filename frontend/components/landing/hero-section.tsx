"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Heart } from "lucide-react";
import { DonationModal } from "./donation-modal";
import Link from "next/link";
import { useState, useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function HeroSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pattern-islamic"
        aria-hidden="true"
      />

      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Placeholder for mosque image - replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-primary/20 via-emerald-primary/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-islamic text-center px-4 py-20 md:py-32">
        {isClient && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Arabic Text */}
            <motion.div variants={itemVariants}>
              <h1 className="font-arabic text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 leading-tight">
                مسجد بيت الرحيم
              </h1>
            </motion.div>

            {/* Indonesian Text */}
            <motion.div variants={itemVariants}>
              <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Masjid Baiturrahim
              </h2>
            </motion.div>

            {/* Tagline */}
            <motion.div variants={itemVariants}>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Pusat kegiatan keislaman dan kemasyarakatan
                <br className="hidden md:block" />
                yang melayani umat dengan penuh dedikasi
              </p>
            </motion.div>

            {/* Location */}
            <motion.div variants={itemVariants}>
              <p className="text-base md:text-lg text-muted-foreground">
                Jakarta Selatan, DKI Jakarta
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <DonationModal />
              <Link href="/kegiatan">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] px-8 text-base font-medium border-2"
                >
                  Lihat Jadwal Sholat
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5,
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-primary animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
