import { COMPANY, CONTACT } from '@/lib/contact'
import { SERVICES } from '@/lib/services'

type OrganizationSchema = Record<string, unknown>

interface WebSiteSchema {
	'@context': 'https://schema.org'
	'@type': 'WebSite'
	'@id': string
	url: string
	name: string
	inLanguage: string
	publisher: {
		'@id': string
	}
}

type ProfessionalServiceSchema = Record<string, unknown>

interface BreadcrumbSchema {
	'@context': 'https://schema.org'
	'@type': 'BreadcrumbList'
	'@id': string
	itemListElement: Array<{
		'@type': 'ListItem'
		position: number
		name: string
		item: string
	}>
}

export function getSiteUrl(): string {
	const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
	if (fromEnv && fromEnv.startsWith('http')) {
		return fromEnv.replace(/\/$/, '')
	}
	return 'https://kometacom.com'
}

function getPostalAddress() {
	return {
		'@type': 'PostalAddress',
		streetAddress: CONTACT.streetAddress,
		postalCode: CONTACT.postalCode,
		addressLocality: CONTACT.locality,
		addressRegion: CONTACT.region,
		addressCountry: 'ES',
	}
}

export function getOrganizationSchema(): OrganizationSchema {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${siteUrl}/#organization`,
		name: COMPANY.name,
		legalName: COMPANY.legalName,
		alternateName: COMPANY.alternateNames,
		description: COMPANY.description,
		url: siteUrl,
		logo: `${siteUrl}/LOGO/LOGOKOMETA.svg`,
		image: `${siteUrl}/og-image.png`,
		email: CONTACT.email,
		telephone: CONTACT.phoneE164,
		address: getPostalAddress(),
		areaServed: { '@type': 'Country', name: 'España' },
		knowsAbout: SERVICES.flatMap((service) => service.keywords),
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'sales',
			telephone: CONTACT.phoneE164,
			email: CONTACT.email,
			availableLanguage: ['es', 'en'],
			areaServed: 'ES',
		},
		...(COMPANY.sameAs.length > 0 ? { sameAs: COMPANY.sameAs } : {}),
	}
}

export function getWebSiteSchema(): WebSiteSchema {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${siteUrl}/#website`,
		url: siteUrl,
		name: 'Kometalab',
		inLanguage: 'es',
		publisher: {
			'@id': `${siteUrl}/#organization`,
		},
	}
}

export function getServiceSchema(
	service: (typeof SERVICES)[number],
): Record<string, unknown> {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': `${siteUrl}/servicios/${service.slug}#service`,
		name: service.title,
		serviceType: service.keywords[0],
		description: service.summary,
		url: `${siteUrl}/servicios/${service.slug}`,
		keywords: service.keywords.join(', '),
		provider: { '@id': `${siteUrl}/#localbusiness` },
		areaServed: [
			{ '@type': 'City', name: 'Madrid' },
			{ '@type': 'Country', name: 'España' },
		],
	}
}

export function getProfessionalServiceSchema(): ProfessionalServiceSchema {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		'@id': `${siteUrl}/#localbusiness`,
		name: COMPANY.name,
		description: COMPANY.description,
		url: siteUrl,
		image: `${siteUrl}/og-image.png`,
		logo: `${siteUrl}/LOGO/LOGOKOMETA.svg`,
		email: CONTACT.email,
		telephone: CONTACT.phoneE164,
		address: getPostalAddress(),
		areaServed: [
			{ '@type': 'City', name: 'Madrid' },
			{ '@type': 'Country', name: 'España' },
		],
		knowsAbout: SERVICES.flatMap((service) => service.keywords),
		parentOrganization: { '@id': `${siteUrl}/#organization` },
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Servicios de Kometalab',
			itemListElement: SERVICES.map((service) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					'@id': `${siteUrl}/servicios/${service.slug}#service`,
					name: service.title,
					description: service.summary,
					url: `${siteUrl}/servicios/${service.slug}`,
				},
			})),
		},
		...(COMPANY.sameAs.length > 0 ? { sameAs: COMPANY.sameAs } : {}),
	}
}

export function getBreadcrumbSchema(input: {
	slug: string
	name: string
}): BreadcrumbSchema {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'@id': `${siteUrl}/servicios/${input.slug}#breadcrumb`,
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Inicio',
				item: `${siteUrl}/`,
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Servicios',
				item: `${siteUrl}/servicios`,
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: input.name,
				item: `${siteUrl}/servicios/${input.slug}`,
			},
		],
	}
}
