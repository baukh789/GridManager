'use strict';
var Cache = require('../src/js/Cache').default;
describe('Base', function() {
	beforeEach(function(){
	});
	afterEach(function () {
	});
	it('clear', function() {
		expect(Cache.clear()).toBe(false);
	});
});
