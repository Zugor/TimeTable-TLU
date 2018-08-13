const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	mode: 'development',
	entry: ['babel-polyfill','./app/index.js'],
	output: {
		path: __dirname,
		filename: './public/js/bundle.js'
	},
	resolve: {
	    modules: [__dirname, 'node_modules'],
	    alias: {
			  APP		: 'app/components/',
			  ACTIONS	: 'app/actions/',
			  CONSTANTS	: 'app/constants/',
			  DATA		: 'app/data/',
			  SERVICES	: 'app/services/',
	    }
  	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				query: {
					presets: ['env', 'react', 'stage-0']
				},
				test: /\.js?$/,
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
				  fallback: 'style-loader',
				  use: [
					'css-loader',
					'sass-loader'
				  ]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('public/css/custom.css'),
	]
};
