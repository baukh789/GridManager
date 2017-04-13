'use strict';
import AjaxPage from '../src/js/AjaxPage';
describe('AjaxPage: 验证方法是否存在', function() {
	it('html', function() {
		expect(AjaxPage.html).toBeDefined();
	});
	it('initAjaxPage', function(){
		expect(AjaxPage.initAjaxPage).toBeDefined();
	});
	it('createPageDOM', function(){
		expect(AjaxPage.createPageDOM).toBeDefined();
	});
	it('createPageSizeDOM', function(){
		expect(AjaxPage.createPageSizeDOM).toBeDefined();
	});
	it('bindPageJumpEvent', function(){
		expect(AjaxPage.bindPageJumpEvent).toBeDefined();
	});
	it('gotoPage', function(){
		expect(AjaxPage.gotoPage).toBeDefined();
	});
	it('bindSetPageSizeEvent', function(){
		expect(AjaxPage.bindSetPageSizeEvent).toBeDefined();
	});
	it('resetPSize', function(){
		expect(AjaxPage.resetPSize).toBeDefined();
	});
	it('resetPageData', function(){
		expect(AjaxPage.resetPageData).toBeDefined();
	});
	it('configPageForCache', function(){
		expect(AjaxPage.configPageForCache).toBeDefined();
	});
});
