const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const blueprintFiles = [
	'playground/blueprint.json',
	'.wordpress-org/blueprints/blueprint.json',
];

describe('Playground blueprints', () => {
	test.each(blueprintFiles)(
		'%s requests intl in both supported Playground forms',
		(relativePath) => {
			const blueprint = JSON.parse(
				fs.readFileSync(path.join(rootDir, relativePath), 'utf8')
			);

			expect(blueprint.phpExtensionBundles).toContain('kitchen-sink');
			expect(blueprint.features).toEqual(
				expect.objectContaining({
					networking: true,
					intl: true,
				})
			);
		}
	);
});
