'use client'

import { Component } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import Spline from '@splinetool/react-spline'

class SplineErrorBoundary extends Component<
	{ children: ReactNode },
	{ failed: boolean }
> {
	state = { failed: false }

	static getDerivedStateFromError() {
		return { failed: true }
	}

	componentDidCatch(error: unknown) {
		console.warn('[SPLINE_LOAD_ERROR]', error)
	}

	render() {
		return this.state.failed ? null : this.props.children
	}
}

/**
 * Spline throws during render when its scene can't be fetched (ad
 * blockers, corporate firewalls, flaky mobile data). Without a
 * boundary that takes down the whole page, so the 3D scene simply
 * disappears instead.
 */
export default function SafeSpline(
	props: ComponentProps<typeof Spline>,
) {
	return (
		<SplineErrorBoundary>
			<Spline {...props} />
		</SplineErrorBoundary>
	)
}
