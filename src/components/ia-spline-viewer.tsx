'use client'

import { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

interface IaSplineViewerProps {
	scene: string
	className?: string
}

export default function IaSplineViewer({
	scene,
	className,
}: IaSplineViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		const blockWheel = (e: WheelEvent) => {
			e.preventDefault()
			e.stopPropagation()

			const target = el.parentElement ?? document.documentElement
			target.dispatchEvent(
				new WheelEvent('wheel', {
					deltaX: e.deltaX,
					deltaY: e.deltaY,
					deltaMode: e.deltaMode,
					bubbles: true,
					cancelable: true,
				}),
			)
		}

		el.addEventListener('wheel', blockWheel, { passive: false })
		return () => el.removeEventListener('wheel', blockWheel)
	}, [])

	return (
		<div
			ref={containerRef}
			className={className}
			style={{ width: '100%', height: '100%' }}
		>
			<Spline
				scene={scene}
				style={{
					width: '100%',
					height: '100%',
				}}
			/>
		</div>
	)
}
