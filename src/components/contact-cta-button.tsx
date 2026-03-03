'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ContactCtaButtonProps {
	className?: string
}

export function ContactCtaButton({
	className,
}: ContactCtaButtonProps) {
	const buttonRef = useRef<HTMLButtonElement>(null)
	const dotRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const buttonElement = buttonRef.current
		const dotElement = dotRef.current
		if (!buttonElement || !dotElement) return

		const shouldReduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)',
		).matches
		if (shouldReduceMotion) return

		const timeline = gsap.timeline({
			repeat: -1,
			repeatDelay: 0.4,
		})

		timeline
			.to(buttonElement, {
				scale: 1.02,
				y: -1,
				boxShadow:
					'0 0 0 0 rgba(255, 62, 48, 0.45), ' +
					'0 12px 30px rgba(255, 62, 48, 0.2)',
				duration: 0.7,
				ease: 'power2.out',
			})
			.to(
				dotElement,
				{
					scale: 1.4,
					rotate: 180,
					duration: 0.55,
					ease: 'back.out(2)',
				},
				0.05,
			)
			.to(buttonElement, {
				scale: 1,
				y: 0,
				boxShadow:
					'0 0 0 14px rgba(255, 62, 48, 0), ' +
					'0 8px 18px rgba(53, 54, 58, 0.14)',
				duration: 1,
				ease: 'power2.inOut',
			})
			.to(
				dotElement,
				{
					scale: 1,
					rotate: 360,
					duration: 1,
					ease: 'power2.inOut',
				},
				0.35,
			)

		return () => timeline.kill()
	}, [])

	return (
		<button
			ref={buttonRef}
			type="button"
			className={`ContactCtaButton ${className ?? ''}`.trim()}
			data-cursor-hover
			onClick={() =>
				window.dispatchEvent(new Event('openKevinChat'))
			}
		>
			<span ref={dotRef} className="ContactCtaButton-dot" />
			<span className="ContactCtaButton-label">Contacto</span>
		</button>
	)
}
