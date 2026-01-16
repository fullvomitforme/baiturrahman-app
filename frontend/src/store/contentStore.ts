import { create } from 'zustand'
import type { MosqueInfo, Event, Announcement, PrayerTime } from '@/types'

interface ContentState {
  mosqueInfo: MosqueInfo | null
  events: Event[]
  announcements: Announcement[]
  prayerTimes: PrayerTime | null
  setMosqueInfo: (info: MosqueInfo) => void
  setEvents: (events: Event[]) => void
  setAnnouncements: (announcements: Announcement[]) => void
  setPrayerTimes: (times: PrayerTime) => void
}

export const useContentStore = create<ContentState>((set) => ({
  mosqueInfo: null,
  events: [],
  announcements: [],
  prayerTimes: null,
  setMosqueInfo: (info) => set({ mosqueInfo: info }),
  setEvents: (events) => set({ events }),
  setAnnouncements: (announcements) => set({ announcements }),
  setPrayerTimes: (times) => set({ prayerTimes: times }),
}))
