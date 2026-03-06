export interface CloudinaryVideoUrls {
	adealfar: string
	gonzalezYGonzalez: string
	webTaranjales: string
	doMadrid: string
	cuandoHarryEncontroAMeghan: string
	reel1: string
	reel3: string
	desarrolloWeb: string
	video20260216: string
	disenoAMedida: string
	rendimientoExtremo: string
	escalableDiaUno: string
	sanvinxLepicurien: string
}

export interface CloudinaryImageUrls {
	vogueLogo: string
	rtveLogo: string
	marieClaireLogo: string
	holaLogo: string
	atresplayerLogo: string
	elDebateLogo: string
	semanaLogo: string
	mediasetLogo: string
	vanitatisLogo: string
	agenciaEfeLogo: string
	europaPressLogo: string
	efeLogo: string
	gresRojo: string
	gresAzul: string
	gresTurquesa: string
	gresNegro: string
	gresVerde: string
	gresAmarillo: string
	pressHero1: string
	pressHero2: string
	pressHero3: string
	pressHero4: string
}

interface VideoOptimizationOptions {
	url: string
	maxWidth?: number
}

function optimizeCloudinaryVideo({
	url,
	maxWidth = 1920,
}: VideoOptimizationOptions): string {
	if (!url.includes('/res.cloudinary.com/')) {
		return url
	}
	return url.replace(
		'/video/upload/',
		`/video/upload/f_auto,vc_auto,q_auto:best,c_limit,w_${maxWidth}/`,
	)
}

function optimizeCloudinaryImage(url: string): string {
	if (!url.includes('/res.cloudinary.com/')) {
		return url
	}
	if (url.endsWith('.svg')) {
		return url
	}
	return url.replace(
		'/image/upload/',
		'/image/upload/f_auto,q_auto:good/',
	)
}

export const VIDEO_URLS: CloudinaryVideoUrls = {
	adealfar:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544832/adealfar_ukgjvq.mp4',
			},
		),
	gonzalezYGonzalez:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544883/gonzalezygonzalez_wg2klc.mp4',
			},
		),
	webTaranjales:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544856/webtaranjales_iiwemo.mp4',
			},
		),
	doMadrid:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772571020/vinos-de-madrid/do_madrid_v1_1080p.mp4',
			},
		),
	cuandoHarryEncontroAMeghan:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772571175/vinos-de-madrid/cuando_harry_encontro_a_meghan_v01_1080p.mp4',
			},
		),
	reel1:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544867/REEL_1_dh1lhh.mp4',
			},
		),
	reel3:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544822/REEL_3_wpaqew.mp4',
			},
		),
	desarrolloWeb:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544636/DESAROOLLOWEBDEFINITIVO2_nzg7sp.mov',
			},
		),
	video20260216:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544618/VIDEO-2026-02-16-22-52-32_pd7wsa.mp4',
			},
		),
	disenoAMedida:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544571/diseno-a-medida_jatvo2.mp4',
			},
		),
	rendimientoExtremo:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544580/rendimiento-extremo_brshzw.mp4',
			},
		),
	escalableDiaUno:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544585/escalable-desde-dia-uno_hmklnu.mp4',
			},
		),
	sanvinxLepicurien:
		optimizeCloudinaryVideo(
			{
				url: 'https://res.cloudinary.com/dkgv4tw3q/video/upload/v1772544754/sanvin_x_Le%CC%81picurien_ensxbg.mp4',
			},
		),
}

export const IMAGE_URLS: CloudinaryImageUrls = {
	vogueLogo:
		'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/vogue-logo_usoqha.svg',
	rtveLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/rtve-logo_rrcycx.png',
		),
	marieClaireLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/marie-claire-logo_njqlyq.png',
		),
	holaLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/hola-logo_kmujdn.png',
		),
	atresplayerLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545358/atresplayer-logo_c3ivyp.png',
		),
	elDebateLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/eldebate-logo_zp0bu6.webp',
		),
	semanaLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/semana-logo_flukee.png',
		),
	mediasetLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545359/mediaset-logo_qfhfae.webp',
		),
	vanitatisLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545360/vanitatis-logo_mtnnc2.jpg',
		),
	agenciaEfeLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545358/agencia-efe-logo_gk3or0.png',
		),
	europaPressLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545358/europapress-logo_rny2ek.png',
		),
	efeLogo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772545358/efe-logo_hp2op8.png',
		),
	gresRojo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772544694/gresrojo_g3bs3e.png',
		),
	gresAzul:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772544694/gresazul_yftldq.png',
		),
	gresTurquesa:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772544693/gresturquesa_ddzpzg.png',
		),
	gresNegro:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772544694/gresnegro_m1and4.png',
		),
	gresVerde:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772544701/gresverde_rda1we.png',
		),
	gresAmarillo:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772544686/gresamarillo_elcaso.png',
		),
	pressHero1:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772571372/vinos-de-madrid/u486213_011.jpg',
		),
	pressHero2:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772571382/vinos-de-madrid/u500501_004.jpg',
		),
	pressHero3:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772571391/vinos-de-madrid/u500501_013.jpg',
		),
	pressHero4:
		optimizeCloudinaryImage(
			'https://res.cloudinary.com/dkgv4tw3q/image/upload/v1772571398/vinos-de-madrid/u500501_055.jpg',
		),
}
