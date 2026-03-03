'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

const CURSOR_SIZE = 10
const CURSOR_HOVER_SCALE = 4

export function CustomCursor() {
	const outerRef = useRef<HTMLDivElement>(null)
	const dotRef = useRef<HTMLDivElement>(null)
	const hovering = useRef(false)

	const handlePointerMove = useCallback((e: PointerEvent) => {
		const outer = outerRef.current
		if (!outer) return
		outer.style.transform =
			`translate3d(${e.clientX}px, ${e.clientY}px, 0)`
	}, [])

	const handleMouseEnterHover = useCallback(() => {
		hovering.current = true
		if (!dotRef.current) return
		gsap.to(dotRef.current, {
			scale: CURSOR_HOVER_SCALE,
			opacity: 0.25,
			duration: 0.4,
			ease: 'power3.out',
		})
	}, [])

	const handleMouseLeaveHover = useCallback(() => {
		hovering.current = false
		if (!dotRef.current) return
		gsap.to(dotRef.current, {
			scale: 1,
			opacity: 1,
			duration: 0.4,
			ease: 'power3.out',
		})
	}, [])

	useEffect(() => {
		const outer = outerRef.current
		if (!outer) return

		outer.style.transform = 'translate3d(-100px, -100px, 0)'
		window.addEventListener('pointermove', handlePointerMove, {
			passive: true,
		})

		const hoverTargets = document.querySelectorAll(
			'a, button, [data-cursor-hover]',
		)
		hoverTargets.forEach((el) => {
			el.addEventListener(
				'mouseenter',
				handleMouseEnterHover,
			)
			el.addEventListener(
				'mouseleave',
				handleMouseLeaveHover,
			)
		})

		const observer = new MutationObserver(() => {
			const fresh = document.querySelectorAll(
				'a, button, [data-cursor-hover]',
			)
			fresh.forEach((el) => {
				el.removeEventListener(
					'mouseenter',
					handleMouseEnterHover,
				)
				el.removeEventListener(
					'mouseleave',
					handleMouseLeaveHover,
				)
				el.addEventListener(
					'mouseenter',
					handleMouseEnterHover,
				)
				el.addEventListener(
					'mouseleave',
					handleMouseLeaveHover,
				)
			})
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		})

		return () => {
			window.removeEventListener(
				'pointermove',
				handlePointerMove,
			)
			hoverTargets.forEach((el) => {
				el.removeEventListener(
					'mouseenter',
					handleMouseEnterHover,
				)
				el.removeEventListener(
					'mouseleave',
					handleMouseLeaveHover,
				)
			})
			observer.disconnect()
		}
	}, [
		handlePointerMove,
		handleMouseEnterHover,
		handleMouseLeaveHover,
	])

	return (
		<div className="Cursor">
			<div ref={outerRef} className="Cursor-el">
				<div ref={dotRef} className="Cursor-default" />
			</div>
		</div>
	)
}
