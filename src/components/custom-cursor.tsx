'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

const CURSOR_SIZE = 10
const CURSOR_HOVER_SCALE = 4
const LERP_SPEED = 0.12

export function CustomCursor() {
	const outerRef = useRef<HTMLDivElement>(null)
	const dotRef = useRef<HTMLDivElement>(null)
	const pos = useRef({ x: -100, y: -100 })
	const target = useRef({ x: -100, y: -100 })
	const hovering = useRef(false)
	const rafId = useRef(0)

	const handleMouseMove = useCallback((e: MouseEvent) => {
		target.current.x = e.clientX
		target.current.y = e.clientY
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

		const tick = () => {
			pos.current.x +=
				(target.current.x - pos.current.x) * LERP_SPEED
			pos.current.y +=
				(target.current.y - pos.current.y) * LERP_SPEED

			outer.style.transform =
				`translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`

			rafId.current = requestAnimationFrame(tick)
		}

		rafId.current = requestAnimationFrame(tick)
		window.addEventListener('mousemove', handleMouseMove)

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
			cancelAnimationFrame(rafId.current)
			window.removeEventListener(
				'mousemove',
				handleMouseMove,
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
		handleMouseMove,
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
