const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

const wpIconsRequest = '@wordpress/icons';

module.exports = {
	...defaultConfig,
	resolve: {
		...(defaultConfig.resolve || {}),
		alias: {
			...(defaultConfig.resolve?.alias || {}),
			'react/jsx-runtime$': path.resolve(
				__dirname,
				'node_modules/react/jsx-runtime.js'
			),
			'react/jsx-dev-runtime$': path.resolve(
				__dirname,
				'node_modules/react/jsx-dev-runtime.js'
			),
		},
	},
	plugins: [
		...(defaultConfig.plugins || []).filter(
			(plugin) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin({
			requestToExternal(request) {
				if (request === wpIconsRequest) {
					return null;
				}
			},
		}),
	],
	output: {
		...defaultConfig.output,
		chunkFilename: '[name].js',
	},
	optimization: {
		...defaultConfig.optimization,
		splitChunks: {
			...defaultConfig.optimization.splitChunks,
			chunks: 'async',
			maxSize: 240000,
			cacheGroups: {
				...defaultConfig.optimization.splitChunks.cacheGroups,
				citationBibtex: {
					test: /[\\/]node_modules[\\/]@citation-js[\\/]plugin-bibtex[\\/]/,
					name: 'citation-plugin-bibtex',
					chunks: 'async',
					enforce: true,
				},
				citationDoi: {
					test: /[\\/]node_modules[\\/]@citation-js[\\/]plugin-doi[\\/]/,
					name: 'citation-plugin-doi',
					chunks: 'async',
					enforce: true,
				},
				citationCore: {
					test: /[\\/]node_modules[\\/]@citation-js[\\/](core|date|name)[\\/]/,
					name: 'citation-core',
					chunks: 'async',
					enforce: true,
				},
			},
		},
	},
};
