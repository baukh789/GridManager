'use strict';
var Base = require('../src/js/Base').default;
describe('Base', function() {
	beforeEach(function(){
	});
	afterEach(function () {
	});
	it('验证outLog', function() {
		expect(Base.outLog('Base outLog')).toBe('Base outLog');
	});
});
