'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
	const cursorRef = useRef<HTMLDivElement>(null)
	const squareRef = useRef<HTMLDivElement>(null)
	const pos = useRef({ x: 0, y: 0 })
	const target = useRef({ x: 0, y: 0 })

	useEffect(() => {
		const cursor = cursorRef.current
		const square = squareRef.current
		if (!cursor || !square) return

		const onMouseMove = (e: MouseEvent) => {
			target.current = { x: e.clientX, y: e.clientY }
		}

		let raf: number
		const animate = () => {
			pos.current.x +=
				(target.current.x - pos.current.x) * 0.15
			pos.current.y +=
				(target.current.y - pos.current.y) * 0.15

			cursor.style.transform =
				`translate(${pos.current.x}px, ${pos.current.y}px)`

			raf = requestAnimationFrame(animate)
		}

		animate()
		window.addEventListener('mousemove', onMouseMove)

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('mousemove', onMouseMove)
		}
	}, [])

	return (
		<div className="Cursor">
			<div ref={cursorRef} className="Cursor-el">
				<div
					ref={squareRef}
					className="Cursor-default"
					style={{
						backgroundColor: 'var(--color-grey-1)',
					}}
				/>
			</div>
		</div>
	)
}
