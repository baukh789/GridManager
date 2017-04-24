var path = require('path');
module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'test/*_test.js'
		],
		exclude: ['karma.conf.js'],
		port: 9876,
		colors: true,
		singleRun: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
		reporters: ['progress', 'coverage'],
		preprocessors: {
			'test/*_test.js': ['webpack']
		},
		// optionally, configure the reporter
		coverageReporter: {
			reporters: [
				// generates ./coverage/lcov.info
				{type:'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type:'json', subdir: '.'}
			]
		},
		webpack: {
			module: {
				loaders:[
					{
						test: /\.js?$/,
						loaders: ['babel?{"presets":["es2015"]}'],
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')]
					},
					{
						test:/\.css$/,
						loader:'style-loader!css-loader',
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src/css')]
					},
					{
						test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
						loader: 'url?limit=15000&mimetype=application/font-woff&prefix=fonts',
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src')]
					},
					{
						test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
						loader: 'url?limit=15000&mimetype=application/octet-stream&prefix=fonts',
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src')]
					},
					{
						test: /\.eot(\?#\w+)?$/,
						loader: 'url?limit=15000&mimetype=application/vnd.ms-fontobject&prefix=fonts',
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src')]
					},
					{
						test: /\.svg(#\w+)?$/,
						loader: 'url?limit=15000&mimetype=image/svg+xml&prefix=fonts',
						exclude: /(node_modules|bower_components)/,
						include: [path.join(__dirname, 'src')]
					}
				],
				postLoaders: [{
					test: /\.js$/,
					loader: 'istanbul-instrumenter',
					exclude: /node_modules|_spec\.js$/,
					include: [path.join(__dirname, './src')]
				}]
			}

		},
		concurrency: Infinity
	});
};
