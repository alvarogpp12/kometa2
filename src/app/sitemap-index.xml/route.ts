import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { getSiteUrl } from '@/lib/seo'
import {
	buildSitemapIndexXml,
	formatW3cDate,
} from '@/lib/sitemap-utils'

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

export async function GET(): Promise<Response> {
	const siteUrl = getSiteUrl()
	const indexLastMod = await getSourceLastModified({
		relativePath: 'src/app/sitemap.ts',
	})

	const xml = buildSitemapIndexXml({
		sitemaps: [
			{
				loc: `${siteUrl}/sitemap.xml`,
				lastmod: indexLastMod,
			},
			{
				loc: `${siteUrl}/image-sitemap.xml`,
				lastmod: indexLastMod,
			},
			{
				loc: `${siteUrl}/video-sitemap.xml`,
				lastmod: indexLastMod,
			},
		],
	})

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
		},
	})
}
