export async function copyTextToClipboard(
	text,
	{ navigatorRef, documentRef } = {}
) {
	const runtimeNavigator =
		navigatorRef ??
		(typeof window !== 'undefined' ? window.navigator : undefined);
	const runtimeDocument =
		documentRef ?? (typeof document !== 'undefined' ? document : undefined);

	if (runtimeNavigator?.clipboard?.writeText) {
		await runtimeNavigator.clipboard.writeText(text);
		return true;
	}

	if (!runtimeDocument?.createElement || !runtimeDocument?.body) {
		throw new Error('Clipboard API unavailable');
	}

	const textarea = runtimeDocument.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';
	runtimeDocument.body.appendChild(textarea);
	textarea.select();

	try {
		const copied = runtimeDocument.execCommand?.('copy');

		if (!copied) {
			throw new Error('Clipboard copy command failed');
		}

		return true;
	} finally {
		textarea.remove();
	}
}
