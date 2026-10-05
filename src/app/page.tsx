import type { Metadata } from 'next'
import { AnimatedLogo } from '@/components/animated-logo'
import { HeroIntro } from '@/components/hero-intro'
import { HomeShowreel } from '@/components/home-showreel'
import { HomeFamily } from '@/components/home-family'
import PlatePreview from '@/components/plate-preview'

export const metadata: Metadata = {
	title: {
		absolute:
			'Kometalab · Productora audiovisual y agencia de'
			+ ' comunicación en Madrid',
	},
	description:
		'Gabinete de prensa, producción audiovisual, branding,'
		+ ' redes sociales y desarrollo web en Madrid.',
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: 'Kometalab — Nuestras madres siguen sin entender'
			+ ' a qué nos dedicamos. Nuestros clientes, sí.',
		description:
			'Productora audiovisual y agencia de comunicación'
			+ ' en Madrid.',
		url: '/',
	},
	twitter: {
		title: 'Kometalab — Nuestras madres siguen sin entender'
			+ ' a qué nos dedicamos. Nuestros clientes, sí.',
		description:
			'Productora audiovisual y agencia de comunicación'
			+ ' en Madrid.',
	},
}

export default function HomePage() {
	return (
		<>
			<section className="HomeHero">
				<div className="wrapper">
					<AnimatedLogo />
				</div>
				<div className="wrapper">
					<HeroIntro />
				</div>
			</section>

			<HomeShowreel />
			<HomeFamily
				webDevMedia={
					<PlatePreview
						className="SliceHomeArtists-mediaVisual"
					/>
				}
			/>
		</>
	)
}
