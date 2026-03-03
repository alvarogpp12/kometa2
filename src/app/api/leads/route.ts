import { NextRequest } from 'next/server'
import { Client } from '@notionhq/client'
import { z } from 'zod'

const notion = new Client({
	auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_CRM_DATABASE_ID!

const leadSchema = z.object({
	name: z.string().min(1).max(200),
	email: z.string().email(),
	service: z.string().optional(),
	message: z.string().optional(),
})

export async function POST(req: NextRequest) {
	try {
		const json = await req.json()
		const parsed = leadSchema.safeParse(json)

		if (!parsed.success) {
			return Response.json(
				{ error: 'Datos inválidos' },
				{ status: 400 },
			)
		}

		const { name, email, service, message } = parsed.data

		await notion.pages.create({
			parent: { database_id: DATABASE_ID },
			properties: {
				Nombre: {
					title: [
						{
							text: { content: name },
						},
					],
				},
				Email: {
					email: email,
				},
				Estado: {
					status: { name: 'Lead' },
				},
				'Fecha de contacto': {
					date: {
						start: new Date().toISOString(),
					},
				},
				...(service
					? {
							Empresa: {
								rich_text: [
									{
										text: {
											content: service,
										},
									},
								],
							},
						}
					: {}),
			},
		})

		if (message) {
			console.log('[LEAD_MESSAGE]', {
				name,
				email,
				service,
				message,
				timestamp: new Date().toISOString(),
			})
		}

		return Response.json({ ok: true })
	} catch (err) {
		console.error('[LEAD_ERROR]', err)
		return Response.json(
			{ error: 'Error guardando lead' },
			{ status: 500 },
		)
	}
}
