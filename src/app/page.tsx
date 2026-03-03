import { AnimatedLogo } from '@/components/animated-logo'
import { HeroIntro } from '@/components/hero-intro'
import { HomeShowreel } from '@/components/home-showreel'
import { HomeFamily } from '@/components/home-family'
import IaSplineViewer from '@/components/ia-spline-viewer'
import PlatePreview from '@/components/plate-preview'

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
						style={{
							position: 'absolute',
							width: '500px',
							height: '500px',
							top: '50%',
							left: '50%',
							transform:
								'translate(-50%, -50%) '
								+ 'scale(0.561)',
						}}
					/>
				}
				webDevMedia={
					<PlatePreview
						className="SliceHomeArtists-mediaVisual"
					/>
				}
			/>
		</>
	)
}
