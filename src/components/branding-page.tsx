import Link from 'next/link'

const ROWS = [
	{
		label: 'Branding',
		value:
			'Naming, logotipo e identidad corporativa, manual de '
			+ 'identidad, papelería, señalética y packaging.',
	},
	{
		label: 'Redes sociales',
		value:
			'Gestión de Instagram, Facebook, TikTok y LinkedIn: '
			+ 'calendario editorial, posts, reels, stories y '
			+ 'community management.',
	},
	{
		label: 'Publicidad',
		value:
			'Campañas en Meta y TikTok, con informe de '
			+ 'resultados.',
	},
	{
		label: 'Reseñas',
		value: 'Gestión y respuesta de reseñas en Google.',
	},
	{
		label: 'Lanzamientos',
		value: 'Publicidad exterior, medios e influencers.',
		accent: true,
	},
]

export default function BrandingPage() {
	return (
		<main className="ArtistPage">
			<section className="SliceArtistHero">
				<div className="SliceArtistHero-head Site-head">
					<div className="wrapper-1290 SliceArtistHero-headWrapper">
						<Link href="/" className="BackLink">
							<span className="BackLink-title">
								Volver al inicio
							</span>
						</Link>
						<span className="SliceArtistHero-headTimezone">
							Madrid
						</span>
					</div>
				</div>

				<div className="SliceArtistHero-wrapper wrapper-1290">
					<h1 className="SliceArtistHero-title">
						Branding y redes sociales
					</h1>
					<div className="SliceArtistHero-content">
						<p>
							Creamos la identidad de tu marca y
							gestionamos sus redes sociales.
						</p>
					</div>
				</div>
			</section>

			<section className="NoiseText">
				<div className="NoiseText-inner wrapper-1290">
					<div className="NoiseText-block">
						{ROWS.map((row, index) => (
							<div
								key={row.label}
								className={`NoiseText-row${
									index === ROWS.length - 1
										? ' --last'
										: ''
								}`}
							>
								<span className="NoiseText-label">
									{row.label}
								</span>
								<p
									className={`NoiseText-value${
										row.accent ? ' --accent' : ''
									}`}
								>
									{row.value}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	)
}
