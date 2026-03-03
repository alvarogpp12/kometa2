import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Preloader } from '@/components/preloader'
import { PageTransition } from '@/components/page-transition'
import { LenisProvider } from '@/components/LenisProvider'
import ChatWidget from '@/components/chat-widget'
import { HomeFooter } from '@/components/home-footer'

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
				<LenisProvider>
					<div className="Site-pageInner">
						{children}
						<HomeFooter />
					</div>
				</LenisProvider>
				<Navigation />
				<ChatWidget />
			</body>
		</html>
	)
}
