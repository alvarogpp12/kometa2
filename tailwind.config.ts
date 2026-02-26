import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				white: '#fff',
				offwhite: '#f6f6f4',
				'offwhite-2': '#f2f2f2',
				'offwhite-3': '#eee',
				black: '#111',
				offblack: '#1a1a1a',
				'grey-1': '#35363a',
				'grey-2': '#5e5b52',
				'grey-3': '#959697',
				'grey-4': '#8f8f8f',
				'grey-6': '#898a8b',
				red: '#ff243a',
			},
			fontFamily: {
				season: ['var(--font-season)', 'sans-serif'],
				sans: ['system-ui', '-apple-system', 'sans-serif'],
			},
			borderRadius: {
				'1': '1px',
				'2': '2px',
				'4': '4px',
				'8': '8px',
				'10': '10px',
			},
		},
	},
	plugins: [],
}

export default config
