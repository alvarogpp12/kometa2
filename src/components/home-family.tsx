'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VIDEO_URLS, getVideoPoster } from '@/lib/cloudinary-media'
import { SERVICES } from '@/lib/services'

interface HomeFamilyProps {
	iaMedia?: ReactNode
	webDevMedia?: ReactNode
}

export function HomeFamily({ iaMedia, webDevMedia }: HomeFamilyProps) {
	const [activeIndex, setActiveIndex] = useState(0)
	const [isNavigating, setIsNavigating] = useState(false)
	const [currentVideoSrc, setCurrentVideoSrc] = useState(
		SERVICES[0].previewVideo,
	)
	const [isTransitioningVideo, setIsTransitioningVideo] = useState(false)
	const listRef = useRef<HTMLElement>(null)
	const [thumbOffset, setThumbOffset] = useState(0)
	const fallbackVideoSrc = VIDEO_URLS.reel3
	const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	)
	const requestIdRef = useRef(0)
	const pathname = usePathname()
	const router = useRouter()
	const activeService = SERVICES[activeIndex]
	const isIaServiceActive = activeService.slug === 'ia-aplicada'
	const isWebDevActive = activeService.slug === 'desarrollo-web'
	const activePreviewVideo = activeService.previewVideo
	const mediaAspectRatio = '410 / 512'

	useEffect(() => {
		setIsNavigating(false)
	}, [pathname])

	useEffect(() => {
		const nextService = SERVICES[activeIndex]
		if (
			nextService.slug === 'ia-aplicada' ||
			nextService.slug === 'desarrollo-web'
		) {
			setIsTransitioningVideo(false)
			return
		}

		const nextVideoSrc = nextService.previewVideo
		if (nextVideoSrc === currentVideoSrc) return

		const requestId = requestIdRef.current + 1
		requestIdRef.current = requestId

		const probeVideo = document.createElement('video')
		probeVideo.preload = 'metadata'
		probeVideo.muted = true
		probeVideo.playsInline = true
		probeVideo.src = nextVideoSrc

		const commitVideoSwap = (resolvedSrc: string) => {
			if (requestIdRef.current !== requestId) return
			setIsTransitioningVideo(true)
			requestAnimationFrame(() => {
				setCurrentVideoSrc(resolvedSrc)
			})
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current)
			}
			transitionTimeoutRef.current = setTimeout(() => {
				setIsTransitioningVideo(false)
			}, 560)
		}

		probeVideo.onloadedmetadata = () => {
			commitVideoSwap(nextVideoSrc)
		}

		probeVideo.onerror = () => {
			commitVideoSwap(fallbackVideoSrc)
		}

		if (transitionTimeoutRef.current) {
			clearTimeout(transitionTimeoutRef.current)
		}

		return () => {
			probeVideo.onloadedmetadata = null
			probeVideo.onerror = null
			probeVideo.src = ''
		}
	}, [activeIndex, currentVideoSrc])

	const updateThumbOffset = useCallback(() => {
		const nav = listRef.current
		if (!nav) return
		const item = nav.children[activeIndex] as HTMLElement | undefined
		if (!item) return
		setThumbOffset(item.offsetTop)
	}, [activeIndex])

	useEffect(() => {
		updateThumbOffset()
		window.addEventListener('resize', updateThumbOffset)
		return () => window.removeEventListener('resize', updateThumbOffset)
	}, [updateThumbOffset])

	useEffect(() => {
		return () => {
			if (transitionTimeoutRef.current) {
				clearTimeout(transitionTimeoutRef.current)
			}
		}
	}, [])

	const handleServiceClick = (
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
		setTimeout(() => {
			router.push(href)
		}, 560)
	}

	const handlePrevService = () => {
		setActiveIndex((prev) =>
			prev === 0 ? SERVICES.length - 1 : prev - 1,
		)
	}

	const handleNextService = () => {
		setActiveIndex((prev) =>
			prev === SERVICES.length - 1 ? 0 : prev + 1,
		)
	}

	return (
		<section className="SliceHomeArtists">
			<div className="wrapper-1080">
				<div className="SliceHomeArtists-mobileHead">
					<h2 className="SliceHomeArtists-mobileHeading">
						Servicios
					</h2>
				</div>
				<h2 className="SliceHomeArtists-title">Servicios</h2>

				<div className="SliceHomeArtists-content">
					<div className="SliceHomeArtists-mediaArea">
						<div
							className={`SliceHomeArtists-mediaCard${
								isIaServiceActive ? ' --is-spline' : ''
							}`}
							style={{ aspectRatio: mediaAspectRatio }}
						>
							<div
								className={`SliceHomeArtists-mediaStage${
									isIaServiceActive ? ' --is-spline' : ''
								}${
									isTransitioningVideo ? ' --is-transitioning' : ''
								}`}
							>
							{isIaServiceActive ? (
								<>
									{iaMedia}
									<div
										className="SliceHomeArtists-splineOverlay"
										aria-hidden="true"
									/>
								</>
							) : isWebDevActive ? (
								webDevMedia
							) : (
								<video
									key={currentVideoSrc}
									className="SliceHomeArtists-mediaVisual"
									src={currentVideoSrc}
									poster={getVideoPoster({ url: currentVideoSrc })}
									preload="auto"
									autoPlay
									loop
									muted
									playsInline
								/>
							)}
							</div>
						</div>
					</div>

					<div className="SliceHomeArtists-listWrap">
						<div className="SliceHomeArtists-mobileSelector">
							<button
								type="button"
								className="SliceHomeArtists-arrow"
								onClick={handlePrevService}
								aria-label="Servicio anterior"
							>
								<span aria-hidden>←</span>
							</button>
							<Link
								href={`/servicios/${activeService.slug}`}
								className="SliceHomeArtists-mobileTitle"
								onClick={(event) =>
									handleServiceClick(
										event,
										`/servicios/${activeService.slug}`,
									)
								}
							>
								{activeService.title}
							</Link>
							<button
								type="button"
								className="SliceHomeArtists-arrow"
								onClick={handleNextService}
								aria-label="Siguiente servicio"
							>
								<span aria-hidden>→</span>
							</button>
						</div>

						<div className="SliceHomeArtists-mobileRail" aria-hidden>
							{SERVICES.map((service, index) => (
								<span
									key={service.slug}
									className={`SliceHomeArtists-mobileRailDot${
										index === activeIndex ? ' is-active' : ''
									}`}
								/>
							))}
						</div>

						<nav ref={listRef} className="SliceHomeArtists-list" aria-label="Servicios">
							{SERVICES.map((service, index) => (
								<Link
									key={service.title}
									href={`/servicios/${service.slug}`}
									className={`SliceHomeArtists-listItem${
										index === activeIndex ? ' is-active' : ''
									}`}
									onClick={(event) =>
										handleServiceClick(
											event,
											`/servicios/${service.slug}`,
										)
									}
									onMouseEnter={() => setActiveIndex(index)}
									onFocus={() => setActiveIndex(index)}
								>
									<span className="SliceHomeArtists-itemDot" />
									<span>{service.title}</span>
								</Link>
							))}
						</nav>
						<div className="SliceHomeArtists-rail" aria-hidden>
							<div
								className="SliceHomeArtists-railThumb"
								style={{
									transform: `translateY(${thumbOffset}px)`,
								}}
							>
								<span />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
