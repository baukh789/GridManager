/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import { Settings, TextSettings } from '../src/js/Settings';
describe('Settings', function() {

	it('验证属性[supportDrag]初始值', function() {
		expect(Settings.supportDrag).toBe(true);
	});

	it('验证属性[dragBefore]初始值', function() {
		expect(typeof Settings.dragBefore).toBe('function');
	});

	it('验证属性[dragAfter]初始值', function() {
		expect(typeof Settings.dragAfter).toBe('function');
	});

	it('验证属性[supportAdjust]初始值', function() {
		expect(Settings.supportAdjust).toBe(true);
	});

	it('验证属性[adjustBefore]初始值', function() {
		expect(typeof Settings.adjustBefore).toBe('function');
	});

	it('验证属性[adjustAfter]初始值', function() {
		expect(typeof Settings.adjustAfter).toBe('function');
	});

	it('验证属性[supportRemind]初始值', function() {
		expect(Settings.supportRemind).toBe(false);
	});

	it('验证属性[supportConfig]初始值', function() {
		expect(Settings.supportConfig).toBe(true);
	});

	it('验证属性[width]初始值', function() {
		expect(Settings.width).toBe('100%');
	});

	it('验证属性[height]初始值', function() {
		expect(Settings.height).toBe('300px');
	});

	it('验证属性[animateTime]初始值', function() {
		expect(Settings.animateTime).toBe(300);
	});

	it('验证属性[disableCache]初始值', function() {
		expect(Settings.disableCache).toBe(false);
	});

	it('验证属性[supportSorting]初始值', function() {
		expect(Settings.supportSorting).toBe(false);
	});

	it('验证属性[isCombSorting]初始值', function() {
		expect(Settings.isCombSorting).toBe(false);
	});

	it('验证属性[sortKey]初始值', function() {
		expect(Settings.sortKey).toBe('sort_');
	});

	it('验证属性[sortData]初始值', function() {
		expect(Settings.sortData).toEqual({});
	});

	it('验证属性[sortUpText]初始值', function() {
		expect(Settings.sortUpText).toBe('ASC');
	});

	it('验证属性[sortDownText]初始值', function() {
		expect(Settings.sortDownText).toBe('DESC');
	});

	it('验证属性[sortingBefore]初始值', function() {
		expect(typeof Settings.sortingBefore).toBe('function');
	});

	it('验证属性[sortingAfter]初始值', function() {
		expect(typeof Settings.sortingAfter).toBe('function');
	});

	it('验证属性[supportAjaxPage]初始值', function() {
		expect(Settings.supportAjaxPage).toBe(false);
	});

	it('验证属性[sizeData]初始值', function() {
		expect(Settings.sizeData).toEqual([10,20,30,50,100]);
	});

	it('验证属性[pageSize]初始值', function() {
		expect(Settings.pageSize).toBe(20);
	});

	it('验证属性[pageData]初始值', function() {
		expect(Settings.pageData).toEqual({});
	});

	it('验证属性[query]初始值', function() {
		expect(Settings.query).toEqual({});
	});

	it('验证属性[pagingBefore]初始值', function() {
		expect(typeof Settings.pagingBefore).toBe('function');
	});

	it('验证属性[pagingAfter]初始值', function() {
		expect(typeof Settings.pagingAfter).toBe('function');
	});

	it('验证属性[supportAutoOrder]初始值', function() {
		expect(Settings.supportAutoOrder).toBe(true);
	});

	it('验证属性[supportCheckbox]初始值', function() {
		expect(Settings.supportCheckbox).toBe(true);
	});

	it('验证属性[i18n]初始值', function() {
		expect(Settings.i18n).toBe('zh-cn');
	});

	it('验证属性[columnData]初始值', function() {
		expect(Settings.columnData).toEqual([]);
	});

	it('验证属性[gridManagerName]初始值', function() {
		expect(Settings.gridManagerName).toBe('');
	});

	it('验证属性[ajax_url]初始值', function() {
		expect(Settings.ajax_url).toBe('');
	});

	it('验证属性[ajax_type]初始值', function() {
		expect(Settings.ajax_type).toBe('GET');
	});

	it('验证属性[ajax_headers]初始值', function() {
		expect(Settings.ajax_headers).toEqual({});
	});

	it('验证属性[ajax_beforeSend]初始值', function() {
		expect(typeof Settings.ajax_beforeSend).toBe('function');
	});

	it('验证属性[ajax_success]初始值', function() {
		expect(typeof Settings.ajax_success).toBe('function');
	});

	it('验证属性[ajax_complete]初始值', function() {
		expect(typeof Settings.ajax_complete).toBe('function');
	});

	it('验证属性[ajax_error]初始值', function() {
		expect(typeof Settings.ajax_error).toBe('function');
	});

	it('验证属性[ajax_data]初始值', function() {
		expect(Settings.ajax_data).toBeUndefined();
	});

	it('验证属性[dataKey]初始值', function() {
		expect(Settings.dataKey).toBe('data');
	});

	it('验证属性[totalsKey]初始值', function() {
		expect(Settings.totalsKey).toBe('totals');
	});

	it('验证属性[supportExport]初始值', function() {
		expect(Settings.supportExport).toBe(true);
	});

});
describe('TextSettings', function() {
	let TS = null;
	let count = null;
	let key = null;
	beforeEach(function(){
		TS = new TextSettings();
	});
	afterEach(function(){
		TS = null;
		count = null;
		key = null;
	});
	it('验证国际化文本总数', function(){
		count = 0;
		for(key in TS){
			count++;
		}
		expect(count).toBe(13);
	});
	it('验证国际化文本[order-text]初始值', function(){
		expect(TS['order-text']['zh-cn']).toBe('序号');
		expect(TS['order-text']['en-us']).toBe('order');
	});

	it('验证国际化文本[first-page]初始值', function(){
		expect(TS['first-page']['zh-cn']).toBe('首页');
		expect(TS['first-page']['en-us']).toBe('first');
	});

	it('验证国际化文本[previous-page]初始值', function(){
		expect(TS['previous-page']['zh-cn']).toBe('上一页');
		expect(TS['previous-page']['en-us']).toBe('previous');
	});

	it('验证国际化文本[next-page]初始值', function(){
		expect(TS['next-page']['zh-cn']).toBe('下一页');
		expect(TS['next-page']['en-us']).toBe('next');
	});

	it('验证国际化文本[last-page]初始值', function(){
		expect(TS['last-page']['zh-cn']).toBe('尾页');
		expect(TS['last-page']['en-us']).toBe('last');
	});

	it('验证国际化文本[dataTablesInfo]初始值', function(){
		expect(TS['dataTablesInfo']['zh-cn']).toBe('此页显示 {0}-{1} 共{2}条');
		expect(TS['dataTablesInfo']['en-us']).toBe('this page show {0}-{1} count {2}');
	});

	it('验证国际化文本[goto-first-text]初始值', function(){
		expect(TS['goto-first-text']['zh-cn']).toBe('跳转至');
		expect(TS['goto-first-text']['en-us']).toBe('goto');
	});

	it('验证国际化文本[goto-last-text]初始值', function(){
		expect(TS['goto-last-text']['zh-cn']).toBe('页');
		expect(TS['goto-last-text']['en-us']).toBe('page');
	});

	it('验证国际化文本[refresh]初始值', function(){
		expect(TS['refresh']['zh-cn']).toBe('重新加载');
		expect(TS['refresh']['en-us']).toBe('Refresh');
	});

	it('验证国际化文本[save-as-excel]初始值', function(){
		expect(TS['save-as-excel']['zh-cn']).toBe('另存为Excel');
		expect(TS['save-as-excel']['en-us']).toBe('Save as Excel');
	});

	it('验证国际化文本[save-as-excel-for-checked]初始值', function(){
		expect(TS['save-as-excel-for-checked']['zh-cn']).toBe('已选中项另存为Excel');
		expect(TS['save-as-excel-for-checked']['en-us']).toBe('Save selected as Excel');
	});

	it('验证国际化文本[setting-grid]初始值', function(){
		expect(TS['setting-grid']['zh-cn']).toBe('配置表');
		expect(TS['setting-grid']['en-us']).toBe('Setting Grid');
	});

	it('验证国际化文本[checkall-text]初始值', function(){
		expect(TS['checkall-text']['zh-cn']).toBe('全选');
		expect(TS['checkall-text']['en-us']).toBe('All');
	});
});
