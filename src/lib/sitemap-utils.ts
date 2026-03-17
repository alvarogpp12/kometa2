export interface XmlUrlEntry {
	loc: string
	lastmod?: string
}

export interface XmlSitemapEntry {
	loc: string
	lastmod?: string
}

export function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')
}

export function formatW3cDate(input: Date): string {
	return input.toISOString()
}

export function buildSitemapXml(input: {
	urls: XmlUrlEntry[]
	namespaces?: string[]
}): string {
	const namespaceList = [
		'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
		...(input.namespaces ?? []),
	].join(' ')

	const urls = input.urls
		.map((url) => {
			const lastmodTag = url.lastmod
				? `<lastmod>${escapeXml(url.lastmod)}</lastmod>`
				: ''

			return [
				'<url>',
				`<loc>${escapeXml(url.loc)}</loc>`,
				lastmodTag,
				'</url>',
			]
				.filter(Boolean)
				.join('')
		})
		.join('')

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		`<urlset ${namespaceList}>${urls}</urlset>`,
	].join('')
}

export function buildSitemapIndexXml(input: {
	sitemaps: XmlSitemapEntry[]
}): string {
	const sitemapNodes = input.sitemaps
		.map((sitemap) => {
			const lastmodTag = sitemap.lastmod
				? `<lastmod>${escapeXml(sitemap.lastmod)}</lastmod>`
				: ''

			return [
				'<sitemap>',
				`<loc>${escapeXml(sitemap.loc)}</loc>`,
				lastmodTag,
				'</sitemap>',
			]
				.filter(Boolean)
				.join('')
		})
		.join('')

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		sitemapNodes,
		'</sitemapindex>',
	].join('')
}

export function cloudinaryVideoThumbnail(input: {
	videoUrl: string
}): string {
	if (!input.videoUrl.includes('/video/upload/')) {
		return input.videoUrl
	}

	const withFrame = input.videoUrl.replace(
		'/video/upload/',
		'/video/upload/so_1/',
	)

	return withFrame.replace(/\.(mp4|mov|webm)$/i, '.jpg')
}
