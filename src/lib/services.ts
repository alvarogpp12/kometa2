import { VIDEO_URLS } from '@/lib/cloudinary-media'

export interface ServiceContent {
	slug: string
	title: string
	introFirst: string
	introSecond: string
	previewVideo: string
}

export const SERVICES: ServiceContent[] = [
	{
		slug: 'gabinete-de-prensa',
		title: 'Gabinete de Prensa',
		previewVideo: VIDEO_URLS.video20260216,
		introFirst:
			'Prensa, televisión y medios digitales, con nuestro socio GTRES.',
		introSecond:
			'Notas de prensa, convocatorias, relación con medios, photocalls, ruedas de prensa y clipping.',
	},
	{
		slug: 'produccion-audiovisual',
		title: 'Producción Audiovisual',
		previewVideo: VIDEO_URLS.adealfar,
		introFirst:
			'Spots, branded content, vídeo corporativo y vídeo para redes sociales.',
		introSecond:
			'Preproducción, rodaje y postproducción con equipo propio.',
	},
	{
		slug: 'branding-y-redes-sociales',
		title: 'Branding y Redes Sociales',
		previewVideo: VIDEO_URLS.reel1,
		introFirst:
			'Naming, identidad corporativa y gestión de redes sociales.',
		introSecond:
			'Calendario editorial, community management y publicidad en Meta y TikTok.',
	},
	{
		slug: 'desarrollo-web',
		title: 'Desarrollo Web',
		previewVideo: VIDEO_URLS.desarrolloWeb,
		introFirst:
			'Webs corporativas, tiendas online, landing pages, portales B2B y CRM.',
		introSecond:
			'Diseño UX/UI, desarrollo y SEO. Automatización de procesos y chatbots con IA.',
	},
]
