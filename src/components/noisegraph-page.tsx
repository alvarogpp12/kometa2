'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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

export default function NoisegraphPage() {
	const [activeIndex, setActiveIndex] = useState(0)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const bgVideoRef = useRef<HTMLVideoElement>(null)
	const previewVideoRef = useRef<HTMLVideoElement>(null)
	const prevIndexRef = useRef(0)
	const textRef = useRef<HTMLDivElement>(null)
	const [textVisible, setTextVisible] = useState(false)
	const [clock, setClock] = useState('')
	const activeProject = PROJECTS[activeIndex]

	useEffect(() => {
		const tick = () => {
			const now = new Date()
			setClock(
				now.toLocaleTimeString('es-ES', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					timeZone: 'Europe/Madrid',
				}),
			)
		}
		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [])

	useEffect(() => {
		const titleEl = titleRef.current
		if (!titleEl) return

		gsap.fromTo(
			titleEl,
			{ autoAlpha: 0, y: 50 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.9,
				ease: 'power3.out',
			},
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

	useEffect(() => {
		const el = textRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setTextVisible(true)
			},
			{ threshold: 0.2 },
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<main>
			<section className="ProjectsPage --embedded">
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
					>
						Go to homepage
					</Link>
					<span className="ProjectsPage-location">
						MADRID{' '}
						<span className="ProjectsPage-clock">
							{clock}
						</span>
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
								<a
									key={project.slug}
									href="#"
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
										e.preventDefault()
									}
									data-cursor-hover
								>
									<span className="ProjectsPage-listDot" />
									<span>{project.name}</span>
								</a>
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

						<div
							className="ProjectsPage-rail"
							aria-hidden
						>
							{PROJECTS.map((_, i) => (
								<span
									key={i}
									className={`ProjectsPage-railDot${
										i === activeIndex
											? ' is-active'
											: ''
									}`}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="WebDevPage-hero">
				<div
					ref={textRef}
					className="WebDevPage-heroInner wrapper-1290"
				>
					<div
						className="WebDevPage-bodyRight"
						style={{
							opacity: textVisible ? 1 : 0,
							transform: textVisible
								? 'translateY(0)'
								: 'translateY(3rem)',
							transition:
								'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)',
						}}
					>
						<p className="WebDevPage-bodySerif">
							¿Coordinas freelancers para cada
							proyecto? ¿Pierdes tiempo
							gestionando proveedores?
						</p>
						<p className="WebDevPage-bodyText">
							Un solo equipo para toda tu
							comunicación: estrategia,
							producción y entrega.
						</p>
						<p className="WebDevPage-bodySerif">
							Para marcas que quieren eficiencia
							real y agencias que buscan un
							partner de confianza.
						</p>
						<p className="WebDevPage-bodySerif --large">
							Sede en Madrid, pero vamos
							donde estés.
						</p>
					</div>
				</div>
			</section>
		</main>
	)
}
