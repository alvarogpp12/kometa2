'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/hooks/useLenis'

const TOOLS_CRM = [
	'HubSpot',
	'Salesforce',
	'Zoho',
	'Pipedrive',
	'Monday',
	'Notion',
	'Airtable',
]

const TOOLS_AI = [
	'OpenAI (LLMs)',
	'Make',
	'Zapier',
	'APIs personalizadas',
	'Webhooks',
]

const AUTOMATIONS = [
	{
		title: 'Leads y cualificación automática',
		desc: 'Captura, clasifica y prioriza leads sin intervención manual.',
	},
	{
		title: 'Seguimiento comercial inteligente',
		desc: 'Secuencias automáticas que se adaptan al comportamiento del lead.',
	},
	{
		title: 'Propuestas generadas por IA',
		desc: 'Documentos personalizados creados en segundos.',
	},
	{
		title: 'Chatbots entrenados con tu negocio',
		desc: 'Asistentes que responden con tu tono y tu conocimiento.',
	},
	{
		title: 'Reporting y análisis predictivo',
		desc: 'Dashboards que anticipan, no solo miden.',
	},
]

export default function IaPage() {
	const lenis = useLenis()
	const pageRef = useRef<HTMLElement>(null)
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
			const reveals =
				pageRef.current?.querySelectorAll('[data-reveal]')
			if (!reveals) return

			reveals.forEach((el) => {
				gsap.fromTo(
					el,
					{ autoAlpha: 0, y: 48 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.9,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: el,
							start: 'top 88%',
							once: true,
						},
					},
				)
			})
		})

		return () => ctx.revert()
	}, [entered])

	return (
		<main ref={pageRef} className="IaPage">
			{/* ── Hero ── */}
			<section className="IaPage-hero">
				<div className="IaPage-heroOverlay" />
				<div className="WebDevPage-head Site-head">
					<div className="wrapper-1290 SliceArtistHero-headWrapper">
						<Link href="/" className="BackLink">
							<span
								className="BackLink-title"
								style={{ color: 'rgba(255,255,255,0.5)' }}
							>
								Go to homepage
							</span>
						</Link>
						<span className="SliceArtistHero-headTimezone"
							style={{ color: 'rgba(255,255,255,0.5)' }}
						>
							Madrid
						</span>
					</div>
				</div>

				<div className="IaPage-heroInner wrapper-1290">
					<div
						className="IaPage-heroBody"
						style={{
							opacity: entered ? 1 : 0,
							transform: entered
								? 'translateY(0)'
								: 'translateY(4rem)',
							transition:
								'all 1.1s cubic-bezier(0.165, 0.84, 0.44, 1)',
						}}
					>
						<h1 className="IaPage-heroTitle">
							Automatiza. Optimiza. Escala.
						</h1>
						<p className="IaPage-heroSub">
							IA Aplicada
						</p>
					</div>

					<div
						className="IaPage-heroIntro"
						style={{
							opacity: entered ? 1 : 0,
							transform: entered
								? 'translateY(0)'
								: 'translateY(2.4rem)',
							transition:
								'all 1s cubic-bezier(0.165, 0.84, 0.44, 1) 0.25s',
						}}
					>
						<div className="IaPage-heroIntroAccent">
							<span className="IaPage-gradientLine --light">
								Menos carga de trabajo
							</span>
							<span className="IaPage-gradientLine --mid">
								Más eficiencia
							</span>
							<span className="IaPage-gradientLine --dark">
								Más crecimiento
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* ── Tools grid ── */}
			<section className="IaPage-tools">
				<div className="wrapper-1290">
					<div className="IaPage-toolsGrid" data-reveal>
						<div className="IaPage-toolsLeft">
							<h2 className="IaPage-sectionTitle">
								Tecnología que
								<br />
								conecta todo
							</h2>
							<p className="IaPage-toolsDesc">
								IA + CRM + Automatización.
								Conectamos las herramientas que
								ya usas con inteligencia que las
								hace trabajar mejor.
							</p>
						</div>

						<div className="IaPage-toolsRight">
							<div className="IaPage-toolGroup">
								<span className="IaPage-toolLabel">
									Trabajamos con
								</span>
								<div className="IaPage-toolPills">
									{TOOLS_CRM.map((t) => (
										<span
											key={t}
											className="IaPage-toolPill"
										>
											{t}
										</span>
									))}
								</div>
							</div>
							<div className="IaPage-toolGroup">
								<span className="IaPage-toolLabel">
									Potenciado con
								</span>
								<div className="IaPage-toolPills">
									{TOOLS_AI.map((t) => (
										<span
											key={t}
											className="IaPage-toolPill"
										>
											{t}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── Automations list ── */}
			<section className="IaPage-automations">
				<div className="wrapper-1290">
					<h2
						className="IaPage-sectionTitle"
						data-reveal
					>
						¿Qué automatizamos?
					</h2>
					<div className="IaPage-autoList">
						{AUTOMATIONS.map((item, i) => (
							<div
								key={item.title}
								className="IaPage-autoItem"
								data-reveal
								style={{
									transitionDelay: `${i * 0.06}s`,
								}}
							>
								<span className="IaPage-autoIndex">
									0{i + 1}
								</span>
								<div className="IaPage-autoContent">
									<h3 className="IaPage-autoTitle">
										{item.title}
									</h3>
									<p className="IaPage-autoDesc">
										{item.desc}
									</p>
								</div>
							</div>
						))}
					</div>
					<div className="IaPage-autoClose" data-reveal>
						<p>
							Si es repetitivo, lo optimizamos.
							<br />
							Si consume tiempo, lo automatizamos.
						</p>
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="IaPage-cta">
				<div className="wrapper-1290">
					<div className="IaPage-ctaInner" data-reveal>
						<Link
							href="/contact"
							className="IaPage-ctaButton"
							data-cursor-hover
						>
							<span>Hablemos</span>
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
