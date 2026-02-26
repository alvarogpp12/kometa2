import { notFound } from 'next/navigation'

import ServicePage from '@/components/service-page'
import WebDevPage from '@/components/web-dev-page'
import NoisegraphPage from '@/components/noisegraph-page'
import IaPage from '@/components/ia-page'
import { SERVICES } from '@/lib/services'

interface ServiceRouteParams {
	slug: string
}

export function generateStaticParams() {
	return SERVICES.map((service) => ({ slug: service.slug }))
}

export default function ServiceDetailPage({
	params,
}: {
	params: ServiceRouteParams
}) {
	const service = SERVICES.find((item) => item.slug === params.slug)
	if (!service) notFound()

	if (service.slug === 'desarrollo-web') {
		return <WebDevPage />
	}

	if (service.slug === 'produccion-audiovisual') {
		return <NoisegraphPage />
	}

	if (service.slug === 'ia-aplicada') {
		return <IaPage />
	}

	return (
		<ServicePage
			title={service.title}
			introFirst={service.introFirst}
			introSecond={service.introSecond}
		/>
	)
}
