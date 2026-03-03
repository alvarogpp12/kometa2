'use client'

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import gsap from 'gsap'

interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
}

interface Lead {
	name: string
	email: string
}

type ChatPhase = 'idle' | 'ask-name' | 'ask-email' | 'ready'

export default function IaChatPreview({
	className,
}: {
	className?: string
}) {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [input, setInput] = useState('')
	const [isStreaming, setIsStreaming] = useState(false)
	const [phase, setPhase] = useState<ChatPhase>('idle')
	const [lead, setLead] = useState<Lead>({ name: '', email: '' })
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const lastBubbleRef = useRef<HTMLDivElement>(null)

	const animateBubble = useCallback((el: HTMLDivElement | null) => {
		if (!el) return
		gsap.fromTo(
			el,
			{ opacity: 0, y: 12 },
			{ opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
		)
	}, [])

	useEffect(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [messages])

	const addAssistantMessage = useCallback(
		(content: string) => {
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content },
			])
		},
		[],
	)

	const streamChat = useCallback(
		async (allMessages: ChatMessage[], currentLead?: Lead) => {
			setIsStreaming(true)
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: '' },
			])

			try {
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						messages: allMessages,
						lead: currentLead,
					}),
				})

				if (!res.ok || !res.body) {
					setMessages((prev) => {
						const next = [...prev]
						next[next.length - 1] = {
							role: 'assistant',
							content: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.',
						}
						return next
					})
					setIsStreaming(false)
					return
				}

				const reader = res.body.getReader()
				const decoder = new TextDecoder()
				let buffer = ''

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					buffer += decoder.decode(value, { stream: true })
					const lines = buffer.split('\n')
					buffer = lines.pop() ?? ''

					for (const line of lines) {
						if (!line.startsWith('data: ')) continue
						const payload = line.slice(6)
						if (payload === '[DONE]') break

						try {
							const { text } = JSON.parse(payload)
							if (text) {
								setMessages((prev) => {
									const next = [...prev]
									const last = next[next.length - 1]
									next[next.length - 1] = {
										...last,
										content: last.content + text,
									}
									return next
								})
							}
						} catch {
							/* skip malformed chunks */
						}
					}
				}
			} catch {
				setMessages((prev) => {
					const next = [...prev]
					next[next.length - 1] = {
						role: 'assistant',
						content: 'Error de conexión. Inténtalo de nuevo.',
					}
					return next
				})
			}

			setIsStreaming(false)
		},
		[],
	)

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			const text = input.trim()
			if (!text || isStreaming) return

			setInput('')

			if (phase === 'idle') {
				setMessages([{ role: 'user', content: text }])
				addAssistantMessage(
					'Antes de ayudarte, ¿cómo te llamas?',
				)
				setPhase('ask-name')
				return
			}

			if (phase === 'ask-name') {
				setMessages((prev) => [
					...prev,
					{ role: 'user', content: text },
				])
				setLead((prev) => ({ ...prev, name: text }))
				addAssistantMessage(
					`Encantado, ${text}. ¿Me dejas tu email para poder hacer seguimiento?`,
				)
				setPhase('ask-email')
				return
			}

			if (phase === 'ask-email') {
				const emailRegex = /\S+@\S+\.\S+/
				if (!emailRegex.test(text)) {
					setMessages((prev) => [
						...prev,
						{ role: 'user', content: text },
					])
					addAssistantMessage(
						'No parece un email válido. ¿Puedes escribirlo de nuevo?',
					)
					return
				}

				const completeLead = { name: lead.name, email: text }
				setLead(completeLead)

				setMessages((prev) => [
					...prev,
					{ role: 'user', content: text },
				])
				setPhase('ready')

				const firstUserMsg = messages[0]
				if (firstUserMsg) {
					const chatMessages: ChatMessage[] = [
						{ role: 'user', content: firstUserMsg.content },
					]
					streamChat(chatMessages, completeLead)
				}
				return
			}

			const userMsg: ChatMessage = { role: 'user', content: text }
			setMessages((prev) => [...prev, userMsg])

			const chatHistory = messages
				.filter(
					(m) =>
						!(
							m.role === 'assistant' &&
							(m.content.includes('¿cómo te llamas') ||
								m.content.includes('¿Me dejas tu email') ||
								m.content.includes('email válido'))
						),
				)
				.filter(
					(_, i) => i !== 1 && i !== 2 && i !== 3 && i !== 4,
				)

			const relevantMessages = [
				...chatHistory.filter(
					(m) =>
						m.role === 'user' || m.role === 'assistant',
				),
				userMsg,
			].filter((m) => m.content.length > 0)

			streamChat(relevantMessages, lead)
		},
		[
			input,
			isStreaming,
			phase,
			lead,
			messages,
			addAssistantMessage,
			streamChat,
		],
	)

	return (
		<div
			className={className}
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				position: 'relative',
				userSelect: 'none',
			}}
		>
			<div
				ref={scrollRef}
				style={{
					flex: 1,
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					padding: '12px 8px',
					gap: '8px',
					scrollbarWidth: 'none',
				}}
			>
				{messages.map((msg, i) => {
					const isUser = msg.role === 'user'
					const isLast = i === messages.length - 1

					return (
						<div
							key={`${msg.role}-${i}`}
							ref={isLast ? (el) => {
								lastBubbleRef.current = el
								if (isLast) animateBubble(el)
							} : undefined}
							style={{
								alignSelf: isUser
									? 'flex-end'
									: 'flex-start',
								maxWidth: '85%',
								padding: '8px 14px',
								borderRadius: isUser
									? '16px 16px 4px 16px'
									: '16px 16px 16px 4px',
								background: isUser
									? '#171717'
									: 'rgba(94, 91, 82, 0.08)',
								color: isUser ? '#fff' : '#171717',
								fontSize: '13px',
								lineHeight: 1.45,
								fontFamily:
									'system-ui, -apple-system, sans-serif',
							}}
						>
							{msg.content}
							{isLast &&
								msg.role === 'assistant' &&
								isStreaming && (
									<span
										style={{
											display: 'inline-block',
											width: '4px',
											height: '14px',
											background: '#171717',
											marginLeft: '2px',
											verticalAlign: 'text-bottom',
											animation:
												'blink 1s steps(2) infinite',
										}}
									/>
								)}
						</div>
					)
				})}
				<div ref={messagesEndRef} />
			</div>

			<form
				onSubmit={handleSubmit}
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '6px',
					padding: '8px 0 12px',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						background: 'rgba(255, 255, 255, 0.9)',
						backdropFilter: 'blur(8px)',
						borderRadius: '999px',
						padding: '6px 8px 6px 16px',
						maxWidth: '260px',
						width: '100%',
						boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
					}}
				>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							phase === 'idle'
								? 'Pregúntame...'
								: phase === 'ask-name'
									? 'Tu nombre...'
									: phase === 'ask-email'
										? 'tu@email.com'
										: 'Escribe...'
						}
						disabled={isStreaming}
						style={{
							flex: 1,
							background: 'transparent',
							border: 'none',
							outline: 'none',
							padding: '4px 0',
							fontSize: '12px',
							fontFamily:
								'system-ui, -apple-system, sans-serif',
							color: '#171717',
							caretColor: '#171717',
							minWidth: 0,
						}}
					/>
					<button
						type="submit"
						disabled={isStreaming || !input.trim()}
						style={{
							flexShrink: 0,
							width: '28px',
							height: '28px',
							borderRadius: '50%',
							background:
								isStreaming || !input.trim()
									? 'rgba(23, 23, 23, 0.15)'
									: '#171717',
							border: 'none',
							cursor:
								isStreaming || !input.trim()
									? 'default'
									: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transition:
								'background 0.2s, transform 0.15s',
						}}
						aria-label="Enviar mensaje"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</button>
				</div>
			</form>

			<style>{`
				@keyframes blink {
					0%, 100% { opacity: 1; }
					50% { opacity: 0; }
				}
			`}</style>
		</div>
	)
}
