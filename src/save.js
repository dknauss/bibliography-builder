/**
 * Static save function for the Bibliography block.
 *
 * Produces semantic HTML with DPUB-ARIA roles, JSON-LD by default,
 * and optional CSL-JSON / COinS layers.
 * All output is baked into post content — no PHP render_callback.
 */

import { renderBibliographySave } from './save-markup';

export default function save({ attributes }) {
	return renderBibliographySave(attributes, {
		sortEntries: true,
		headingTag: 'p',
		entryTag: 'cite',
	});
}
