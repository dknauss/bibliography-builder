import '@testing-library/jest-dom';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useBlockNotices } from './use-block-notices';

jest.useFakeTimers();

jest.mock(
	'@wordpress/notices',
	() => ({
		store: 'core/notices',
	}),
	{ virtual: true }
);

jest.mock(
	'@wordpress/data',
	() => {
		const ReactLocal = require('react');
		let notices = [];
		const listeners = new Set();

		const emit = () => {
			listeners.forEach((listener) => listener());
		};

		const subscribe = (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		};

		const getSelectApi = () => ({
			getNotices: (context) =>
				notices.filter((notice) => notice.context === context),
		});

		return {
			useDispatch: () => ({
				createNotice: (status, content, options = {}) => {
					notices = [
						...notices.filter(
							(notice) => notice.context !== options.context
						),
						{
							id: options.id || `notice-${notices.length + 1}`,
							status,
							content,
							context: options.context,
							type: options.type || 'default',
						},
					];
					emit();
				},
				removeAllNotices: (_type, context) => {
					notices = notices.filter(
						(notice) => notice.context !== context
					);
					emit();
				},
				removeNotice: (id, context) => {
					notices = notices.filter(
						(notice) =>
							!(
								notice.id === id &&
								(!context || notice.context === context)
							)
					);
					emit();
				},
			}),
			useSelect: (mapSelect) => {
				const [selected, setSelected] = ReactLocal.useState(() =>
					mapSelect(() => getSelectApi())
				);

				ReactLocal.useEffect(
					() =>
						subscribe(() => {
							setSelected(mapSelect(() => getSelectApi()));
						}),
					[]
				);

				return selected;
			},
			__unstableResetNotices: () => {
				notices = [];
				emit();
			},
		};
	},
	{ virtual: true }
);

jest.mock(
	'@wordpress/element',
	() => {
		const ReactLocal = require('react');

		return {
			createElement: ReactLocal.createElement,
			Fragment: ReactLocal.Fragment,
			useState: ReactLocal.useState,
			useRef: ReactLocal.useRef,
			useCallback: ReactLocal.useCallback,
			useEffect: ReactLocal.useEffect,
			useMemo: ReactLocal.useMemo,
		};
	},
	{ virtual: true }
);

function NoticeHarness() {
	const { announce, clearNotice, currentNotice } = useBlockNotices();

	return (
		<div>
			<button
				type="button"
				onClick={() => announce('info', 'Info notice')}
			>
				Show info
			</button>
			<button
				type="button"
				onClick={() => announce('warning', 'Warning notice')}
			>
				Show warning
			</button>
			<button type="button" onClick={clearNotice}>
				Clear
			</button>
			{currentNotice ? <p>{currentNotice.message}</p> : null}
		</div>
	);
}

describe('useBlockNotices', () => {
	afterEach(() => {
		jest.clearAllTimers();
		act(() => {
			require('@wordpress/data').__unstableResetNotices();
		});
	});

	it('auto-dismisses info notices after five seconds', () => {
		render(<NoticeHarness />);

		screen.getByRole('button', { name: 'Show info' }).click();
		expect(screen.getByText('Info notice')).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(5000);
		});

		expect(screen.queryByText('Info notice')).not.toBeInTheDocument();
	});

	it('does not auto-dismiss warning notices', () => {
		render(<NoticeHarness />);

		screen.getByRole('button', { name: 'Show warning' }).click();
		expect(screen.getByText('Warning notice')).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(5000);
		});

		expect(screen.getByText('Warning notice')).toBeInTheDocument();
	});
});
