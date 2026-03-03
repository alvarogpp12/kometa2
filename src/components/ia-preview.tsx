'use client'

import IaSplineViewer from '@/components/ia-spline-viewer'
import IaChatPreview from '@/components/ia-chat-preview'

export default function IaPreview({
	scene,
}: {
	scene: string
}) {
	return (
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
			}}
		>
			<IaSplineViewer
				className="SliceHomeArtists-spline"
				scene={scene}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '40%',
					zIndex: 20,
					pointerEvents: 'auto',
				}}
			>
				<IaChatPreview />
			</div>
		</div>
	)
}
