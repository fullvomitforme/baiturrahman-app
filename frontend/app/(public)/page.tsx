import { HeroSection } from '@/components/landing/hero-section';
import { PrayerTimesWidget } from '@/components/landing/prayer-times-widget';
import { AboutSection } from '@/components/landing/about-section';
import { UpcomingEvents } from '@/components/landing/upcoming-events';
import { AnnouncementsSection } from '@/components/landing/announcements-section';
import { OrganizationPreview } from '@/components/landing/organization-preview';
import { DonationCTA } from '@/components/landing/donation-cta';
import { ContactSection } from '@/components/landing/contact-section';
import { FloatingWhatsApp } from '@/components/shared/floating-whatsapp';
import { BackToTop } from '@/components/shared/back-to-top';

export default function HomePage() {
	return (
		<div className='flex flex-col'>
			<HeroSection />
			<PrayerTimesWidget />
			<AboutSection />
			<UpcomingEvents />
			<AnnouncementsSection />
			<OrganizationPreview />
			<DonationCTA />
			<ContactSection />
			<FloatingWhatsApp />
			<BackToTop />
		</div>
	);
}
