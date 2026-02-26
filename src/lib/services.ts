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
		previewVideo: '/videos/REEL 12.mp4',
		introFirst:
			'¿Coordinas freelancers para cada proyecto? ¿Pierdes tiempo gestionando proveedores?',
		introSecond:
			'Un solo equipo para toda tu comunicación: estrategia, producción y entrega. Para marcas que quieren eficiencia real y agencias que buscan un partner de confianza. Sede en Madrid, pero vamos donde estés.',
	},
	{
		slug: 'desarrollo-web',
		title: 'Desarrollo Web',
		previewVideo: '/videos/DESAROOLLOWEBDEFINITIVO2.mov',
		introFirst:
			'Diseñamos experiencias digitales que combinan estética y funcionalidad.',
		introSecond:
			'Webs a medida, orientadas a conversión y construidas como plataformas de crecimiento. Una web no es presencia. Es estructura.',
	},
	{
		slug: 'ia-aplicada',
		title: 'IA Aplicada',
		previewVideo: '/videos/REEL 1.mp4',
		introFirst:
			'Integramos IA en procesos creativos y estratégicos con enfoque de negocio.',
		introSecond:
			'Automatización, optimización y escalabilidad sin perder identidad. La tecnología no sustituye la visión. La amplifica.',
	},
	{
		slug: 'gestion-rrss',
		title: 'Gestion RRSS',
		previewVideo: '/videos/showreel.mp4',
		introFirst:
			'Construimos presencia coherente en canales sociales, con dirección creativa clara.',
		introSecond:
			'Estrategia editorial, producción visual y ejecución alineadas con el posicionamiento de marca.',
	},
	{
		slug: 'studio',
		title: 'Studio',
		previewVideo: '/videos/showreel.mp4',
		introFirst:
			'Espacio y dirección para producciones de contenido e imagen de alto nivel.',
		introSecond:
			'Un entorno de producción flexible para piezas audiovisuales profesionales, desde la idea hasta la entrega.',
	},
	{
		slug: 'gabinete-de-prensa',
		title: 'Gabinete de Prensa',
		previewVideo: '/videos/showreel.mp4',
		introFirst:
			'Activamos presencia en medios convencionales con estrategia y criterio editorial.',
		introSecond:
			'Relación con periodistas, visibilidad y construcción de reputación pública. La autoridad no solo se construye online.',
	},
]
