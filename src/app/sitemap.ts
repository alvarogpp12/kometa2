import type { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/services'
import { getSiteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl()
	const now = new Date().toISOString()

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${siteUrl}/servicios`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.95,
		},
	]

	const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
		url: `${siteUrl}/servicios/${service.slug}`,
		lastModified: now,
		changeFrequency: 'weekly' as const,
		priority: 0.9,
	}))

	return [...staticRoutes, ...serviceRoutes]
}
