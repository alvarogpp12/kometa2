'use client'

import { useEffect, useRef } from 'react'
import { VIDEO_URLS } from '@/lib/cloudinary-media'

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value))
}

export function HomeShowreel() {
	const sectionRef = useRef<HTMLElement>(null)
	const videoWrapRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const sectionEl = sectionRef.current
		const videoWrapEl = videoWrapRef.current
		if (!sectionEl || !videoWrapEl) return

		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches
		if (reducedMotion) {
			videoWrapEl.style.clipPath = 'inset(0% round 8px)'
			return
		}

		let rafId = 0

		const updateClipPath = () => {
			const rect = sectionEl.getBoundingClientRect()
			const viewportHeight = window.innerHeight

			// Clip-path animation based on scroll position
			const progress = clamp(
				(viewportHeight - rect.top) / rect.height,
				0,
				1,
			)
			const insetValue = (1 - progress) * 20
			videoWrapEl.style.clipPath =
				`inset(${insetValue}% round 8px)`
		}

		const onScrollOrResize = () => {
			cancelAnimationFrame(rafId)
			rafId = requestAnimationFrame(updateClipPath)
		}

		updateClipPath()
		window.addEventListener('scroll', onScrollOrResize, {
			passive: true,
		})
		window.addEventListener('resize', onScrollOrResize)

		return () => {
			cancelAnimationFrame(rafId)
			window.removeEventListener('scroll', onScrollOrResize)
			window.removeEventListener('resize', onScrollOrResize)
		}
	}, [])

	return (
		<section
			ref={sectionRef}
			className="SliceHomeShowreels"
		>
			<div className="wrapper-1290">
				<div
					ref={videoWrapRef}
					className="SliceHomeShowreels-video"
				>
					<div className="AppVideo --is-playing --fit-cover">
						<video
							className="AppVideo-video"
							preload="metadata"
							playsInline
							loop
							muted
							autoPlay
						>
							<source
								src={VIDEO_URLS.webTaranjales}
								type="video/mp4"
							/>
						</video>
					</div>
				</div>
			</div>
		</section>
	)
}
