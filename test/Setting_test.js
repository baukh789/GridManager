/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import { Settings, textObject } from '../src/js/Settings';
describe('Settings', function() {
	it('test supportDrag initialize property', function() {
		expect(Settings.supportDrag).toBe(true);
	});
	it('test dragBefore initialize property', function() {
		expect(typeof Settings.dragBefore).toBe('function');
	});
	it('test dragAfter initialize property', function() {
		expect(typeof Settings.dragAfter).toBe('function');
	});
	it('test supportAdjust initialize property', function() {
		expect(Settings.supportAdjust).toBe(true);
	});
	it('test adjustBefore initialize property', function() {
		expect(typeof Settings.adjustBefore).toBe('function');
	});
	it('test adjustAfter initialize property', function() {
		expect(typeof Settings.adjustAfter).toBe('function');
	});
	it('test supportRemind initialize property', function() {
		expect(Settings.supportRemind).toBe(false);
	});
	it('test supportConfig initialize property', function() {
		expect(Settings.supportConfig).toBe(true);
	});
	it('test width initialize property', function() {
		expect(Settings.width).toBe('100%');
	});
	it('test height initialize property', function() {
		expect(Settings.height).toBe('300px');
	});
	it('test animateTime initialize property', function() {
		expect(Settings.animateTime).toBe(300);
	});
	it('test disableCache initialize property', function() {
		expect(Settings.disableCache).toBe(false);
	});
	it('test supportSorting initialize property', function() {
		expect(Settings.supportSorting).toBe(false);
	});
	it('test isCombSorting initialize property', function() {
		expect(Settings.isCombSorting).toBe(false);
	});
	it('test sortKey initialize property', function() {
		expect(Settings.sortKey).toBe('sort_');
	});
	it('test sortData initialize property', function() {
		expect(Settings.sortData).toEqual({});
	});
	it('test sortUpText initialize property', function() {
		expect(Settings.sortUpText).toBe('ASC');
	});
	it('test sortDownText initialize property', function() {
		expect(Settings.sortDownText).toBe('DESC');
	});
	it('test sortingBefore initialize property', function() {
		expect(typeof Settings.sortingBefore).toBe('function');
	});
	it('test sortingAfter initialize property', function() {
		expect(typeof Settings.sortingAfter).toBe('function');
	});
	it('test supportAjaxPage initialize property', function() {
		expect(Settings.supportAjaxPage).toBe(false);
	});
	it('test sizeData initialize property', function() {
		expect(Settings.sizeData).toEqual([10,20,30,50,100]);
	});
	it('test pageSize initialize property', function() {
		expect(Settings.pageSize).toBe(20);
	});
	it('test pageData initialize property', function() {
		expect(Settings.pageData).toEqual({});
	});
	it('test query initialize property', function() {
		expect(Settings.query).toEqual({});
	});
	it('test pagingBefore initialize property', function() {
		expect(typeof Settings.pagingBefore).toBe('function');
	});
	it('test pagingAfter initialize property', function() {
		expect(typeof Settings.pagingAfter).toBe('function');
	});
	it('test supportAutoOrder initialize property', function() {
		expect(Settings.supportAutoOrder).toBe(true);
	});
	it('test supportCheckbox initialize property', function() {
		expect(Settings.supportCheckbox).toBe(true);
	});
	it('test i18n initialize property', function() {
		expect(Settings.i18n).toBe('zh-cn');
	});
	it('test columnData initialize property', function() {
		expect(Settings.columnData).toEqual([]);
	});
	it('test gridManagerName initialize property', function() {
		expect(Settings.gridManagerName).toBe('');
	});
	it('test ajax_url initialize property', function() {
		expect(Settings.ajax_url).toBe('');
	});
	it('test ajax_type initialize property', function() {
		expect(Settings.ajax_type).toBe('GET');
	});
	it('test ajax_headers initialize property', function() {
		expect(Settings.ajax_headers).toEqual({});
	});
	it('test ajax_beforeSend initialize property', function() {
		expect(typeof Settings.ajax_beforeSend).toBe('function');
	});
	it('test ajax_success initialize property', function() {
		expect(typeof Settings.ajax_success).toBe('function');
	});
	it('test ajax_complete initialize property', function() {
		expect(typeof Settings.ajax_complete).toBe('function');
	});
	it('test ajax_error initialize property', function() {
		expect(typeof Settings.ajax_error).toBe('function');
	});
	it('test ajax_data initialize property', function() {
		expect(Settings.ajax_data).toBeUndefined();
	});
	it('test dataKey initialize property', function() {
		expect(Settings.dataKey).toBe('data');
	});
	it('test totalsKey initialize property', function() {
		expect(Settings.totalsKey).toBe('totals');
	});
	it('test supportExport initialize property', function() {
		expect(Settings.supportExport).toBe(true);
	});

});
