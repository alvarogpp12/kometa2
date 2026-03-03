'use client'

import { useEffect, useState } from 'react'

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
				<div className="HeroIntro-title">
					<p className="HeroIntro-line HeroIntro-line--intro">
						Transformamos tus ideas en proyectos reales.
					</p>
					<p className="HeroIntro-line HeroIntro-line--words">
						<span className="HeroIntro-word HeroIntro-word--full">
							Estrategia
						</span>{' '}
						<span className="HeroIntro-word HeroIntro-word--soft">
							Produccion
						</span>{' '}
						<span className="HeroIntro-word HeroIntro-word--full">
							Tecnologia
						</span>{' '}
						<span className="HeroIntro-word HeroIntro-word--soft">
							Presencia
						</span>
					</p>
				</div>
			</div>
		</div>
	)
}
