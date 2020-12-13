const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

console.log(__dirname);
module.exports = merge(baseConfig, {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	target: 'electron-main',
	entry: {
		main: './src/main/index.ts'
	},
	output: {
		filename: './main.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
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
});
