var path = require('path');
module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: ['test/*_test.js'],
		exclude: ['karma.conf.js'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
		singleRun: false,
		reporters: ['progress', 'coverage'],
		preprocessors: {
			'test/*_test.js': ['webpack']
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
				loaders:[{
					test:/\.js$/,
					loader:'babel',
					query:{
						presets:['es2015']
					},
					exclude:[
						path.resolve( __dirname, '/test' ), path.resolve( __dirname, '/node_modules' )
					]
				}]
			}

		},
		// optionally, configure the reporter
		coverageReporter: {
			reporters: [
				// generates ./coverage/lcov.info
				{type: 'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type: 'json', subdir: '.'}
			]
		},
		singleRun: true,
		concurrency: Infinity
	});
};
