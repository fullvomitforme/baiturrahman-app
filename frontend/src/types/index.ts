export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
}

export interface MosqueInfo {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  facebook?: string
  instagram?: string
  youtube?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface PrayerTime {
  id: string
  date: string
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string
  location: string
  image_url?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_name: string
  amount: number
  payment_method: string
  status: 'pending' | 'confirmed' | 'rejected'
  message?: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  name: string
  account_number: string
  account_holder: string
  logo_url?: string
  is_active: boolean
  order: number
}

export interface ContentSection {
  id: string
  title: string
  content: string
  section_type: 'about' | 'programs' | 'history' | 'other'
  is_visible: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface StructureMember {
  id: string
  name: string
  position: string
  role: string
  image_url?: string
  order: number
  created_at: string
}
