const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base.js');
const { merge } = require('webpack-merge');

// const srcPath = path.resolve(__dirname, './src/renderer');
// const buildPath = path.resolve(__dirname, '../build');
const wins = fs.readdirSync('./src/renderer').filter((dir) => {
	return (
		fs.statSync(path.join('./src/renderer', dir)).isDirectory() &&
		fs.existsSync(path.join('./src/renderer', dir, 'index.ts'))
	);
});

const loaderConfig = {
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
										chrome: 58
									}
								}
							],
							'@babel/preset-typescript',
							'@babel/preset-react'
						]
					}
				}
			}
		]
	}
};
const renderConfig = merge(
	baseConfig,
	loaderConfig,
	process.env.NODE_ENV === 'production'
		? {
				target: 'electron-renderer',
				mode: 'production'
		  }
		: {
				mode: 'development',
				target: 'web',
				devServer: {
					contentBase: path.resolve(__dirname, '../build'),
					port: 9000,
					before() {
						console.log('Starting Main Process...');
						spawn('npm', ['run', 'start'], {
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
		  }
);
module.exports = wins.map((dir) => {
	return merge(renderConfig, {
		entry: {
			[dir]: './src/renderer/' + dir + '/index.ts'
		},
		output: {
			filename: './' + dir + 'Window.bundle.js'
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: dir + '.html',
				chunks: [dir],
				template: 'src/template.html'
			})
		]
	});
});
