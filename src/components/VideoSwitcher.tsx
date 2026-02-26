'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface VideoSwitcherProps {
	videos: [string, string]
	activeIndex: 0 | 1
	className?: string
	crossfadeDuration?: number
}

export default function VideoSwitcher({
	videos,
	activeIndex,
	className,
	crossfadeDuration = 0.55,
}: VideoSwitcherProps) {
	const [frontIndex, setFrontIndex] = useState<0 | 1>(activeIndex)
	const [backIndex, setBackIndex] = useState<0 | 1>(activeIndex)
	const frontWrapperRef = useRef<HTMLDivElement>(null)
	const backWrapperRef = useRef<HTMLDivElement>(null)
	const timelineRef = useRef<gsap.core.Timeline | null>(null)

	useEffect(() => {
		if (activeIndex === frontIndex) return
		const frontWrapper = frontWrapperRef.current
		const backWrapper = backWrapperRef.current
		if (!frontWrapper || !backWrapper) return

		setBackIndex(activeIndex)

		timelineRef.current?.kill()
		gsap.set(backWrapper, { opacity: 0 })

		const timeline = gsap.timeline({
			defaults: {
				ease: 'power2.out',
				duration: crossfadeDuration,
			},
			onComplete: () => {
				setFrontIndex(activeIndex)
			},
		})

		timeline
			.to(backWrapper, { opacity: 1 }, 0)
			.to(frontWrapper, { opacity: 0 }, 0)

		timelineRef.current = timeline

		return () => {
			timeline.kill()
		}
	}, [activeIndex, frontIndex, crossfadeDuration])

	useEffect(() => {
		const frontWrapper = frontWrapperRef.current
		const backWrapper = backWrapperRef.current
		if (!frontWrapper || !backWrapper) return

		gsap.set(frontWrapper, { opacity: 1 })
		gsap.set(backWrapper, { opacity: 0 })
	}, [])

	return (
		<div
			className={className}
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'hidden',
			}}
		>
			<div
				ref={frontWrapperRef}
				style={{
					position: 'absolute',
					inset: 0,
					zIndex: 2,
				}}
			>
				<video
					className="ProjectsGridLine-itemMedia AppVideo-video"
					src={videos[frontIndex]}
					preload="metadata"
					loop
					muted
					playsInline
					autoPlay
				/>
			</div>

			<div
				ref={backWrapperRef}
				style={{
					position: 'absolute',
					inset: 0,
					zIndex: 1,
				}}
			>
				<video
					className="ProjectsGridLine-itemMedia AppVideo-video"
					src={videos[backIndex]}
					preload="metadata"
					loop
					muted
					playsInline
					autoPlay
				/>
			</div>
		</div>
	)
}
