import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Preloader } from '@/components/preloader'
import { PageTransition } from '@/components/page-transition'
import { LenisProvider } from '@/components/LenisProvider'
import ChatWidget from '@/components/chat-widget'
import { HomeFooter } from '@/components/home-footer'
import {
	getOrganizationSchema,
	getProfessionalServiceSchema,
	getSiteUrl,
	getWebSiteSchema,
} from '@/lib/seo'

const season = localFont({
	src: '../../public/fonts/season-500.woff2',
	variable: '--font-season',
	display: 'swap',
	weight: '500',
})

export const metadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: 'Kometa | Producción Audiovisual, Web, IA y Prensa',
		template: '%s | Kometa',
	},
	description:
		'Agencia en Madrid de producción audiovisual, desarrollo web,'
		+ ' IA aplicada y gabinete de prensa.',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
	openGraph: {
		type: 'website',
		locale: 'es_ES',
		url: '/',
		siteName: 'Kometa',
		title: 'Kometa | Producción Audiovisual, Web, IA y Prensa',
		description:
			'Producción audiovisual, desarrollo web, IA aplicada y'
			+ ' gabinete de prensa.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Kometa | Producción Audiovisual, Web, IA y Prensa',
		description:
			'Estrategia digital, producción y tecnología para marcas.',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const organizationSchema = getOrganizationSchema()
	const websiteSchema = getWebSiteSchema()
	const professionalServiceSchema = getProfessionalServiceSchema()

	return (
		<html lang="es" className={`${season.variable} light`}>
			<head>
				<link
					rel="preconnect"
					href="https://res.cloudinary.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="dns-prefetch"
					href="https://res.cloudinary.com"
				/>
				<link
					rel="preconnect"
					href="https://prod.spline.design"
					crossOrigin="anonymous"
				/>
				<link
					rel="dns-prefetch"
					href="https://prod.spline.design"
				/>
			</head>
			<body>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteSchema),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(professionalServiceSchema),
					}}
				/>
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
