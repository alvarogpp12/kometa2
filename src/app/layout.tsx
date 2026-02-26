import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { CustomCursor } from '@/components/custom-cursor'
import { Preloader } from '@/components/preloader'
import { PageTransition } from '@/components/page-transition'
import { LenisProvider } from '@/components/LenisProvider'

const season = localFont({
	src: '../../public/fonts/season-500.woff2',
	variable: '--font-season',
	display: 'swap',
	weight: '500',
})

export const metadata: Metadata = {
	title: 'kometa',
	description:
		'Your creative partner for Animation & Imagery. Digital Artists. World-class. Nothing else.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={`${season.variable} light`}>
			<body>
				<Preloader />
				<PageTransition />
				<CustomCursor />
				<LenisProvider>
					<div className="Site-pageInner">
						{children}
					</div>
				</LenisProvider>
				<Navigation />
			</body>
		</html>
	)
}
