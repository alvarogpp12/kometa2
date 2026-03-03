import { NextRequest } from 'next/server'
import { Client } from '@notionhq/client'
import { z } from 'zod'

const notion = new Client({
	auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_CRM_DATABASE_ID!

const meetingSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	service: z.string().optional(),
	meeting: z.string().min(1),
})

export async function POST(req: NextRequest) {
	try {
		const json = await req.json()
		const parsed = meetingSchema.safeParse(json)

		if (!parsed.success) {
			return Response.json(
				{ error: 'Datos inválidos' },
				{ status: 400 },
			)
		}

		const { name, email, service, meeting } = parsed.data

		const results = await notion.databases.query({
			database_id: DATABASE_ID,
			filter: {
				property: 'Email',
				email: { equals: email },
			},
			page_size: 1,
		})

		if (results.results.length > 0) {
			const pageId = results.results[0].id
			await notion.pages.update({
				page_id: pageId,
				properties: {
					Estado: {
						status: { name: 'Contacted' },
					},
					Empresa: {
						rich_text: [
							{
								text: {
									content:
										`Reunión: ${meeting}`
										+ (service
											? ` | ${service}`
											: ''),
								},
							},
						],
					},
				},
			})
		} else {
			await notion.pages.create({
				parent: { database_id: DATABASE_ID },
				properties: {
					Nombre: {
						title: [
							{ text: { content: name } },
						],
					},
					Email: { email },
					Estado: {
						status: { name: 'Contacted' },
					},
					'Fecha de contacto': {
						date: {
							start:
								new Date().toISOString(),
						},
					},
					Empresa: {
						rich_text: [
							{
								text: {
									content:
										`Reunión: ${meeting}`
										+ (service
											? ` | ${service}`
											: ''),
								},
							},
						],
					},
				},
			})
		}

		console.log('[MEETING]', {
			name,
			email,
			meeting,
			service,
			timestamp: new Date().toISOString(),
		})

		return Response.json({ ok: true })
	} catch (err) {
		console.error('[MEETING_ERROR]', err)
		return Response.json(
			{ error: 'Error guardando reunión' },
			{ status: 500 },
		)
	}
}
