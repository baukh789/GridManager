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

describe('AjaxPage.createHtml($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.createHtml).toBeDefined();
		expect(AjaxPage.createHtml.length).toBe(1);
	});
});

describe('AjaxPage.initAjaxPage($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.initAjaxPage).toBeDefined();
		expect(AjaxPage.initAjaxPage.length).toBe(1);
	});
});

describe('AjaxPage.createPaginationDOM($table, pageData)', function() {
	it('基础验证', function () {
		expect(AjaxPage.createPaginationDOM).toBeDefined();
		expect(AjaxPage.createPaginationDOM.length).toBe(2);
	});
});

describe('AjaxPage.joinPagination($table, pageData)', function() {
	it('基础验证', function () {
		expect(AjaxPage.joinPagination).toBeDefined();
		expect(AjaxPage.joinPagination.length).toBe(2);
	});
});

describe('AjaxPage.createPageSizeDOM($table, _sizeData_)', function() {
	it('基础验证', function () {
		expect(AjaxPage.createPageSizeDOM).toBeDefined();
		expect(AjaxPage.createPageSizeDOM.length).toBe(2);
	});
});

describe('AjaxPage.bindPageJumpEvent($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.bindPageJumpEvent).toBeDefined();
		expect(AjaxPage.bindPageJumpEvent.length).toBe(1);
	});
});

describe('AjaxPage.bindPageClick($table, pageToolbar)', function() {
	it('基础验证', function () {
		expect(AjaxPage.bindPageClick).toBeDefined();
		expect(AjaxPage.bindPageClick.length).toBe(2);
	});
});

describe('AjaxPage.bindInputEvent($table, pageToolbar)', function() {
	it('基础验证', function () {
		expect(AjaxPage.bindInputEvent).toBeDefined();
		expect(AjaxPage.bindInputEvent.length).toBe(2);
	});
});

describe('AjaxPage.bindRefreshEvent($table, pageToolbar)', function() {
	it('基础验证', function () {
		expect(AjaxPage.bindRefreshEvent).toBeDefined();
		expect(AjaxPage.bindRefreshEvent.length).toBe(2);
	});
});

describe('AjaxPage.gotoPage($table, _cPage)', function() {
	it('基础验证', function () {
		expect(AjaxPage.gotoPage).toBeDefined();
		expect(AjaxPage.gotoPage.length).toBe(2);
	});
});

describe('AjaxPage.bindSetPageSizeEvent($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.bindSetPageSizeEvent).toBeDefined();
		expect(AjaxPage.bindSetPageSizeEvent.length).toBe(1);
	});
});

describe('AjaxPage.resetPSize($table, _pageData_)', function() {
	it('基础验证', function () {
		expect(AjaxPage.resetPSize).toBeDefined();
		expect(AjaxPage.resetPSize.length).toBe(2);
	});
});

describe('AjaxPage.resetPageData($table, totals)', function() {
	it('基础验证', function () {
		expect(AjaxPage.resetPageData).toBeDefined();
		expect(AjaxPage.resetPageData.length).toBe(2);
	});
});

describe('AjaxPage.configPageForCache($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.configPageForCache).toBeDefined();
		expect(AjaxPage.configPageForCache.length).toBe(1);
	});
});
