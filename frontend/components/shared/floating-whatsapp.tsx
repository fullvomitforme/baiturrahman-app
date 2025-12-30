"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingWhatsApp() {
  // Replace with actual WhatsApp number
  const whatsappNumber = "6281234567890";
  const message = encodeURIComponent("Assalamu'alaikum, saya ingin bertanya tentang Masjid Baiturrahim");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Hubungi via WhatsApp"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

