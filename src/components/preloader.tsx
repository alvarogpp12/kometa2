'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function Preloader() {
	const [visible, setVisible] = useState(true)
	const [animatingOut, setAnimatingOut] = useState(false)
	const [logoEntered, setLogoEntered] = useState(false)

	useEffect(() => {
		const t1 = setTimeout(() => {
			setLogoEntered(true)
		}, 48)
		const t2 = setTimeout(() => {
			setAnimatingOut(true)
			setTimeout(() => setVisible(false), 720)
		}, 2640)

		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
		}
	}, [])

	if (!visible) return null

	return (
		<div
			className="PageLoader --is-show"
			style={{
				opacity: animatingOut ? 0 : 1,
				transition: 'opacity 0.95s cubic-bezier(0.76, 0, 0.24, 1)',
			}}
		>
			<div className="PageLoader-bg" />
			<div className="PageLoader-wrapper">
				<div
					className={`PageLoader-logo${
						logoEntered ? ' PageLoader-logo--entered' : ''
					}${animatingOut ? ' PageLoader-logo--exit' : ''}`}
				>
					<div className="PageLoader-logoStack">
						<Image
							src="/LOGO/LOGOKOMETA.svg"
							alt="Kometa"
							width={580}
							height={100}
							priority
							className="PageLoader-logoImage PageLoader-logoImage--kometa"
						/>
						<Image
							src="/LOGO/LOGOKOMETA.svg"
							alt=""
							aria-hidden
							width={580}
							height={100}
							priority
							className="PageLoader-logoImage PageLoader-logoImage--lab"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
