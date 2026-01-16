'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMosqueInfo } from '@/services/hooks'
import { HeroSection } from '@/components/sections/HeroSection'
import { PrayerTimesSection } from '@/components/sections/PrayerTimesSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { EventsSection } from '@/components/sections/EventsSection'
import { AnnouncementsSection } from '@/components/sections/AnnouncementsSection'
import { DonationSection } from '@/components/sections/DonationSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PrayerTimesSection />
      <AboutSection />
      <EventsSection />
      <AnnouncementsSection />
      <DonationSection />
      <ContactSection />
    </div>
  )
}
