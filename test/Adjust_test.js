'use strict';
import { jTool } from '../src/js/Base';
import Adjust from '../src/js/Adjust';
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

	it('Adjust.html', function() {
		expect(Adjust.html).toBe('<span class="adjust-action"></span>');
	});

	it('Adjust.bindAdjustEvent() 方法是否存在', function() {
		expect(Adjust.bindAdjustEvent).toBeDefined();
	});

	it('Adjust.runMoveEvent() 方法是否存在', function() {
		expect(Adjust.runMoveEvent).toBeDefined();
	});

	it('Adjust.runStopEvent() 方法是否存在', function() {
		expect(Adjust.runStopEvent).toBeDefined();
	});

	it('Adjust.resetAdjust()', function () {
		expect(Adjust.resetAdjust()).toBe(false);
		expect(Adjust.resetAdjust($table)).toBe(undefined);
	});

	it('宽度调整事件[adjustBefore]', function () {
		expect(adjustBefore.calls.any()).toBe(false);// 函数是否被访问过

		// 触发事件 TODO 应该改写jTool 的trigger 方法
		var fireOnThis = document.querySelector('.adjust-action');
		var evObj = document.createEvent('MouseEvents');
		evObj.initEvent('mousedown', true, false);
		fireOnThis.dispatchEvent(evObj);

		expect(adjustBefore.calls.any()).toBe(true);// 函数是否被访问过
		expect(adjustBefore).toHaveBeenCalled();  // 函数是否被调用
	});

	it('宽度调整事件[adjustAfter]', function () {
		// 触发事件 TODO 应该改写jTool 的trigger 方法
		var evObj = document.createEvent('MouseEvents');
		evObj.initEvent('mouseleave', true, false);
		table.dispatchEvent(evObj);

		expect(adjustAfter.calls.any()).toBe(true);// 函数是否被访问过
		expect(adjustAfter).toHaveBeenCalled();  // 函数是否被调用
	});

});
