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
				citationCiteproc: {
					test: /[\\/]node_modules[\\/]citeproc[\\/]/,
					name: 'citation-citeproc',
					chunks: 'async',
					enforce: true,
					maxSize: 240000,
				},
				citationCsl: {
					test: /[\\/]node_modules[\\/]@citation-js[\\/]plugin-csl[\\/]/,
					name: 'citation-plugin-csl',
					chunks: 'async',
					enforce: true,
					maxSize: 240000,
				},
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
				citationStyleChicagoAuthorDate: {
					test: /[\\/]src[\\/]lib[\\/]formatting[\\/]styles[\\/]chicago-author-date\.js$/,
					name: 'citation-style-chicago-author-date',
					chunks: 'async',
					enforce: true,
				},
				citationStyleChicagoNotesBibliography: {
					test: /[\\/]src[\\/]lib[\\/]formatting[\\/]styles[\\/]chicago-notes-bibliography\.js$/,
					name: 'citation-style-chicago-notes-bibliography',
					chunks: 'async',
					enforce: true,
				},
				citationStyleIeee: {
					test: /[\\/]src[\\/]lib[\\/]formatting[\\/]styles[\\/]ieee\.js$/,
					name: 'citation-style-ieee',
					chunks: 'async',
					enforce: true,
				},
				citationStyleMla9: {
					test: /[\\/]src[\\/]lib[\\/]formatting[\\/]styles[\\/]mla-9\.js$/,
					name: 'citation-style-mla-9',
					chunks: 'async',
					enforce: true,
				},
				citationStyleOscola: {
					test: /[\\/]src[\\/]lib[\\/]formatting[\\/]styles[\\/]oscola\.js$/,
					name: 'citation-style-oscola',
					chunks: 'async',
					enforce: true,
				},
				citationStyleAbnt: {
					test: /[\\/]src[\\/]lib[\\/]formatting[\\/]styles[\\/]abnt\.js$/,
					name: 'citation-style-abnt',
					chunks: 'async',
					enforce: true,
				},
			},
		},
	},
};
