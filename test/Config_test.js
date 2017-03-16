'use strict';
var Config = require('../src/js/Config').default;
describe('Base', function() {
	it('html', function() {
		expect(Config.html).toBeDefined();
	});
});
