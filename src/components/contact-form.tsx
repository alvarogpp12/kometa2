'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONTACT } from '@/lib/contact'

const SERVICES = [
	'Producción Audiovisual',
	'Desarrollo Web',
	'IA Aplicada',
	'Gabinete de Prensa',
	'Otro',
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
	const pathname = usePathname()
	const [status, setStatus] = useState<Status>('idle')

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (status === 'sending') return

		const form = e.currentTarget
		const data = Object.fromEntries(new FormData(form)) as Record<
			string,
			string
		>

		setStatus('sending')
		try {
			const res = await fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: data.name,
					email: data.email,
					phone: data.phone || undefined,
					service: data.service || undefined,
					message: data.message || undefined,
					website: data.website || undefined,
					source: 'form',
					page: pathname,
				}),
			})
			if (!res.ok) throw new Error(String(res.status))
			form.reset()
			setStatus('success')
		} catch {
			setStatus('error')
		}
	}

	return (
		<section id="contacto" className="ContactForm" aria-labelledby="contacto-title">
			<div className="ContactForm-intro">
				<h2 id="contacto-title" className="ContactForm-title">
					Si tienes una visión ambiciosa, juntos la construiremos
				</h2>
				<p className="ContactForm-lead">
					Te respondemos en menos de 24 horas laborables con una
					propuesta y presupuesto sin compromiso.
				</p>
				<ul className="ContactForm-direct">
					<li>
						<a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" data-cursor-hover>
							WhatsApp · {CONTACT.phone}
						</a>
					</li>
					<li>
						<a href={CONTACT.phoneHref} data-cursor-hover>
							Llamar · {CONTACT.phone}
						</a>
					</li>
					<li>
						<a href={CONTACT.emailHref} data-cursor-hover>
							{CONTACT.email}
						</a>
					</li>
					<li className="ContactForm-address">{CONTACT.address}</li>
				</ul>
			</div>

			{status === 'success' ? (
				<div className="ContactForm-success" role="status">
					<p className="ContactForm-successTitle">¡Recibido! 🙌</p>
					<p>
						Te escribimos muy pronto. Si es urgente, escríbenos por{' '}
						<a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
							WhatsApp
						</a>
						.
					</p>
				</div>
			) : (
				<form className="ContactForm-form" onSubmit={handleSubmit}>
					<div className="ContactForm-row">
						<label className="ContactForm-field">
							<span>Nombre *</span>
							<input name="name" required maxLength={200} autoComplete="name" />
						</label>
						<label className="ContactForm-field">
							<span>Email *</span>
							<input name="email" type="email" required maxLength={200} autoComplete="email" />
						</label>
					</div>
					<div className="ContactForm-row">
						<label className="ContactForm-field">
							<span>Teléfono</span>
							<input name="phone" type="tel" maxLength={40} autoComplete="tel" />
						</label>
						<label className="ContactForm-field">
							<span>¿Qué necesitas?</span>
							<select name="service" defaultValue="">
								<option value="" disabled>
									Elige un servicio
								</option>
								{SERVICES.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</label>
					</div>
					<label className="ContactForm-field">
						<span>Cuéntanos un poco más</span>
						<textarea name="message" rows={4} maxLength={4000} />
					</label>
					{/* Honeypot: hidden from people, filled by spam bots */}
					<input
						name="website"
						tabIndex={-1}
						autoComplete="off"
						aria-hidden="true"
						className="ContactForm-honeypot"
					/>
					<button
						type="submit"
						className="ContactForm-submit"
						disabled={status === 'sending'}
						data-cursor-hover
					>
						{status === 'sending' ? 'Enviando…' : 'Pedir presupuesto'}
					</button>
					{status === 'error' && (
						<p className="ContactForm-error" role="alert">
							No hemos podido enviar el formulario. Escríbenos a{' '}
							<a href={CONTACT.emailHref}>{CONTACT.email}</a> o por{' '}
							<a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
								WhatsApp
							</a>
							.
						</p>
					)}
				</form>
			)}
		</section>
	)
}
