import { createHash, timingSafeEqual } from 'node:crypto'
import { PLAN_HTML } from './plan-html'

export const dynamic = 'force-dynamic'

const REALM = 'Kometa produccion'

function digest(value: string): Buffer {
	return createHash('sha256').update(value).digest()
}

function isAuthorized(header: string | null, password: string): boolean {
	if (!header?.startsWith('Basic ')) return false
	const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
	// Any username is accepted; only the password is checked.
	const given = decoded.slice(decoded.indexOf(':') + 1)
	return timingSafeEqual(digest(given), digest(password))
}

const PRIVATE_HEADERS = {
	'Cache-Control': 'private, no-store',
	'X-Robots-Tag': 'noindex, nofollow',
}

export function GET(req: Request) {
	const password = process.env.PRODUCCION_PASSWORD
	// The repository is public, so the password lives only in the
	// environment. Without it the page stays closed.
	if (!password) {
		return new Response('Página no configurada.', {
			status: 503,
			headers: PRIVATE_HEADERS,
		})
	}

	if (!isAuthorized(req.headers.get('authorization'), password)) {
		return new Response('Contraseña necesaria.', {
			status: 401,
			headers: {
				...PRIVATE_HEADERS,
				'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
			},
		})
	}

	return new Response(PLAN_HTML, {
		headers: {
			...PRIVATE_HEADERS,
			'Content-Type': 'text/html; charset=utf-8',
		},
	})
}
