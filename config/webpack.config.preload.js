const path = require('path');
const fs = require('fs');
const baseConfig = require('./webpack.config.base');
const { merge } = require('webpack-merge');

const preloads = fs.readdirSync('./src/renderer').filter((dir) => {
	return (
		fs.statSync(path.join('./src/renderer', dir)).isDirectory() &&
		fs.existsSync(path.join('./src/renderer', dir, 'preload.ts'))
	);
});

const renderConfig = merge(
	baseConfig,
	// loaderConfig,
	{
		mode:
			process.env.NODE_ENV === 'production'
				? 'production'
				: 'development',
		target: 'electron-preload',
		module: {
			rules: [
				{
					test: /\.ts?$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: [
								[
									'@babel/preset-env',
									{
										targets: {
											node: 12,
											electron: 11
										}
									}
								],
								'@babel/preset-typescript'
							]
						}
					}
				}
			]
		}
	}
);
module.exports = preloads.map((dir) => {
	return merge(renderConfig, {
		entry: {
			[dir]: './src/renderer/' + dir + '/preload.ts'
		},
		output: {
			filename: './' + dir + 'Preload.bundle.js'
		}
	});
});
