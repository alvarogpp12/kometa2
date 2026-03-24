'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { VIDEO_URLS, getVideoUrlAtWidth, getVideoPoster } from '@/lib/cloudinary-media'

interface ProjectItem {
	name: string
	slug: string
	video: string
	aspect: '16:9' | '9:16'
	instagramQuery: string
}

const PROJECTS: ProjectItem[] = [
	{
		name: 'Adealfar',
		slug: 'adealfar',
		video: VIDEO_URLS.adealfar,
		aspect: '9:16',
		instagramQuery: 'Adealfar',
	},
	{
		name: 'Los Taranjales',
		slug: 'los-taranjales',
		video: VIDEO_URLS.webTaranjales,
		aspect: '16:9',
		instagramQuery: 'Los Taranjales',
	},
	{
		name: 'González y González',
		slug: 'gonzalez-y-gonzalez',
		video: VIDEO_URLS.gonzalezYGonzalez,
		aspect: '9:16',
		instagramQuery: 'González y González',
	},
	{
		name: 'Sanvin x L´epicurien',
		slug: 'sanvinx-lepicurien',
		video: VIDEO_URLS.sanvinxLepicurien,
		aspect: '9:16',
		instagramQuery: 'Sanvin Lepicurien',
	},
	{
		name: 'D.O Madrid',
		slug: 'campana-vinos-de-madrid',
		video: VIDEO_URLS.doMadrid,
		aspect: '16:9',
		instagramQuery: 'D.O Vinos de Madrid',
	},
]

const DIMS = {
	'16:9': { w: '56rem', h: '31.5rem' },
	'9:16': { w: '26.4rem', h: '39.11rem' },
} as const

function getBgVideo(url: string): string {
	return getVideoUrlAtWidth({ url, maxWidth: 480 })
}

export default function NoisegraphPage() {
	const [activeIndex, setActiveIndex] = useState(0)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const bgVideoRef = useRef<HTMLVideoElement>(null)
	const previewVideoRef = useRef<HTMLVideoElement>(null)
	const previewWrapRef = useRef<HTMLDivElement>(null)
	const prevIndexRef = useRef(0)
	const textRef = useRef<HTMLDivElement>(null)
	const [textVisible, setTextVisible] = useState(false)
	const [clock, setClock] = useState('')
	const activeProject = PROJECTS[activeIndex]

	useEffect(() => {
		PROJECTS.forEach((project) => {
			const img = new window.Image()
			img.src = getVideoPoster({ url: project.video })
			const bgImg = new window.Image()
			bgImg.src = getVideoPoster({
				url: project.video,
				maxWidth: 480,
			})
		})
	}, [])

	const handlePrevProject = () => {
		setActiveIndex((prev) =>
			prev === 0 ? PROJECTS.length - 1 : prev - 1,
		)
	}

	const handleNextProject = () => {
		setActiveIndex((prev) =>
			prev === PROJECTS.length - 1 ? 0 : prev + 1,
		)
	}

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
			{ autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
		)
	}, [])

	useEffect(() => {
		const vid = previewVideoRef.current
		const wrap = previewWrapRef.current
		if (vid) {
			vid.src = PROJECTS[0].video
			vid.play().catch(() => {})
		}
		if (wrap) {
			const d = DIMS[PROJECTS[0].aspect]
			gsap.set(wrap, { width: d.w, height: d.h })
		}
	}, [])

	useEffect(() => {
		if (activeIndex === prevIndexRef.current) return
		prevIndexRef.current = activeIndex

		const titleEl = titleRef.current
		if (titleEl) {
			gsap.fromTo(
				titleEl,
				{ autoAlpha: 0, y: 20 },
				{ autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
			)
		}

		if (bgVideoRef.current) {
			bgVideoRef.current.poster = getVideoPoster({
				url: activeProject.video,
				maxWidth: 480,
			})
			bgVideoRef.current.src = getBgVideo(activeProject.video)
			bgVideoRef.current.load()
			bgVideoRef.current.play().catch(() => {})
		}

		const wrap = previewWrapRef.current
		if (wrap) {
			const d = DIMS[activeProject.aspect]
			gsap.to(wrap, {
				width: d.w,
				height: d.h,
				duration: 0.7,
				ease: 'power3.inOut',
			})
		}

		const vid = previewVideoRef.current
		if (vid) {
			gsap.to(vid, {
				opacity: 0,
				scale: 0.97,
				duration: 0.25,
				ease: 'power2.in',
				onComplete: () => {
					vid.poster = getVideoPoster({
						url: activeProject.video,
					})
					vid.src = activeProject.video
					vid.load()
					vid.play().catch(() => {})
					gsap.fromTo(
						vid,
						{ opacity: 0, scale: 1.03 },
						{
							opacity: 1,
							scale: 1,
							duration: 0.45,
							ease: 'power2.out',
						},
					)
				},
			})
		}
	}, [activeIndex, activeProject.video, activeProject.aspect])

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
						src={getBgVideo(activeProject.video)}
						poster={getVideoPoster({
							url: activeProject.video,
							maxWidth: 480,
						})}
						preload="auto"
						autoPlay
						loop
						muted
						playsInline
					/>
					<div className="ProjectsPage-bgOverlay" />
				</div>

			<div className="viewfinder-corners" aria-hidden="true">
				<span className="vf-corner --top-left" />
				<span className="vf-corner --top-right" />
				<span className="vf-corner --bottom-left" />
				<span className="vf-corner --bottom-right" />
			</div>

			<div className="ProjectsPage-header">
				<Link
					href="/"
					className="ProjectsPage-backLink"
				>
					Go to homepage
				</Link>
				<h2 className="ProjectsPage-headerTitle">
					proyectos
				</h2>
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
						<div className="ProjectsPage-mobileArrows">
							<button
								type="button"
								className="ProjectsPage-mobileArrow"
								onClick={handlePrevProject}
								aria-label="Proyecto anterior"
							>
								↑
							</button>
							<button
								type="button"
								className="ProjectsPage-mobileArrow"
								onClick={handleNextProject}
								aria-label="Siguiente proyecto"
							>
								↓
							</button>
						</div>

						<nav className="ProjectsPage-list">
							{PROJECTS.map((project, index) => (
								<a
									key={project.slug}
									href={`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(
										project.instagramQuery,
									)}`}
									target="_blank"
									rel="noopener noreferrer"
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
									data-cursor-hover
								>
									<span className="ProjectsPage-listDot" />
									<span>{project.name}</span>
								</a>
							))}
						</nav>

				<div className="ProjectsPage-preview">
					<div
						ref={previewWrapRef}
						className="ProjectsPage-previewInner"
					>
						<video
							ref={previewVideoRef}
							className="ProjectsPage-previewVideo"
							poster={getVideoPoster({ url: activeProject.video })}
							preload="auto"
							autoPlay
							loop
							muted
							playsInline
						/>
					</div>
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

			<section
				ref={textRef}
				className="NoiseText"
			>
				<div className="NoiseText-inner wrapper-1290">
					<div
						className="NoiseText-block"
						style={{
							opacity: textVisible ? 1 : 0,
							transform: textVisible
								? 'translateY(0)'
								: 'translateY(3rem)',
							transition:
								'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)',
						}}
					>
						<div className="NoiseText-row">
							<span className="NoiseText-label">Problema</span>
							<p className="NoiseText-value">
								¿Coordinas freelancers para cada proyecto?
								¿Pierdes tiempo gestionando proveedores?
							</p>
						</div>
						<div className="NoiseText-row">
							<span className="NoiseText-label">Solución</span>
							<p className="NoiseText-value">
								Un solo equipo para toda tu comunicación:
								estrategia, producción y entrega.
							</p>
						</div>
						<div className="NoiseText-row">
							<span className="NoiseText-label">Para quién</span>
							<p className="NoiseText-value">
								Para marcas que quieren eficiencia real
								y agencias que buscan un partner de confianza.
							</p>
						</div>
						<div className="NoiseText-row --last">
							<span className="NoiseText-label">Dónde</span>
							<p className="NoiseText-value --accent">
								Sede en Madrid, pero vamos donde estés.
							</p>
						</div>
					</div>
				</div>
			</section>

		</main>
	)
}
