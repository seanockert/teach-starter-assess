const path = require('path');

// Import the version number from package.json file
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const webpack = require('webpack');

module.exports = {
	css: {
		loaderOptions: {
			sass: {
				data: `@import "@/assets/scss/_variables.scss";`,
			},
		},
	},
	chainWebpack: config => {
		const svgRule = config.module.rule('svg');
		svgRule.uses.clear();
		svgRule.use('vue-svg-loader').loader('vue-svg-loader');
		config.performance.maxEntrypointSize(450000).maxAssetSize(450000);
	},
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					PACKAGE_VERSION: '"' + version + '"',
				},
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'~': path.resolve(__dirname, 'src/assets/scss'),
			},
		},
	},
	pluginOptions: {
		webpackBundleAnalyzer: {
			openAnalyzer: false,
		},
	},
};
