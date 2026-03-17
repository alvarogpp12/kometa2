import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { IMAGE_URLS } from '@/lib/cloudinary-media'
import { getSiteUrl } from '@/lib/seo'
import {
	escapeXml,
	formatW3cDate,
} from '@/lib/sitemap-utils'

interface ImageEntry {
	pagePath: string
	imageLoc: string
}

async function getSourceLastModified(input: {
	relativePath: string
}): Promise<string | undefined> {
	try {
		const filePath = join(process.cwd(), input.relativePath)
		const fileStat = await stat(filePath)
		return formatW3cDate(fileStat.mtime)
	} catch {
		return undefined
	}
}

function buildImageSitemapXml(input: {
	siteUrl: string
	images: ImageEntry[]
	lastmod?: string
}): string {
	const entriesByPage = new Map<string, string[]>()

	for (const image of input.images) {
		const pageUrl = `${input.siteUrl}${image.pagePath}`
		const current = entriesByPage.get(pageUrl) ?? []
		current.push(image.imageLoc)
		entriesByPage.set(pageUrl, current)
	}

	const urlNodes = Array.from(entriesByPage.entries())
		.map(([pageLoc, imageLocs]) => {
			const lastmodNode = input.lastmod
				? `<lastmod>${escapeXml(input.lastmod)}</lastmod>`
				: ''
			const imageNodes = imageLocs
				.map(
					(imageLoc) =>
						`<image:image><image:loc>${escapeXml(imageLoc)}</image:loc></image:image>`,
				)
				.join('')

			return [
				'<url>',
				`<loc>${escapeXml(pageLoc)}</loc>`,
				lastmodNode,
				imageNodes,
				'</url>',
			]
				.filter(Boolean)
				.join('')
		})
		.join('')

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
			+ 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
		urlNodes,
		'</urlset>',
	].join('')
}

export async function GET(): Promise<Response> {
	const siteUrl = getSiteUrl()
	const lastmod = await getSourceLastModified({
		relativePath: 'src/lib/cloudinary-media.ts',
	})

	const images: ImageEntry[] = [
		{
			pagePath: '/',
			imageLoc: `${siteUrl}/LOGO/LOGOKOMETA.svg`,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.vogueLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.rtveLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.marieClaireLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.holaLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.atresplayerLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.elDebateLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.semanaLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.mediasetLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.vanitatisLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.agenciaEfeLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.europaPressLogo,
		},
		{
			pagePath: '/servicios/gabinete-de-prensa',
			imageLoc: IMAGE_URLS.efeLogo,
		},
	]

	const xml = buildImageSitemapXml({
		siteUrl,
		images,
		lastmod,
	})

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
		},
	})
}
