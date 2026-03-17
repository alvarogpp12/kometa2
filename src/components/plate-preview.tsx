'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { IMAGE_URLS } from '@/lib/cloudinary-media'

const COLORS = [
	{ id: 'rojo', name: 'Rojo', hex: '#BE4A34' },
	{ id: 'azul', name: 'Azul', hex: '#344E78' },
	{ id: 'turquesa', name: 'Turquesa', hex: '#8DCAD8' },
	{ id: 'negro', name: 'Negro', hex: '#2D2D2D' },
	{ id: 'verde', name: 'Verde', hex: '#17654F' },
	{ id: 'amarillo', name: 'Amarillo', hex: '#E5A32C' },
]

const GRES_IMAGES: Record<string, string> = {
	rojo: IMAGE_URLS.gresRojo,
	azul: IMAGE_URLS.gresAzul,
	turquesa: IMAGE_URLS.gresTurquesa,
	negro: IMAGE_URLS.gresNegro,
	verde: IMAGE_URLS.gresVerde,
	amarillo: IMAGE_URLS.gresAmarillo,
}

interface PlatePreviewProps {
	className?: string
}

export default function PlatePreview({
	className,
}: PlatePreviewProps) {
	const [selectedColor, setSelectedColor] = useState('rojo')
	const [isAnimating, setIsAnimating] = useState(false)
	const plateRef = useRef<HTMLDivElement>(null)
	const shadowRef = useRef<HTMLDivElement>(null)

	const currentImage = useMemo(
		() => GRES_IMAGES[selectedColor] ?? GRES_IMAGES.rojo,
		[selectedColor],
	)

	const animatePlate = useCallback(
		(onSwap: () => void) => {
			const plate = plateRef.current
			const shadow = shadowRef.current
			if (!plate) {
				onSwap()
				return
			}

			setIsAnimating(true)
			const tl = gsap.timeline({
				onComplete: () => setIsAnimating(false),
			})

			tl.to(shadow, {
				opacity: 0,
				duration: 0.06,
				ease: 'none',
			})
				.to(plate, {
					opacity: 0,
					duration: 0.12,
					ease: 'power2.in',
				}, 0.04)
				.call(() => onSwap())
				.to(plate, {
					opacity: 1,
					duration: 0.35,
					ease: 'power4.out',
				}, '+=0.03')
				.to(shadow, {
					opacity: 1,
					duration: 0.3,
					ease: 'power4.out',
				}, '<0.1')
		},
		[],
	)

	const handleColorChange = useCallback(
		(colorId: string) => {
			if (colorId === selectedColor || isAnimating) return
			animatePlate(() => setSelectedColor(colorId))
		},
		[selectedColor, isAnimating, animatePlate],
	)

	return (
		<div
			className={className}
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				position: 'relative',
				userSelect: 'none',
			}}
		>
			{/* ── Top bar ── */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '10px 16px',
					backgroundColor: '#1a1a1a',
					borderRadius: '1.2rem 1.2rem 0 0',
					flexShrink: 0,
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '6px',
					}}
					aria-hidden="true"
				>
					<span
						style={{
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							backgroundColor: '#ff5f57',
						}}
					/>
					<span
						style={{
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							backgroundColor: '#febc2e',
						}}
					/>
					<span
						style={{
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							backgroundColor: '#28c840',
						}}
					/>
				</div>
				<span
					style={{
						fontFamily: 'var(--font-body, sans-serif)',
						fontSize: '1.2rem',
						fontWeight: 600,
						letterSpacing: '0.06em',
						textTransform: 'uppercase',
						color: '#ffffff',
					}}
				>
					Tienda Online Adealfar
				</span>
				<div style={{ width: '44px' }} aria-hidden="true" />
			</div>

			{/* ── Content area ── */}
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '6% 0 4%',
					minHeight: 0,
				}}
			>
				<div
					style={{
						position: 'relative',
						width: '65%',
						maxWidth: '300px',
						aspectRatio: '1 / 0.85',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						ref={plateRef}
						style={{
							width: '100%',
							height: '100%',
							willChange: 'opacity',
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={currentImage}
							alt={`Plato gres ${selectedColor}`}
							loading="lazy"
							decoding="async"
							fetchPriority="low"
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'contain',
								pointerEvents: 'none',
							}}
						/>
					</div>
					<div
						ref={shadowRef}
						style={{
							position: 'absolute',
							bottom: '-8px',
							left: '50%',
							transform: 'translateX(-50%)',
							height: '20px',
							width: '55%',
							borderRadius: '50%',
							background: 'rgba(0, 0, 0, 0.25)',
							filter: 'blur(10px)',
							zIndex: 1,
							willChange: 'opacity',
						}}
						aria-hidden="true"
					/>
				</div>

				<div
					style={{
						display: 'flex',
						gap: '10px',
						marginTop: '8%',
						justifyContent: 'center',
					}}
				>
					{COLORS.map((color) => (
						<button
							key={color.id}
							onClick={() =>
								handleColorChange(color.id)
							}
							aria-label={`Color ${color.name}`}
							style={{
								width: '24px',
								height: '24px',
								borderRadius: '50%',
								backgroundColor: color.hex,
								border: 'none',
								cursor: 'pointer',
								transition:
									'transform 0.2s, box-shadow 0.2s',
								transform:
									selectedColor === color.id
										? 'scale(1.15)'
										: 'scale(1)',
								boxShadow:
									selectedColor === color.id
										? '0 0 0 2px #f5f5f5,' +
											' 0 0 0 4px #171717'
										: 'none',
							}}
						/>
					))}
				</div>
			</div>

			{/* ── Bottom bar ── */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '8px 16px',
					backgroundColor: '#1a1a1a',
					borderRadius: '0 0 1.2rem 1.2rem',
					flexShrink: 0,
				}}
			>
				<span
					style={{
						fontFamily: 'var(--font-body, sans-serif)',
						fontSize: '1rem',
						fontWeight: 400,
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
						color: 'rgba(255, 255, 255, 0.45)',
					}}
				>
					Desarrollada por Kometalab
				</span>
			</div>
		</div>
	)
}
