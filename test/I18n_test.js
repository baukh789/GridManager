/**
 * Created by baukh on 17/3/5.
 */
'use strict';
var GridManager = require('../src/js/GridManager').default;
var I18N = require('../src/js/I18n').default;
var jTool = require('../src/js/jTool').default;
describe('I18n', function() {
	let table1 = null;
	let $table1 = null;
	let table2 = null;
	let $table2 = null;
	beforeEach(function(){
		// 第一组设置为en-us
		table1 = document.createElement('table');
		table1.setAttribute('grid-manager', 'test-i18n-1');
		document.querySelector('body').appendChild(table1);
		$table1 = jTool('table[grid-manager="test-i18n-1"]');
		document.querySelector('table[grid-manager="test-i18n-1"]').GM({
			ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList'
			,i18n: 'en-us'
			,columnData: [
				{
					key: 'name',
					remind: 'the name',
					width: '100px',
					text: '名称',
					sorting: 'up'
				}
			]
		});

		//第二组使用默认的zh-cn
		table2 = document.createElement('table');
		table2.setAttribute('grid-manager', 'test-i18n-2');
		document.querySelector('body').appendChild(table2);
		$table2 = jTool('table[grid-manager="test-i18n-2"]');
		document.querySelector('table[grid-manager="test-i18n-2"]').GM({
			ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList'
			,columnData: [
				{
					key: 'name',
					remind: 'the name',
					width: '100px',
					text: '名称',
					sorting: 'up'
				}
			]
		});
	});
	afterEach(function () {
		document.querySelector('body').innerHTML = '';
		table1 = null;
		table2 = null;
		$table1 = null;
		$table2 = null;
	});

	it('验证语言', function() {
		expect( I18N.getLanguage($table1) ).toBe('en-us');
		expect( I18N.getLanguage($table2) ).toBe('zh-cn');
	});

	it('验证静态文本- 序号', function() {
		expect( I18N.i18nText($table1, 'order-text') ).toBe('order');
		expect( I18N.i18nText($table2, 'order-text') ).toBe('序号');
	});

	it('验证动态文本- 显示条数', function() {
		console.log(I18N.i18nText($table1, 'dataTablesInfo', [1, 10, 20]))
		expect( I18N.i18nText($table1, 'dataTablesInfo', [1, 10, 20]) ).toBe('this page show 1-10 count 20');
		expect( I18N.i18nText($table2, 'dataTablesInfo', [1, 10, 20]) ).toBe('此页显示 1-10 共20条');
	});



});
