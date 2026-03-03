'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
	{ href: '/servicios/produccion-audiovisual', label: 'Producción' },
	{ href: '/servicios/desarrollo-web', label: 'Desarrollo Web' },
	{ href: '/servicios/ia-aplicada', label: 'IA Aplicada' },
	{ href: '/servicios/gabinete-de-prensa', label: 'Prensa' },
]

export function Navigation() {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	const [bgStyle, setBgStyle] = useState({ left: 0, width: 0 })
	const navRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

	useEffect(() => {
		const activeIndex = NAV_LINKS.findIndex(
			(link) => pathname === link.href,
		)
		if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
			const el = itemRefs.current[activeIndex]!
			setBgStyle({
				left: el.offsetLeft,
				width: el.offsetWidth,
			})
		} else {
			setBgStyle({ left: 0, width: 0 })
		}
	}, [pathname])

	const handleHover = (index: number) => {
		const el = itemRefs.current[index]
		if (el) {
			setBgStyle({
				left: el.offsetLeft,
				width: el.offsetWidth,
			})
		}
	}

	const handleLeave = () => {
		const activeIndex = NAV_LINKS.findIndex(
			(link) => pathname === link.href,
		)
		if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
			const el = itemRefs.current[activeIndex]!
			setBgStyle({
				left: el.offsetLeft,
				width: el.offsetWidth,
			})
		} else {
			setBgStyle({ left: 0, width: 0 })
		}
	}

	return (
		<header className="Header">
			<div className="Header-wrapper">
				{/* Desktop nav */}
				<nav
					ref={navRef}
					className="Header-nav"
					onMouseLeave={handleLeave}
				>
					{bgStyle.width > 0 && (
						<div
							className="Header-navBg"
							style={{
								left: `${bgStyle.left}px`,
								width: `${bgStyle.width}px`,
								transition:
									'left 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), width 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
							}}
						/>
					)}
					{NAV_LINKS.map((link, i) => (
						<Link
							key={link.href}
							href={link.href}
							ref={(el) => {
								itemRefs.current[i] = el
							}}
							className="Header-navItem"
							onMouseEnter={() => handleHover(i)}
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Mobile menu button */}
				<button
					className="Header-menuBt"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					<span
						style={{
							transform: menuOpen
								? 'translateY(-8rem)'
								: 'translateY(0)',
							transition:
								'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
						}}
					>
						Menu
					</span>
					<span
						style={{
							position: 'absolute',
							transform: menuOpen
								? 'translateY(0)'
								: 'translateY(4rem)',
							transition:
								'transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)',
							transitionDelay: menuOpen ? '0.2s' : '0s',
						}}
					>
						Close menu
					</span>
				</button>
			</div>

			{/* Mobile menu overlay */}
			{menuOpen && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'var(--color-grey-1)',
						zIndex: -1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '2rem',
					}}
				>
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="Header-navItem"
							style={{
								fontSize: '1.6rem',
								textTransform: 'uppercase',
								color: 'var(--color-white)',
							}}
							onClick={() => setMenuOpen(false)}
						>
							{link.label}
						</Link>
					))}
				</div>
			)}
		</header>
	)
}
