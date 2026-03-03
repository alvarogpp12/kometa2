'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/hooks/useLenis'

interface ServiceProject {
	client: string
	title: string
	slug: string
	video: string
}

interface ServicePageProps {
	title?: string
	introFirst: string
	introSecond: string
}

const SERVICE_PROJECTS: ServiceProject[] = []

export default function ServicePage({
	title,
	introFirst,
	introSecond,
}: ServicePageProps) {
	const lenis = useLenis()
	const heroRef = useRef<HTMLElement>(null)
	const gridRef = useRef<HTMLElement>(null)
	const heroTitleRef = useRef<HTMLHeadingElement>(null)
	const heroContentRef = useRef<HTMLDivElement>(null)
	const [visibleCards, setVisibleCards] = useState<number[]>([])

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)

		const titleElement = heroTitleRef.current
		const contentElement = heroContentRef.current
		if (!contentElement) return

		const ctx = gsap.context(() => {
			const heroTimeline = gsap.timeline({
				defaults: { ease: 'power3.out' },
			})

			if (titleElement) {
				heroTimeline.fromTo(
					titleElement,
					{ autoAlpha: 0, y: 42 },
					{ autoAlpha: 1, y: 0, duration: 0.85 },
				)
			}

			heroTimeline.fromTo(
				contentElement,
				{ autoAlpha: 0, y: 28 },
				{ autoAlpha: 1, y: 0, duration: 0.8 },
				titleElement ? '-=0.55' : '0',
			)
		})

		return () => ctx.revert()
	}, [])

	useEffect(() => {
		if (!lenis) return
		const onScroll = () => ScrollTrigger.update()
		lenis.on('scroll', onScroll)
		return () => lenis.off('scroll', onScroll)
	}, [lenis])

	useEffect(() => {
		const gridEl = gridRef.current
		if (!gridEl) return

		const cards = Array.from(
			gridEl.querySelectorAll<HTMLElement>(
				'[data-service-card]',
			),
		)
		if (cards.length === 0) return

		const observer = new IntersectionObserver(
			(entries) => {
				setVisibleCards((prev) => {
					const next = new Set(prev)
					for (const entry of entries) {
						const idx = Number(
							entry.target.getAttribute(
								'data-card-index',
							) ?? '-1',
						)
						if (Number.isNaN(idx) || idx < 0) continue
						if (entry.isIntersecting) next.add(idx)
					}
					return Array.from(next)
				})
			},
			{ threshold: 0.15 },
		)

		for (const card of cards) observer.observe(card)
		return () => observer.disconnect()
	}, [])

	return (
		<main className="ArtistPage">
			<section ref={heroRef} className="SliceArtistHero">
				<div className="SliceArtistHero-head Site-head">
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

				<div className="SliceArtistHero-wrapper wrapper-1290">
					{title && (
						<h1
							ref={heroTitleRef}
							className="SliceArtistHero-title"
						>
							{title}
						</h1>
					)}
					<div
						ref={heroContentRef}
						className="SliceArtistHero-content"
					>
						<p>{introFirst}</p>
						<p>{introSecond}</p>
					</div>
				</div>
			</section>

			{SERVICE_PROJECTS.length > 0 && (
				<section
					ref={gridRef}
					className="SliceProjectsGrid"
					style={{ marginTop: '2rem' }}
				>
					<div className="wrapper-1290">
						<div className="ProjectsGrid">
							<div className="ProjectsGridLine --col-3">
								{SERVICE_PROJECTS.map(
									(project, index) => {
										const isVisible =
											visibleCards.includes(
												index,
											)

										return (
											<Link
												key={project.slug}
												href="#"
												data-service-card
												data-card-index={
													index
												}
												className="ProjectsGridLine-item"
												style={{
													opacity: isVisible
														? 1
														: 0,
													transform:
														isVisible
															? 'translateY(0)'
															: 'translateY(3.4rem)',
													transition: `all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.06}s`,
												}}
												onClick={(e) =>
													e.preventDefault()
												}
											>
												<div className="ProjectsGridLine-itemInner">
													<div className="ProjectsGridLine-itemMediaWrap">
														<video
															className="ProjectsGridLine-itemMedia AppVideo-video"
															src={
																project.video
															}
															preload="metadata"
															loop
															muted
															playsInline
															autoPlay
														/>
													</div>
													<div className="ProjectsGridLine-itemContent">
														<div className="ProjectsGridLine-itemTitle">
															<span>
																{
																	project.client
																}
															</span>
														</div>
														<div className="ProjectsGridLine-itemSubtitle">
															<span>
																{
																	project.title
																}
															</span>
														</div>
													</div>
												</div>
											</Link>
										)
									},
								)}
							</div>
						</div>
					</div>
				</section>
			)}

		</main>
	)
}
