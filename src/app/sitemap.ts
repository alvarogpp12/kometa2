import type { MetadataRoute } from 'next'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { SERVICES } from '@/lib/services'
import { getSiteUrl } from '@/lib/seo'
import { formatW3cDate } from '@/lib/sitemap-utils'

interface RouteInput {
	path: string
	sourceFile: string
}

async function getFileLastModified(input: {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = getSiteUrl()
	const routeInputs: RouteInput[] = [
		{
			path: '/',
			sourceFile: 'src/app/page.tsx',
		},
		{
			path: '/servicios',
			sourceFile: 'src/app/servicios/page.tsx',
		},
		...SERVICES.map((service) => ({
			path: `/servicios/${service.slug}`,
			sourceFile: 'src/app/servicios/[slug]/page.tsx',
		})),
	]

	const routes = await Promise.all(
		routeInputs.map(async (route): Promise<MetadataRoute.Sitemap[number]> => {
			const lastModified = await getFileLastModified({
				relativePath: route.sourceFile,
			})

			return {
				url: `${siteUrl}${route.path}`,
				lastModified,
			}
		}),
	)

	return routes
}
