import { createHash, timingSafeEqual } from 'node:crypto'

const REALM = 'Kometa produccion'

export const PRIVATE_HEADERS = {
	'Cache-Control': 'private, no-store',
	'X-Robots-Tag': 'noindex, nofollow',
}

function digest(value: string): Buffer {
	return createHash('sha256').update(value).digest()
}

/**
 * HTTP Basic auth for everything under /produccion. Any username is
 * accepted; only the password is checked. Returns a response to send
 * back when the request is not allowed, or null when it is.
 */
export function rejectUnauthorized(req: Request): Response | null {
	const password = process.env.PRODUCCION_PASSWORD
	// The repository is public, so the password lives only in the
	// environment. Without it the page stays closed.
	if (!password) {
		return new Response('Página no configurada.', {
			status: 503,
			headers: PRIVATE_HEADERS,
		})
	}

	const header = req.headers.get('authorization')
	if (header?.startsWith('Basic ')) {
		const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
		const given = decoded.slice(decoded.indexOf(':') + 1)
		if (timingSafeEqual(digest(given), digest(password))) return null
	}

	return new Response('Contraseña necesaria.', {
		status: 401,
		headers: {
			...PRIVATE_HEADERS,
			'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
		},
	})
}
