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
		slug: 'produccion-audiovisual',
		title: 'Produccion Audiovisual',
		previewVideo: VIDEO_URLS.adealfar,
		introFirst:
			'¿Coordinas freelancers para cada proyecto? ¿Pierdes tiempo gestionando proveedores?',
		introSecond:
			'Un solo equipo para toda tu comunicación: estrategia, producción y entrega. Para marcas que quieren eficiencia real y agencias que buscan un partner de confianza. Sede en Madrid, pero vamos donde estés.',
	},
	{
		slug: 'desarrollo-web',
		title: 'Desarrollo Web',
		previewVideo: VIDEO_URLS.desarrolloWeb,
		introFirst:
			'Diseñamos experiencias digitales que combinan estética y funcionalidad.',
		introSecond:
			'Webs a medida, orientadas a conversión y construidas como plataformas de crecimiento. Una web no es presencia. Es estructura.',
	},
	{
		slug: 'ia-aplicada',
		title: 'IA Aplicada',
		previewVideo: VIDEO_URLS.reel1,
		introFirst:
			'Integramos IA en procesos creativos y estratégicos con enfoque de negocio.',
		introSecond:
			'Automatización, optimización y escalabilidad sin perder identidad. La tecnología no sustituye la visión. La amplifica.',
	},
	{
		slug: 'gabinete-de-prensa',
		title: 'Gabinete de Prensa',
		previewVideo: VIDEO_URLS.video20260216,
		introFirst:
			'Activamos tu evento/marca en medios nacionales e internacionales.',
		introSecond:
			'Prensa escrita, televisión y medios digitales, a través de nuestro socio GTRES.',
	},
]
