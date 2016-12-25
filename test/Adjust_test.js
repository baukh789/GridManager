'use strict';
var Adjust = require('../src/js/Adjust').default;
describe('Adjust', function() {
	it('验证获取html', function() {
		expect(Adjust.html()).toBe('<span class="adjust-action"></span>');
	});

	it('验证无事件源时返回', function () {
		expect(Adjust.resetAdjust()).toBe(false);
	});
});
