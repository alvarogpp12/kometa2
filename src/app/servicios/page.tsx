import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'

export const metadata: Metadata = {
	title: 'Servicios Digitales y Audiovisuales en Madrid',
	description:
		'Servicios de producción audiovisual, desarrollo web, IA'
		+ ' aplicada y gabinete de prensa en Madrid.',
	alternates: {
		canonical: '/servicios',
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
