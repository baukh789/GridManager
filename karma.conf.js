module.exports = function(config) {
	config.set({
		frameworks: ['browserify', 'jasmine-ajax', 'jasmine'],
		files: [
			'src/**/*.js',
			'test/**/*_spec.js'
		],
		preprocessors: {
			'test/**/*.js': ['jshint', 'browserify'],
			'src/**/*.js': ['jshint', 'browserify', 'coverage']
		},
		browsers: ['PhantomJS'],
		browserify: {
			debug: true,
			bundleDelay: 2000 // Fixes "reload" error messages, YMMV!
		},
		reporters: ['progress', 'coverage'],
		// optionally, configure the reporter
		coverageReporter: {
			reporters: [
				// generates ./coverage/lcov.info
				{type:'lcovonly', subdir: '.'},
				// generates ./coverage/coverage-final.json
				{type:'json', subdir: '.'},
			]
		},
		singleRun: true,
		concurrency: Infinity
	});
};
