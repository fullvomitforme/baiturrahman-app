'use client';

import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function Navbar() {
	const { isMenuOpen, toggleMenu, closeMenu } = useUIStore();
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [isScrolled, setIsScrolled] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true)
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const isDarkMode = mounted && resolvedTheme === 'dark';

	const navLinks = [
		{ href: '#about', label: 'Tentang' },
		{ href: '#activities', label: 'Kegiatan' },
		{ href: '#events', label: 'Acara' },
		{ href: '#announcements', label: 'Pengumuman' },
		{ href: '#donations', label: 'Donasi' },
		{ href: '#contact', label: 'Kontak' },
	];

	return (
		<nav
			className={cn(
				'top-0 right-0 left-0 z-50 fixed transition-all duration-300',
				isScrolled
					? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm'
					: 'bg-transparent',
			)}
		>
			<div className='mx-auto px-4 sm:px-6 lg:px-8 container'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link href='/' className='flex items-center space-x-2'>
						<div className='flex justify-center items-center bg-primary rounded-lg w-10 h-10'>
							<span className='font-bold text-primary-foreground text-xl'>M</span>
						</div>
						<span className='font-semibold text-xl dark:text-white'>
							Masjid Baiturrahim
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-8'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
							>
								{link.label}
							</Link>
						))}
						<button
							onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
							className='hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors'
						>
							{mounted && isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
						</button>
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden flex items-center space-x-2'>
						<button
							onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
							className='hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors'
						>
							{mounted && isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
						</button>
						<button
							onClick={toggleMenu}
							className='hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors'
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className='md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800'
					>
						<div className='space-y-2 mx-auto px-4 py-4 container'>
							{navLinks.map((link, index) => (
								<motion.div
									key={link.href}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<Link
										href={link.href}
										onClick={closeMenu}
										className='block hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300'
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
