import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'

export const metadata: Metadata = {
	title: 'Servicios',
	description:
		'Gabinete de prensa, producción audiovisual,'
		+ ' branding, redes sociales y desarrollo web'
		+ ' en Madrid.',
	alternates: {
		canonical: '/servicios',
	},
	openGraph: {
		title: 'Servicios — Kometalab',
		description:
			'Gabinete de prensa, producción audiovisual,'
			+ ' branding, redes sociales y desarrollo web.',
		url: '/servicios',
	},
	twitter: {
		title: 'Servicios — Kometalab',
		description:
			'Gabinete de prensa, producción audiovisual,'
			+ ' branding, redes sociales y desarrollo web.',
	},
}

export default function ServicesIndexPage() {
	return (
		<main className="wrapper-1290" style={{ paddingBlock: '8rem' }}>
			<h1 style={{ marginBottom: '2rem' }}>Servicios</h1>
			<nav aria-label="Listado de servicios">
				<ul style={{ display: 'grid', gap: '1rem' }}>
					{SERVICES.map((service) => (
						<li key={service.slug}>
							<Link href={`/servicios/${service.slug}`}>
								{service.title}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</main>
	)
}
