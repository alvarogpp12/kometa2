'use client'

import { useCallback, useRef } from 'react'
import type { CSSProperties } from 'react'
import Spline from '@splinetool/react-spline'
import type { Application } from '@splinetool/runtime'

interface IaSplineViewerProps {
	scene: string
	className?: string
	style?: CSSProperties
}

export default function IaSplineViewer({
	scene,
	className,
	style,
}: IaSplineViewerProps) {
	const hasSetup = useRef(false)

	const handleLoad = useCallback((app: Application) => {
		if (hasSetup.current) return
		hasSetup.current = true

		const canvas = app.canvas as HTMLCanvasElement | undefined
		if (!canvas) return

		const root = canvas.closest(
			'.SliceHomeArtists-spline',
		) as HTMLElement | null

		if (root) {
			const observer = new MutationObserver(() => {
				root
					.querySelectorAll<HTMLElement>('a, [class*="logo"]')
					.forEach((el) => {
						el.style.display = 'none'
					})
			})
			observer.observe(root, { childList: true, subtree: true })

			root
				.querySelectorAll<HTMLElement>('a, [class*="logo"]')
				.forEach((el) => {
					el.style.display = 'none'
				})
		}

		const scrollTarget = root?.closest(
			'.SliceHomeArtists-mediaStage',
		) as HTMLElement | null

		const wheelContainer = root ?? canvas.parentElement
		if (wheelContainer) {
			wheelContainer.addEventListener(
				'wheel',
				(e: WheelEvent) => {
					e.preventDefault()
					e.stopPropagation()
					const dest =
						scrollTarget?.parentElement
						?? document.documentElement
					dest.dispatchEvent(
						new WheelEvent('wheel', {
							deltaX: e.deltaX,
							deltaY: e.deltaY,
							deltaMode: e.deltaMode,
							bubbles: true,
							cancelable: true,
						}),
					)
				},
				{ passive: false },
			)
		}
	}, [])

	return (
		<Spline
			className={className}
			scene={scene}
			style={style}
			onLoad={handleLoad}
		/>
	)
}
