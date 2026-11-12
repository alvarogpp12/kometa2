import { PLAN_HTML } from './plan-html'
import { PRIVATE_HEADERS, rejectUnauthorized } from './auth'
import { DB_SHIM } from './db-shim'

export const dynamic = 'force-dynamic'

// The plan was built as a Claude artifact and reads its data through
// window.claude.use('db'). The shim provides that same interface backed
// by /produccion/api, so the original page runs unchanged.
const PAGE = PLAN_HTML.replace('<script>', `<script>${DB_SHIM}</script>\n<script>`)

export function GET(req: Request) {
	const rejection = rejectUnauthorized(req)
	if (rejection) return rejection

	return new Response(PAGE, {
		headers: {
			...PRIVATE_HEADERS,
			'Content-Type': 'text/html; charset=utf-8',
		},
	})
}
