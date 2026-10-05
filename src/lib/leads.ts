import { Client } from '@notionhq/client'
import { z } from 'zod'
import { CONTACT } from '@/lib/contact'

export const leadSchema = z.object({
	name: z.string().trim().min(1).max(200),
	email: z.string().trim().email().max(200),
	phone: z.string().trim().max(40).optional(),
	service: z.string().trim().max(200).optional(),
	message: z.string().trim().max(4000).optional(),
	meeting: z.string().trim().max(200).optional(),
	source: z.enum(['form', 'chat', 'chat-meeting']).default('form'),
	page: z.string().trim().max(300).optional(),
	transcript: z.string().max(8000).optional(),
	// Honeypot: real users never fill this hidden field.
	website: z.string().optional(),
})

export type Lead = z.infer<typeof leadSchema>

const SOURCE_LABEL: Record<Lead['source'], string> = {
	form: 'Formulario web',
	chat: 'Chat (Kevin)',
	'chat-meeting': 'Chat (Kevin) — solicitud de reunión',
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

function leadRows(lead: Lead): Array<[string, string]> {
	const rows: Array<[string, string | undefined]> = [
		['Nombre', lead.name],
		['Email', lead.email],
		['Teléfono', lead.phone],
		['Servicio', lead.service],
		['Reunión propuesta', lead.meeting],
		['Origen', SOURCE_LABEL[lead.source]],
		['Página', lead.page],
		['Mensaje', lead.message],
	]
	return rows.filter(
		(row): row is [string, string] => Boolean(row[1]),
	)
}

async function sendResendEmail(payload: {
	from: string
	to: string[]
	subject: string
	html: string
	text: string
	reply_to?: string
}): Promise<void> {
	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) throw new Error('RESEND_API_KEY no configurada')

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})

	if (!res.ok) {
		throw new Error(
			`Resend ${res.status}: ${await res.text()}`,
		)
	}
}

function fromAddress(): string {
	return (
		process.env.RESEND_FROM_EMAIL
		?? 'Kometalab Web <onboarding@resend.dev>'
	)
}

async function notifyTeam(lead: Lead): Promise<void> {
	const to = (process.env.LEAD_NOTIFY_EMAIL ?? CONTACT.email)
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean)

	const rows = leadRows(lead)
	const subjectPrefix = lead.meeting
		? '📅 Nueva reunión'
		: '🔥 Nuevo lead'
	const subject = `${subjectPrefix}: ${lead.name}`
		+ (lead.service ? ` — ${lead.service}` : '')

	const html = `
		<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111">
			<h2 style="margin:0 0 16px">${escapeHtml(subject)}</h2>
			<table cellpadding="6" style="border-collapse:collapse">
				${rows.map(([k, v]) => `
					<tr>
						<td style="color:#666;vertical-align:top;white-space:nowrap"><b>${escapeHtml(k)}</b></td>
						<td style="white-space:pre-wrap">${escapeHtml(v)}</td>
					</tr>`).join('')}
			</table>
			${lead.transcript
				? `<h3 style="margin:24px 0 8px">Conversación</h3>
					<pre style="white-space:pre-wrap;font-family:inherit;background:#f4f4f4;padding:12px;border-radius:8px">${escapeHtml(lead.transcript)}</pre>`
				: ''}
			<p style="margin-top:24px">
				<a href="mailto:${escapeHtml(lead.email)}">Responder por email</a>
				${lead.phone
					? ` · <a href="tel:${escapeHtml(lead.phone.replace(/\s+/g, ''))}">Llamar</a>`
					: ''}
			</p>
		</div>`

	const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')
		+ (lead.transcript
			? `\n\nConversación:\n${lead.transcript}`
			: '')

	await sendResendEmail({
		from: fromAddress(),
		to,
		subject,
		html,
		text,
		reply_to: lead.email,
	})
}

// The client confirmation needs a verified sending domain in Resend,
// so it only runs when RESEND_FROM_EMAIL is configured.
async function confirmToClient(lead: Lead): Promise<void> {
	if (!process.env.RESEND_FROM_EMAIL) return

	const firstName = lead.name.split(' ')[0]
	const body = lead.meeting
		? `Hemos recibido tu solicitud de reunión para «${lead.meeting}». `
			+ 'Te escribimos en breve para confirmarte el día y la hora.'
		: 'Hemos recibido tu mensaje. Te respondemos en menos de 24 horas laborables.'

	await sendResendEmail({
		from: fromAddress(),
		to: [lead.email],
		reply_to: CONTACT.email,
		subject: 'Hemos recibido tu mensaje — Kometalab',
		text: `Hola ${firstName},\n\n${body}\n\n`
			+ `Si es urgente, llámanos o escríbenos por WhatsApp al ${CONTACT.phone}.\n\n`
			+ 'Equipo Kometalab',
		html: `
			<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111;line-height:1.5">
				<p>Hola ${escapeHtml(firstName)},</p>
				<p>${escapeHtml(body)}</p>
				<p>Si es urgente, llámanos o escríbenos por WhatsApp al
					<a href="${CONTACT.whatsappHref}">${CONTACT.phone}</a>.</p>
				<p>Equipo Kometalab</p>
			</div>`,
	})
}

function richText(content: string) {
	return [{ text: { content: content.slice(0, 2000) } }]
}

async function saveToNotion(lead: Lead): Promise<void> {
	const auth = process.env.NOTION_API_KEY
	const databaseId = process.env.NOTION_CRM_DATABASE_ID
	if (!auth || !databaseId) {
		throw new Error('Notion no configurado')
	}

	const notion = new Client({ auth })
	const summary = [
		lead.meeting ? `Reunión: ${lead.meeting}` : '',
		lead.service ?? '',
	].filter(Boolean).join(' | ')

	// Everything that is not an existing CRM property goes into the
	// page body, so the database schema never makes the insert fail.
	const bodyLines = leadRows(lead).map(([k, v]) => `${k}: ${v}`)
	if (lead.transcript) {
		bodyLines.push('', 'Conversación:', lead.transcript)
	}

	await notion.pages.create({
		parent: { database_id: databaseId },
		properties: {
			Nombre: { title: richText(lead.name) },
			Email: { email: lead.email },
			Estado: {
				status: {
					name: lead.meeting ? 'Contacted' : 'Lead',
				},
			},
			'Fecha de contacto': {
				date: { start: new Date().toISOString() },
			},
			...(summary
				? { Empresa: { rich_text: richText(summary) } }
				: {}),
		},
		children: [
			{
				object: 'block',
				type: 'paragraph',
				paragraph: {
					rich_text: richText(bodyLines.join('\n')),
				},
			},
		],
	})
}

/**
 * Persists a lead. The email notification is what makes sure somebody
 * actually follows up, so a lead counts as saved when either the email
 * or the CRM write succeeds; it only fails when both fail.
 */
export async function processLead(lead: Lead): Promise<boolean> {
	console.log('[LEAD]', {
		...lead,
		transcript: undefined,
		timestamp: new Date().toISOString(),
	})

	const [notified, stored] = await Promise.allSettled([
		notifyTeam(lead),
		saveToNotion(lead),
	])

	if (notified.status === 'rejected') {
		console.error('[LEAD_EMAIL_ERROR]', notified.reason)
	}
	if (stored.status === 'rejected') {
		console.error('[LEAD_NOTION_ERROR]', stored.reason)
	}

	const ok = notified.status === 'fulfilled'
		|| stored.status === 'fulfilled'

	if (ok) {
		await confirmToClient(lead).catch((err) => {
			console.error('[LEAD_CONFIRM_ERROR]', err)
		})
	}

	return ok
}
