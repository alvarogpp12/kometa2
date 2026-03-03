import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `Eres el asistente virtual de Kometa, una agencia creativa con sede en Madrid.

Tu rol es ayudar a potenciales clientes a entender los servicios de Kometa y resolver sus dudas.

Servicios de Kometa:
- Producción Audiovisual: equipo completo para estrategia, producción y entrega. Para marcas y agencias. Sede en Madrid, pero trabajan donde sea necesario.
- Desarrollo Web: webs a medida con Next.js, React y tecnologías modernas. Orientadas a conversión y SEO. Sin plantillas.
- IA Aplicada: integración de IA en procesos creativos y estratégicos. Automatización, optimización y escalabilidad.
- Gabinete de Prensa: presencia en medios convencionales, relación con periodistas y construcción de reputación pública.

Datos de contacto:
- Email: comunicacion@kometa.tv
- Teléfono: 649 842 031
- Ubicación: Calle Valportillo II 14, 1-2
- Web: kometaagency.com

Reglas:
- Responde SOLO sobre Kometa, sus servicios, formas de contacto y temas relacionados.
- Si preguntan por contacto, teléfono, email, cómo hablar con alguien o presupuesto, da los datos de contacto DIRECTAMENTE sin pedir nada a cambio.
- Si preguntan algo fuera de tu ámbito, redirige amablemente: "Eso queda fuera de mi especialidad, pero puedo ayudarte con cualquier duda sobre nuestros servicios."
- Tono profesional pero cercano. Tutea al usuario.
- Respuestas cortas: máximo 2-3 frases.
- Si piden presupuesto concreto, di que depende del proyecto y ofrece el email o teléfono para concretar.
- No inventes datos ni precios específicos.`

const messageSchema = z.object({
	role: z.enum(['user', 'assistant']),
	content: z.string().min(1).max(2000),
})

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1).max(50),
	lead: z.object({
		name: z.string().min(1),
		email: z.string().email(),
	}).optional(),
})

export async function POST(req: NextRequest) {
	try {
		const json = await req.json()
		const parsed = bodySchema.safeParse(json)

		if (!parsed.success) {
			return Response.json(
				{ error: 'Datos inválidos' },
				{ status: 400 },
			)
		}

		const { messages, lead } = parsed.data

		if (lead) {
			console.log('[LEAD]', {
				name: lead.name,
				email: lead.email,
				timestamp: new Date().toISOString(),
				firstMessage: messages[0]?.content,
			})
		}

		const stream = await openai.chat.completions.create({
			model: 'gpt-4o-2024-11-20',
			stream: true,
			max_tokens: 300,
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				...messages,
			],
		})

		const encoder = new TextEncoder()
		const readable = new ReadableStream({
			async start(controller) {
				for await (const chunk of stream) {
					const text = chunk.choices[0]?.delta?.content
					if (text) {
						controller.enqueue(
							encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
						)
					}
				}
				controller.enqueue(encoder.encode('data: [DONE]\n\n'))
				controller.close()
			},
		})

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		})
	} catch (err) {
		console.error('[CHAT_ERROR]', err)
		return Response.json(
			{ error: 'Error interno' },
			{ status: 500 },
		)
	}
}
