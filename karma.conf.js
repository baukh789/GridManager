var path = require('path');
module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			// 'src/**/*.js',
			'test/**/*_test.js'
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
			// 'src/**/*.js': ['webpack', 'coverage'],
			'test/**/*.js': ['webpack', 'coverage']
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
			devtool: 'eval',
			output: {
				pathinfo: true
			},
			eslint: {
				configFile: '.eslintrc',
				emitWarning: true,
				emitError: true,
				formatter: require('eslint-friendly-formatter')
			},
			module: {
				loaders:[
					{
						test:/\.js$/,
						loader:'babel',
						query:{
							presets:['es2015']
						},
						exclude:[
							path.resolve( __dirname, '/test' ), path.resolve( __dirname, '/node_modules' )
						]
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
				]
			}

		},
		concurrency: Infinity
	});
};
