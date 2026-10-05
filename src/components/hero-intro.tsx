'use client'

import { useEffect, useState } from 'react'
import { ContactCtaButton } from '@/components/contact-cta-button'

export function HeroIntro() {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setLoaded(true), 2800)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div
			className="HeroIntro"
			style={{
				opacity: loaded ? 1 : 0,
				transform: loaded ? 'translateY(0)' : 'translateY(3rem)',
				transition:
					'opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) 0.1s, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) 0.1s',
			}}
		>
			<div className="HeroIntro-top">
				<div>
					<h1 className="HeroIntro-claim">
						Nuestras madres siguen sin entender
						a qué nos dedicamos.{' '}
						<span className="HeroIntro-claimAccent">
							Nuestros clientes, sí.
						</span>
					</h1>
					<p className="HeroIntro-descriptor">
						Producción audiovisual, publicidad y
						comunicación en Madrid.
					</p>
				</div>
				<ContactCtaButton />
			</div>
		</div>
	)
}
