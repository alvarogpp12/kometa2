'use client'

import { useEffect, useRef, useState } from 'react'

export function HomeCounter() {
	const sectionRef = useRef<HTMLElement>(null)
	const [inView, setInView] = useState(false)
	const [endYear, setEndYear] = useState(2010)

	useEffect(() => {
		const el = sectionRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					observer.unobserve(el)
				}
			},
			{ threshold: 0.3 },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (!inView) return

		const target = 2026
		const duration = 1500
		const start = Date.now()

		const animate = () => {
			const elapsed = Date.now() - start
			const progress = Math.min(elapsed / duration, 1)
			const eased = 1 - Math.pow(1 - progress, 3)
			setEndYear(Math.round(2010 + (target - 2010) * eased))
			if (progress < 1) requestAnimationFrame(animate)
		}

		requestAnimationFrame(animate)
	}, [inView])

	return (
		<section
			ref={sectionRef}
			className="section-spacing wrapper"
		>
			<p
				style={{
					fontSize: '1.8rem',
					color: 'var(--color-grey-2)',
					marginBottom: '4rem',
					opacity: inView ? 1 : 0,
					transform: inView
						? 'translateY(0)'
						: 'translateY(2rem)',
					transition:
						'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
				}}
			>
				Our Work since...
			</p>

			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
					gap: '4rem',
				}}
			>
				<span
					style={{
						fontFamily: 'var(--font-custom)',
						fontSize: 'clamp(6rem, 14vw, 18rem)',
						fontWeight: 500,
						lineHeight: 0.9,
						color: 'var(--color-grey-1)',
						opacity: inView ? 0.25 : 0,
						transition: 'opacity 1s ease 0.2s',
					}}
				>
					2010
				</span>
				<span
					style={{
						fontFamily: 'var(--font-custom)',
						fontSize: 'clamp(6rem, 14vw, 18rem)',
						fontWeight: 500,
						lineHeight: 0.9,
						color: 'var(--color-grey-1)',
						opacity: inView ? 1 : 0,
						transition: 'opacity 1s ease 0.4s',
					}}
				>
					{endYear}
				</span>
			</div>
		</section>
	)
}
