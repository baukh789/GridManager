/**
 * Created by baukh on 17/4/17.
 * 注意: 公开方法在实际调用时 与 测试时方法不同, document.querySelector('table').GM('get');
 */
'use strict';
import {PublishMethod, publishMethodArray} from '../src/js/Publish';
import testData from '../src/data/testData';
import testData2 from '../src/data/testData2';
import { GM_VERSION, GM_PUBLISH_METHOD_LIST } from '../src/common/constants';
import GridManager from "../src/js/GridManager";
import {Base, jTool} from "../src/js/Base";
import { CONSOLE_STYLE } from '../src/common/constants';

describe('publishMethodArray', function() {
	it('公开方法列表', function () {
		expect(publishMethodArray).toEqual(GM_PUBLISH_METHOD_LIST);
	});
});

/**
 * 验证类的属性及方法总量
 */
describe('Publish 验证类的属性及方法总量', function() {
	var getPropertyCount = null;
	beforeAll(function() {
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
	afterAll(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(PublishMethod)))).toBe(22 + 1);
	});
});

describe('PublishMethod.init(table, settings, callback)', function() {
	let table = null;
	let arg = null;
	beforeAll(function(){
		// 存储console, 用于在测方式完成后原还console对象
		console._log = console.log;
		console.log = jasmine.createSpy("log");

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterAll(function(){
		console.log = console._log;
		document.body.innerHTML = '';
		table = null;
		arg = null;
	});

	it('基础验证', function () {
		expect(PublishMethod.init).toBeDefined();
		expect(PublishMethod.init.length).toBe(3);
	});

	it('配置参为空', function () {
		PublishMethod.init(table);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c init()方法中未发现有效的参数 ', ...CONSOLE_STYLE.ERROR);
	});

	it('columnData 为空', function () {
		arg = {
			gridManagerName: 'test-publish'
		};
		PublishMethod.init(table, arg);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c 请对参数columnData进行有效的配置 ', ...CONSOLE_STYLE.ERROR);
	});

	// gridManagerName 为空
	it('gridManagerName 为空', function () {
		arg = {
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		PublishMethod.init(table, arg);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c 请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName ', ...CONSOLE_STYLE.ERROR);
	});

	it('当前表格已经渲染', function () {
		arg = {
			gridManagerName: 'test-publish',
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		table.className = 'GridManager-ready';
		PublishMethod.init(table, arg);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c 渲染失败,可能该表格已经渲染或正在渲染 ', ...CONSOLE_STYLE.ERROR);
	});

	it('当前表格正在渲染', function () {
		arg = {
			gridManagerName: 'test-publish',
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		table.className = 'GridManager-loading';
		PublishMethod.init(table, arg);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c 渲染失败,可能该表格已经渲染或正在渲染 ', ...CONSOLE_STYLE.ERROR);
	});

	it('回调函数是否调用', function () {
        jasmine.clock().install();
		table.className = '';
		arg = {
			ajax_data: testData,
			gridManagerName: 'test-publish',
			columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				},{
					key: 'info',
					text: '使用说明'
				},{
					key: 'url',
					text: 'url',
                    // 使用函数返回 dom node
                    template: function(url) {
                        var urlNode = document.createElement('a');
                        urlNode.setAttribute('href', url);
                        urlNode.setAttribute('target', '_blank');
                        urlNode.innerText = url;
                        return urlNode;
                    }
				},{
					key: 'createDate',
					text: '创建时间'
				},{
					key: 'lastDate',
					text: '最后修改时间',
                    // 使用函数返回 htmlString
                    template: function(lastDate, rowObject){
                        return new Date(lastDate).toLocaleDateString();
                    }
                },{
					key: 'action',
					text: '操作',
                    // 直接返回 htmlString
                    template: '<span class="plugin-action del-action" onclick="delectRowData(this)">删除</span>'
				}
			]
		};

		let callback = jasmine.createSpy('callback');
		PublishMethod.init(table, arg, callback);
        jasmine.clock().tick(1000);
		expect(callback).toHaveBeenCalled();
        jasmine.clock().uninstall();
	});
});

describe('PublishMethod 非init方法验证', function() {
	let table = null;
	let arg = null;
	let trList = null;
	let gridManagerName = null;
	let queryValue = null;
	beforeAll(function () {
		// 存储console, 用于在测方式完成后原还console对象
		console._log = console.log;
		console.log = jasmine.createSpy("log");

		gridManagerName = 'test-publish';
		queryValue = {'ccname': 'baukh'};

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = {
			ajax_data: testData,
			gridManagerName: gridManagerName,
            disableCache: true,
			query: queryValue,
			columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				},{
					key: 'info',
					text: '使用说明'
				},{
					key: 'url',
					text: 'url'
				},{
					key: 'createDate',
					text: '创建时间'
				},{
					key: 'lastDate',
					text: '最后修改时间'
				},{
					key: 'action',
					text: '操作',
					template: function(action, rowObject){
						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
					}
				}
			]
		};
        jasmine.clock().install();
		PublishMethod.init(table, arg);
        jasmine.clock().tick(1000);
	});

	afterAll(function () {
		table = null;
		arg = null;
		trList = null;
		gridManagerName = null;
		queryValue = null;
		console.log = console._log;
		document.body.innerHTML = '';
        jasmine.clock().uninstall();
	});


	describe('PublishMethod.get(table)', function() {
		it('基础验证', function () {
			expect(PublishMethod.get).toBeDefined();
			expect(PublishMethod.get.length).toBe(1);
		});

		it('参数为空', function () {
			expect(PublishMethod.get()).toEqual({});
		});

		it('验证返回值', function () {
			// 抽取两个值进行较验
			expect(PublishMethod.get(table).gridManagerName).toBe(gridManagerName);
			expect(PublishMethod.get(table).sortKey).toBe('sort_');
		});
	});


	describe('PublishMethod.version()', function() {
		it('基础验证', function () {
			expect(PublishMethod.version()).toBeDefined();
			expect(PublishMethod.version.length).toBe(0);
		});

		it('返回值验证', function () {
			expect(PublishMethod.version()).toBe(GM_VERSION);
		});
	});

	describe('PublishMethod.getLocalStorage(table)', function() {
		it('基础验证', function () {
			expect(PublishMethod.getLocalStorage).toBeDefined();
			expect(PublishMethod.getLocalStorage.length).toBe(1);
		});

		it('参数为空', function () {
			expect(PublishMethod.getLocalStorage()).toEqual({});
		});

		it('验证返回值', function () {
			// 当前表格并不存在本地存储, 所以返回为空对象
			expect(PublishMethod.getLocalStorage(table)).toEqual({});
		});
	});

    describe('PublishMethod.resetLayout(table, width, height)', function() {
        let $table = null;
        let $tableWrap = null;
        let $tableDiv = null;
        let style = null;
        let overflowX = null;
        beforeEach(function(){
            $table = jTool(table);
            $tableWrap = $table.closest('.table-wrap');
            $tableDiv = jTool('.table-div', $tableWrap);
        });

        afterEach(function(){
            $table = null;
            $tableWrap = null;
            $tableDiv = null;
            style = null;
            overflowX = null;
        });

        it('基础验证', function () {
            expect(PublishMethod.resetLayout).toBeDefined();
            expect(PublishMethod.resetLayout.length).toBe(3);
        });

        it('验证百分比', function () {
            PublishMethod.resetLayout(table, '100%', '100%');
            style = $tableWrap.get(0).style;
            expect(style.width).toBe('calc(100%)');
            expect(style.height).toBe('calc(100%)');
        });

        it('验证像素', function () {
            PublishMethod.resetLayout(table, '1000px', '500px');
            style = $tableWrap.get(0).style;
            expect(style.width).toBe('calc(1000px)');
            expect(style.height).toBe('calc(500px)');
        });

        it('验证calc()', function () {
            PublishMethod.resetLayout(table, '100% - 100px', '100% + 100px');
            style = $tableWrap.get(0).style;
            expect(style.width).toBe('calc(100% - 100px)');
            expect(style.height).toBe('calc(100% + 100px)');
        });

        it('验证calc()', function () {
            PublishMethod.resetLayout(table, '100% + 100px', '100% + 100px');
            style = $tableWrap.get(0).style;
            expect(style.width).toBe('calc(100% + 100px)');
            expect(style.height).toBe('calc(100% + 100px)');
        });
    });

	describe('PublishMethod.clear(table)', function() {
		it('基础验证', function () {
			expect(PublishMethod.clear).toBeDefined();
			expect(PublishMethod.clear.length).toBe(1);
		});

		it('console提示文本', function () {
			PublishMethod.clear();
            expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c 用户记忆被全部清除: 通过clear()方法清除 ', ...CONSOLE_STYLE.WARN);
		});
	});


	describe('PublishMethod.getRowData(table, target)', function() {
		it('基础验证', function () {
			expect(PublishMethod.getRowData).toBeDefined();
			expect(PublishMethod.getRowData.length).toBe(2);
		});

		it('target为空', function () {
			expect(PublishMethod.getRowData(table)).toEqual({});
		});

		it('参数完整', function () {
			trList = document.querySelectorAll('tbody tr');
			expect(PublishMethod.getRowData(table, trList[0]).name).toEqual('baukh');
			expect(PublishMethod.getRowData(table, trList[1]).name).toEqual('kouzi');
		});
	});

	describe('PublishMethod.setSort(table, sortJson, callback, refresh)', function() {
		let callback1 = null;
		let callback2 = null;
		let callback3 = null;
		let sortJson = null;
		beforeEach(() => {
            jasmine.clock().uninstall();
            callback1 = jasmine.createSpy('callback');
            callback2 = jasmine.createSpy('callback');
            callback3 = jasmine.createSpy('callback');
            jasmine.clock().install();
		});

		afterEach(() => {
			sortJson = null;
            callback1 = null;
            callback2 = null;
            callback3 = null;
            jasmine.clock().uninstall();
		});
		it('基础验证', function () {
			expect(PublishMethod.setSort).toBeDefined();
			expect(PublishMethod.setSort.length).toBe(4);
		});

		it('执行1', function () {
			sortJson = {
				name: 'DESC'
			};
			PublishMethod.setSort(table, sortJson, callback1, true);
			jasmine.clock().tick(100);
			// expect(callback1).toHaveBeenCalled();
			expect(PublishMethod.get(table).sortData.name).toBe('DESC');
		});

		it('执行2', function () {
			sortJson = {
				name: 'ASC'
			};
			PublishMethod.setSort(table, sortJson, callback2, false);
			jasmine.clock().tick(1000);
			expect(callback2).toHaveBeenCalled();
			expect(PublishMethod.get(table).sortData.name).toBe('ASC');
		});
		it('执行3', function () {
			// 传递无效的值
			sortJson = {
				name: undefined
			};
			PublishMethod.setSort(table, sortJson, callback3, false);
			jasmine.clock().tick(1000);
			expect(callback3).toHaveBeenCalled();
			expect(PublishMethod.get(table).sortData.name).toBe(undefined);
		});
	});


	// showConfig 和 hideConfig 方法用 setConfigVisible方法替换了
    // describe('PublishMethod.showConfig(table) or PublishMethod.hideConfig(table)', function() {
    //     let $table = null;
    //     let $tableWrap = null;
    //     let $configArea = null;
    //     beforeEach(function(){
    //         $table = jTool(table);
    //         $tableWrap = $table.closest('.table-wrap');
    //         $configArea = jTool('.config-area', $tableWrap);
    //     });
    //
    //     afterEach(function(){
    //         $table = null;
    //         $tableWrap = null;
    //         $configArea = null;
    //     });
    //
    //     it('基础验证', function () {
    //         expect(PublishMethod.showConfig).toBeDefined();
    //         expect(PublishMethod.showConfig.length).toBe(1);
    //
    //         expect(PublishMethod.hideConfig).toBeDefined();
    //         expect(PublishMethod.hideConfig.length).toBe(1);
    //     });
    //
    //     it('执行 showConfig', function () {
    //         PublishMethod.showConfig(table);
    //         expect($configArea.css('display')).toBe('block');
    //     });
    //
    //     it('执行 hideConfig', function () {
    //         expect($configArea.css('display')).toBe('block');
    //         PublishMethod.hideConfig(table);
    //         expect($configArea.css('display')).toBe('none');
    //     });
    // });

	describe('PublishMethod.showTh(table, target) or PublishMethod.hideTh(table, target)', function() {
		let firstTh = null;
		let lastTh = null;
		let firstTd = null;
		let lastTd = null;
		beforeAll(() => {
			firstTh = table.querySelector('thead th');
			lastTh = table.querySelector('thead th:last-child');
			firstTd = table.querySelector('tbody td');
			lastTd = table.querySelector('tbody td:last-child');
		});

		afterAll(() => {
			firstTh = null;
			lastTh = null;
			firstTd = null;
			lastTd = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.showTh).toBeDefined();
			expect(PublishMethod.showTh.length).toBe(2);

			expect(PublishMethod.hideTh).toBeDefined();
			expect(PublishMethod.hideTh.length).toBe(2);
		});

		it('执行 hideTh', function () {
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');

			PublishMethod.hideTh(table, firstTh);
			expect(firstTd.getAttribute('td-visible')).toBe('none');
		});

		it('执行 showTh', function () {
			expect(firstTh.getAttribute('th-visible')).toBe('none');
			expect(firstTd.getAttribute('td-visible')).toBe('none');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');

			PublishMethod.showTh(table, firstTh);
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');
		});

		it('执行 showTh or hideTh', function () {
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');

			PublishMethod.hideTh(table, [firstTh, lastTh]);
			expect(firstTh.getAttribute('th-visible')).toBe('none');
			expect(firstTd.getAttribute('td-visible')).toBe('none');
			expect(lastTh.getAttribute('th-visible')).toBe('none');
			expect(lastTd.getAttribute('td-visible')).toBe('none');

			PublishMethod.showTh(table, [firstTh, lastTh]);
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');
		});
	});

	describe('PublishMethod.exportGridToXls(table, fileName, onlyChecked)', function() {
		it('基础验证', function () {
			expect(PublishMethod.exportGridToXls).toBeDefined();
			expect(PublishMethod.exportGridToXls.length).toBe(3);
		});
	});

	describe('PublishMethod.setQuery(table, query, isGotoFirstPage, callback)', function() {
		let callback1 = null;
		let callback2 = null;
		let callback3 = null;
		beforeEach(() => {
			jasmine.clock().install();
			callback1 = jasmine.createSpy('callback');
			callback2 = jasmine.createSpy('callback');
			callback3 = jasmine.createSpy('callback');
		});

		afterEach(() => {
			callback1 = null;
			callback2 = null;
			callback3 = null;
			jasmine.clock().uninstall();
		});

		it('基础验证', function () {
			expect(PublishMethod.setQuery).toBeDefined();
			expect(PublishMethod.setQuery.length).toBe(4);
		});

		it('执行1', function () {
			// query 为 init 时传递的参数值
			expect(PublishMethod.get(table).query).toEqual(queryValue);

			// query值为空, 不指定 isGotoFirstPage
			PublishMethod.setQuery(table, {}, callback1);
			jasmine.clock().tick(1000);
			// expect(callback1).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toEqual({});
		});

		it('执行2', function () {
			// query值不为空, 指定 isGotoFirstPage = true
			PublishMethod.setQuery(table, {cc: 1}, true, callback2);
			jasmine.clock().tick(1000);
			// expect(callback2).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toEqual({cc: 1});
		});
		it('执行3', function () {
			// query值为空对象, 指定 isGotoFirstPage = false
			PublishMethod.setQuery(table, {}, false, callback3);
			jasmine.clock().tick(1000);
			// expect(callback3).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toEqual({});

		});
		it('执行4', function () {
			// 不传递query, 不指定 isGotoFirstPage
			PublishMethod.setQuery(table, undefined, false, callback3);
			jasmine.clock().tick(1000);
			// expect(callback3).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toBeUndefined();
		});
	});

	describe('PublishMethod.setAjaxData(table, ajaxData, callback)', function() {
		let checkAllTh = null;
		let checkOneTh = null;
		let callback = jasmine.createSpy('callback');
		beforeAll(() => {
			checkAllTh = table.querySelector('thead th[gm-checkbox="true"] input');
			checkOneTh = table.querySelector('tbody td[gm-checkbox="true"] input');
			callback = jasmine.createSpy('callback');
		});

		afterAll(() => {
			checkAllTh = null;
			checkOneTh = null;
			callback = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.setAjaxData).toBeDefined();
			expect(PublishMethod.setAjaxData.length).toBe(3);
		});

		it('执行', function () {
			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);

			// TODO 被测试的方法内包含promise时，无法通过clock进行测试，所以下列测试方法都被注释
			// 将静态数据更换为 testData2
			// PublishMethod.setAjaxData(table, testData2, callback);
			// expect(callback).toHaveBeenCalled();

			// 全选
			// checkAllTh.click();
			// expect(PublishMethod.getCheckedTr(table).length).toBe(testData2.data.length);

			// 取消全选
			// checkAllTh.click();
			// expect(PublishMethod.getCheckedTr(table).length).toBe(0);

			// 将静态数据更换为 testData
			// PublishMethod.setAjaxData(table, testData);

			// 全选
			// checkAllTh.click();
			// expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			// checkAllTh.click();
			// expect(PublishMethod.getCheckedTr(table).length).toBe(0);

		});
	});

	describe('PublishMethod.refreshGrid(table, isGotoFirstPage, callback)', function() {
		let callback1 = null;
		let callback2 = null;
		let callback3 = null;
		beforeAll(() => {
			callback1 = jasmine.createSpy('callback');
			callback2 = jasmine.createSpy('callback');
			callback3 = jasmine.createSpy('callback');
		});

		afterAll(() => {
			callback1 = null;
			callback2 = null;
			callback3 = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.refreshGrid).toBeDefined();
			expect(PublishMethod.refreshGrid.length).toBe(3);
		});

		it('执行', function () {
			PublishMethod.refreshGrid(table, callback1);
			// expect(callback1).toHaveBeenCalled();

			PublishMethod.refreshGrid(table, true, callback2);
			// expect(callback2).toHaveBeenCalled();

			PublishMethod.refreshGrid(table, false, callback3);
			// expect(callback3).toHaveBeenCalled();
		});
	});

	describe('PublishMethod.getCheckedTr(table)', function() {
		let checkAllTh = null;
		let checkOneTh = null;
		beforeAll(() => {
			checkAllTh = table.querySelector('thead th[gm-checkbox="true"] input');
			checkOneTh = table.querySelector('tbody td[gm-checkbox="true"] input');
		});

		afterAll(() => {
			checkAllTh = null;
			checkOneTh = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.getCheckedTr).toBeDefined();
			expect(PublishMethod.getCheckedTr.length).toBe(1);
		});

		it('操作验证', function () {
			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);

			// 选中第一个
			checkOneTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(1);

			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);
		});
	});

	describe('PublishMethod.getCheckedTr(table)', function() {
		let checkAllTh = null;
		let checkOneTh = null;
		beforeAll(() => {
			checkAllTh = table.querySelector('thead th[gm-checkbox="true"] input');
			checkOneTh = table.querySelector('tbody td[gm-checkbox="true"] input');
		});

		afterAll(() => {
			checkAllTh = null;
			checkOneTh = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.getCheckedData).toBeDefined();
			expect(PublishMethod.getCheckedData.length).toBe(1);
		});

		it('返回值1', function () {
			expect(PublishMethod.getCheckedData(table).length).toEqual(0);
			expect(PublishMethod.getCheckedData(table)).toEqual([]);
		});

		it('返回值2', function () {
			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(testData.data.length);
			expect(PublishMethod.getCheckedData(table)[0].createDate).toBe(testData.data[0].createDate);
			expect(PublishMethod.getCheckedData(table)[1].name).toBe(testData.data[1].name);
			expect(PublishMethod.getCheckedData(table)[2].age).toBe(testData.data[2].age);
		});

		it('返回值3', function () {
			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(0);
		});

		it('返回值4', function () {
			// 选中第一个
			checkOneTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(1);
			expect(PublishMethod.getCheckedData(table)[0].createDate).toBe(testData.data[0].createDate);
			expect(PublishMethod.getCheckedData(table)[0].name).toBe(testData.data[0].name);
			expect(PublishMethod.getCheckedData(table)[0].age).toBe(testData.data[0].age);
			expect(PublishMethod.getCheckedData(table)[0].info).toBe(testData.data[0].info);
			expect(PublishMethod.getCheckedData(table)[0].operation).toBe(testData.data[0].operation);

		});

		it('返回值5', function () {
			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(testData.data.length);
			expect(PublishMethod.getCheckedData(table)[0].operation).toEqual(testData.data[0].operation);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toEqual(0);
			expect(PublishMethod.getCheckedData(table)).toEqual([]);
		});
	});

});

describe('PublishMethod.setCheckedData(table, checkedList)', function() {
    it('基础验证', function() {
        expect(PublishMethod.checkedList).toBeDefined();
        expect(PublishMethod.checkedList.length).toBe(2);
    });
});

describe('PublishMethod.updateRowData(table, key, rowData)', function() {
    it('基础验证', function() {
        expect(PublishMethod.updateRowData).toBeDefined();
        expect(PublishMethod.updateRowData.length).toBe(3);
    });
});

describe('PublishMethod.cleanData(table)', function() {
	it('基础验证', function() {
		expect(PublishMethod.cleanData).toBeDefined();
		expect(PublishMethod.cleanData.length).toBe(1);
	});
});

describe('PublishMethod.destroy(table)', function() {
	let table = null;
	let arg = null;
    beforeAll(() => {
		table = document.createElement('table');
		document.body.appendChild(table);
        jasmine.clock().install();
	});

    afterAll(() => {
		table = null;
		arg = null;
        document.body.innerHTML = '';
        jasmine.clock().uninstall();
	});

	it('基础验证', function () {
		expect(PublishMethod.destroy).toBeDefined();
		expect(PublishMethod.destroy.length).toBe(1);
	});

	it('验证移除效果', function () {
        arg = {
            ajax_data: testData,
            gridManagerName: 'test-publish',
            supportAjaxPage: true,
            supportAdjust: true,
            columnData: [
                {
                    key: 'name',
                    width: '100px',
                    text: '名称'
                },{
                    key: 'info',
                    text: '使用说明'
                },{
                    key: 'url',
                    text: 'url'
                },{
                    key: 'createDate',
                    text: '创建时间'
                },{
                    key: 'lastDate',
                    text: '最后修改时间',
                    sorting: ''
                },{
                    key: 'action',
                    text: '操作',
                    template: function(action, rowObject){
                        return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
                            +'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
                    }
                }
            ]
        };
        // TODO jToolEvent 部分事件是存在异步的情况了，
        // TODO 应该改成验证settings中的值是否正确，而不是去验证事件。 其它的测试也应该考虑一下
        PublishMethod.init(table, arg);
        jasmine.clock().tick(10000);
		// 全选
		expect(table.jToolEvent['clickth[gm-checkbox="true"] input[type="checkbox"]']).toBeDefined();
		expect(table.jToolEvent['clicktd[gm-checkbox="true"] input[type="checkbox"]']).toBeDefined();

		// 宽度调整
		// expect(table.jToolEvent['mousedown.adjust-action']).toBeDefined();

		// 排序
		// expect(table.jToolEvent['mouseup.sorting-action']).toBeDefined();

		// Hover
		// expect(table.jToolEvent['mousemovetd']).toBeDefined();
		PublishMethod.destroy(table);
		expect(table.jToolEvent['clickth[gm-checkbox="true"] input[type="checkbox"]']).toBeUndefined();
		expect(table.jToolEvent['mousedown.adjust-action']).toBeUndefined();
		expect(table.jToolEvent['mouseup.sorting-action']).toBeUndefined();
		expect(table.jToolEvent['mousemovetd']).toBeUndefined();
	});
});
