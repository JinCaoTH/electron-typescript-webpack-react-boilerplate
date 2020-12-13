const path = require('path');
const { EnvironmentPlugin } = require('webpack');
// exports.srcPath = path.resolve(__dirname, '../src');
// exports.buildPath = path.resolve(__dirname, '../build');

module.exports = {
	output: {
		path: path.resolve(__dirname, '../build')
	},
	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: 'development',
			DEBUG: false
		})
	]
};
