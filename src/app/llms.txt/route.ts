import { getSiteUrl } from '@/lib/seo'
import { SERVICES } from '@/lib/services'

export async function GET(): Promise<Response> {
	const siteUrl = getSiteUrl()

	const lines = [
		'# Kometalab',
		'',
		'> Transformamos tus ideas en proyectos reales.',
		'> Estrategia, producción, tecnología y presencia.',
		'',
		'## Servicios',
		'',
		...SERVICES.map(
			(service) =>
				`- [${service.title}](${siteUrl}/servicios/${service.slug}): ${service.introFirst} ${service.introSecond}`,
		),
		'',
		'## Contacto',
		'',
		`- Web: ${siteUrl}`,
		'- Email: comunicacion@kometa.tv',
		'- Ubicación: Madrid, España',
		'',
	]

	return new Response(lines.join('\n'), {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=86400, s-maxage=86400',
		},
	})
}
