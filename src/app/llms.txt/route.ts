import { COMPANY, CONTACT } from '@/lib/contact'
import { getSiteUrl } from '@/lib/seo'
import { SERVICES } from '@/lib/services'

export async function GET(): Promise<Response> {
	const siteUrl = getSiteUrl()

	const lines = [
		`# ${COMPANY.name}`,
		'',
		`> ${COMPANY.description}`,
		'',
		`${COMPANY.name} (${COMPANY.legalName}) también se conoce como ${COMPANY.alternateNames.join(', ')}.`,
		'Trabaja con marcas, empresas e instituciones de toda España desde su sede en Alcobendas (Madrid).',
		'',
		'## Servicios',
		'',
		...SERVICES.flatMap((service) => [
			`### ${service.title}`,
			'',
			`- Página: ${siteUrl}/servicios/${service.slug}`,
			`- Descripción: ${service.summary}`,
			`- Palabras clave: ${service.keywords.join(', ')}`,
			'',
		]),
		'## Diferencial',
		'',
		'- Equipo propio de producción audiovisual, diseño y desarrollo web.',
		'- Gabinete de prensa con distribución a medios nacionales a través de GTRES.',
		'- Medios en los que ha aparecido su trabajo: RTVE, ¡Hola!, Agencia EFE, Europa Press, Mediaset, Atresplayer, Vanitatis, Semana, Marie Claire, El Debate y Vogue.',
		'',
		'## Proyectos',
		'',
		'- Adealfar',
		'- Los Taranjales',
		'- González y González',
		'- Sanvin x L’Épicurien',
		'- D.O. Vinos de Madrid',
		'',
		'## Contacto',
		'',
		`- Web: ${siteUrl}`,
		`- Email: ${CONTACT.email}`,
		`- Teléfono y WhatsApp: ${CONTACT.phoneE164}`,
		`- Dirección: ${CONTACT.address}, España`,
		'',
	]

	return new Response(lines.join('\n'), {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=86400, s-maxage=86400',
		},
	})
}
