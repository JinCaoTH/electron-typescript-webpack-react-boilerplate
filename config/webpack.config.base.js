const path = require('path');
const { EnvironmentPlugin } = require('webpack');
// exports.srcPath = path.resolve(__dirname, '../src');
// exports.buildPath = path.resolve(__dirname, '../build');

module.exports = {
	output: {
		path: path.resolve(__dirname, '../build')
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
	},
	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: 'development',
			DEBUG: false
		})
	]
};
