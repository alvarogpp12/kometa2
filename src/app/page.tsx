import { AnimatedLogo } from '@/components/animated-logo'
import { HeroIntro } from '@/components/hero-intro'
import { HomeShowreel } from '@/components/home-showreel'
import { HomeFamily } from '@/components/home-family'
import { HomeCarousel } from '@/components/home-carousel'
import { HomeFooter } from '@/components/home-footer'
import IaSplineViewer from '@/components/ia-spline-viewer'

export default function HomePage() {
	return (
		<>
			<section className="HomeHero">
				<div className="wrapper">
					<AnimatedLogo />
				</div>
				<div className="wrapper">
					<HeroIntro />
				</div>
			</section>

			<HomeShowreel />
			<HomeFamily
				iaMedia={
					<IaSplineViewer
						className="SliceHomeArtists-spline"
						scene="https://prod.spline.design/QXi9B-cOSBcQ8hPw/scene.splinecode"
					/>
				}
			/>
			<HomeCarousel />
			<HomeFooter />
		</>
	)
}
