
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				matrix: {
					DEFAULT: '#00FF00',
					light: '#10ff10',
					dark: '#003B00',
					black: '#000000',
					terminal: '#0F0',
					glow: '#00FF0050'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'matrix-fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'matrix-blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				'matrix-glow': {
					'0%': { textShadow: '0 0 5px #0F0, 0 0 10px #0F0' },
					'50%': { textShadow: '0 0 10px #0F0, 0 0 20px #0F0, 0 0 30px #0F0' },
					'100%': { textShadow: '0 0 5px #0F0, 0 0 10px #0F0' }
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100vh)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0' }
				},
				'typing': {
					'from': { width: '0' },
					'to': { width: '100%' }
				},
				'pulse-glow': {
					'0%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.2)' },
					'50%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.6), 0 0 30px rgba(0, 255, 65, 0.4)' },
					'100%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.2)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'matrix-fade': 'matrix-fade-in 1.5s ease-out',
				'matrix-cursor': 'matrix-blink 1s step-end infinite',
				'matrix-glow': 'matrix-glow 1.5s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 10s linear infinite',
				'typing': 'typing 3.5s steps(40, end)',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			},
			fontFamily: {
				'matrix': ['Source Code Pro', 'Courier New', 'monospace'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
