const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base.js');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const port = process.env.PORT || 9000;
const isDevelopment = process.env.NODE_ENV !== 'production';

const wins = fs.readdirSync('./src/renderer').filter((dir) => {
	return (
		fs.statSync(path.join('./src/renderer', dir)).isDirectory() &&
		fs.existsSync(path.join('./src/renderer', dir, 'index.tsx'))
	);
});

const rendererConfig = {
	output: {
		filename: '[name]Window.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: require.resolve('babel-loader'),
					options: {
						cacheDirectory: true,
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										chrome: 58
									}
								}
							],
							'@babel/preset-typescript',
							'@babel/preset-react'
						],
						plugins: [
							isDevelopment &&
								require.resolve('react-refresh/babel')
						].filter(Boolean)
					}
				}
			}
		]
	},
	plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean)
};

const modeConfig =
	process.env.NODE_ENV === 'production'
		? {
				target: 'electron-renderer',
				mode: 'production'
		  }
		: {
				mode: 'development',
				target: 'web',
				devtool: 'inline-source-map',
				devServer: {
					port,
					hot: true,
					historyApiFallback: true,
					before() {
						console.log('Starting Main Process...');
						spawn('npm', ['run', 'start:main'], {
							shell: true,
							env: process.env,
							stdio: 'inherit'
						})
							.on('close', (code) => process.exit(code))
							.on('error', (spawnError) =>
								console.error(spawnError)
							);
					}
				}
		  };

const pageConfig = {
	entry: {},
	plugins: []
};

wins.forEach((dir) => {
	pageConfig.entry[dir] = './src/renderer/' + dir + '/index.tsx';
	pageConfig.plugins.push(
		new HtmlWebpackPlugin({
			filename: dir + '.html',
			chunks: [dir],
			template: 'src/template.html'
		})
	);
});

module.exports = merge(baseConfig, rendererConfig, modeConfig, pageConfig);
