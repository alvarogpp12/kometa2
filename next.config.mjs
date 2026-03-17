/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value:
							'camera=(), microphone=(), geolocation=()',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload',
					},
				],
			},
			{
				source:
					'/(.*)\\.(js|css|woff2|woff|ttf|otf|ico|svg|png|jpg|webp)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/sitemap.xml',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, s-maxage=3600',
					},
				],
			},
			{
				source: '/sitemap-index.xml',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, s-maxage=3600',
					},
				],
			},
			{
				source: '/image-sitemap.xml',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, s-maxage=3600',
					},
				],
			},
			{
				source: '/video-sitemap.xml',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, s-maxage=3600',
					},
				],
			},
			{
				source: '/robots.txt',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=86400, s-maxage=86400',
					},
				],
			},
		]
	},
}

export default nextConfig
