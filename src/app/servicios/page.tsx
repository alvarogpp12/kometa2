import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'

export const metadata: Metadata = {
	title: 'Servicios',
	description:
		'Producción audiovisual, desarrollo web,'
		+ ' IA aplicada y gabinete de prensa.'
		+ ' Un solo equipo para toda tu comunicación'
		+ ' en Madrid.',
	alternates: {
		canonical: '/servicios',
	},
	openGraph: {
		title: 'Servicios — Kometalab',
		description:
			'Producción audiovisual, desarrollo web,'
			+ ' IA aplicada y gabinete de prensa en Madrid.',
		url: '/servicios',
	},
	twitter: {
		title: 'Servicios — Kometalab',
		description:
			'Producción audiovisual, desarrollo web,'
			+ ' IA aplicada y gabinete de prensa en Madrid.',
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
