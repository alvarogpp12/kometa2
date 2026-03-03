/**
 * Splits all text nodes inside a container into individual
 * <span class="lum-char"> elements, preserving existing HTML
 * (like <br>) untouched. Returns the created spans in DOM order.
 */
export function splitChars(
	container: HTMLElement,
): HTMLSpanElement[] {
	const chars: HTMLSpanElement[] = []
	const walker = document.createTreeWalker(
		container,
		NodeFilter.SHOW_TEXT,
	)

	const textNodes: Text[] = []
	let node: Node | null
	while ((node = walker.nextNode())) {
		textNodes.push(node as Text)
	}

	for (const textNode of textNodes) {
		const content = textNode.textContent ?? ''
		if (!content.trim()) continue

		const parent = textNode.parentNode!
		const frag = document.createDocumentFragment()

		for (const char of content) {
			if (char === '\n' || char === '\t') continue
			const span = document.createElement('span')
			span.textContent = char
			span.className = 'lum-char'
			frag.appendChild(span)
			chars.push(span)
		}

		parent.replaceChild(frag, textNode)
	}

	return chars
}
