'use strict';
import '../build/css/GridManager.css';
import { jTool } from '../src/js/Base';
import Adjust from '../src/js/Adjust';
import GridManager from '../src/js/GridManager';
/**
 * 对象完整性验证
 */
describe('Adjust.js 对象完整性验证', function() {
	it('对象完整性验证 Adjust.html', function() {
		expect(Adjust.html).toBeDefined();
	});
	it('对象完整性验证 Adjust.bindAdjustEvent', function() {
		expect(Adjust.bindAdjustEvent).toBeDefined();
		expect(Adjust.bindAdjustEvent.length).toBe(1);
	});

	it('对象完整性验证 Adjust.runMoveEvent', function() {
		expect(Adjust.runMoveEvent).toBeDefined();
		expect(Adjust.runMoveEvent.length).toBe(3);
	});

	it('对象完整性验证 Adjust.runStopEvent', function() {
		expect(Adjust.runStopEvent).toBeDefined();
		expect(Adjust.runStopEvent.length).toBe(3);
	});

	it('对象完整性验证 Adjust.resetAdjust', function() {
		expect(Adjust.resetAdjust).toBeDefined();
		expect(Adjust.resetAdjust.length).toBe(1);
	});

});

/**
 * 验证原型方法总数
 */
describe('Adjust 验证原型方法总数', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Adjust)))).toBe(5 + 1);
	});
});
describe('Adjust.js', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-adjust';
	let adjustBefore = jasmine.createSpy('adjustBefore');
	let adjustAfter = jasmine.createSpy('adjustAfter');
	beforeAll(function(){
		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		var arg = {
			ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList'
			,disableCache: true
			,i18n: 'en-us'
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
			],
			adjustBefore: adjustBefore,
			adjustAfter: adjustAfter
		};
		new GridManager().init(table, arg);
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		adjustBefore = null;
		adjustAfter = null;
		document.body.innerHTML = '';
	});

	it('Adjust.resetAdjust()', function () {
		expect(Adjust.resetAdjust()).toBe(false);
		expect(Adjust.resetAdjust($table)).toBe(undefined);
	});

	it('Adjust.html', function() {
		expect(Adjust.html).toBe('<span class="adjust-action"></span>');
	});

	it('宽度调整事件[adjustBefore]', function () {
		expect(adjustBefore.calls.any()).toBe(false);// 函数是否被访问过

		// 触发事件 TODO jTool 中预绑定的事件, 无法通过new Event()方式触发.  考虑下改写jTool 相关代码
		var fireOnThis = document.querySelector('.adjust-action');
		var evObj = document.createEvent('MouseEvents');
		evObj.initEvent('mousedown', true, false);
		fireOnThis.dispatchEvent(evObj);

		expect(adjustBefore.calls.any()).toBe(true);// 函数是否被访问过
		expect(adjustBefore).toHaveBeenCalled();  // 函数是否被调用
	});

	it('宽度调整事件[adjustAfter]', function () {
		// 触发事件
		expect(adjustAfter.calls.any()).toBe(false);// 函数是否被访问过

		var myEvent = new Event('mouseleave');
		table.dispatchEvent(myEvent);

		expect(adjustAfter.calls.any()).toBe(true);// 函数是否被访问过
		expect(adjustAfter).toHaveBeenCalled();  // 函数是否被调用
	});

});
