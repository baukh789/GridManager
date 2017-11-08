'use strict';
import { jTool } from '../src/js/Base';
import AjaxPage from '../src/js/AjaxPage';
import Cache from '../src/js/Cache';
/**
 * 对象完整性验证
 */
describe('AjaxPage 对象完整性验证', function() {
	it('对象完整性验证 AjaxPage.createHtml', function(){
		expect(AjaxPage.initAjaxPage).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.initAjaxPage', function(){
		expect(AjaxPage.initAjaxPage).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.createPaginationDOM', function(){
		expect(AjaxPage.createPaginationDOM).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.joinPagination', function(){
		expect(AjaxPage.joinPagination).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.createPageSizeDOM', function(){
		expect(AjaxPage.createPageSizeDOM).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.bindPageJumpEvent', function(){
		expect(AjaxPage.bindPageJumpEvent).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.gotoPage', function(){
		expect(AjaxPage.gotoPage).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.bindSetPageSizeEvent', function(){
		expect(AjaxPage.bindSetPageSizeEvent).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.resetPSize', function(){
		expect(AjaxPage.resetPSize).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.resetPageData', function(){
		expect(AjaxPage.resetPageData).toBeDefined();
	});

	it('对象完整性验证 AjaxPage.configPageForCache', function(){
		expect(AjaxPage.configPageForCache).toBeDefined();
	});
});

describe('AjaxPage 验证原型方法总数', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(AjaxPage)))).toBe(11 + 1);
	});
});
describe('AjaxPage.js', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-ajaxPage';
	let pagingBefore = null;
	let pagingAfter = null;
	beforeAll(function(){
		pagingBefore = jasmine.createSpy('pagingBefore');
		pagingAfter = jasmine.createSpy('pagingAfter');
		// 第一组设置为en-us, 且其中几项被重置
		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
			ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList'
			,supportAjaxPage:true
			,disableCache: true
			,pageSize: 10
			,columnData: [
				{
					key: 'name',
					remind: 'the name',
					width: '100px',
					text: '名称',
					sorting: ''
				},{
					key: 'info',
					remind: 'the info',
					text: '使用说明'
				},{
					key: 'url',
					remind: 'the url',
					text: 'url'
				}
			]
			// 分页前事件
			,pagingBefore: pagingBefore
			// 分页后事件
			,pagingAfter: pagingAfter
		});
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		pagingBefore = null;
		pagingAfter = null;
		document.body.innerHTML = '';
	});

	it('分页事件[pagingBefore]', function(){
		expect(pagingBefore.calls.any()).toBe(false);// 函数是否被访问过
		AjaxPage.gotoPage($table, 2);
		expect(pagingBefore.calls.any()).toBe(true);// 函数是否被访问过
		expect(pagingBefore).toHaveBeenCalled();  // 函数是否被调用
		expect(pagingBefore).toHaveBeenCalledWith({cPage: 2, pSize: 10});  // 调用函数时的参数
	});

	// TODO After是需要延时执行的, 而jasmine 延时执行不知道怎么写. 所以暂时跳过不处理
	// it('分页后事件[pagingAfter]', function(){
		// AjaxPage.gotoPage($table, 1);
		// expect(pagingAfter).toHaveBeenCalledWith({cPage: 1, pSize: 10});
	// });


	it('AjaxPage.createHtml($table)', function(){
		let ajaxPageHtml= `<div class="page-toolbar">
						<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>
						<div class="goto-page">
							跳转至
							<input type="text" class="gp-input"/>
							页
						</div>
						<div class="change-size"><select name="pSizeArea"></select></div>
						<div class="dataTables_info"></div>
						<div class="ajax-page"><ul class="pagination"></ul></div>
					</div>`;
		expect(AjaxPage.createHtml($table).replace(/\s/g, '')).toBe(ajaxPageHtml.replace(/\s/g, ''));
		ajaxPageHtml = null;
	});

	it('AjaxPage.joinPagination($table, pageData)', function () {
		let pageData = {
			cPage: 2,
			tPage: 10
		};
		let paginationHtml = `<li c-page="1" class="first-page">
                                        首页
                                </li>
                                <li c-page="1" class="previous-page">
                                        上一页
                                </li><li c-page="1">
                                                1
                                        </li><li class="active">
                                                        2
                                                </li><li c-page="3">
                                                3
                                        </li><li c-page="4">
                                                4
                                        </li><li class="disabled">
                                                ...
                                        </li>
                                        <li c-page="10">
                                                10
                                        </li><li c-page="3" class="next-page">
                                        下一页
                                </li>
                                <li c-page="10" class="last-page">
                                        尾页
                                </li>`;
		expect(AjaxPage.joinPagination($table, pageData).replace(/\s/g, '')).toBe(paginationHtml.replace(/\s/g, ''));
		pageData = null;
	});

	it('重置每页显示条数, 重置条数文字信息', function () {
		let tableWarp = $table.closest('.table-wrap');
		let pSizeArea = jTool('select[name="pSizeArea"]', tableWarp);
		let pSizeInfo = jTool('.dataTables_info', tableWarp);
		expect(pSizeArea.val()).toBe('10');

		// 重围前使用的值为配置项中的pSize, 配置后重新测试
		let pageData = {
			cPage: 3,
			pSize: 20,
			tSize: 100
		};
		AjaxPage.resetPSize($table, pageData);
		expect(pSizeArea.val()).toBe('20');
		expect(pSizeInfo.html()).toBe('此页显示 41-60 共100条');
		pageData = null;
		tableWarp = null;
		pSizeArea = null;
		pSizeInfo = null;
	});

	it('重置分页数据', function(){
		AjaxPage.resetPageData($table, 900);
		let pageData = Cache.getSettings($table).pageData;
		expect(pageData.cPage).toBe(2);
		expect(pageData.pSize).toBe(10);
		expect(pageData.tPage).toBe(90);
		expect(pageData.tSize).toBe(900);

	});
});
