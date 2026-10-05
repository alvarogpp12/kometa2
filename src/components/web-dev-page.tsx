'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/hooks/useLenis'
import { splitChars } from '@/lib/split-chars'
import { VIDEO_URLS, getVideoPoster } from '@/lib/cloudinary-media'
import PlatePreview from '@/components/plate-preview'

const FEATURES = [
	{
		title: 'Diseño a medida',
		desc:
			'Sin plantillas. Diseño UX/UI propio ' +
			'para cada proyecto.',
		video: VIDEO_URLS.disenoAMedida,
	},
	{
		title: 'Rendimiento y SEO',
		desc:
			'Webs rápidas, optimizadas para ' +
			'Core Web Vitals y SEO técnico.',
		video: VIDEO_URLS.rendimientoExtremo,
	},
	{
		title: 'Escalable',
		desc:
			'Next.js, React y Headless CMS. ' +
			'Preparada para crecer con tu negocio.',
		video: VIDEO_URLS.escalableDiaUno,
	},
]

const PROCESS_STEPS = [
	{
		num: '01',
		title: 'Briefing y arquitectura',
		desc:
			'Objetivos, estructura de contenidos ' +
			'y arquitectura de la web.',
	},
	{
		num: '02',
		title: 'Diseño UX/UI',
		desc:
			'Wireframes y diseño de cada pantalla, ' +
			'adaptado a móvil.',
	},
	{
		num: '03',
		title: 'Desarrollo y lanzamiento',
		desc:
			'Desarrollo, pruebas, SEO técnico y ' +
			'puesta en producción. Después, ' +
			'mantenimiento y mejoras.',
	},
]

const TECH_STACK = [
	'Next.js',
	'React',
	'TypeScript',
	'TailwindCSS',
	'Vercel',
	'Headless CMS',
]

export default function WebDevPage() {
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
			const heroTitle =
				pageRef.current?.querySelector(
					'.WebDevPage-heroTitle',
				)
			if (heroTitle) {
				const words =
					heroTitle.querySelectorAll(
						'.WebDevPage-titleWord',
					)
				gsap.fromTo(
					words,
					{ autoAlpha: 0, y: 80, skewX: 8 },
					{
						autoAlpha: 1,
						y: 0,
						skewX: 0,
						duration: 1.1,
						ease: 'power3.out',
						stagger: 0.14,
					},
				)
			}

			const heroSub =
				pageRef.current?.querySelector(
					'.WebDevPage-heroSub',
				) as HTMLElement | null
			if (heroSub) {
				const chars = splitChars(heroSub)
				gsap.set(chars, {
					color: 'rgba(94, 91, 82, 0.12)',
				})
				gsap.fromTo(
					heroSub,
					{ autoAlpha: 0, y: 32 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.9,
						ease: 'power3.out',
						delay: 0.4,
					},
				)
				gsap.to(chars, {
					color: '#5e5b52',
					duration: 0.6,
					stagger: 0.025,
					ease: 'power2.out',
					delay: 0.55,
				})
			}

			const reveals =
				pageRef.current?.querySelectorAll(
					'[data-reveal]',
				)
			if (reveals) {
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
								start: 'top 85%',
								once: true,
							},
						},
					)
				})
			}

			const featureCards =
				pageRef.current?.querySelectorAll(
					'.WebDevPage-featureCard',
				)
			if (featureCards?.length) {
				gsap.fromTo(
					featureCards,
					{ autoAlpha: 0, y: 56 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.85,
						ease: 'power3.out',
						stagger: 0.12,
						scrollTrigger: {
							trigger: '.WebDevPage-features',
							start: 'top 80%',
							once: true,
						},
					},
				)
			}

			const processItems =
				pageRef.current?.querySelectorAll(
					'.WebDevPage-processItem',
				)
			if (processItems?.length) {
				gsap.fromTo(
					processItems,
					{ autoAlpha: 0, y: 48 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.8,
						ease: 'power3.out',
						stagger: 0.14,
						scrollTrigger: {
							trigger: '.WebDevPage-processList',
							start: 'top 80%',
							once: true,
						},
					},
				)
			}

			const techPills =
				pageRef.current?.querySelectorAll(
					'.WebDevPage-techPill',
				)
			if (techPills?.length) {
				gsap.fromTo(
					techPills,
					{ autoAlpha: 0, scale: 0.85 },
					{
						autoAlpha: 1,
						scale: 1,
						duration: 0.6,
						ease: 'back.out(1.4)',
						stagger: 0.07,
						scrollTrigger: {
							trigger: '.WebDevPage-techPills',
							start: 'top 85%',
							once: true,
						},
					},
				)
			}

			const lines =
				pageRef.current?.querySelectorAll(
					'.WebDevPage-line',
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
								start: 'top 90%',
								once: true,
							},
						},
					)
				})
			}
		})

		return () => ctx.revert()
	}, [entered])

	return (
		<main ref={pageRef} className="WebDevPage">
			{/* ── Nav ── */}
			<div className="WebDevPage-head Site-head">
				<div className="wrapper-1290 SliceArtistHero-headWrapper">
					<Link href="/" className="BackLink">
						<span className="BackLink-title">
							Volver al inicio
						</span>
					</Link>
					<span className="SliceArtistHero-headTimezone">
						Madrid
					</span>
				</div>
			</div>

			{/* ── Hero ── */}
			<section className="WebDevPage-hero">
				<div className="wrapper-1290">
					<div className="WebDevPage-heroTop">
						<h1 className="WebDevPage-heroTitle">
							<span className="WebDevPage-titleWord">
								Desarrollo
							</span>
							<span className="WebDevPage-titleWord --accent">
								Web
							</span>
						</h1>
						<p className="WebDevPage-heroSub">
							Diseño UX/UI, desarrollo y SEO.
						</p>
					</div>
				</div>
			</section>

			{/* ── Statement ── */}
			<section className="WebDevPage-statement">
				<div className="wrapper-1290">
					<div
						className="WebDevPage-statementInner"
						data-reveal
					>
						<p className="WebDevPage-statementText">
							Webs corporativas, tiendas online,
							<br />
							landing pages, portales B2B y CRM.
						</p>
						<p className="WebDevPage-statementSub">
							Diseñamos y programamos a medida.
							También integramos la web con tu ERP,
							automatizamos procesos y desarrollamos
							chatbots con IA.
						</p>
					</div>
				</div>
			</section>

			<div className="wrapper-1290">
				<div className="WebDevPage-line" />
			</div>

			{/* ── Features ── */}
			<section className="WebDevPage-features">
				<div className="wrapper-1290">
					<h2
						className="WebDevPage-sectionTitle"
						data-reveal
					>
						Cómo son nuestras webs
					</h2>
					<div className="WebDevPage-featuresGrid">
						{FEATURES.map((f, i) => (
							<div
								key={f.title}
								className="WebDevPage-featureCard"
							>
								<div className="WebDevPage-mediaBox --feature">
									<video
										src={f.video}
										poster={getVideoPoster({ url: f.video })}
										autoPlay
										loop
										muted
										playsInline
										preload="auto"
									/>
								</div>
								<h3 className="WebDevPage-featureTitle">
									{f.title}
								</h3>
								<p className="WebDevPage-featureDesc">
									{f.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<div className="wrapper-1290">
				<div className="WebDevPage-line" />
			</div>

			{/* ── Process ── */}
			<section className="WebDevPage-process">
				<div className="wrapper-1290">
					<div className="WebDevPage-processHead">
						<h2
							className="WebDevPage-sectionTitle"
							data-reveal
						>
							Cómo trabajamos
						</h2>
						<p
							className="WebDevPage-processIntro"
							data-reveal
						>
							Del briefing al lanzamiento.
						</p>
					</div>

					<div className="WebDevPage-processLayout">
						<div className="WebDevPage-processList">
							{PROCESS_STEPS.map((step) => (
								<div
									key={step.num}
									className="WebDevPage-processItem"
								>
									<span className="WebDevPage-processNum">
										{step.num}
									</span>
									<div className="WebDevPage-processContent">
										<h3 className="WebDevPage-processTitle">
											{step.title}
										</h3>
										<p className="WebDevPage-processDesc">
											{step.desc}
										</p>
									</div>
								</div>
							))}
						</div>
						<div
							className="WebDevPage-processMedia"
							data-reveal
						>
							<div className="WebDevPage-mediaBox --process">
								<PlatePreview />
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="wrapper-1290">
				<div className="WebDevPage-line" />
			</div>

			{/* ── Tech stack ── */}
			<section className="WebDevPage-tech">
				<div className="wrapper-1290">
					<div className="WebDevPage-techLayout">
						<div className="WebDevPage-techLeft">
							<h2
								className="WebDevPage-sectionTitle"
								data-reveal
							>
								Tecnología
							</h2>
							<p
								className="WebDevPage-techDesc"
								data-reveal
							>
								El stack con el que trabajamos.
							</p>
						</div>
						<div className="WebDevPage-techRight">
							<div className="WebDevPage-techPills">
								{TECH_STACK.map((t) => (
									<span
										key={t}
										className="WebDevPage-techPill"
									>
										{t}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

		</main>
	)
}
