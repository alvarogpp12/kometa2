'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/hooks/useLenis'

export default function WebDevPage() {
	const lenis = useLenis()
	const pageRef = useRef<HTMLElement>(null)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const heroBlockRef = useRef<HTMLDivElement>(null)
	const techRef = useRef<HTMLElement>(null)
	const designRef = useRef<HTMLElement>(null)
	const ecommerceRef = useRef<HTMLElement>(null)
	const [entered, setEntered] = useState(false)

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
		requestAnimationFrame(() => setEntered(true))
	}, [])

	useEffect(() => {
		if (!lenis) return
		const onScroll = () => ScrollTrigger.update()
		lenis.on('scroll', onScroll)
		return () => lenis.off('scroll', onScroll)
	}, [lenis])

	useEffect(() => {
		if (!entered) return

		const ctx = gsap.context(() => {
			const reveals = pageRef.current?.querySelectorAll(
				'[data-reveal]',
			)
			if (!reveals) return

			reveals.forEach((el) => {
				gsap.fromTo(
					el,
					{ autoAlpha: 0, y: 48 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.9,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: el,
							start: 'top 88%',
							once: true,
						},
					},
				)
			})
		})

		return () => ctx.revert()
	}, [entered])

	return (
		<main ref={pageRef} className="WebDevPage">
			<div className="WebDevPage-head Site-head">
				<div className="wrapper-1290 SliceArtistHero-headWrapper">
					<Link href="/" className="BackLink">
						<span className="BackLink-title">
							Go to homepage
						</span>
					</Link>
					<span className="SliceArtistHero-headTimezone">
						Madrid
					</span>
				</div>
			</div>

			<section className="WebDevPage-hero">
				<div className="WebDevPage-heroInner wrapper-1290">
					<h1
						ref={titleRef}
						className="WebDevPage-title"
						style={{
							opacity: entered ? 1 : 0,
							transform: entered
								? 'translateY(0)'
								: 'translateY(4rem)',
							transition:
								'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)',
						}}
					>
						<span>Desarrollo</span>
						<span>Web</span>
					</h1>

					<div
						ref={heroBlockRef}
						className="WebDevPage-bodyRight"
						style={{
							opacity: entered ? 1 : 0,
							transform: entered
								? 'translateY(0)'
								: 'translateY(3rem)',
							transition:
								'all 1s cubic-bezier(0.165, 0.84, 0.44, 1) 0.15s',
						}}
					>
						<p className="WebDevPage-bodySerif">
							Webs que no solo se ven
							bien. Funcionan.
						</p>
						<p className="WebDevPage-bodyText">
							Si tu web no genera
							oportunidades, solo está
							ocupando espacio.
						</p>
						<p className="WebDevPage-bodySerif">
							Creamos plataformas digitales
							diseñadas desde cero para
							posicionar, convertir y escalar.
						</p>
						<p className="WebDevPage-bodyHighlight">
							Sin plantillas.
							Sin soluciones estándar.
						</p>
						<p className="WebDevPage-bodySerif --large">
							Cada proyecto es único.
						</p>
					</div>
				</div>
			</section>

			<section ref={techRef} className="WebDevPage-tech">
				<div className="wrapper-1290">
					<div className="WebDevPage-techGrid" data-reveal>
						<div className="WebDevPage-techLeft">
							<h2 className="WebDevPage-sectionTitle">
								Tecnología que
								<br />
								impulsa resultados
							</h2>
							<p className="WebDevPage-techDesc">
								Desarrollamos con Next.js, React y
								tecnologías modernas para construir
								webs:
							</p>
						</div>

						<div className="WebDevPage-techRight">
							<ul className="WebDevPage-techList">
								<li>Rápidas</li>
								<li>Escalables</li>
								<li>Optimizadas para SEO</li>
								<li>Preparadas para crecer</li>
							</ul>
							
						</div>
					</div>
				</div>
			</section>

			<section className="WebDevPage-duo">
				<div className="wrapper-1290">
					<div className="WebDevPage-duoGrid">
						<div
							ref={designRef}
							className="WebDevPage-duoBlock"
							data-reveal
						>
							<h2 className="WebDevPage-sectionTitle">
								Diseño
								<br />
								estratégico
							</h2>
							<p className="WebDevPage-duoLead">
								Estética y funcionalidad trabajando
								juntas.
							</p>
							<p className="WebDevPage-duoBody">
								UX cuidada.
								<br />
								Arquitectura pensada para conversión.
								<br />
								Experiencias que guían, no que
								distraen.
							</p>
						</div>

						<div
							ref={ecommerceRef}
							className="WebDevPage-duoBlock"
							data-reveal
						>
							<h2 className="WebDevPage-sectionTitle">
								Ecommerce &
								<br />
								Landing Pages
							</h2>
							<p className="WebDevPage-duoLead">
								Tiendas online con Stripe.
								<br />
								Landing pages enfocadas en
								resultados.
								<br />
								Sistemas pensados para vender.
							</p>
							<p className="WebDevPage-duoClose">
								No es solo diseño.
								<br />
								<strong>Es negocio.</strong>
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
