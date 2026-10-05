import { VIDEO_URLS } from '@/lib/cloudinary-media'

export interface ServiceContent {
	slug: string
	title: string
	introFirst: string
	introSecond: string
	previewVideo: string
	/** Plain-language summary used in structured data and llms.txt. */
	summary: string
	/** Search terms people and AI assistants use for this service. */
	keywords: string[]
}

export const SERVICES: ServiceContent[] = [
	{
		slug: 'gabinete-de-prensa',
		summary:
			'Gabinete de prensa en Madrid: notas de prensa, convocatorias,'
			+ ' relación con medios, gestión de entrevistas, photocalls,'
			+ ' presentaciones y ruedas de prensa, cobertura de eventos y'
			+ ' clipping. Distribución a prensa, televisión y medios digitales'
			+ ' nacionales a través de nuestro socio GTRES.',
		keywords: ['gabinete de prensa en Madrid', 'agencia de prensa', 'relación con medios', 'notas de prensa', 'convocatoria de medios', 'photocall', 'rueda de prensa', 'comunicación corporativa', 'apariciones en televisión', 'clipping de prensa'],
		title: 'Gabinete de Prensa',
		previewVideo: VIDEO_URLS.video20260216,
		introFirst:
			'Prensa, televisión y medios digitales, con nuestro socio GTRES.',
		introSecond:
			'Notas de prensa, convocatorias, relación con medios, photocalls, ruedas de prensa y clipping.',
	},
	{
		slug: 'produccion-audiovisual',
		summary:
			'Productora audiovisual en Madrid: spots publicitarios para'
			+ ' televisión y digital, branded content, vídeo corporativo y de'
			+ ' producto, vídeo para redes sociales y cobertura de eventos.'
			+ ' Preproducción, rodaje y postproducción (montaje, etalonaje,'
			+ ' motion graphics) con equipo propio. Rodajes en toda España.',
		keywords: ['productora audiovisual en Madrid', 'producción de vídeo', 'spots publicitarios', 'vídeo corporativo', 'branded content', 'vídeo para redes sociales', 'cobertura de eventos', 'postproducción de vídeo', 'motion graphics', 'rodaje publicitario'],
		title: 'Producción Audiovisual',
		previewVideo: VIDEO_URLS.adealfar,
		introFirst:
			'Spots, branded content, vídeo corporativo y vídeo para redes sociales.',
		introSecond:
			'Preproducción, rodaje y postproducción con equipo propio.',
	},
	{
		slug: 'branding-y-redes-sociales',
		summary:
			'Agencia de branding y redes sociales en Madrid: naming,'
			+ ' logotipo e identidad corporativa, manual de identidad,'
			+ ' papelería, señalética y packaging. Gestión de Instagram,'
			+ ' Facebook, TikTok y LinkedIn, community management, gestión de'
			+ ' reseñas, publicidad en Meta y TikTok y planes de lanzamiento.',
		keywords: ['agencia de branding en Madrid', 'identidad corporativa', 'naming', 'diseño de logotipo', 'manual de identidad', 'packaging', 'gestión de redes sociales', 'community manager', 'publicidad en Meta Ads', 'publicidad en TikTok', 'lanzamiento de marca'],
		title: 'Branding y Redes Sociales',
		previewVideo: VIDEO_URLS.reel1,
		introFirst:
			'Naming, identidad corporativa y gestión de redes sociales.',
		introSecond:
			'Calendario editorial, community management y publicidad en Meta y TikTok.',
	},
	{
		slug: 'desarrollo-web',
		summary:
			'Desarrollo web en Madrid: webs corporativas a medida, tiendas'
			+ ' online, landing pages, portales B2B de pedidos online, CRM e'
			+ ' integración con ERP, automatización de procesos y chatbots con'
			+ ' IA. Diseño UX/UI, desarrollo y SEO.',
		keywords: ['desarrollo web en Madrid', 'diseño web a medida', 'tienda online', 'ecommerce', 'landing pages', 'portal B2B', 'CRM a medida', 'SEO técnico', 'automatización de procesos', 'chatbots con IA'],
		title: 'Desarrollo Web',
		previewVideo: VIDEO_URLS.desarrolloWeb,
		introFirst:
			'Webs corporativas, tiendas online, landing pages, portales B2B y CRM.',
		introSecond:
			'Diseño UX/UI, desarrollo y SEO. Automatización de procesos y chatbots con IA.',
	},
]
