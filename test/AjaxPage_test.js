'use strict';
import AjaxPage from '../src/js/AjaxPage';
/**
 * 验证类的属性及方法总量
 */
describe('AjaxPage 验证类的属性及方法总量', function() {
	var getPropertyCount = null;
	beforeEach(function() {
		getPropertyCount = function(o){
			var n, count = 0;
			for(n in o){
				if(o.hasOwnProperty(n)){
					count++;
				}
			}
			return count;
		}
	});
	afterEach(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(AjaxPage)))).toBe(14 + 1);
	});
});

/**
 * 属性及方法验证
 */
describe('AjaxPage 属性及方法验证', function() {
	it('AjaxPage.createHtml($table)', function(){
		expect(AjaxPage.createHtml).toBeDefined();
		expect(AjaxPage.createHtml.length).toBe(1);
	});

	it('AjaxPage.initAjaxPage($table)', function(){
		expect(AjaxPage.initAjaxPage).toBeDefined();
		expect(AjaxPage.initAjaxPage.length).toBe(1);
	});

	it('AjaxPage.createPaginationDOM($table, pageData)', function(){
		expect(AjaxPage.createPaginationDOM).toBeDefined();
		expect(AjaxPage.createPaginationDOM.length).toBe(2);
	});

	it('AjaxPage.joinPagination($table, pageData)', function(){
		expect(AjaxPage.joinPagination).toBeDefined();
		expect(AjaxPage.joinPagination.length).toBe(2);
	});

	it('AjaxPage.createPageSizeDOM($table, _sizeData_)', function(){
		expect(AjaxPage.createPageSizeDOM).toBeDefined();
		expect(AjaxPage.createPageSizeDOM.length).toBe(2);
	});

	it('AjaxPage.bindPageJumpEvent($table)', function(){
		expect(AjaxPage.bindPageJumpEvent).toBeDefined();
		expect(AjaxPage.bindPageJumpEvent.length).toBe(1);
	});

	it('AjaxPage.bindPageClick($table, pageToolbar)', function(){
		expect(AjaxPage.bindPageClick).toBeDefined();
		expect(AjaxPage.bindPageClick.length).toBe(2);
	});

	it('AjaxPage.bindInputEvent($table, pageToolbar)', function(){
		expect(AjaxPage.bindInputEvent).toBeDefined();
		expect(AjaxPage.bindInputEvent.length).toBe(2);
	});

	it('AjaxPage.bindRefreshEvent($table, pageToolbar)', function(){
		expect(AjaxPage.bindRefreshEvent).toBeDefined();
		expect(AjaxPage.bindRefreshEvent.length).toBe(2);
	});

	it('AjaxPage.gotoPage($table, _cPage)', function(){
		expect(AjaxPage.gotoPage).toBeDefined();
		expect(AjaxPage.gotoPage.length).toBe(2);
	});

	it('AjaxPage.bindSetPageSizeEvent($table)', function(){
		expect(AjaxPage.bindSetPageSizeEvent).toBeDefined();
		expect(AjaxPage.bindSetPageSizeEvent.length).toBe(1);
	});

	it('AjaxPage.resetPSize($table, _pageData_)', function(){
		expect(AjaxPage.resetPSize).toBeDefined();
		expect(AjaxPage.resetPSize.length).toBe(2);
	});

	it('AjaxPage.resetPageData($table, totals)', function(){
		expect(AjaxPage.resetPageData).toBeDefined();
		expect(AjaxPage.resetPageData.length).toBe(2);
	});

	it('AjaxPage.configPageForCache($table)', function(){
		expect(AjaxPage.configPageForCache).toBeDefined();
		expect(AjaxPage.configPageForCache.length).toBe(1);
	});
});
