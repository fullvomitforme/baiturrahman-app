import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'background': 'rgb(var(--background) / <alpha-value>)',
				'foreground': 'rgb(var(--foreground) / <alpha-value>)',
				'card': {
					DEFAULT: 'rgb(var(--card) / <alpha-value>)',
					foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
				},
				'popover': {
					DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
					foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
				},
				'primary': {
					DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
					foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
				},
				'secondary': {
					DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
					foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
				},
				'accent': {
					DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
					foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
				},
				'muted': {
					DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
					foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
				},
				'destructive': {
					DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
					foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
				},
				'border': 'rgb(var(--border) / <alpha-value>)',
				'input': 'rgb(var(--input) / <alpha-value>)',
				'ring': 'rgb(var(--ring) / <alpha-value>)',
				// Custom Islamic colors
				'emerald-primary': {
					DEFAULT: 'rgb(var(--emerald-primary) / <alpha-value>)',
					light: 'rgb(var(--emerald-primary-light) / <alpha-value>)',
					dark: 'rgb(var(--emerald-primary-dark) / <alpha-value>)',
				},
				'gold-accent': {
					DEFAULT: 'rgb(var(--gold-accent) / <alpha-value>)',
					light: 'rgb(var(--gold-accent-light) / <alpha-value>)',
					dark: 'rgb(var(--gold-accent-dark) / <alpha-value>)',
				},
				'navy-deep': {
					DEFAULT: 'rgb(var(--navy-deep) / <alpha-value>)',
					light: 'rgb(var(--navy-deep-light) / <alpha-value>)',
				},
				'cream-soft': 'rgb(var(--cream-soft) / <alpha-value>)',
			},
			fontFamily: {
				heading: ['var(--font-amiri)', 'var(--font-cairo)', 'Georgia', 'serif'],
				body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
				arabic: ['var(--font-scheherazade)', 'var(--font-amiri)', 'serif'],
				sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
				serif: ['var(--font-amiri)', 'var(--font-cairo)', 'Georgia', 'serif'],
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'gentle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-up': 'slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'gentle-bounce':
					'gentle-bounce 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			},
			spacing: {
				touch: '2.75rem', // 44px - Minimum touch target
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			},
		},
	},
	plugins: [],
};

export default config;
