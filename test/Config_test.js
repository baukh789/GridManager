'use strict';
var Config = require('../src/js/Config').default;
describe('Base', function() {
	var html = null;
	beforeEach(function(){
		html = '<div class="config-area"><span class="config-action"><i class="iconfont icon-31xingdongdian"></i></span><ul class="config-list"></ul></div>';
	});
	afterEach(function () {
		html = null;
	});
	it('html', function() {
		expect(Config.html()).toBe(html);
	});
});
