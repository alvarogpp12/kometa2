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
			<p className="HeroIntro-title">
				Transformamos tus ideas en proyectos reales.
				<br />
				<span className="HeroIntro-words">
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
				</span>
			</p>
			<div>
				<button
					type="button"
					className="AppButton"
					onClick={() =>
						window.dispatchEvent(
							new Event('openKevinChat'),
						)
					}
				>
					<span className="pl-square" />
					<span className="AppButton-title">
						Read More
					</span>
				</button>
			</div>
		</div>
	)
}
