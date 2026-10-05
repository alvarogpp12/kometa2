import { NextRequest } from 'next/server'
import { leadSchema, processLead } from '@/lib/leads'

export async function POST(req: NextRequest) {
	let json: unknown
	try {
		json = await req.json()
	} catch {
		return Response.json(
			{ error: 'Datos inválidos' },
			{ status: 400 },
		)
	}

	const parsed = leadSchema.safeParse(json)
	if (!parsed.success) {
		return Response.json(
			{ error: 'Datos inválidos' },
			{ status: 400 },
		)
	}

	// Bots fill the honeypot; pretend success so they move on.
	if (parsed.data.website) {
		return Response.json({ ok: true })
	}

	const ok = await processLead(parsed.data)
	if (!ok) {
		return Response.json(
			{ error: 'Error guardando lead' },
			{ status: 500 },
		)
	}

	return Response.json({ ok: true })
}
