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

function getServiceSeoTitle(slug: string): string {
	switch (slug) {
		case 'produccion-audiovisual':
			return 'Producción Audiovisual'
		case 'desarrollo-web':
			return 'Desarrollo Web'
		case 'ia-aplicada':
			return 'IA Aplicada'
		case 'gabinete-de-prensa':
			return 'Gabinete de Prensa'
		default:
			return 'Servicios'
	}
}

export function generateMetadata({
	params,
}: {
	params: ServiceRouteParams
}): Metadata {
	const service = SERVICES.find((item) => item.slug === params.slug)
	if (!service) {
		return {
			robots: {
				index: false,
				follow: false,
			},
		}
	}

	const serviceTitle = getServiceSeoTitle(service.slug)
	const description = `${service.introFirst} ${service.introSecond}`.slice(
		0,
		155,
	)

	return {
		title: `${serviceTitle} en Madrid`,
		description,
		alternates: {
			canonical: `/servicios/${service.slug}`,
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
