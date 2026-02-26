'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'

interface ProjectItem {
	name: string
	slug: string
	video: string
}

const PROJECTS: ProjectItem[] = [
	{
		name: 'New York City Ballet',
		slug: 'new-york-city-ballet',
		video: '/videos/REEL 12.mp4',
	},
	{
		name: 'Mary Kay',
		slug: 'mary-kay',
		video: '/videos/REEL 1.mp4',
	},
	{
		name: 'Hennessy',
		slug: 'hennessy',
		video: '/videos/REEL 3.mp4',
	},
	{
		name: 'Taranjales',
		slug: 'taranjales',
		video: '/videos/webtaranjales.mp4',
	},
	{
		name: 'GyG',
		slug: 'gyg',
		video: '/videos/videosmarketing/GyG_Campaña_SV_Receta_Cupcakes.mp4',
	},
	{
		name: 'Chocolates',
		slug: 'chocolates',
		video: '/videos/videosmarketing/TRAILER CHOCOLATES V5.mp4',
	},
]

export default function ProjectsPage() {
	const [activeIndex, setActiveIndex] = useState(0)
	const [isNavigating, setIsNavigating] = useState(false)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const bgVideoRef = useRef<HTMLVideoElement>(null)
	const previewVideoRef = useRef<HTMLVideoElement>(null)
	const prevIndexRef = useRef(0)
	const pathname = usePathname()
	const router = useRouter()
	const activeProject = PROJECTS[activeIndex]

	useEffect(() => {
		setIsNavigating(false)
	}, [pathname])

	useEffect(() => {
		const titleEl = titleRef.current
		if (!titleEl) return

		gsap.fromTo(
			titleEl,
			{ autoAlpha: 0, y: 50 },
			{ autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
		)
	}, [])

	useEffect(() => {
		if (activeIndex === prevIndexRef.current) return
		prevIndexRef.current = activeIndex

		const titleEl = titleRef.current
		if (titleEl) {
			gsap.fromTo(
				titleEl,
				{ autoAlpha: 0, y: 20 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.5,
					ease: 'power2.out',
				},
			)
		}

		if (bgVideoRef.current) {
			bgVideoRef.current.src = activeProject.video
			bgVideoRef.current.load()
			bgVideoRef.current.play().catch(() => {})
		}

		if (previewVideoRef.current) {
			previewVideoRef.current.src = activeProject.video
			previewVideoRef.current.load()
			previewVideoRef.current.play().catch(() => {})
		}
	}, [activeIndex, activeProject.video])

	const handleClick = (
		event: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		if (isNavigating) {
			event.preventDefault()
			return
		}
		if (pathname === href) return

		event.preventDefault()
		setIsNavigating(true)
		window.dispatchEvent(
			new CustomEvent('kometa:page-transition-start', {
				detail: { href },
			}),
		)
		setTimeout(() => router.push(href), 560)
	}

	return (
		<main className="ProjectsPage">
			<div className="ProjectsPage-bg">
				<video
					ref={bgVideoRef}
					className="ProjectsPage-bgVideo"
					src={activeProject.video}
					preload="metadata"
					autoPlay
					loop
					muted
					playsInline
				/>
				<div className="ProjectsPage-bgOverlay" />
			</div>

			<div className="ProjectsPage-header">
				<Link
					href="/"
					className="ProjectsPage-backLink"
					onClick={(e) => handleClick(e, '/')}
				>
					Go to homepage
				</Link>
				<span className="ProjectsPage-location">
					MADRID
				</span>
			</div>

			<div className="ProjectsPage-body">
				<h1
					ref={titleRef}
					className="ProjectsPage-title"
					key={activeProject.name}
				>
					{activeProject.name}
				</h1>

				<div className="ProjectsPage-content">
					<nav className="ProjectsPage-list">
						{PROJECTS.map((project, index) => (
							<Link
								key={project.slug}
								href={`/proyectos/${project.slug}`}
								className={`ProjectsPage-listItem${
									index === activeIndex
										? ' is-active'
										: ''
								}`}
								onMouseEnter={() =>
									setActiveIndex(index)
								}
								onFocus={() =>
									setActiveIndex(index)
								}
								onClick={(e) =>
									handleClick(
										e,
										`/proyectos/${project.slug}`,
									)
								}
								data-cursor-hover
							>
								<span className="ProjectsPage-listDot" />
								<span>{project.name}</span>
							</Link>
						))}
					</nav>

					<div className="ProjectsPage-preview">
						<video
							ref={previewVideoRef}
							className="ProjectsPage-previewVideo"
							src={activeProject.video}
							preload="metadata"
							autoPlay
							loop
							muted
							playsInline
						/>
					</div>

					<div className="ProjectsPage-rail" aria-hidden>
						<div
							className="ProjectsPage-railThumb"
							style={{
								transform: `translateY(${activeIndex * 72}px)`,
							}}
						>
							<span />
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
