interface OrganizationSchema {
	'@context': 'https://schema.org'
	'@type': 'Organization'
	'@id': string
	name: string
	url: string
	logo: string
	sameAs: string[]
}

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

interface ProfessionalServiceSchema {
	'@context': 'https://schema.org'
	'@type': 'ProfessionalService'
	'@id': string
	name: string
	url: string
	areaServed: string
	serviceType: string[]
	address: {
		'@type': 'PostalAddress'
		addressLocality: string
		addressCountry: string
	}
	provider: {
		'@id': string
	}
}

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

export function getOrganizationSchema(): OrganizationSchema {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${siteUrl}/#organization`,
		name: 'Kometalab',
		url: siteUrl,
		logo: `${siteUrl}/LOGO/LOGOKOMETA.svg`,
		sameAs: [],
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

export function getProfessionalServiceSchema(): ProfessionalServiceSchema {
	const siteUrl = getSiteUrl()
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		'@id': `${siteUrl}/#service`,
		name: 'Kometalab',
		url: siteUrl,
		areaServed: 'ES',
		serviceType: [
			'Producción audiovisual',
			'Desarrollo web',
			'IA aplicada',
			'Gabinete de prensa',
			'Estrategia digital',
		],
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Madrid',
			addressCountry: 'ES',
		},
		provider: {
			'@id': `${siteUrl}/#organization`,
		},
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
