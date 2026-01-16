'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
	return (
		<section className='relative flex justify-center items-center min-h-screen overflow-hidden'>
			{/* Background Image with Overlay */}
			<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
				<div className='absolute inset-0 bg-black/40' />
			</div>

			{/* Decorative Pattern */}
			<div className='absolute inset-0 opacity-10'>
				<div
					className='absolute inset-0'
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			{/* Content */}
			<div className='z-10 relative mx-auto px-4 sm:px-6 lg:px-8 container'>
				<div className='mx-auto max-w-4xl text-center'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className='mb-6 font-bold text-primary text-5xl sm:text-6xl lg:text-7xl leading-tight'>
							Selamat Datang di
							<span className='block text-primary'>Masjid Baiturrahim</span>
						</h1>
						<p className='mb-8 text-primary text-xl sm:text-2xl leading-relaxed'>
							Pusat ibadah dan kegiatan keagamaan yang membangun ukhuwah dan
							persatuan umat
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='flex sm:flex-row flex-col justify-center items-center gap-4'
					>
						<Button size='lg' variant='outline'>
							Jadwal Sholat
							<ArrowRight size={20} />
						</Button>
						<Button size='lg' variant='default'>
							Donasi Sekarang
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						className='gap-8 grid grid-cols-1 sm:grid-cols-3 mt-16'
					>
						<div>
							<div className='font-bold text-primary text-4xl'>5+</div>
							<div className='mt-2 text-primary text-sm'>Kegiatan Rutin</div>
						</div>
						<div>
							<div className='font-bold text-primary text-4xl'>1000+</div>
							<div className='mt-2 text-primary text-sm'>Jamaah</div>
						</div>
						<div>
							<div className='font-bold text-primary text-4xl'>24/7</div>
							<div className='mt-2 text-primary text-sm'>Layanan</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 1 }}
				className='bottom-8 left-1/2 absolute -translate-x-1/2'
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
					className='flex justify-center items-start p-2 border-2 border-primary rounded-full w-6 h-10'
				>
					<motion.div
						animate={{ y: [0, 12, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className='bg-primary rounded-full w-1 h-2'
					/>
				</motion.div>
			</motion.div>
		</section>
	);
}
