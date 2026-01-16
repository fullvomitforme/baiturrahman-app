'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Moon, Sun } from 'lucide-react';
import { usePrayerTimes } from '@/services/hooks';

interface PrayerCardProps {
	name: string;
	time: string;
	icon: React.ReactNode;
	isNext?: boolean;
	isNow?: boolean;
}

function PrayerCard({ name, time, icon, isNext, isNow }: PrayerCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
		>
			<Card
				className={`text-center transition-all duration-300 ${
					isNow
						? 'border-2 border-primary shadow-lg scale-105'
						: isNext
						? 'border-2 border-primary/50'
						: 'hover:shadow-md'
				}`}
			>
				<CardContent className='p-6'>
					<div className='flex justify-center mb-3'>
						<div
							className={`p-3 rounded-full ${
								isNow
									? 'bg-primary text-primary-foreground'
									: 'bg-gray-100 dark:bg-gray-800'
							}`}
						>
							{icon}
						</div>
					</div>
					<h3 className='mb-2 font-semibold dark:text-white text-lg'>{name}</h3>
					<p
						className={`text-2xl font-bold ${
							isNow ? 'text-primary' : 'text-gray-900 dark:text-white'
						}`}
					>
						{time}
					</p>
					{isNow && (
						<span className='inline-block bg-primary mt-2 px-3 py-1 rounded-full text-primary-foreground text-xs'>
							Now
						</span>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}

export function PrayerTimesSection() {
	const today = new Date().toISOString().split('T')[0];
	const { data: prayerTimes, isLoading } = usePrayerTimes(today);

	// For now, use placeholder data since API is not set up yet
	const prayerData = prayerTimes || {
		fajr: '04:45',
		dhuhr: '12:15',
		asr: '15:30',
		maghrib: '18:20',
		isha: '19:35',
	};

	return (
		<section id='prayer-times' className='py-20'>
			<div className='mx-auto px-4 sm:px-6 lg:px-8 container'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='mb-12 text-center'
				>
					<h2 className='mb-4 font-bold text-4xl'>Jadwal Sholat</h2>
					<p className='text-lg'>
						{new Date().toLocaleDateString('id-ID', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
					<p className='mt-2 text-sm'>
						Sumber: Kemenag RI | Imsak 04:35 | Sunrise 05:55
					</p>
				</motion.div>

				<div className='gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mx-auto max-w-6xl'>
					<PrayerCard
						name='Subuh'
						time={prayerData.fajr}
						icon={<Moon size={24} />}
					/>
					<PrayerCard
						name='Dzuhur'
						time={prayerData.dhuhr}
						icon={<Sun size={24} />}
					/>
					<PrayerCard
						name='Ashar'
						time={prayerData.asr}
						icon={<Cloud size={24} />}
					/>
					<PrayerCard
						name='Maghrib'
						time={prayerData.maghrib}
						icon={<Sun size={24} />}
					/>
					<PrayerCard
						name='Isya'
						time={prayerData.isha}
						icon={<Moon size={24} />}
					/>
				</div>
			</div>
		</section>
	);
}
