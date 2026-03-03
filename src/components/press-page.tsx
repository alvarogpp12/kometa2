'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/hooks/useLenis'
import { splitChars } from '@/lib/split-chars'

const PILLARS = [
	{
		icon: (
			<svg
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="6" y="8" width="36" height="32" rx="2" />
				<line x1="6" y1="16" x2="42" y2="16" />
				<line x1="18" y1="16" x2="18" y2="40" />
				<line x1="6" y1="24" x2="18" y2="24" />
				<line x1="6" y1="32" x2="18" y2="32" />
			</svg>
		),
		title: 'Prensa escrita',
		desc: 'Activamos presencia en los principales medios impresos y digitales del país.',
	},
	{
		icon: (
			<svg
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="4" y="8" width="40" height="28" rx="2" />
				<polyline points="18,18 18,30 32,24" />
				<line x1="14" y1="40" x2="34" y2="40" />
				<line x1="24" y1="36" x2="24" y2="40" />
			</svg>
		),
		title: 'Televisión',
		desc: 'Conseguimos apariciones en programas y informativos de cadenas nacionales.',
	},
	{
		icon: (
			<svg
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="24" cy="24" r="8" />
				<circle cx="24" cy="24" r="3" />
				<path d="M4 24 C4 24 10 10 24 10 C38 10 44 24 44 24" />
				<rect x="8" y="18" width="32" height="16" rx="3" />
				<line x1="40" y1="22" x2="46" y2="20" />
			</svg>
		),
		title: 'Eventos',
		desc: 'Cubrimos y distribuimos photocalls, alfombras rojas y ruedas de prensa.',
	},
]

const CLIENT_LOGOS = [
	{ name: 'Vogue', src: '/logosclientes/vogue-logo.svg' },
	{ name: 'RTVE', src: '/logosclientes/rtve-logo.png' },
	{
		name: 'Marie Claire',
		src: '/logosclientes/marie-claire-logo.png',
	},
	{ name: '¡Hola!', src: '/logosclientes/hola-logo.png' },
	{
		name: 'Atresplayer',
		src: '/logosclientes/atresplayer-logo.png',
	},
	{
		name: 'El Debate',
		src: '/logosclientes/eldebate-logo.webp',
	},
	{ name: 'Semana', src: '/logosclientes/semana-logo.png' },
	{
		name: 'Mediaset',
		src: '/logosclientes/mediaset-logo.webp',
	},
	{
		name: 'Vanitatis',
		src: '/logosclientes/vanitatis-logo.jpg',
	},
	{
		name: 'EFE',
		src: '/logosclientes/agencia-efe-logo.png',
	},
	{
		name: 'Europa Press',
		src: '/logosclientes/europapress-logo.png',
	},
	{
		name: 'Agencia EFE',
		src: '/logosclientes/efe-logo.png',
	},
]

const PROCESS_STEPS = [
	{
		number: '01',
		title: 'Definimos la acción',
		icon: (
			<svg
				viewBox="0 0 40 40"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="20" cy="20" r="16" />
				<path d="M20 12 L20 20 L26 26" />
			</svg>
		),
	},
	{
		number: '02',
		title: 'Activamos medios',
		icon: (
			<svg
				viewBox="0 0 40 40"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M8 20 L16 20 L20 10 L24 30 L28 20 L32 20" />
			</svg>
		),
	},
	{
		number: '03',
		title: 'Cubrimos el evento',
		icon: (
			<svg
				viewBox="0 0 40 40"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="6" y="10" width="28" height="20" rx="2" />
				<circle cx="20" cy="20" r="6" />
				<circle cx="20" cy="20" r="2" />
				<circle cx="30" cy="14" r="1.5" />
			</svg>
		),
	},
	{
		number: '04',
		title: 'Medimos resultados',
		icon: (
			<svg
				viewBox="0 0 40 40"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="8,28 16,18 22,24 32,12" />
				<polyline points="26,12 32,12 32,18" />
			</svg>
		),
	},
]

export default function PressPage() {
	const lenis = useLenis()
	const pageRef = useRef<HTMLElement>(null)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const subtitleRef = useRef<HTMLDivElement>(null)
	const [entered, setEntered] = useState(false)

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
		requestAnimationFrame(() => setEntered(true))
	}, [])

	useEffect(() => {
		if (!lenis) return
		const onScroll = () => ScrollTrigger.update()
		lenis.on('scroll', onScroll)
		return () => lenis.off('scroll', onScroll)
	}, [lenis])

	useEffect(() => {
		if (!entered) return

		const ctx = gsap.context(() => {
			const titleLines =
				titleRef.current?.querySelectorAll(
					'.PressPage-titleLine',
				)
			if (titleLines) {
				gsap.fromTo(
					titleLines,
					{
						autoAlpha: 0,
						y: 64,
						skewX: 10,
						letterSpacing: '0.06em',
					},
					{
						autoAlpha: 1,
						y: 0,
						skewX: 0,
						letterSpacing: '-0.03em',
						duration: 1.1,
						ease: 'power3.out',
						stagger: 0.18,
					},
				)
			}

			const introLines =
				subtitleRef.current?.querySelectorAll(
					'[data-intro-line]',
				)
			if (introLines) {
				const introChars: HTMLSpanElement[] = []
				const introTargets: string[] = []

				introLines.forEach((line) => {
					const el = line as HTMLElement
					const isSerif =
						el.classList.contains(
							'PressPage-introSerif',
						)
					const target = isSerif
						? '#35363a'
						: '#5e5b52'
					const from = isSerif
						? 'rgba(53, 54, 58, 0.1)'
						: 'rgba(94, 91, 82, 0.1)'
					const chars = splitChars(el)
					chars.forEach((c) => {
						introChars.push(c)
						introTargets.push(target)
					})
					gsap.set(chars, { color: from })
				})

				gsap.fromTo(
					introLines,
					{ autoAlpha: 0, x: 80, skewX: 8 },
					{
						autoAlpha: 1,
						x: 0,
						skewX: 0,
						duration: 0.95,
						ease: 'power3.out',
						stagger: 0.14,
						delay: 0.45,
					},
				)

				gsap.to(introChars, {
					color: (i: number) => introTargets[i],
					duration: 0.55,
					stagger: 0.018,
					ease: 'power2.out',
					delay: 0.6,
				})
			}

			const lines =
				pageRef.current?.querySelectorAll(
					'.PressPage-line',
				)
			if (lines) {
				lines.forEach((line) => {
					gsap.fromTo(
						line,
						{ scaleX: 0 },
						{
							scaleX: 1,
							duration: 1.2,
							ease: 'power3.inOut',
							scrollTrigger: {
								trigger: line,
								start: 'top 92%',
								once: true,
							},
						},
					)
				})
			}

			const pillarCards =
				pageRef.current?.querySelectorAll(
					'.PressPage-pillarCard',
				)
			if (pillarCards) {
				gsap.fromTo(
					pillarCards,
					{ autoAlpha: 0, y: 50, scale: 0.95 },
					{
						autoAlpha: 1,
						y: 0,
						scale: 1,
						duration: 0.9,
						ease: 'power3.out',
						stagger: 0.12,
						scrollTrigger: {
							trigger: pillarCards[0],
							start: 'top 88%',
							once: true,
						},
					},
				)
			}

			const steps =
				pageRef.current?.querySelectorAll(
					'.PressPage-stepCard',
				)
			if (steps) {
				gsap.fromTo(
					steps,
					{ autoAlpha: 0, y: 40 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.8,
						ease: 'power3.out',
						stagger: 0.15,
						scrollTrigger: {
							trigger: steps[0],
							start: 'top 88%',
							once: true,
						},
					},
				)
			}

			const ctaTitle =
				pageRef.current?.querySelector(
					'.PressPage-ctaTitle',
				)
			if (ctaTitle) {
				gsap.fromTo(
					ctaTitle,
					{
						autoAlpha: 0,
						scale: 0.92,
						letterSpacing: '0.08em',
					},
					{
						autoAlpha: 1,
						scale: 1,
						letterSpacing: '-0.03em',
						duration: 1.2,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: ctaTitle,
							start: 'top 82%',
							once: true,
						},
					},
				)
			}
		})

		return () => ctx.revert()
	}, [entered])

	return (
		<main ref={pageRef} className="PressPage">
			<div className="PressPage-head Site-head">
				<div className="wrapper-1290 SliceArtistHero-headWrapper">
					<Link href="/" className="BackLink">
						<span className="BackLink-title">
							Go to homepage
						</span>
					</Link>
					<span className="SliceArtistHero-headTimezone">
						Madrid
					</span>
				</div>
			</div>

			<section className="PressPage-hero">
				<div className="PressPage-heroInner wrapper-1290">
					<h1 ref={titleRef} className="PressPage-title">
						<span className="PressPage-titleLine">
							Gabinete
						</span>
						<span className="PressPage-titleLine --accent">
							de Prensa
						</span>
					</h1>

					<div
						ref={subtitleRef}
						className="PressPage-intro"
					>
						<p
							className="PressPage-introSerif"
							data-intro-line
						>
							Activamos tu evento/marca en medios
							nacionales e internacionales.
						</p>
						<p
							className="PressPage-introText"
							data-intro-line
						>
							Prensa escrita, televisión y medios
							digitales, a través de nuestro
							socio GTRES.
						</p>
					</div>
				</div>
			</section>

			<div className="wrapper-1290">
				<div className="PressPage-line" />
			</div>

			{/* 3 Pillars */}
			<section className="PressPage-pillars">
				<div className="wrapper-1290">
					<div className="PressPage-pillarsGrid">
						{PILLARS.map((pillar, i) => (
							<div
								key={i}
								className="PressPage-pillarCard"
							>
								<div className="PressPage-pillarIcon">
									{pillar.icon}
								</div>
								<h3 className="PressPage-pillarTitle">
									{pillar.title}
								</h3>
								<p className="PressPage-pillarDesc">
									{pillar.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Client Logos Marquee */}
			<section className="PressPage-mediaLogos">
				<div className="wrapper-1290">
					<h2 className="PressPage-mediaTitle">
						Medios donde activamos presencia
					</h2>
				</div>
				<div className="PressPage-marquee">
					<div className="PressPage-marqueeTrack">
						{[...CLIENT_LOGOS, ...CLIENT_LOGOS].map(
							(logo, i) => (
								<div
									key={i}
									className="PressPage-logoItem"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={logo.src}
										alt={logo.name}
										className="PressPage-logoImg"
									/>
								</div>
							),
						)}
					</div>
				</div>
			</section>

			<div className="wrapper-1290">
				<div className="PressPage-line" />
			</div>

			{/* Process Steps */}
			<section className="PressPage-process">
				<div className="wrapper-1290">
					<h2 className="PressPage-sectionTitle">
						Cómo trabajamos
					</h2>
					<div className="PressPage-stepsGrid">
						{PROCESS_STEPS.map((step, i) => (
							<div
								key={i}
								className="PressPage-stepCard"
							>
								<div className="PressPage-stepIcon">
									{step.icon}
								</div>
								<span className="PressPage-stepNumber">
									{step.number}
								</span>
								<h3 className="PressPage-stepTitle">
									{step.title}
								</h3>
							</div>
						))}
					</div>
				</div>
			</section>

			<div className="wrapper-1290">
				<div className="PressPage-line" />
			</div>

			<section className="PressPage-cta">
				<div className="wrapper-1290">
					<div className="PressPage-ctaInner">
						<h2 className="PressPage-ctaTitle">
							¿Hablamos?
						</h2>
						<p className="PressPage-ctaText">
							La reputación se construye antes de
							necesitarla.
						</p>
						<button
							type="button"
							className="AppButton"
							data-cursor-hover
							onClick={() =>
								window.dispatchEvent(
									new Event('openKevinChat'),
								)
							}
							style={{ marginTop: '2rem' }}
						>
							<span className="pl-square" />
							<span className="AppButton-title">
								Hablemos
							</span>
						</button>
					</div>
				</div>
			</section>
		</main>
	)
}
