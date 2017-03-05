/**
 * Created by baukh on 17/3/5.
 */
'use strict';
var I18n = require('../src/js/I18n').default;
describe('I18n', function() {
	it('验证默认语言', function() {
		expect(I18n.i18n).toBe('zh-cn');
	});

	it('验证I18N配置项: 序号', function() {
		expect(JSON.stringify(I18n.textConfig['order-text'])).toBe('{"zh-cn":"序号","en-us":"order"}');
	});

	it('验证I18N配置项: 首页', function() {
		expect(JSON.stringify(I18n.textConfig['first-page'])).toBe('{"zh-cn":"首页","en-us":"first"}');
	});

	it('验证I18N配置项: 上一页', function() {
		expect(JSON.stringify(I18n.textConfig['previous-page'])).toBe('{"zh-cn":"上一页","en-us":"previous"}');
	});

	it('验证I18N配置项: 下一页', function() {
		expect(JSON.stringify(I18n.textConfig['next-page'])).toBe('{"zh-cn":"下一页","en-us":"next"}');
	});

	it('验证I18N配置项: 尾页', function() {
		expect(JSON.stringify(I18n.textConfig['last-page'])).toBe('{"zh-cn":"尾页","en-us":"last"}');
	});

	it('验证i18nText方法,参数为非数组类型', function() {
		expect((I18n.i18nText('dataTablesInfo', 1, 10, 100))).toBe('此页显示 1-10 共100条');
	});

	it('验证i18nText方法,参数为数组类型', function() {
		expect((I18n.i18nText('dataTablesInfo', [1, 10, 100]))).toBe('此页显示 1-10 共100条');
	});

	it('验证I18N配置项: 另存为Excel', function() {
		expect(JSON.stringify(I18n.textConfig['save-as-excel'])).toBe('{"zh-cn":"另存为Excel","en-us":"Save as Excel"}');
	});

	it('验证I18N配置项: 已选中项另存为Excel', function() {
		expect(JSON.stringify(I18n.textConfig['save-as-excel-for-checked'])).toBe('{"zh-cn":"已选中项另存为Excel","en-us":"Save selected as Excel"}');
	});

	it('验证I18N配置项: 配置表', function() {
		expect(JSON.stringify(I18n.textConfig['setting-grid'])).toBe('{"zh-cn":"配置表","en-us":"Setting Grid"}');
	});

	it('验证I18N配置项: 配置表', function() {
		expect(JSON.stringify(I18n.textConfig['checkall-text'])).toBe('{"zh-cn":"全选","en-us":"All"}');
	});
});
