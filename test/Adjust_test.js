'use strict';
var Adjust = require('../src/js/Adjust');
describe('Adjust', function() {
	it('验证获取html', function() {
		expect(Adjust.default.html()).toBe('<span class="adjust-action"></span>');
	});

	it('验证无事件源时返回', function () {
		expect(Adjust.default.resetAdjust()).toBe(false);
	});
});
