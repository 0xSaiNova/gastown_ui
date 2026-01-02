import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Background colors
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',

				// Surface colors
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},

				// Primary colors
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},

				// Accent colors
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},

				// UI element colors
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',

				// Muted colors
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},

				// Destructive colors
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},

				// Status colors (semantic)
				status: {
					online: 'hsl(var(--status-online) / <alpha-value>)',
					offline: 'hsl(var(--status-offline) / <alpha-value>)',
					pending: 'hsl(var(--status-pending) / <alpha-value>)',
					idle: 'hsl(var(--status-idle) / <alpha-value>)'
				},

				// Semantic feedback colors
				success: {
					DEFAULT: 'hsl(var(--success) / <alpha-value>)',
					foreground: 'hsl(var(--success-foreground) / <alpha-value>)'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
					foreground: 'hsl(var(--warning-foreground) / <alpha-value>)'
				},
				info: {
					DEFAULT: 'hsl(var(--info) / <alpha-value>)',
					foreground: 'hsl(var(--info-foreground) / <alpha-value>)'
				}
			},

			// Typography - JetBrains Mono as primary mono font
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', ...fontFamily.sans],
				mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', ...fontFamily.mono]
			},

			// Font sizes with line heights
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.875rem' }],
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }]
			},

			// Spacing scale (1-12 based on 4px increments)
			spacing: {
				'1': '0.25rem',   // 4px
				'2': '0.5rem',    // 8px
				'3': '0.75rem',   // 12px
				'4': '1rem',      // 16px
				'5': '1.25rem',   // 20px
				'6': '1.5rem',    // 24px
				'7': '1.75rem',   // 28px
				'8': '2rem',      // 32px
				'9': '2.25rem',   // 36px
				'10': '2.5rem',   // 40px
				'11': '2.75rem',  // 44px
				'12': '3rem',     // 48px
				'touch': 'var(--touch-target-min)'
			},

			// Border radius
			borderRadius: {
				'sm': '0.25rem',     // 4px
				'md': '0.375rem',    // 6px
				'lg': '0.5rem',      // 8px
				'xl': '0.75rem',     // 12px
				'2xl': '1rem',       // 16px
				'full': '9999px',
				DEFAULT: 'var(--radius)'
			},

			// Box shadows
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'glow': 'var(--shadow-glow)',
				'focus': 'var(--shadow-focus)'
			},

			// Touch target minimum heights/widths
			minHeight: {
				'touch': 'var(--touch-target-min)'
			},
			minWidth: {
				'touch': 'var(--touch-target-min)'
			},

			// Keyframes for animations
			keyframes: {
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'pulse-status': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},

			// Animation utilities
			animation: {
				'fade-in': 'fade-in var(--duration-normal, 200ms) var(--ease-out, ease-out)',
				'fade-in-up': 'fade-in-up var(--duration-normal, 200ms) var(--ease-out, ease-out)',
				'scale-in': 'scale-in var(--duration-fast, 150ms) var(--ease-out, ease-out)',
				'shimmer': 'shimmer 2s infinite ease-in-out',
				'pulse-status': 'pulse-status 2s infinite'
			}
		}
	},
	plugins: []
};
