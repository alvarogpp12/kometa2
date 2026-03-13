import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const SOURCE_FILE = path.resolve(
	process.cwd(),
	'src/lib/cloudinary-media.ts',
)

const MAX_CONCURRENCY = 8
const REQUEST_TIMEOUT_MS = 20000

function extractCloudinaryUrls(sourceText) {
	const matches = sourceText.match(
		/https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g,
	)
	if (!matches) return []
	return Array.from(new Set(matches))
}

function toCurrentVideoVariant(url) {
	if (!url.includes('/video/upload/')) return url
	return url.replace(
		'/video/upload/',
		'/video/upload/f_auto,vc_auto,q_auto:best,c_limit,w_1920/',
	)
}

function toCurrentImageVariant(url) {
	if (!url.includes('/image/upload/')) return url
	if (url.endsWith('.svg')) return url
	return url.replace(
		'/image/upload/',
		'/image/upload/f_auto,q_auto:good/',
	)
}

function buildPrewarmUrls(rawUrls) {
	const urls = new Set()
	for (const rawUrl of rawUrls) {
		if (rawUrl.includes('/video/upload/')) {
			urls.add(toCurrentVideoVariant(rawUrl))
			continue
		}
		if (rawUrl.includes('/image/upload/')) {
			urls.add(toCurrentImageVariant(rawUrl))
		}
	}
	return Array.from(urls)
}

function withTimeout(promise, ms) {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), ms)
	return Promise.race([
		promise(controller.signal).finally(() => clearTimeout(timeout)),
	])
}

async function warmUrl(url) {
	const tryRequest = async (method) =>
		withTimeout(
			(signal) =>
				fetch(url, {
					method,
					redirect: 'follow',
					signal,
				}),
			REQUEST_TIMEOUT_MS,
		)

	try {
		let response = await tryRequest('HEAD')
		if (
			response.status === 405 ||
			response.status === 400 ||
			response.status === 501
		) {
			response = await tryRequest('GET')
		}
		if (!response.ok) {
			return {
				url,
				ok: false,
				status: response.status,
				statusText: response.statusText,
			}
		}
		return { url, ok: true, status: response.status }
	} catch (error) {
		return {
			url,
			ok: false,
			error:
				error instanceof Error ? error.message : 'Unknown error',
		}
	}
}

async function runPool(items, handler, concurrency) {
	const results = []
	let index = 0

	async function worker() {
		while (index < items.length) {
			const currentIndex = index
			index += 1
			results[currentIndex] = await handler(items[currentIndex])
		}
	}

	const workers = Array.from({ length: concurrency }, () => worker())
	await Promise.all(workers)
	return results
}

async function main() {
	const source = await fs.readFile(SOURCE_FILE, 'utf8')
	const rawUrls = extractCloudinaryUrls(source)
	const prewarmUrls = buildPrewarmUrls(rawUrls)

	if (prewarmUrls.length === 0) {
		console.log('No Cloudinary URLs found to prewarm.')
		return
	}

	console.log(`Found ${rawUrls.length} raw Cloudinary URLs.`)
	console.log(`Prewarming ${prewarmUrls.length} derived URLs...`)

	const startedAt = Date.now()
	const results = await runPool(
		prewarmUrls,
		warmUrl,
		MAX_CONCURRENCY,
	)
	const elapsedMs = Date.now() - startedAt

	const ok = results.filter((item) => item.ok)
	const fail = results.filter((item) => !item.ok)

	console.log('\nPrewarm summary')
	console.log('----------------')
	console.log(`Success: ${ok.length}`)
	console.log(`Failed: ${fail.length}`)
	console.log(`Elapsed: ${Math.round(elapsedMs / 1000)}s`)

	if (fail.length > 0) {
		console.log('\nFailed URLs')
		console.log('-----------')
		for (const item of fail) {
			if (item.error) {
				console.log(`- ${item.url} -> ${item.error}`)
				continue
			}
			console.log(
				`- ${item.url} -> HTTP ${item.status} ${item.statusText ?? ''}`,
			)
		}
		process.exitCode = 1
	}
}

main().catch((error) => {
	console.error(
		'Cloudinary prewarm failed:',
		error instanceof Error ? error.message : error,
	)
	process.exit(1)
})
