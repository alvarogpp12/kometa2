import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `Eres Kevin, el asistente virtual de Kometalab, una agencia creativa en Madrid. Tu nombre es Kevin.

Servicios de Kometalab:
- Producción Audiovisual: estrategia, producción y entrega para marcas y agencias. Sede en Madrid, nos desplazamos donde sea.
- Desarrollo Web: webs a medida con Next.js, React, orientadas a conversión y SEO. Sin plantillas.
- IA Aplicada: automatización, optimización y escalabilidad con inteligencia artificial.
- Gabinete de Prensa: presencia en medios, relación con periodistas, reputación pública.

Contacto:
- Email: comunicacion@kometa.tv
- Teléfono: 649 842 031
- Dirección: Calle Valportillo II 14, 1-2

REGLAS IMPORTANTES:
- Responde SOLO sobre Kometalab y sus servicios.
- Tono profesional pero cercano. Tutea al usuario.
- Respuestas cortas: máximo 2-3 frases.
- No inventes datos ni precios.
- Si preguntan algo fuera de tu ámbito: "Eso queda fuera de mi especialidad, pero puedo ayudarte con cualquier duda sobre nuestros servicios."

REGLA DE ACCIONES — OBLIGATORIO, SIGUE ESTO SIEMPRE:

1. Cada vez que respondas con información sobre un servicio, presupuesto o contacto, DEBES terminar tu mensaje con estas DOS líneas exactas (cópialas tal cual):
<<ACTION:Agendar reunión>>
<<ACTION:Llamar ahora>>

2. Si el usuario dice "agendar reunión", "quiero una reunión", "quiero agendar" o similar, NO le digas que escriba un email ni que llame. En su lugar, pregúntale DIRECTAMENTE: "¿Qué día y a qué hora te vendría bien la reunión?" y NO incluyas las líneas <<ACTION:...>> en esa respuesta.

3. Cuando el usuario responda con un día y hora (ej: "martes a las 10", "el viernes 14 a las 16:00"), confirma la reunión y termina con esta línea exacta:
<<MEETING:lo que dijo el usuario>>
Por ejemplo: <<MEETING:martes a las 10:00>>

4. NO pongas <<ACTION:...>> cuando estés preguntando nombre, email o día/hora de reunión.

5. Las líneas <<ACTION:...>> y <<MEETING:...>> van SIEMPRE al final del mensaje, cada una en su propia línea, sin texto adicional después.

EJEMPLO de respuesta correcta sobre un servicio:
"En Kometalab ofrecemos producción audiovisual completa: estrategia, grabación y postproducción. Trabajamos con marcas y agencias.
<<ACTION:Agendar reunión>>
<<ACTION:Llamar ahora>>"

EJEMPLO de respuesta correcta cuando piden reunión:
"¡Genial! ¿Qué día y a qué hora te vendría bien la reunión?"

EJEMPLO de confirmación de reunión:
"Perfecto, queda agendada tu reunión para el martes a las 10:00. ¡Te esperamos!
<<MEETING:martes a las 10:00>>"
`

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
