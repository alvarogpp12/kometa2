import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ServicePage from '@/components/service-page'
import WebDevPage from '@/components/web-dev-page'
import NoisegraphPage from '@/components/noisegraph-page'
import IaPage from '@/components/ia-page'
import PressPage from '@/components/press-page'
import { SERVICES } from '@/lib/services'
import { getBreadcrumbSchema } from '@/lib/seo'

interface ServiceRouteParams {
	slug: string
}

export function generateStaticParams() {
	return SERVICES.map((service) => ({ slug: service.slug }))
}

interface ServiceSeo {
	title: string
	description: string
}

const SERVICE_SEO: Record<string, ServiceSeo> = {
	'produccion-audiovisual': {
		title: 'Producción Audiovisual en Madrid',
		description:
			'Un solo equipo para toda tu comunicación:'
			+ ' estrategia, producción y entrega.'
			+ ' Para marcas que quieren eficiencia real.'
			+ ' Sede en Madrid, pero vamos donde estés.',
	},
	'desarrollo-web': {
		title: 'Desarrollo Web en Madrid',
		description:
			'Diseñamos experiencias digitales que combinan'
			+ ' estética y funcionalidad.'
			+ ' Webs a medida, orientadas a conversión y'
			+ ' construidas como plataformas de crecimiento.',
	},
	'ia-aplicada': {
		title: 'IA Aplicada en Madrid',
		description:
			'Integramos IA en procesos creativos y'
			+ ' estratégicos con enfoque de negocio.'
			+ ' Automatización, optimización y escalabilidad'
			+ ' sin perder identidad.',
	},
	'gabinete-de-prensa': {
		title: 'Gabinete de Prensa en Madrid',
		description:
			'Activamos tu evento y marca en medios nacionales'
			+ ' e internacionales. Prensa escrita, televisión'
			+ ' y medios digitales, a través de nuestro'
			+ ' socio GTRES.',
	},
}

function getServiceSeoTitle(slug: string): string {
	return SERVICE_SEO[slug]?.title ?? 'Servicios'
}

export function generateMetadata({
	params,
}: {
	params: ServiceRouteParams
}): Metadata {
	const service = SERVICES.find(
		(item) => item.slug === params.slug,
	)
	if (!service) {
		return {
			robots: { index: false, follow: false },
		}
	}

	const seo = SERVICE_SEO[service.slug]
	if (!seo) {
		return {
			robots: { index: false, follow: false },
		}
	}

	return {
		title: seo.title,
		description: seo.description,
		alternates: {
			canonical: `/servicios/${service.slug}`,
		},
		openGraph: {
			title: `${seo.title} — Kometalab`,
			description: seo.description,
			url: `/servicios/${service.slug}`,
		},
		twitter: {
			title: `${seo.title} — Kometalab`,
			description: seo.description,
		},
	}
}

export default function ServiceDetailPage({
	params,
}: {
	params: ServiceRouteParams
}) {
	const service = SERVICES.find(
		(item) => item.slug === params.slug,
	)
	if (!service) notFound()

	const serviceTitle = getServiceSeoTitle(service.slug)
	const breadcrumbSchema = getBreadcrumbSchema({
		slug: service.slug,
		name: serviceTitle,
	})

	const schemaScript = (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(breadcrumbSchema),
			}}
		/>
	)

	if (service.slug === 'desarrollo-web') {
		return (
			<>
				{schemaScript}
				<WebDevPage />
			</>
		)
	}

	if (service.slug === 'produccion-audiovisual') {
		return (
			<>
				{schemaScript}
				<NoisegraphPage />
			</>
		)
	}

	if (service.slug === 'ia-aplicada') {
		return (
			<>
				{schemaScript}
				<IaPage />
			</>
		)
	}

	if (service.slug === 'gabinete-de-prensa') {
		return (
			<>
				{schemaScript}
				<PressPage />
			</>
		)
	}

	return (
		<>
			{schemaScript}
			<ServicePage
				title={service.title}
				introFirst={service.introFirst}
				introSecond={service.introSecond}
			/>
		</>
	)
}
