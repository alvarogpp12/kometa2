'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
	{ name: 'AI', count: 12, filter: 'ai' },
	{ name: 'Archi & Design', count: 12, filter: 'architecture-design' },
	{ name: 'Beauty', count: 15, filter: 'beauty' },
	{ name: 'Characters', count: 25, filter: 'characters' },
	{ name: 'Luxury', count: 16, filter: 'luxury' },
	{ name: 'Set Design', count: 13, filter: 'set-design' },
	{ name: 'Typography', count: 3, filter: 'typography' },
]

export function HomeCategories() {
	const sectionRef = useRef<HTMLElement>(null)
	const [inView, setInView] = useState(false)

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
			{ threshold: 0.1 },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<section
			ref={sectionRef}
			className="section-spacing wrapper"
		>
			<h2
				style={{
					fontFamily: 'var(--font-custom)',
					fontSize: 'clamp(3rem, 5vw, 5rem)',
					fontWeight: 500,
					color: 'var(--color-grey-1)',
					marginBottom: '3rem',
					opacity: inView ? 1 : 0,
					transform: inView
						? 'translateY(0)'
						: 'translateY(3rem)',
					transition:
						'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
				}}
			>
				Categories
			</h2>

			<div className="AppProjectCategories">
				{CATEGORIES.map((cat, i) => (
					<Link
						key={cat.filter}
						href={`/categories?filter=${cat.filter}`}
						className="AppProjectCategories-item"
						style={{
							opacity: inView ? 1 : 0,
							transform: inView
								? 'translateY(0)'
								: 'translateY(2rem)',
							transition: `all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${i * 0.05}s`,
						}}
					>
						<span>{cat.name}</span>
						<span
							style={{
								marginLeft: '0.5rem',
								fontSize: '1.1rem',
								opacity: 0.5,
							}}
						>
							{cat.count}
						</span>
					</Link>
				))}
			</div>

			<div
				style={{
					marginTop: '3rem',
					opacity: inView ? 1 : 0,
					transition: 'opacity 0.6s ease 0.4s',
				}}
			>
				<button
					type="button"
					className="AppButton"
					onClick={() =>
						window.dispatchEvent(
							new Event('openKevinChat'),
						)
					}
				>
					<span className="pl-square" />
					<span className="AppButton-title">
						See All
					</span>
				</button>
			</div>
		</section>
	)
}
