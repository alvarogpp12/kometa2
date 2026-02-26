'use client'

import { useEffect, useRef } from 'react'

interface SmoothScrollProps {
	children: React.ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
	const lenisRef = useRef<any>(null)

	useEffect(() => {
		let raf: number

		const initLenis = async () => {
			const Lenis = (await import('lenis')).default

			lenisRef.current = new Lenis({
				duration: 1.2,
				easing: (t: number) =>
					Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				smoothWheel: true,
			})

			const animate = (time: number) => {
				lenisRef.current?.raf(time)
				raf = requestAnimationFrame(animate)
			}

			raf = requestAnimationFrame(animate)
		}

		initLenis()

		return () => {
			cancelAnimationFrame(raf)
			lenisRef.current?.destroy()
		}
	}, [])

	return <main>{children}</main>
}
