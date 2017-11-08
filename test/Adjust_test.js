'use strict';
import { jTool } from '../src/js/Base';
import Adjust from '../src/js/Adjust';
/**
 * 对象完整性验证
 */
describe('Adjust.js 对象完整性验证', function() {
	it('对象完整性验证 Adjust.html', function() {
		expect(Adjust.html).toBeDefined();
	});
	it('对象完整性验证 Adjust.bindAdjustEvent', function() {
		expect(Adjust.bindAdjustEvent).toBeDefined();
	});

	it('对象完整性验证 Adjust.runMoveEvent', function() {
		expect(Adjust.runMoveEvent).toBeDefined();
	});

	it('对象完整性验证 Adjust.runStopEvent', function() {
		expect(Adjust.runStopEvent).toBeDefined();
	});

	it('对象完整性验证 Adjust.resetAdjust', function() {
		expect(Adjust.resetAdjust).toBeDefined();
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
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
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
		});
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
