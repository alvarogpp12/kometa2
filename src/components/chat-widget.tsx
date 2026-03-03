'use client'

import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import gsap from 'gsap'
import Spline from '@splinetool/react-spline'

interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
}

interface Lead {
	name: string
	email: string
}

type ChatPhase = 'idle' | 'ask-name' | 'ask-email' | 'ready'

const CONTACT_KEYWORDS = [
	'contacto',
	'contactar',
	'telefono',
	'teléfono',
	'email',
	'correo',
	'llamar',
	'presupuesto',
	'precio',
	'hablar',
	'reunión',
	'reunion',
	'cita',
]

const QUICK_OPTIONS = [
	'Producción Audiovisual',
	'Desarrollo Web',
	'IA Aplicada',
	'Gabinete de Prensa',
	'Solicitar presupuesto',
]
const CONTACT_HINT_TEXT = 'Contactanos'

const ACTION_REGEX = /<<ACTION:(.+?)>>/g
const MEETING_REGEX = /<<MEETING:(.+?)>>/g

function isContactQuery(text: string): boolean {
	const lower = text.toLowerCase()
	return CONTACT_KEYWORDS.some((kw) => lower.includes(kw))
}

function parseActions(text: string): {
	clean: string
	actions: string[]
	meeting: string | null
} {
	const actions: string[] = []
	let meeting: string | null = null

	let match: RegExpExecArray | null
	ACTION_REGEX.lastIndex = 0
	while ((match = ACTION_REGEX.exec(text)) !== null) {
		actions.push(match[1])
	}

	MEETING_REGEX.lastIndex = 0
	match = MEETING_REGEX.exec(text)
	if (match) {
		meeting = match[1]
	}

	const clean = text
		.replace(ACTION_REGEX, '')
		.replace(MEETING_REGEX, '')
		.trim()

	return { clean, actions, meeting }
}

const pillStyle: React.CSSProperties = {
	padding: '7px 14px',
	borderRadius: '999px',
	border: '1px solid rgba(255, 255, 255, 0.15)',
	background: 'rgba(255, 255, 255, 0.06)',
	color: 'rgba(255, 255, 255, 0.85)',
	fontSize: '12px',
	fontFamily: 'system-ui, -apple-system, sans-serif',
	cursor: 'pointer',
	transition: 'all 0.15s',
	whiteSpace: 'nowrap',
}

function handlePillHover(
	e: React.MouseEvent<HTMLButtonElement>,
	enter: boolean,
) {
	const t = e.currentTarget
	t.style.background = enter
		? 'rgba(255, 255, 255, 0.15)'
		: 'rgba(255, 255, 255, 0.06)'
	t.style.borderColor = enter
		? 'rgba(255, 255, 255, 0.3)'
		: 'rgba(255, 255, 255, 0.15)'
}

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false)
	const [showContactHint, setShowContactHint] = useState(true)
	const [messages, setMessages] = useState<ChatMessage[]>(
		[],
	)
	const [input, setInput] = useState('')
	const [isStreaming, setIsStreaming] = useState(false)
	const [phase, setPhase] = useState<ChatPhase>('idle')
	const [lead, setLead] = useState<Lead>({
		name: '',
		email: '',
	})
	const [showQuickOptions, setShowQuickOptions] =
		useState(true)
	const [actionButtons, setActionButtons] = useState<
		string[]
	>([])

	const panelRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const hintRef = useRef<HTMLDivElement>(null)
	const hintArrowRef = useRef<HTMLSpanElement>(null)
	const hintCharsRef = useRef<Array<HTMLSpanElement | null>>([])
	const isFirstOpen = useRef(true)
	const firstServiceRef = useRef('')

	useEffect(() => {
		if (isOpen || !showContactHint) return
		if (
			!hintRef.current
			|| !hintArrowRef.current
		) {
			return
		}
		const hintChars = hintCharsRef.current.filter(
			(char): char is HTMLSpanElement => Boolean(char),
		)
		if (hintChars.length === 0) return

		const fadeTween = gsap.fromTo(
			hintRef.current,
			{ autoAlpha: 0, y: 8 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.35,
				ease: 'power2.out',
			},
		)

		const arrowTween = gsap.fromTo(
			hintArrowRef.current,
			{ x: 0 },
			{
				x: 7,
				duration: 0.75,
				ease: 'sine.inOut',
				repeat: -1,
				yoyo: true,
			},
		)

		gsap.set(hintChars, {
			color: '#050505',
		})

		const textSweepTween = gsap.timeline({
			repeat: -1,
			repeatDelay: 0.1,
		})
		textSweepTween
			.to(hintChars, {
				color: '#d40000',
				duration: 0.07,
				ease: 'power1.inOut',
				stagger: 0.05,
			})
			.to(hintChars, {
				color: '#050505',
				duration: 0.08,
				ease: 'power1.out',
				stagger: 0.05,
			})
			.set(hintChars, {
				color: '#050505',
			})

		return () => {
			fadeTween.kill()
			arrowTween.kill()
			textSweepTween.kill()
		}
	}, [isOpen, showContactHint])

	useEffect(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [messages, actionButtons])

	useEffect(() => {
		const handleOpenChat = () => {
			if (!isOpen) openPanel()
		}
		window.addEventListener(
			'openKevinChat',
			handleOpenChat,
		)
		return () =>
			window.removeEventListener(
				'openKevinChat',
				handleOpenChat,
			)
	})

	const openPanel = useCallback(() => {
		const panel = panelRef.current
		setShowContactHint(false)
		setIsOpen(true)
		if (panel) {
			gsap.fromTo(
				panel,
				{ opacity: 0, scale: 0.85, x: 20 },
				{
					opacity: 1,
					scale: 1,
					x: 0,
					duration: 0.3,
					ease: 'power3.out',
				},
			)
		}
		if (isFirstOpen.current) {
			isFirstOpen.current = false
			setTimeout(() => {
				setMessages([
					{
						role: 'assistant',
						content:
							'📞 649 842 031\n'
							+ '✉️ comunicacion@kometa.tv\n'
							+ '📍 Calle Valportillo II 14, '
							+ '1-2',
					},
				])
			}, 300)
		}
		setTimeout(() => inputRef.current?.focus(), 350)
	}, [])

	const closePanel = useCallback(() => {
		const panel = panelRef.current
		if (panel) {
			gsap.to(panel, {
				opacity: 0,
				scale: 0.85,
				x: 20,
				duration: 0.2,
				ease: 'power2.in',
				onComplete: () => setIsOpen(false),
			})
		} else {
			setIsOpen(false)
		}
	}, [])

	const togglePanel = useCallback(() => {
		if (!isOpen) openPanel()
		else closePanel()
	}, [isOpen, openPanel, closePanel])

	const addAssistantMessage = useCallback(
		(content: string) => {
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content },
			])
		},
		[],
	)

	const saveMeeting = useCallback(
		(dateText: string) => {
			if (!lead.email) return
			fetch('/api/leads/meeting', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: lead.name,
					email: lead.email,
					service: firstServiceRef.current,
					meeting: dateText,
				}),
			}).catch(() => {})
		},
		[lead],
	)

	const streamChat = useCallback(
		async (
			allMessages: ChatMessage[],
			currentLead?: Lead,
		) => {
			setIsStreaming(true)
			setActionButtons([])
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: '' },
			])

			let fullText = ''

			try {
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
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
							content:
								'Lo siento, ha ocurrido un '
								+ 'error. Inténtalo de nuevo.',
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
					const { done, value } =
						await reader.read()
					if (done) break

					buffer += decoder.decode(value, {
						stream: true,
					})
					const lines = buffer.split('\n')
					buffer = lines.pop() ?? ''

					for (const line of lines) {
						if (!line.startsWith('data: '))
							continue
						const payload = line.slice(6)
						if (payload === '[DONE]') break

						try {
							const { text } =
								JSON.parse(payload)
							if (text) {
								fullText += text
								const { clean } =
									parseActions(fullText)
								setMessages((prev) => {
									const next = [...prev]
									next[next.length - 1] = {
										role: 'assistant',
										content: clean,
									}
									return next
								})
							}
						} catch {
							/* skip */
						}
					}
				}
			} catch {
				setMessages((prev) => {
					const next = [...prev]
					next[next.length - 1] = {
						role: 'assistant',
						content:
							'Error de conexión. Inténtalo '
							+ 'de nuevo.',
					}
					return next
				})
			}

			const { clean, actions, meeting } =
				parseActions(fullText)

			setMessages((prev) => {
				const next = [...prev]
				next[next.length - 1] = {
					role: 'assistant',
					content: clean,
				}
				return next
			})

			if (actions.length > 0) {
				setActionButtons(actions)
			}

			if (meeting) {
				saveMeeting(meeting)
			}

			setIsStreaming(false)
		},
		[saveMeeting],
	)

	const sendText = useCallback(
		(text: string) => {
			if (isStreaming) return

			setShowQuickOptions(false)
			setActionButtons([])

			const userMsg: ChatMessage = {
				role: 'user',
				content: text,
			}

			if (phase === 'idle') {
				if (!firstServiceRef.current) {
					firstServiceRef.current = text
				}
				setMessages((prev) => [...prev, userMsg])

				if (isContactQuery(text)) {
					setPhase('ready')
					streamChat([userMsg])
					return
				}

				addAssistantMessage(
					'Encantado de ayudarte. '
					+ '¿Cómo te llamas?',
				)
				setPhase('ask-name')
				return
			}

			if (phase === 'ask-name') {
				setMessages((prev) => [...prev, userMsg])
				setLead((prev) => ({
					...prev,
					name: text,
				}))
				addAssistantMessage(
					`Perfecto, ${text}. ¿Me dejas tu `
					+ 'email para poder hacer seguimiento?',
				)
				setPhase('ask-email')
				return
			}

			if (phase === 'ask-email') {
				const emailRegex = /\S+@\S+\.\S+/
				if (!emailRegex.test(text)) {
					setMessages((prev) => [...prev, userMsg])
					addAssistantMessage(
						'No parece un email válido. '
						+ '¿Puedes escribirlo de nuevo?',
					)
					return
				}

				const completeLead = {
					name: lead.name,
					email: text,
				}
				setLead(completeLead)
				setMessages((prev) => [...prev, userMsg])
				setPhase('ready')

				const firstUserMsg = messages.find(
					(m) => m.role === 'user',
				)

				fetch('/api/leads', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: lead.name,
						email: text,
						service: firstServiceRef.current,
					}),
				}).catch(() => {})

				if (firstUserMsg) {
					streamChat(
						[
							{
								role: 'user',
								content: firstUserMsg.content,
							},
						],
						completeLead,
					)
				}
				return
			}

			setMessages((prev) => [...prev, userMsg])

			const chatHistory = messages
				.filter((m) => m.content.length > 0)
				.filter(
					(m) =>
						!(
							m.role === 'assistant' &&
							(m.content.includes(
								'¿Cómo te llamas',
							) ||
								m.content.includes(
									'¿Me dejas tu email',
								) ||
								m.content.includes(
									'email válido',
								))
						),
				)

			const relevantMessages = [
				...chatHistory,
				userMsg,
			].filter(
				(m) =>
					m.role === 'user' ||
					m.role === 'assistant',
			)

			streamChat(
				relevantMessages,
				lead.email ? lead : undefined,
			)
		},
		[
			isStreaming,
			phase,
			lead,
			messages,
			addAssistantMessage,
			streamChat,
		],
	)

	const handleActionClick = useCallback(
		(action: string) => {
			if (action === 'Llamar ahora') {
				window.open('tel:649842031', '_self')
				return
			}
			sendText(
				action === 'Agendar reunión'
					? 'Quiero agendar una reunión'
					: action,
			)
		},
		[sendText],
	)

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			const text = input.trim()
			if (!text || isStreaming) return
			setInput('')
			sendText(text)
		},
		[input, isStreaming, sendText],
	)

	const placeholder = useMemo(() => {
		if (phase === 'ask-name') return 'Tu nombre...'
		if (phase === 'ask-email') return 'tu@email.com'
		return 'Escribe un mensaje...'
	}, [phase])

	return (
		<>
			{isOpen && (
				<div
					ref={panelRef}
					style={{
						position: 'fixed',
						top: '50%',
						right: '24px',
						transform: 'translateY(-50%)',
						width: '360px',
						maxHeight: '480px',
						zIndex: 9999,
						borderRadius: '20px',
						overflow: 'hidden',
						background: 'rgba(0, 0, 0, 0.35)',
						backdropFilter: 'blur(24px)',
						WebkitBackdropFilter: 'blur(24px)',
						border:
							'1px solid '
							+ 'rgba(255, 255, 255, 0.08)',
						boxShadow:
							'0 8px 40px rgba(0, 0, 0, 0.3)',
						display: 'flex',
						flexDirection: 'column',
						transformOrigin: 'center right',
					}}
				>
					{/* Header */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '14px 18px',
							borderBottom:
								'1px solid '
								+ 'rgba(255, 255, 255, 0.06)',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							<div
								style={{
									width: '8px',
									height: '8px',
									borderRadius: '50%',
									background: '#22c55e',
								}}
							/>
							<span
								style={{
									fontSize: '14px',
									fontWeight: 600,
									color:
										'rgba(255, 255, 255, '
										+ '0.9)',
									fontFamily:
										'system-ui, '
										+ '-apple-system, '
										+ 'sans-serif',
								}}
							>
								Kevin
							</span>
						</div>
						<button
							onClick={togglePanel}
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								padding: '4px',
								lineHeight: 1,
								color:
									'rgba(255, 255, 255, 0.4)',
								fontSize: '18px',
							}}
							aria-label="Cerrar chat"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line
									x1="18"
									y1="6"
									x2="6"
									y2="18"
								/>
								<line
									x1="6"
									y1="6"
									x2="18"
									y2="18"
								/>
							</svg>
						</button>
					</div>

					{/* Messages */}
					<div
						ref={scrollRef}
						style={{
							flex: 1,
							overflowY: 'auto',
							padding: '14px',
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							scrollbarWidth: 'none',
							minHeight: '280px',
							maxHeight: '340px',
						}}
					>
						{messages.map((msg, i) => {
							const isUser =
								msg.role === 'user'
							const isLast =
								i === messages.length - 1

							return (
								<div
									key={`${msg.role}-${i}`}
									style={{
										alignSelf: isUser
											? 'flex-end'
											: 'flex-start',
										maxWidth: '82%',
										padding: '9px 14px',
										borderRadius: isUser
											? '16px 16px '
												+ '4px 16px'
											: '16px 16px '
												+ '16px 4px',
										background: isUser
											? 'rgba(255, 255, '
												+ '255, 0.15)'
											: 'rgba(255, 255, '
												+ '255, 0.06)',
										color:
											'rgba(255, 255, '
											+ '255, 0.9)',
										fontSize: '13px',
										lineHeight: 1.5,
										whiteSpace:
											'pre-line',
										fontFamily:
											'system-ui, '
											+ '-apple-system, '
											+ 'sans-serif',
									}}
								>
									{msg.content}
									{isLast &&
										msg.role ===
											'assistant' &&
										isStreaming && (
											<span
												style={{
													display:
														'inline-block',
													width: '4px',
													height:
														'14px',
													background:
														'rgba(255,'
														+ ' 255, '
														+ '255, '
														+ '0.9)',
													marginLeft:
														'2px',
													verticalAlign:
														'text-bottom',
													animation:
														'kevinBlink'
														+ ' 1s '
														+ 'steps(2) '
														+ 'infinite',
												}}
											/>
										)}
								</div>
							)
						})}

						{/* Quick options (first open) */}
						{showQuickOptions && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '6px',
									marginTop: '4px',
								}}
							>
								<span
									style={{
										fontSize: '12px',
										color:
											'rgba(255, 255, '
											+ '255, 0.45)',
										fontFamily:
											'system-ui, '
											+ '-apple-system, '
											+ 'sans-serif',
									}}
								>
									Elige una opción:
								</span>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '6px',
									}}
								>
									{QUICK_OPTIONS.map(
										(option) => (
											<button
												key={option}
												type="button"
												onClick={() =>
													sendText(
														option,
													)
												}
												style={
													pillStyle
												}
												onMouseEnter={(
													e,
												) =>
													handlePillHover(
														e,
														true,
													)
												}
												onMouseLeave={(
													e,
												) =>
													handlePillHover(
														e,
														false,
													)
												}
											>
												{option}
											</button>
										),
									)}
								</div>
							</div>
						)}

						{/* Action buttons from Kevin */}
						{actionButtons.length > 0 &&
							!isStreaming && (
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '6px',
										marginTop: '4px',
									}}
								>
									{actionButtons.map(
										(action) => (
											<button
												key={action}
												type="button"
												onClick={() =>
													handleActionClick(
														action,
													)
												}
												style={{
													...pillStyle,
													background:
														action ===
														'Llamar ahora'
															? 'rgba(34, 197, '
																+ '94, 0.15)'
															: pillStyle.background,
													borderColor:
														action ===
														'Llamar ahora'
															? 'rgba(34, 197, '
																+ '94, 0.3)'
															: pillStyle.borderColor?.toString(),
												}}
												onMouseEnter={(
													e,
												) =>
													handlePillHover(
														e,
														true,
													)
												}
												onMouseLeave={(
													e,
												) =>
													handlePillHover(
														e,
														false,
													)
												}
											>
												{action ===
												'Llamar ahora'
													? '📞 Llamar ahora'
													: `📅 ${action}`}
											</button>
										),
									)}
								</div>
							)}
					</div>

					{/* Input */}
					<form
						onSubmit={handleSubmit}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '10px 14px 14px',
							borderTop:
								'1px solid '
								+ 'rgba(255, 255, 255, 0.06)',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '6px',
								background:
									'rgba(255, 255, 255, 0.06)',
								borderRadius: '999px',
								padding: '6px 8px 6px 16px',
								width: '100%',
							}}
						>
							<input
								ref={inputRef}
								type="text"
								value={input}
								onChange={(e) =>
									setInput(e.target.value)
								}
								placeholder={placeholder}
								disabled={isStreaming}
								style={{
									flex: 1,
									background: 'transparent',
									border: 'none',
									outline: 'none',
									padding: '5px 0',
									fontSize: '13px',
									fontFamily:
										'system-ui, '
										+ '-apple-system, '
										+ 'sans-serif',
									color:
										'rgba(255, 255, '
										+ '255, 0.9)',
									caretColor:
										'rgba(255, 255, '
										+ '255, 0.9)',
									minWidth: 0,
								}}
							/>
							<button
								type="submit"
								disabled={
									isStreaming ||
									!input.trim()
								}
								style={{
									flexShrink: 0,
									width: '30px',
									height: '30px',
									borderRadius: '50%',
									background:
										isStreaming ||
										!input.trim()
											? 'rgba(255, 255, '
												+ '255, 0.08)'
											: 'rgba(255, 255, '
												+ '255, 0.2)',
									border: 'none',
									cursor:
										isStreaming ||
										!input.trim()
											? 'default'
											: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition:
										'background 0.2s',
								}}
								aria-label="Enviar"
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="rgba(255, 255, 255, 0.9)"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line
										x1="5"
										y1="12"
										x2="19"
										y2="12"
									/>
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Floating Spline button */}
			<div
				className="ChatWidget-splineTrigger"
				onClick={togglePanel}
				style={{
					position: 'fixed',
					top: '50%',
					right: '24px',
					transform: 'translateY(-50%)',
					zIndex: 10000,
					width: '94px',
					height: '94px',
					cursor: isOpen ? 'default' : 'pointer',
					transition:
						'transform 0.2s, opacity 0.3s ease',
					opacity: isOpen ? 0 : 1,
					pointerEvents: isOpen ? 'none' : 'auto',
				}}
				onMouseEnter={(e) => {
					if (!isOpen) {
						e.currentTarget.style.transform =
							'translateY(-50%) scale(1.08)'
					}
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform =
						'translateY(-50%) scale(1)'
				}}
				role="button"
				tabIndex={isOpen ? -1 : 0}
				aria-label="Abrir chat con Kevin"
				aria-hidden={isOpen}
			>
				{showContactHint && !isOpen && (
					<div
						ref={hintRef}
						style={{
							position: 'absolute',
							top: '50%',
							right: 'calc(100% + 12px)',
							transform: 'translateY(-50%)',
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							color:
								'rgba(255, 255, 255, 0.92)',
							fontSize: '2.2rem',
							fontFamily: 'var(--font-custom)',
							fontWeight: 500,
							lineHeight: 1,
							letterSpacing: '-0.03em',
							whiteSpace: 'nowrap',
							pointerEvents: 'none',
						}}
						aria-hidden="true"
					>
						<span
							ref={hintArrowRef}
							style={{
								display: 'inline-flex',
								fontSize: '14px',
								lineHeight: 1,
								color: '#050505',
							}}
						>
							→
						</span>
						<span
							style={{
								display: 'inline-flex',
								gap: '0',
							}}
						>
							{CONTACT_HINT_TEXT.split('').map(
								(char, index) => (
									<span
										key={`${char}-${index}`}
										ref={(element) => {
											hintCharsRef.current[index] =
												element
										}}
										style={{
											display: 'inline-block',
											color: '#050505',
										}}
									>
										{char}
									</span>
								),
							)}
						</span>
					</div>
				)}
				<Spline
					scene="https://prod.spline.design/QXi9B-cOSBcQ8hPw/scene.splinecode"
					style={{
						position: 'absolute',
						width: '500px',
						height: '500px',
						top: '50%',
						left: '50%',
						transform:
							'translate(-50%, -50%) '
							+ 'scale(0.187)',
						pointerEvents: 'none',
					}}
				/>
			</div>

			<style>{`
				@keyframes kevinBlink {
					0%, 100% { opacity: 1; }
					50% { opacity: 0; }
				}
				@media (orientation: portrait) {
					.ChatWidget-splineTrigger {
						display: none !important;
					}
				}
			`}</style>
		</>
	)
}
