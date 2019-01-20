'use strict';
import AjaxPage from '../src/js/AjaxPage';
import { Settings, TextSettings } from '../src/js/Settings';
import I18n from "../src/js/I18n";
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(AjaxPage)))).toBe(17 + 1);
	});
});

describe('AjaxPage.createHtml($table)', function() {
	var settings = null;
	beforeEach(function() {
		// 合并参数
		settings = new Settings();
		settings.textConfig = new TextSettings();
	});
	afterEach(function(){
		settings = null;
	});

	it('基础验证', function () {
		expect(AjaxPage.createHtml).toBeDefined();
		expect(AjaxPage.createHtml.length).toBe(1);
	});

	it('返回值', function () {

        // 刷新按纽
        const refreshHtml = '<span class="refresh-action"><i class="iconfont icon-refresh"></i></span>';

        // 快捷跳转
        const gotoHtml = `<div class="goto-page">
							${ I18n.i18nText(settings, 'goto-first-text') }
							<input type="text" class="gp-input"/>
							${ I18n.i18nText(settings, 'goto-last-text') }
						</div>`;

        // 每页显示条数
        const pageSizeHtml = AjaxPage.__getPageSizeHtml(settings);

        // 选中项描述信息
        const checkedInfoHtml = `<div class="toolbar-info checked-info"></div>`;

        // 分页描述信息
        const pageInfoHtml = `<div class="toolbar-info page-info"></div>`;

        // 页码
        const paginationHtml = `<div class="ajax-page"><ul class="pagination"></ul></div>`;

        let ajaxPageHtml = `<div class="footer-toolbar">
						${refreshHtml}
						${gotoHtml}
						${pageSizeHtml}
						${checkedInfoHtml}
						${pageInfoHtml}
						${paginationHtml}
					</div>`;
		expect(AjaxPage.createHtml(settings).replace(/\s/g, '')).toBe(ajaxPageHtml.replace(/\s/g, ''));

		ajaxPageHtml = null;
	});
});

describe('AjaxPage.initAjaxPage($table, settings)', function() {
	it('基础验证', function () {
		expect(AjaxPage.initAjaxPage).toBeDefined();
		expect(AjaxPage.initAjaxPage.length).toBe(2);
	});
});

describe('AjaxPage.gotoPage($table, settings, toPage)', function() {
	var settings = null;
	var toPage = null;
	var pageData = null;
	beforeEach(function() {
	});
	afterEach(function(){
		settings = null;
		toPage = null;
		pageData = null;
	});
	it('基础验证', function () {
		expect(AjaxPage.gotoPage).toBeDefined();
		expect(AjaxPage.gotoPage.length).toBe(3);
	});
});

describe('AjaxPage.__createPaginationDOM($table, settings, pageData)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__createPaginationDOM).toBeDefined();
		expect(AjaxPage.__createPaginationDOM.length).toBe(3);
	});
});

describe('AjaxPage.__joinPagination(settings, pageData)', function() {
	var settings = null;
	var pageData = null;
	var paginatioHtml = null;
	beforeEach(function() {
		settings = new Settings();
		settings.textConfig = new TextSettings();
	});
	afterEach(function(){
		settings = null;
		pageData = null;
		paginatioHtml = null;
	});

	it('基础验证', function () {
		expect(AjaxPage.__joinPagination).toBeDefined();
		expect(AjaxPage.__joinPagination.length).toBe(2);
	});

	it('返回值->无省略符,cPage=1', function () {
		pageData = {tPage: 3, cPage: 1, pSize: 30, tSize: 68};
		paginatioHtml = `<li c-page="1" class="first-page disabled">首页</li>
						<li c-page="0" class="previous-page disabled">上一页</li>
						<li class="active">1</li>
						<li c-page="2">2</li>
						<li c-page="3">3</li>
						<li c-page="2" class="next-page">下一页</li>
						<li c-page="3" class="last-page">尾页</li>`;
		expect(AjaxPage.__joinPagination(settings, pageData).replace(/\s/g, '')).toBe(paginatioHtml.replace(/\s/g, ''));
	});

	it('返回值->无省略符,cPage=2', function () {
		pageData = {tPage: 3, cPage: 2, pSize: 30, tSize: 68};
		paginatioHtml = `<li c-page="1" class="first-page">首页</li>
						<li c-page="1" class="previous-page">上一页</li>
						<li c-page="1">1</li>
						<li class="active">2</li>
						<li c-page="3">3</li>
						<li c-page="3" class="next-page">下一页</li>
						<li c-page="3" class="last-page">尾页</li>`;

		expect(AjaxPage.__joinPagination(settings, pageData).replace(/\s/g, '')).toBe(paginatioHtml.replace(/\s/g, ''));
	});

	it('返回值->last端省略符', function () {
		pageData = {tPage: 7, cPage: 1, pSize: 10, tSize: 68};
		paginatioHtml = `<li c-page="1" class="first-page disabled">首页</li>
						<li c-page="0" class="previous-page disabled">上一页</li>
						<li class="active">1</li>
						<li c-page="2">2</li>
						<li c-page="3">3</li>
						<li class="disabled">...</li>
						<li c-page="7">7</li>
						<li c-page="2" class="next-page">下一页</li>
						<li c-page="7" class="last-page">尾页</li>`;

		expect(AjaxPage.__joinPagination(settings, pageData).replace(/\s/g, '')).toBe(paginatioHtml.replace(/\s/g, ''));
	});

	it('返回值->first端省略符', function () {
		pageData = {tPage: 7, cPage: 7, pSize: 10, tSize: 68};
		paginatioHtml = `<li c-page="1" class="first-page">首页</li>
						<li c-page="6" class="previous-page">上一页</li>
						<li c-page="1">1</li>
						<li class="disabled">...</li>
						<li c-page="5">5</li>
						<li c-page="6">6</li>
						<li class="active">7</li>
						<li c-page="8" class="next-page disabled">下一页</li>
						<li c-page="7" class="last-page disabled">尾页</li>`;

		expect(AjaxPage.__joinPagination(settings, pageData).replace(/\s/g, '')).toBe(paginatioHtml.replace(/\s/g, ''));
	});
});

describe('AjaxPage.__getPageSizeHtml(sizeData)', function() {
	var sizeData = null;
	var pageSizeHtml = null;
	beforeEach(function() {
	});
	afterEach(function(){
		sizeData = null;
		pageSizeHtml = null;
	});

	it('基础验证', function () {
		expect(AjaxPage.__getPageSizeHtml).toBeDefined();
		expect(AjaxPage.__getPageSizeHtml.length).toBe(1);
	});

	it('返回值->[10, 30, 50]', function () {
		sizeData = {sizeData: [10, 30, 50]};
		pageSizeHtml = `<div class="change-size"><select name="pSizeArea">
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </select></div>`;
		expect(AjaxPage.__getPageSizeHtml(sizeData).replace(/\s/g, '')).toBe(pageSizeHtml.replace(/\s/g, ''));
	});

	it('返回值->[10, 20, 30, 50, 100]', function () {
		sizeData = {sizeData:[10, 20, 30, 50, 100]};
		pageSizeHtml = `<div class="change-size"><select name="pSizeArea">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select></div>`;
		expect(AjaxPage.__getPageSizeHtml(sizeData).replace(/\s/g, '')).toBe(pageSizeHtml.replace(/\s/g, ''));
	});
});

describe('AjaxPage.__bindPageJumpEvent($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__bindPageJumpEvent).toBeDefined();
		expect(AjaxPage.__bindPageJumpEvent.length).toBe(1);
	});
});

describe('AjaxPage.__bindPageClick($table, pageToolbar)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__bindPageClick).toBeDefined();
		expect(AjaxPage.__bindPageClick.length).toBe(2);
	});
});

describe('AjaxPage.__bindInputEvent($table, pageToolbar)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__bindInputEvent).toBeDefined();
		expect(AjaxPage.__bindInputEvent.length).toBe(2);
	});
});

describe('AjaxPage.__bindRefreshEvent($table, pageToolbar)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__bindRefreshEvent).toBeDefined();
		expect(AjaxPage.__bindRefreshEvent.length).toBe(1);
	});

	it('返回值验证', function () {
		expect(AjaxPage.__bindRefreshEvent).toBeDefined();
		expect(AjaxPage.__bindRefreshEvent.length).toBe(1);
	});
});

describe('AjaxPage.__bindSetPageSizeEvent($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__bindSetPageSizeEvent).toBeDefined();
		expect(AjaxPage.__bindSetPageSizeEvent.length).toBe(1);
	});
});

describe('AjaxPage.__resetPSize($table, settings, _pageData_)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__resetPSize).toBeDefined();
		expect(AjaxPage.__resetPSize.length).toBe(3);
	});
});

describe('AjaxPage.__resetPageInfo($table, settings, _pageData_)', function() {
    it('基础验证', function () {
        expect(AjaxPage.__resetPageInfo).toBeDefined();
        expect(AjaxPage.__resetPageInfo.length).toBe(3);
    });
});

describe('AjaxPage.resetPageData($table, settings, totals, len)', function() {
	it('基础验证', function () {
		expect(AjaxPage.resetPageData).toBeDefined();
		expect(AjaxPage.resetPageData.length).toBe(4);
	});
});

describe('AjaxPage.__getPageData(settings, totals, len)', function() {
	var settings = null;
	var totals = null;
	var pageData = null;
	beforeEach(function() {
		settings = new Settings();
		settings.textConfig = new TextSettings();
		settings.gridManagerName = 'test-createMenuDOM';
	});
	afterEach(function(){
		settings = null;
		totals = null;
		pageData = null;
	});

	it('基础验证', function () {
		expect(AjaxPage.__getPageData).toBeDefined();
		expect(AjaxPage.__getPageData.length).toBe(3);
	});

	it('返回值-> 使用 pageData.pSize', function () {
		totals = 95;
		settings.pageData = {
			pSize: 20,
			cPage: 2
		};
		pageData = {tPage: 5, cPage: 2, pSize: 20, tSize: 95};
		expect(AjaxPage.__getPageData(settings, totals)).toEqual(pageData);
	});

	it('返回值-> 使用 settings.pageSize', function () {
		totals = 95;
		settings.pageSize = 30;
		settings.pageData = {
			cPage: 2
		};
		pageData = {tPage: 4, cPage: 2, pSize: 30, tSize: 95};
		expect(AjaxPage.__getPageData(settings, totals)).toEqual(pageData);
	});

	it('返回值-> 使用 settings.pageSize 和 pageData.pSize', function () {
		totals = 95;
		settings.pageSize = 30;
		settings.pageData = {
			pSize: 20,
			cPage: 2
		};
		pageData = {tPage: 5, cPage: 2, pSize: 20, tSize: 95};
		expect(AjaxPage.__getPageData(settings, totals)).toEqual(pageData);
	});
});

describe('AjaxPage.__configPageForCache($table, settings)', function() {
	it('基础验证', function () {
		expect(AjaxPage.__configPageForCache).toBeDefined();
		expect(AjaxPage.__configPageForCache.length).toBe(2);
	});
});

describe('AjaxPage.destroy($table)', function() {
	it('基础验证', function () {
		expect(AjaxPage.destroy).toBeDefined();
		expect(AjaxPage.destroy.length).toBe(1);
	});
});

