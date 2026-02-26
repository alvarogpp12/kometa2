'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export function HomeFooter() {
	const footerRef = useRef<HTMLElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = footerRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					observer.unobserve(el)
				}
			},
			{ threshold: 0.15 },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<footer ref={footerRef} className="AppFooter wrapper">
			<div className="AppFooter-wrapper">
				<div
					style={{
						display: 'flex',
						gap: '6rem',
						flexDirection: 'column',
					}}
				>
					{/* Top: CTA + nav */}
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '3rem',
						}}
					>
						<p
							className="AppFooter-contentText"
							style={{
								opacity: inView ? 1 : 0,
								transform: inView
									? 'translateY(0)'
									: 'translateY(3rem)',
								transition:
									'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
							}}
						>
							si tienes una visión ambiciosa,
							<br />
							juntos la constreuimos
						</p>

						<p
							style={{
								fontSize: '1.6rem',
								opacity: inView ? 0.6 : 0,
								maxWidth: '44rem',
								lineHeight: 1.5,
								transition: 'opacity 0.6s ease 0.2s',
							}}
						>
							Nuestro equipo creativo hace tus ideas
							realidad, contamos con lo mejor del sector
							nada más. No seguimos tendencias. No
							improvisamos. No hacemos marketing
							superficial.
						</p>

						<Link
							href="/contact"
							className="AppButton"
							style={{
								opacity: inView ? 1 : 0,
								transition: 'opacity 0.6s ease 0.3s',
							}}
						>
							<span className="pl-square" />
							<span className="AppButton-title">
								Agendar reunión
							</span>
						</Link>
					</div>

					{/* Nav links */}
					<nav
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '2.7rem',
							opacity: inView ? 1 : 0,
							transition: 'opacity 0.6s ease 0.4s',
						}}
					>
						{['Artists', 'Categories', 'About', 'Contact'].map(
							(item) => (
								<Link
									key={item}
									href={`/${item.toLowerCase()}`}
									style={{
										fontSize: '16px',
										display: 'flex',
										alignItems: 'center',
										position: 'relative',
									}}
								>
									<span>{item}</span>
								</Link>
							),
						)}
					</nav>

					{/* Large logo */}
					<div
						className="AppFooter-logo"
						style={{
							opacity: inView ? 1 : 0,
							transition: 'opacity 0.6s ease 0.5s',
						}}
					>
						<svg
							viewBox="0 0 1200 180"
							style={{ width: '100%' }}
						>
							<text
								x="0"
								y="155"
								fontFamily="var(--font-custom)"
								fontSize="200"
								fontWeight="500"
								letterSpacing="-8"
								fill="var(--color-black)"
							>
								kometa
							</text>
						</svg>
					</div>

					{/* Socials */}
					<div
						style={{
							display: 'flex',
							gap: '2rem',
							fontSize: '13px',
							textTransform: 'uppercase',
							marginTop: '2rem',
							opacity: inView ? 1 : 0,
							transition: 'opacity 0.6s ease 0.5s',
						}}
					>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							Instagram
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							Linkedin
						</a>
					</div>

					{/* Credits */}
					<div
						style={{
							display: 'flex',
							gap: '1rem',
							fontSize: '10px',
							justifyContent: 'flex-end',
							opacity: 0.3,
						}}
					>
						<span>Made with Love by</span>
						<span>Le Fruit Studio</span>
						<span>Emma Houlé</span>
						<span>Ludmilla Maury</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
