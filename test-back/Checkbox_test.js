/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import Checkbox from '../src/js/Checkbox';
import {Settings, TextSettings} from '../src/js/Settings';
import {Base} from "../src/js/Base";
import I18n from "../src/js/I18n";
/**
 * 验证类的属性及方法总量
 */
describe('Checkbox 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Checkbox)))).toBe(8 + 1);
	});
});

describe('Checkbox.key', function() {
	it('基础验证', function() {
		expect(Checkbox.key).toBeDefined();
		expect(Checkbox.key).toBe('gm_checkbox');
	});
});

describe('Checkbox.getCheckedTr($table)', function() {
	it('基础验证', function() {
		expect(Checkbox.getCheckedTr).toBeDefined();
		expect(Checkbox.getCheckedTr.length).toBe(1);
	});
});

describe('Checkbox.getThString(useRadio)', function() {
	let checkboxHtml = null;
	beforeEach(() => {
	});

	afterEach(() => {
		checkboxHtml = null;
	});

	it('基础验证', function () {
		expect(Checkbox.getThString).toBeDefined();
		expect(Checkbox.getThString.length).toBe(1);
	});

	it('返回值验证', function () {
		checkboxHtml = Base.getCheckboxString();
		expect(Checkbox.getThString(false).replace(/\s/g, '')).toBe(checkboxHtml.replace(/\s/g, ''));
	});

    it('返回值验证', function () {
        checkboxHtml = Base.getCheckboxString();
        expect(Checkbox.getThString(true)).toBe('');
    });
});

describe('Checkbox.getColumn(settings)', function() {
	let settings = null;
	let column = null;
	beforeEach(() => {
		settings = new Settings();
		settings.textConfig = new TextSettings();
		settings.gridManagerName = 'checkbox-getColumn';
	});

	afterEach(() => {
		settings = null;
		column = null;
	});

	it('基础验证', function () {
		expect(Checkbox.getColumn).toBeDefined();
		expect(Checkbox.getColumn.length).toBe(1);
	});

	it('返回值验证', function () {
		column = Checkbox.getColumn(settings);
		expect(typeof column).toBe('object');
		expect(column.key).toBe('gm_checkbox');
		expect(column.isAutoCreate).toBe(true);
		expect(column.isShow).toBe(true);
		expect(column.disableCustomize).toBe(true);
		expect(column.width).toBe('40px');
		expect(column.align).toBe('center');
	});
});

describe('Checkbox.bindCheckboxEvent($table, settings)', function() {
	it('基础验证', function () {
		expect(Checkbox.bindCheckboxEvent).toBeDefined();
		expect(Checkbox.bindCheckboxEvent.length).toBe(2);
	});
});

describe('Checkbox.resetData($table, status, isAllCheck, cacheKey, isRadio)', function() {
	it('基础验证', function () {
		expect(Checkbox.resetData).toBeDefined();
		expect(Checkbox.resetData.length).toBe(5);
	});
});

describe('Checkbox.resetDOM($table, settings, tableData, isRadio)', function() {
	it('基础验证', function () {
		expect(Checkbox.resetDOM).toBeDefined();
		expect(Checkbox.resetDOM.length).toBe(4);
	});
});

describe('Checkbox.destroy($table)', function() {
	it('基础验证', function () {
		expect(Checkbox.destroy).toBeDefined();
		expect(Checkbox.destroy.length).toBe(1);
	});
});

