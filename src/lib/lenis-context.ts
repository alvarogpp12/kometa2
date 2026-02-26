'use client'

import { createContext } from 'react'
import type Lenis from 'lenis'

interface LenisContextValue {
	lenis: Lenis | null
}

export const LenisContext = createContext<LenisContextValue>({
	lenis: null,
})
