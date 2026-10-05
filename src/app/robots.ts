import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

// Search and AI assistant crawlers, listed explicitly so the site stays
// open to them even if a host or CDN adds stricter defaults later.
const AI_CRAWLERS = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-SearchBot',
	'Claude-User',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Applebot-Extended',
	'Bingbot',
	'CCBot',
]

export default function robots(): MetadataRoute.Robots {
	const siteUrl = getSiteUrl()

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: '/api/',
			},
			{
				userAgent: AI_CRAWLERS,
				allow: '/',
				disallow: '/api/',
			},
		],
		sitemap: `${siteUrl}/sitemap-index.xml`,
	}
}
