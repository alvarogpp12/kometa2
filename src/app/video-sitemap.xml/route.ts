import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { SERVICES } from '@/lib/services'
import { getSiteUrl } from '@/lib/seo'
import {
	cloudinaryVideoThumbnail,
	escapeXml,
	formatW3cDate,
} from '@/lib/sitemap-utils'

interface VideoSitemapItem {
	pagePath: string
	videoTitle: string
	videoDescription: string
	contentLoc: string
	thumbnailLoc: string
	publicationDate?: string
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

function buildVideoSitemapXml(input: {
	siteUrl: string
	items: VideoSitemapItem[]
}): string {
	const urlNodes = input.items
		.map((item) => {
			const publicationDateNode = item.publicationDate
				? `<video:publication_date>${escapeXml(item.publicationDate)}</video:publication_date>`
				: ''

			return [
				'<url>',
				`<loc>${escapeXml(`${input.siteUrl}${item.pagePath}`)}</loc>`,
				'<video:video>',
				`<video:thumbnail_loc>${escapeXml(item.thumbnailLoc)}</video:thumbnail_loc>`,
				`<video:title>${escapeXml(item.videoTitle)}</video:title>`,
				`<video:description>${escapeXml(item.videoDescription)}</video:description>`,
				`<video:content_loc>${escapeXml(item.contentLoc)}</video:content_loc>`,
				publicationDateNode,
				'<video:family_friendly>yes</video:family_friendly>',
				'<video:live>no</video:live>',
				'</video:video>',
				'</url>',
			]
				.filter(Boolean)
				.join('')
		})
		.join('')

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
			+ 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
		urlNodes,
		'</urlset>',
	].join('')
}

export async function GET(): Promise<Response> {
	const siteUrl = getSiteUrl()
	const publicationDate = await getSourceLastModified({
		relativePath: 'src/lib/services.ts',
	})

	const videoItems: VideoSitemapItem[] = SERVICES.map((service) => ({
		pagePath: `/servicios/${service.slug}`,
		videoTitle: `${service.title} | Kometalab`,
		videoDescription: `${service.introFirst} ${service.introSecond}`.slice(
			0,
			2048,
		),
		contentLoc: service.previewVideo,
		thumbnailLoc: cloudinaryVideoThumbnail({
			videoUrl: service.previewVideo,
		}),
		publicationDate,
	}))

	const xml = buildVideoSitemapXml({
		siteUrl,
		items: videoItems,
	})

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
		},
	})
}
