/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import { Settings, TextSettings } from '../src/js/Settings';
describe('Settings', function() {
	let settings = null;
	beforeEach(function(){
		settings = new Settings();
	});
	afterEach(function(){
		settings = null;
	});

	it('验证属性[compileVue]初始值', function() {
		expect(settings.compileVue).toBe(null);
	});

    it('验证属性[compileAngularjs]初始值', function() {
        expect(settings.compileAngularjs).toBe(null);
    });

    it('验证属性[supportDrag]初始值', function() {
		expect(settings.supportDrag).toBe(true);
	});

	it('验证属性[dragBefore]初始值', function() {
		expect(typeof settings.dragBefore).toBe('function');
	});

	it('验证属性[dragAfter]初始值', function() {
		expect(typeof settings.dragAfter).toBe('function');
	});

	it('验证属性[supportAdjust]初始值', function() {
		expect(settings.supportAdjust).toBe(true);
	});

	it('验证属性[adjustBefore]初始值', function() {
		expect(typeof settings.adjustBefore).toBe('function');
	});

	it('验证属性[adjustAfter]初始值', function() {
		expect(typeof settings.adjustAfter).toBe('function');
	});

	it('验证属性[supportMenu]初始值', function() {
		expect(settings.supportMenu).toBe(true);
	});

	it('验证属性[supportConfig]初始值', function() {
		expect(settings.supportConfig).toBe(true);
	});

	it('验证属性[configInfo]初始值', function() {
		expect(settings.configInfo).toBe('配置列的显示状态');
	});

	it('验证属性[width]初始值', function() {
		expect(settings.width).toBe('100%');
	});

	it('验证属性[height]初始值', function() {
		expect(settings.height).toBe('300px');
	});

	it('验证属性[animateTime]初始值', function() {
		expect(settings.animateTime).toBe(300);
	});

    it('验证属性[disableLine]初始值', function() {
        expect(settings.disableLine).toBe(false);
    });

    it('验证属性[disableHover]初始值', function() {
        expect(settings.disableHover).toBe(false);
    });

    it('验证属性[cellHover]初始值', function() {
        expect(typeof settings.cellHover).toBe('function');
    });

    it('验证属性[disableBorder]初始值', function() {
        expect(settings.disableBorder).toBe(false);
    });

    it('验证属性[skinClassName]初始值', function() {
        expect(settings.skinClassName).toBe('');
    });

    it('验证属性[isIconFollowText]初始值', function() {
        expect(settings.isIconFollowText).toBe(false);
    });

    it('验证属性[loadingTemplate]初始值', function() {
        expect(settings.loadingTemplate).toBe('<div class="loading"><div class="loadInner kernel"></div></div>');
    });

    it('验证属性[disableCache]初始值', function() {
		expect(settings.disableCache).toBe(true);
	});

	it('验证属性[isCombSorting]初始值', function() {
		expect(settings.isCombSorting).toBe(false);
	});

    it('验证属性[mergeSort]初始值', function() {
        expect(settings.mergeSort).toBe(false);
    });

	it('验证属性[sortKey]初始值', function() {
		expect(settings.sortKey).toBe('sort_');
	});

	it('验证属性[sortData]初始值', function() {
		expect(settings.sortData).toEqual({});
	});

	it('验证属性[sortUpText]初始值', function() {
		expect(settings.sortUpText).toBe('ASC');
	});

	it('验证属性[sortDownText]初始值', function() {
		expect(settings.sortDownText).toBe('DESC');
	});

	it('验证属性[sortingBefore]初始值', function() {
		expect(typeof settings.sortingBefore).toBe('function');
	});

	it('验证属性[sortingAfter]初始值', function() {
		expect(typeof settings.sortingAfter).toBe('function');
	});

	it('验证属性[supportAjaxPage]初始值', function() {
		expect(settings.supportAjaxPage).toBe(false);
	});

    it('验证属性[useNoTotalsMode]初始值', function() {
        expect(settings.useNoTotalsMode).toBe(false);
    });

	it('验证属性[sizeData]初始值', function() {
		expect(settings.sizeData).toEqual([10,20,30,50,100]);
	});

	it('验证属性[pageSize]初始值', function() {
		expect(settings.pageSize).toBe(20);
	});

	it('验证属性[pageData]初始值', function() {
		expect(settings.pageData).toEqual({});
	});

	it('验证属性[query]初始值', function() {
		expect(settings.query).toEqual({});
	});

	it('验证属性[pagingBefore]初始值', function() {
		expect(typeof settings.pagingBefore).toBe('function');
	});

	it('验证属性[pagingAfter]初始值', function() {
		expect(typeof settings.pagingAfter).toBe('function');
	});

	it('验证属性[supportAutoOrder]初始值', function() {
		expect(settings.supportAutoOrder).toBe(true);
	});

	it('验证属性[supportCheckbox]初始值', function() {
		expect(settings.supportCheckbox).toBe(true);
	});

    it('验证属性[useRowCheck]初始值', function() {
        expect(settings.useRowCheck).toBe(false);
    });

    it('验证属性[useRadio]初始值', function() {
        expect(settings.useRadio).toBe(false);
    });


    it('验证属性[checkedBefore]初始值', function() {
		expect(typeof settings.checkedBefore).toBe('function');
	});


	it('验证属性[checkedAfter]初始值', function() {
		expect(typeof settings.checkedAfter).toBe('function');
	});


	it('验证属性[checkedAllBefore]初始值', function() {
		expect(typeof settings.checkedAllBefore).toBe('function');
	});


	it('验证属性[checkedAllAfter]初始值', function() {
		expect(typeof settings.checkedAllAfter).toBe('function');
	});


	it('验证属性[i18n]初始值', function() {
		expect(settings.i18n).toBe('zh-cn');
	});

    it('验证属性[topFullColumn]初始值', function() {
        expect(settings.topFullColumn).toEqual({});
    });

	it('验证属性[columnData]初始值', function() {
		expect(settings.columnData).toEqual([]);
	});

	it('验证属性[gridManagerName]初始值', function() {
		expect(settings.gridManagerName).toBe('');
	});

	it('验证属性[firstLoading]初始值', function() {
		expect(settings.firstLoading).toBe(true);
	});

	it('验证属性[ajax_data]初始值', function() {
		expect(settings.ajax_data).toBeUndefined();
	});

	it('验证属性[ajax_type]初始值', function() {
		expect(settings.ajax_type).toBe('GET');
	});

	it('验证属性[ajax_headers]初始值', function() {
		expect(settings.ajax_headers).toEqual({});
	});

	it('验证属性[ajax_beforeSend]初始值', function() {
		expect(typeof settings.ajax_beforeSend).toBe('function');
	});

	it('验证属性[ajax_success]初始值', function() {
		expect(typeof settings.ajax_success).toBe('function');
	});

	it('验证属性[ajax_complete]初始值', function() {
		expect(typeof settings.ajax_complete).toBe('function');
	});

	it('验证属性[ajax_error]初始值', function() {
		expect(typeof settings.ajax_error).toBe('function');
	});

	it('验证属性[requestHandler]初始值', function() {
		expect(typeof settings.requestHandler).toBe('function');
	});

	it('验证属性[responseHandler]初始值', function() {
		expect(typeof settings.responseHandler).toBe('function');
	});

	it('验证属性[dataKey]初始值', function() {
		expect(settings.dataKey).toBe('data');
	});

	it('验证属性[totalsKey]初始值', function() {
		expect(settings.totalsKey).toBe('totals');
	});

	it('验证属性[currentPageKey]初始值', function() {
		expect(settings.currentPageKey).toBe('cPage');
	});

	it('验证属性[pageSizeKey]初始值', function() {
		expect(settings.pageSizeKey).toBe('pSize');
	});

	it('验证属性[emptyTemplate]初始值', function() {
		expect(settings.emptyTemplate).toBe('<div class="gm-emptyTemplate">暂无数据</div>');
	});

    it('验证属性[supportExport]初始值', function() {
        expect(settings.supportExport).toBe(true);
    });

    it('验证属性[exportConfig]初始值', function() {
        expect(typeof settings.exportConfig).toBe('object');
        expect(settings.exportConfig.mode).toBe('static');
        expect(settings.exportConfig.suffix).toBe('xls');
        expect(typeof settings.exportConfig.handler).toBe('function');
    });
});
describe('textConfig', function() {
	let count = null;
	let key = null;
	var textConfig = null;
	beforeEach(function(){
		textConfig = new TextSettings();
	});
	afterEach(function(){
		count = null;
		key = null;
		textConfig = null;
	});
	it('验证国际化文本总数', function(){
		count = 0;
		for(key in textConfig){
			count++;
		}
		expect(count).toBe(18);
	});
	it('验证国际化文本[order-text]初始值', function(){
		expect(textConfig['order-text']['zh-cn']).toBe('序号');
		expect(textConfig['order-text']['zh-tw']).toBe('序號');
		expect(textConfig['order-text']['en-us']).toBe('order');
	});

    it('验证国际化文本[refresh-action]初始值', function(){
        expect(textConfig['refresh-action']['zh-cn']).toBe('<i class="iconfont icon-refresh"></i>');
        expect(textConfig['refresh-action']['zh-tw']).toBe('<i class="iconfont icon-refresh"></i>');
        expect(textConfig['refresh-action']['en-us']).toBe('<i class="iconfont icon-refresh"></i>');
    });

    it('验证国际化文本[first-page]初始值', function(){
		expect(textConfig['first-page']['zh-cn']).toBe('首页');
		expect(textConfig['first-page']['zh-tw']).toBe('首頁');
		expect(textConfig['first-page']['en-us']).toBe('first');
	});

	it('验证国际化文本[previous-page]初始值', function(){
		expect(textConfig['previous-page']['zh-cn']).toBe('上一页');
		expect(textConfig['previous-page']['zh-tw']).toBe('上一頁');
		expect(textConfig['previous-page']['en-us']).toBe('previous');
	});

	it('验证国际化文本[next-page]初始值', function(){
		expect(textConfig['next-page']['zh-cn']).toBe('下一页');
		expect(textConfig['next-page']['zh-tw']).toBe('下一頁');
		expect(textConfig['next-page']['en-us']).toBe('next');
	});

	it('验证国际化文本[last-page]初始值', function(){
		expect(textConfig['last-page']['zh-cn']).toBe('尾页');
		expect(textConfig['last-page']['zh-tw']).toBe('尾頁');
		expect(textConfig['last-page']['en-us']).toBe('last');
	});

    it('验证国际化文本[checked-info]初始值', function(){
        expect(textConfig['checked-info']['zh-cn']).toBe('已选 {0} 条');
        expect(textConfig['checked-info']['zh-tw']).toBe('已選 {0} 條');
        expect(textConfig['checked-info']['en-us']).toBe('selected {0}');
    });

    it('验证国际化文本[page-info]初始值', function(){
		expect(textConfig['page-info']['zh-cn']).toBe('此页显示 {0}-{1}<span class="page-info-totals"> 共{2}条</span>');
		expect(textConfig['page-info']['zh-tw']).toBe('此頁顯示 {0}-{1}<span class="page-info-totals"> 共{2}條</span>');
		expect(textConfig['page-info']['en-us']).toBe('this page show {0}-{1}<span class="page-info-totals"> count {2}</span>');
	});

    it('验证国际化文本[goto-first-text]初始值', function(){
		expect(textConfig['goto-first-text']['zh-cn']).toBe('跳转至');
		expect(textConfig['goto-first-text']['zh-tw']).toBe('跳轉至');
		expect(textConfig['goto-first-text']['en-us']).toBe('goto');
	});

	it('验证国际化文本[goto-last-text]初始值', function(){
		expect(textConfig['goto-last-text']['zh-cn']).toBe('页');
		expect(textConfig['goto-last-text']['zh-tw']).toBe('頁');
		expect(textConfig['goto-last-text']['en-us']).toBe('page');
	});

    it('验证国际化文本[menu-previous-page]初始值', function(){
        expect(textConfig['menu-previous-page']['zh-cn']).toBe('上一页');
        expect(textConfig['menu-previous-page']['zh-tw']).toBe('上一頁');
        expect(textConfig['menu-previous-page']['en-us']).toBe('previous');
    });

    it('验证国际化文本[menu-next-page]初始值', function(){
        expect(textConfig['menu-next-page']['zh-cn']).toBe('下一页');
        expect(textConfig['menu-next-page']['zh-tw']).toBe('下一頁');
        expect(textConfig['menu-next-page']['en-us']).toBe('next');
    });

	it('验证国际化文本[menu-refresh]初始值', function(){
		expect(textConfig['menu-refresh']['zh-cn']).toBe('重新加载');
		expect(textConfig['menu-refresh']['zh-tw']).toBe('重新加載');
		expect(textConfig['menu-refresh']['en-us']).toBe('Refresh');
	});

	it('验证国际化文本[menu-save-as-excel]初始值', function(){
		expect(textConfig['menu-save-as-excel']['zh-cn']).toBe('另存为Excel');
		expect(textConfig['menu-save-as-excel']['zh-tw']).toBe('另存為Excel');
		expect(textConfig['menu-save-as-excel']['en-us']).toBe('Save as Excel');
	});

	it('验证国际化文本[menu-save-as-excel-for-checked]初始值', function(){
		expect(textConfig['menu-save-as-excel-for-checked']['zh-cn']).toBe('已选中项另存为Excel');
		expect(textConfig['menu-save-as-excel-for-checked']['zh-tw']).toBe('已選中項另存為Excel');
		expect(textConfig['menu-save-as-excel-for-checked']['en-us']).toBe('Save selected as Excel');
	});

	it('验证国际化文本[menu-config-grid]初始值', function(){
		expect(textConfig['menu-config-grid']['zh-cn']).toBe('配置表');
		expect(textConfig['menu-config-grid']['zh-tw']).toBe('配置表');
		expect(textConfig['menu-config-grid']['en-us']).toBe('Setting Grid');
	});

    it('验证国际化文本[filter-ok]初始值', function(){
        expect(textConfig['filter-ok']['zh-cn']).toBe('确定');
        expect(textConfig['filter-ok']['zh-tw']).toBe('確定');
        expect(textConfig['filter-ok']['en-us']).toBe('OK');
    });

    it('验证国际化文本[filter-reset]初始值', function(){
        expect(textConfig['filter-reset']['zh-cn']).toBe('重置');
        expect(textConfig['filter-reset']['zh-tw']).toBe('重置');
        expect(textConfig['filter-reset']['en-us']).toBe('Reset');
    });
});
