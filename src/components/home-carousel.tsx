'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PROJECTS = [
	{
		title: 'Moncler',
		artist: 'Styleframe',
		slug: 'produccion-audiovisual',
		color: '#d4cfc9',
	},
	{
		title: 'New York City Ballet',
		artist: 'Noisegraph',
		slug: 'desarrollo-web',
		color: '#c9d4d4',
	},
	{
		title: 'Galaxy',
		artist: 'JVG',
		slug: 'ia-aplicada',
		color: '#2a2a3e',
	},
]

export function HomeCarousel() {
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
				Latest Projects
			</h2>

			<div className="ProjectsGrid">
				<div className="ProjectsGridLine --col-3">
					{PROJECTS.map((project, i) => (
						<Link
							key={project.slug}
							href={`/servicios/${project.slug}`}
							className="ProjectsGridLine-item"
							style={{
								opacity: inView ? 1 : 0,
								transform: inView
									? 'translateY(0)'
									: 'translateY(4rem)',
								transition: `all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) ${i * 0.12}s`,
							}}
						>
							<div className="ProjectsGridLine-itemMediaWrap">
								<div
									style={{
										aspectRatio: '16/10',
										backgroundColor: project.color,
										borderRadius: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span
										style={{
											fontFamily: 'var(--font-custom)',
											fontSize: '6rem',
											opacity: 0.08,
											color: 'var(--color-grey-1)',
										}}
									>
										{project.title.charAt(0)}
									</span>
								</div>
							</div>
							<div className="ProjectsGridLine-itemContent">
								<span className="ProjectsGridLine-itemTitle">
									{project.title}
								</span>
								<span className="ProjectsGridLine-itemSubtitle">
									{project.artist}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
