import { copyTextToClipboard } from './clipboard';

describe('copyTextToClipboard', () => {
	it('uses the async clipboard API when available', async () => {
		const writeText = jest.fn().mockResolvedValue(undefined);

		await copyTextToClipboard('Alpha citation', {
			navigatorRef: { clipboard: { writeText } },
			documentRef: {},
		});

		expect(writeText).toHaveBeenCalledWith('Alpha citation');
	});

	it('falls back to document.execCommand when clipboard API is unavailable', async () => {
		const select = jest.fn();
		const remove = jest.fn();
		const appendChild = jest.fn();
		const textarea = {
			setAttribute: jest.fn(),
			style: {},
			select,
			remove,
		};
		const documentRef = {
			createElement: jest.fn(() => textarea),
			body: { appendChild },
			execCommand: jest.fn(() => true),
		};

		await copyTextToClipboard('Beta citation', {
			navigatorRef: {},
			documentRef,
		});

		expect(documentRef.createElement).toHaveBeenCalledWith('textarea');
		expect(appendChild).toHaveBeenCalledWith(textarea);
		expect(select).toHaveBeenCalled();
		expect(documentRef.execCommand).toHaveBeenCalledWith('copy');
		expect(remove).toHaveBeenCalled();
	});

	it('rejects when the fallback copy command fails', async () => {
		const remove = jest.fn();
		const documentRef = {
			createElement: jest.fn(() => ({
				setAttribute: jest.fn(),
				style: {},
				select: jest.fn(),
				remove,
			})),
			body: { appendChild: jest.fn() },
			execCommand: jest.fn(() => false),
		};

		await expect(
			copyTextToClipboard('Gamma citation', {
				navigatorRef: {},
				documentRef,
			})
		).rejects.toThrow('Clipboard copy command failed');
		expect(remove).toHaveBeenCalled();
	});
});
