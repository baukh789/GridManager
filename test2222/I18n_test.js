/**
 * Created by baukh on 17/3/5.
 */
'use strict';
import I18n from '../src/js/I18n';
import { Settings, TextSettings } from '../src/js/Settings';
import { CONSOLE_STYLE } from '../src/common/constants';
/**
 * 验证类的属性及方法总量
 */
describe('I18n 验证类的属性及方法总量', function() {
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
		// 静态函数并不会计算到实例化对象内
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(I18n)))).toBe(3 + 1);
	});
});

/**
 * 实例化方法验证
 */
describe('I18n.getLanguage(settings)', function() {
	it('基础验证', function() {
		expect(I18n.getLanguage).toBeDefined();
		expect(I18n.getLanguage.length).toBe(1);
	});

	it('返回值验证', function() {
		let settings = new Settings();
		expect(I18n.getLanguage(settings)).toBe('zh-cn');
		settings = null;
	});
});

describe('getText(settings, key, language)', function() {
	it('基础验证', function() {
		expect(I18n.getText).toBeDefined();
		expect(I18n.getText.length).toBe(3);
	});

	it('返回值验证', function() {

		let settings = new Settings();
		settings.textConfig = new TextSettings();

		// 未指定语言的
		expect(I18n.getText(settings, 'order-text')).toBe('序号');

		// 指定错误语言的
		expect(I18n.getText(settings, 'order-text', 'll')).toBe('');

		// 指定正确语言的
		expect(I18n.getText(settings, 'order-text', 'zh-tw')).toBe('序號');
		settings = null;
	});
});

describe('i18nText(settings, key, v1, v2, v3)', function() {
	let settings = null;
	beforeEach(function(){
		settings = new Settings();
		settings.textConfig = new TextSettings();

		// 存储console, 用于在测方式完成后原还console对象
		console._log = console.log;
		console.log = jasmine.createSpy("log");
	});

	afterEach(function(){
		settings = null;

		// 还原console
		console.log = console._log;
	});
	it('基础验证', function() {
		expect(I18n.i18nText).toBeDefined();
		expect(I18n.i18nText.length).toBe(5);
	});

	it('返回值验证', function() {

		// 未指定{}内容的
		expect(I18n.i18nText(settings, 'order-text')).toBe('序号');

		// 指定1个{}内容的
		expect(I18n.i18nText(settings, 'checked-info', 1)).toBe('已选 1 条');

		// 指定2个{}内容的
		expect(I18n.i18nText(settings, 'page-info', 1, 2)).toBe('此页显示 1-2<span class="page-info-totals"> 共条</span>');

		// 指定3个{}内容的
		expect(I18n.i18nText(settings, 'page-info', 1, 2, 3)).toBe('此页显示 1-2<span class="page-info-totals"> 共3条</span>');

		// 指定1个{}内容的- 数组
		expect(I18n.i18nText(settings, 'page-info', [1, 2, 3])).toBe('此页显示 1-2<span class="page-info-totals"> 共3条</span>');

		// 指定错误的, 并验证错误打印信息
		expect(I18n.i18nText(settings, 'undefinedKey', [1, 2, 3])).toBe('');
		expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c 未找到与undefinedKey相匹配的zh-cn语言 ', ...CONSOLE_STYLE.WARN);

	});
});

