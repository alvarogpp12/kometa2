import { BlobPreconditionFailedError, get, put } from '@vercel/blob'
import { PRIVATE_HEADERS, rejectUnauthorized } from '../auth'

export const dynamic = 'force-dynamic'

const BLOB_PATH = 'produccion/paquirri-plan.json'
const COLLECTIONS = ['invitados', 'mesas', 'escenarios', 'estado'] as const
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/
const MAX_BODY = 512 * 1024

type Collection = (typeof COLLECTIONS)[number]
type Doc = Record<string, unknown>
type State = Record<Collection, Record<string, Doc>>
type Op =
	| { op: 'set' | 'update'; path: string; data: Doc }
	| { op: 'delete'; path: string }

function emptyState(): State {
	return { invitados: {}, mesas: {}, escenarios: {}, estado: {} }
}

function isPlainObject(value: unknown): value is Doc {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge(target: Doc, patch: Doc): Doc {
	const out: Doc = { ...target }
	for (const [key, value] of Object.entries(patch)) {
		out[key] = isPlainObject(value) && isPlainObject(out[key])
			? deepMerge(out[key] as Doc, value)
			: value
	}
	return out
}

function parsePath(path: unknown): [Collection, string] | null {
	if (typeof path !== 'string') return null
	const [col, id, extra] = path.split('/')
	if (extra !== undefined) return null
	if (!COLLECTIONS.includes(col as Collection) || !ID_RE.test(id ?? '')) {
		return null
	}
	return [col as Collection, id]
}

async function readState(): Promise<{ state: State; etag?: string }> {
	const result = await get(BLOB_PATH, { access: 'private', useCache: false, ...blobAuth() })
	if (!result) return { state: emptyState() }
	const text = await new Response(result.stream).text()
	const parsed = JSON.parse(text) as Partial<State>
	return {
		state: { ...emptyState(), ...parsed },
		etag: result.blob.etag,
	}
}

function json(data: unknown, status = 200) {
	return Response.json(data, { status, headers: PRIVATE_HEADERS })
}

// Vercel connects a Blob store either with a read-write token or, on
// newer stores, with OIDC plus a store id. Custom env prefixes are
// supported by looking for the matching suffix.
function findEnv(suffix: string, valuePrefix: string): string | undefined {
	const exact = process.env[`BLOB${suffix}`]
	if (exact) return exact
	return Object.entries(process.env).find(
		([key, value]) => key.endsWith(suffix) && value?.startsWith(valuePrefix),
	)?.[1]
}

function blobAuth(): { token: string } | { storeId: string } | null {
	const token = findEnv('_READ_WRITE_TOKEN', 'vercel_blob_rw_')
	if (token) return { token }
	const storeId = findEnv('_STORE_ID', 'store_')
	if (storeId) return { storeId }
	return null
}

function storageMissing() {
	if (blobAuth()) return null
	// Names only, never values, to help diagnose the store connection.
	const seen = Object.keys(process.env).filter((key) => /BLOB|STORE/.test(key))
	return json({ error: 'Almacenamiento no configurado', variables: seen }, 503)
}

export async function GET(req: Request) {
	const rejection = rejectUnauthorized(req)
	if (rejection) return rejection
	const missing = storageMissing()
	if (missing) return missing

	const { state } = await readState()
	return json(state)
}

export async function POST(req: Request) {
	const rejection = rejectUnauthorized(req)
	if (rejection) return rejection
	const missing = storageMissing()
	if (missing) return missing

	const raw = await req.text()
	if (raw.length > MAX_BODY) return json({ error: 'Demasiado grande' }, 413)

	let ops: Op[]
	try {
		const body = JSON.parse(raw) as { ops?: unknown }
		if (!Array.isArray(body.ops) || body.ops.length === 0) throw new Error()
		ops = body.ops as Op[]
		for (const op of ops) {
			if (!parsePath(op.path)) throw new Error()
			if (op.op === 'delete') continue
			if ((op.op !== 'set' && op.op !== 'update') || !isPlainObject(op.data)) {
				throw new Error()
			}
		}
	} catch {
		return json({ error: 'Datos inválidos' }, 400)
	}

	// Read, apply and write back conditionally on the ETag we read, so two
	// people saving at the same time never overwrite each other.
	for (let attempt = 0; attempt < 5; attempt++) {
		const { state, etag } = await readState()
		for (const op of ops) {
			const [col, id] = parsePath(op.path)!
			if (op.op === 'delete') delete state[col][id]
			else if (op.op === 'set') state[col][id] = op.data
			else state[col][id] = deepMerge(state[col][id] ?? {}, op.data)
		}

		try {
			await put(BLOB_PATH, JSON.stringify(state), {
				access: 'private',
				contentType: 'application/json',
				addRandomSuffix: false,
				allowOverwrite: true,
				cacheControlMaxAge: 60,
				...blobAuth(),
				...(etag ? { ifMatch: etag } : {}),
			})
			return json(state)
		} catch (err) {
			if (err instanceof BlobPreconditionFailedError) continue
			console.error('[PRODUCCION_SAVE_ERROR]', err)
			return json({ error: 'No se ha podido guardar' }, 500)
		}
	}

	return json({ error: 'Conflicto al guardar, inténtalo de nuevo' }, 409)
}
