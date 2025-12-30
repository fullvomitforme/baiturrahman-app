/**
 * Islamic-Inspired Design Tokens
 * Color palette and design system tokens for web-masjid
 */

export const designTokens = {
  colors: {
    // Primary: Emerald/Teal - Islamic green
    primary: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981', // Main primary
      600: '#059669', // Primary dark
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      950: '#022C22',
    },
    // Secondary: Gold - Mosque dome accent
    secondary: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Main secondary
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    // Accent: Deep Blue - Night sky, spirituality
    accent: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF', // Main accent
      900: '#1E3A8A',
      950: '#172554',
    },
    // Neutral: Warm gray scale
    neutral: {
      50: '#FAFAF9', // Soft cream for light mode background
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
      950: '#0C0A09',
    },
    // Dark mode: Deep navy with emerald accents
    dark: {
      background: '#0F172A', // Deep navy
      foreground: '#F1F5F9',
      card: '#1E293B',
      'card-foreground': '#F1F5F9',
      popover: '#1E293B',
      'popover-foreground': '#F1F5F9',
      primary: '#059669', // Emerald
      'primary-foreground': '#FFFFFF',
      secondary: '#F59E0B', // Gold
      'secondary-foreground': '#0F172A',
      muted: '#334155',
      'muted-foreground': '#94A3B8',
      accent: '#1E40AF', // Deep blue
      'accent-foreground': '#FFFFFF',
      destructive: '#EF4444',
      'destructive-foreground': '#FFFFFF',
      border: '#334155',
      input: '#334155',
      ring: '#059669',
    },
  },
  typography: {
    fonts: {
      heading: {
        name: 'Amiri',
        fallback: ['Cairo', 'Georgia', 'serif'],
        googleFonts: ['Amiri', 'Cairo'],
      },
      body: {
        name: 'Inter',
        fallback: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        googleFonts: ['Inter', 'Plus Jakarta Sans'],
      },
      arabic: {
        name: 'Scheherazade New',
        fallback: ['Amiri', 'serif'],
        googleFonts: ['Scheherazade New', 'Amiri'],
      },
    },
    sizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
    },
    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    touchTarget: '44px', // Minimum touch target for mobile
    section: '4rem', // 64px
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    base: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
} as const;

export type DesignTokens = typeof designTokens;

