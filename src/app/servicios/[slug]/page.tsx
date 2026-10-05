import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ServicePage from '@/components/service-page'
import WebDevPage from '@/components/web-dev-page'
import NoisegraphPage from '@/components/noisegraph-page'
import BrandingPage from '@/components/branding-page'
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
	'gabinete-de-prensa': {
		title: 'Gabinete de Prensa en Madrid',
		description:
			'Prensa, televisión y medios digitales con nuestro'
			+ ' socio GTRES. Notas de prensa, convocatorias,'
			+ ' photocalls, ruedas de prensa y clipping.',
	},
	'produccion-audiovisual': {
		title: 'Productora Audiovisual en Madrid',
		description:
			'Spots, branded content, vídeo corporativo y vídeo'
			+ ' para redes sociales. Preproducción, rodaje y'
			+ ' postproducción con equipo propio.',
	},
	'branding-y-redes-sociales': {
		title: 'Branding y Redes Sociales en Madrid',
		description:
			'Naming, identidad corporativa, gestión de redes'
			+ ' sociales, community management y publicidad'
			+ ' en Meta y TikTok.',
	},
	'desarrollo-web': {
		title: 'Desarrollo Web en Madrid',
		description:
			'Webs corporativas a medida, tiendas online,'
			+ ' landing pages, portales B2B y CRM.'
			+ ' Diseño UX/UI, desarrollo y SEO.',
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

	if (service.slug === 'branding-y-redes-sociales') {
		return (
			<>
				{schemaScript}
				<BrandingPage />
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
