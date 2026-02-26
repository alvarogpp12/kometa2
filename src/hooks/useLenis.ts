'use client'

import { useContext } from 'react'
import { LenisContext } from '@/lib/lenis-context'

export function useLenis() {
	const { lenis } = useContext(LenisContext)
	return lenis
}
