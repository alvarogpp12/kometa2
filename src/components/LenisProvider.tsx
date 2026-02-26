'use client'

import {
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { ReactLenis, useLenis as useReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import type Lenis from 'lenis'
import { LenisContext } from '@/lib/lenis-context'

interface LenisContextBridgeProps {
	onReady: (instance: Lenis | null) => void
}

function LenisContextBridge({
	onReady,
}: LenisContextBridgeProps) {
	const instance = useReactLenis()

	useEffect(() => {
		onReady(instance ?? null)
	}, [instance, onReady])

	return null
}

interface LenisProviderProps {
	children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
	const lenisRef = useRef<LenisRef | null>(null)
	const runtimeLenisRef = useRef<Lenis | null>(null)
	const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)

	useEffect(() => {
		let rafId = 0
		const lenis = lenisInstance
		if (!lenis) return

		// Keep a manual RAF fallback for setups disabling autoRaf.
		if (!lenis.options.autoRaf) {
			const animate = (time: number) => {
				runtimeLenisRef.current?.raf(time)
				rafId = window.requestAnimationFrame(animate)
			}
			rafId = window.requestAnimationFrame(animate)
		}

		return () => {
			if (rafId) window.cancelAnimationFrame(rafId)
		}
	}, [lenisInstance])

	const contextValue = useMemo(() => {
		return { lenis: lenisInstance }
	}, [lenisInstance])

	return (
		<ReactLenis
			ref={lenisRef}
			root
			options={{
				autoRaf: true,
				smoothWheel: true,
				duration: 1.2,
				easing: (t: number) =>
					Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				syncTouch: true,
			}}
		>
			<LenisContextBridge
				onReady={(instance) => {
					runtimeLenisRef.current = instance
					setLenisInstance(instance)
				}}
			/>
			<LenisContext.Provider value={contextValue}>
				{children}
			</LenisContext.Provider>
		</ReactLenis>
	)
}
