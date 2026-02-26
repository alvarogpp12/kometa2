'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionEventDetail {
	href: string
}

export function PageTransition() {
	const pathname = usePathname()
	const [phase, setPhase] = useState<'idle' | 'covering' | 'revealing'>(
		'idle',
	)
	const [targetHref, setTargetHref] = useState<string | null>(null)

	useEffect(() => {
		const onStart = (event: Event) => {
			const customEvent =
				event as CustomEvent<PageTransitionEventDetail>
			const nextHref = customEvent.detail?.href
			if (!nextHref) return

			setTargetHref(nextHref)
			setPhase('covering')
		}

		window.addEventListener(
			'kometa:page-transition-start',
			onStart as EventListener,
		)

		return () => {
			window.removeEventListener(
				'kometa:page-transition-start',
				onStart as EventListener,
			)
		}
	}, [])

	useEffect(() => {
		if (phase !== 'covering') return
		if (!targetHref || pathname !== targetHref) return

		const revealId = requestAnimationFrame(() => {
			setPhase('revealing')
		})

		const resetId = window.setTimeout(() => {
			setPhase('idle')
			setTargetHref(null)
		}, 780)

		return () => {
			cancelAnimationFrame(revealId)
			window.clearTimeout(resetId)
		}
	}, [pathname, targetHref, phase])

	const className =
		phase === 'idle'
			? 'PageTransition'
			: phase === 'covering'
				? 'PageTransition --active --covering'
				: 'PageTransition --active --revealing'

	return (
		<div className={className} aria-hidden />
	)
}
