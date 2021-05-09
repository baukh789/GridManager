/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import { Settings } from '../../src/common/Settings';

describe('Settings', () => {
	let settings = null;
	beforeEach(() => {
		settings = new Settings();
	});
	afterEach(() => {
		settings = null;
	});

    it('验证属性[supportDrag]初始值', () => {
		expect(settings.supportDrag).toBe(true);
	});

	it('验证属性[dragBefore]初始值', () => {
		expect(typeof settings.dragBefore).toBe('function');
	});

	it('验证属性[dragAfter]初始值', () => {
		expect(typeof settings.dragAfter).toBe('function');
	});

    it('验证属性[supportMoveRow]初始值', () => {
        expect(settings.supportMoveRow).toBe(false);
    });

    it('验证属性[moveRowConfig]初始值', () => {
        expect(settings.moveRowConfig.key).toBeUndefined();
        expect(typeof settings.moveRowConfig.handler).toBe('function');
    });

    it('验证属性[supportAdjust]初始值', () => {
		expect(settings.supportAdjust).toBe(true);
	});

	it('验证属性[adjustBefore]初始值', () => {
		expect(typeof settings.adjustBefore).toBe('function');
	});

	it('验证属性[adjustAfter]初始值', () => {
		expect(typeof settings.adjustAfter).toBe('function');
	});

	it('验证属性[supportMenu]初始值', () => {
		expect(settings.supportMenu).toBe(true);
	});

    it('验证属性[supportMenu]初始值', () => {
        expect(typeof settings.menuHandler).toBe('function');
        expect(settings.menuHandler(1)).toBe(1);
    });

	it('验证属性[supportConfig]初始值', () => {
		expect(settings.supportConfig).toBe(true);
	});

	it('验证属性[configInfo]初始值', () => {
		expect(settings.configInfo).toBe('配置列的显示状态');
	});

	it('验证属性[width]初始值', () => {
		expect(settings.width).toBe('100%');
	});

	it('验证属性[height]初始值', () => {
		expect(settings.height).toBe('300px');
	});

	it('验证属性[animateTime]初始值', () => {
		expect(settings.animateTime).toBe(300);
	});

    it('验证属性[disableLine]初始值', () => {
        expect(settings.disableLine).toBe(false);
    });

    it('验证属性[rowHover]初始值', () => {
        expect(settings.rowHover).toBeNull();
    });

    it('验证属性[rowClick]初始值', () => {
        expect(settings.rowClick).toBeNull();
    });

    it('验证属性[cellHover]初始值', () => {
        expect(settings.cellHover).toBeNull();
    });

    it('验证属性[cellClick]初始值', () => {
        expect(settings.cellClick).toBeNull();
    });

    it('验证属性[disableBorder]初始值', () => {
        expect(settings.disableBorder).toBe(false);
    });

    it('验证属性[skinClassName]初始值', () => {
        expect(settings.skinClassName).toBe('');
    });

    it('验证属性[useWordBreak]初始值', () => {
        expect(settings.useWordBreak).toBe(false);
    });

    it('验证属性[useCellFocus]初始值', () => {
        expect(settings.useCellFocus).toBeUndefined();
    });

    it('验证属性[isIconFollowText]初始值', () => {
        expect(settings.isIconFollowText).toBe(false);
    });

    it('验证属性[loadingTemplate]初始值', () => {
        expect(settings.loadingTemplate).toBe('<section class="gm-loading"><div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"></circle></svg></div></section>');
    });

    it('验证属性[disableCache]初始值', () => {
		expect(settings.disableCache).toBe(true);
	});

	it('验证属性[isCombSorting]初始值', () => {
		expect(settings.isCombSorting).toBe(false);
	});

    it('验证属性[mergeSort]初始值', () => {
        expect(settings.mergeSort).toBe(false);
    });

	it('验证属性[sortKey]初始值', () => {
		expect(settings.sortKey).toBe('sort_');
	});

	it('验证属性[sortData]初始值', () => {
		expect(settings.sortData).toEqual({});
	});

	it('验证属性[sortUpText]初始值', () => {
		expect(settings.sortUpText).toBe('ASC');
	});

	it('验证属性[sortDownText]初始值', () => {
		expect(settings.sortDownText).toBe('DESC');
	});

    it('验证属性[sortMode]初始值', () => {
        expect(settings.sortMode).toBe('overall');
    });

	it('验证属性[sortingBefore]初始值', () => {
		expect(typeof settings.sortingBefore).toBe('function');
	});

	it('验证属性[sortingAfter]初始值', () => {
		expect(typeof settings.sortingAfter).toBe('function');
	});

	it('验证属性[supportAjaxPage]初始值', () => {
		expect(settings.supportAjaxPage).toBe(false);
	});

    it('验证属性[useNoTotalsMode]初始值', () => {
        expect(settings.useNoTotalsMode).toBe(false);
    });

    it('验证属性[asyncTotals]初始值', () => {
        expect(settings.asyncTotals).toBeUndefined();
    });

    it('验证属性[ajaxPageTemplate]初始值', () => {
        expect(settings.ajaxPageTemplate).toBeUndefined();
    });

    it('验证属性[sizeData]初始值', () => {
		expect(settings.sizeData).toEqual([10, 20, 30, 50, 100]);
	});

	it('验证属性[pageSize]初始值', () => {
		expect(settings.pageSize).toBe(20);
	});

	it('验证属性[pageData]初始值', () => {
		expect(settings.pageData).toEqual({});
	});

	it('验证属性[query]初始值', () => {
		expect(settings.query).toEqual({});
	});

	it('验证属性[pagingBefore]初始值', () => {
		expect(typeof settings.pagingBefore).toBe('function');
	});

	it('验证属性[pagingAfter]初始值', () => {
		expect(typeof settings.pagingAfter).toBe('function');
	});

	it('验证属性[supportAutoOrder]初始值', () => {
		expect(settings.supportAutoOrder).toBe(true);
	});

	it('验证属性[supportCheckbox]初始值', () => {
		expect(settings.supportCheckbox).toBe(true);
	});

    it('验证属性[checkboxConfig]初始值', () => {
        expect(settings.checkboxConfig.useRadio).toBe(false);
        expect(settings.checkboxConfig.useRowCheck).toBe(false);
        expect(settings.checkboxConfig.max).toBeUndefined(null);
    });

    it('验证属性[checkedBefore]初始值', () => {
		expect(typeof settings.checkedBefore).toBe('function');
	});


	it('验证属性[checkedAfter]初始值', () => {
		expect(typeof settings.checkedAfter).toBe('function');
	});


	it('验证属性[checkedAllBefore]初始值', () => {
		expect(typeof settings.checkedAllBefore).toBe('function');
	});


	it('验证属性[checkedAllAfter]初始值', () => {
		expect(typeof settings.checkedAllAfter).toBe('function');
	});


	it('验证属性[i18n]初始值', () => {
		expect(settings.i18n).toBe('zh-cn');
	});

    it('验证属性[supportTreeData]初始值', () => {
        expect(settings.supportTreeData).toBe(false);
    });

    it('验证属性[treeConfig]初始值', () => {
        expect(settings.treeConfig.insertTo).toBeUndefined();
        expect(settings.treeConfig.treeKey).toBe('children');
        expect(settings.treeConfig.openState).toBe(false);
    });

    it('验证属性[fullColumn]初始值', () => {
        expect(settings.fullColumn).toBeUndefined();
    });

	it('验证属性[columnData]初始值', () => {
		expect(settings.columnData).toBeUndefined();
	});

	it('验证属性[gridManagerName]初始值', () => {
		expect(settings.gridManagerName).toBeUndefined();
	});

	it('验证属性[firstLoading]初始值', () => {
		expect(settings.firstLoading).toBe(true);
	});

	it('验证属性[ajaxData]初始值', () => {
		expect(settings.ajaxData).toBeUndefined();
	});

	it('验证属性[ajaxType]初始值', () => {
		expect(settings.ajaxType).toBe('GET');
	});

	it('验证属性[ajaxHeaders]初始值', () => {
		expect(settings.ajaxHeaders).toEqual({});
	});

	it('验证属性[ajaxBeforeSend]初始值', () => {
		expect(typeof settings.ajaxBeforeSend).toBe('function');
	});

	it('验证属性[ajaxSuccess]初始值', () => {
		expect(typeof settings.ajaxSuccess).toBe('function');
	});

	it('验证属性[ajaxComplete]初始值', () => {
		expect(typeof settings.ajaxComplete).toBe('function');
	});

	it('验证属性[ajaxError]初始值', () => {
		expect(typeof settings.ajaxError).toBe('function');
	});

	it('验证属性[requestHandler]初始值', () => {
		expect(typeof settings.requestHandler).toBe('function');
	});

    it('验证属性[requestHandler]返回值', () =>  {
        expect(settings.requestHandler({'name': 'baukh'})).toEqual({'name': 'baukh'});
    });

    it('验证属性[responseHandler]初始值', () => {
        expect(typeof settings.responseHandler).toBe('function');
    });

    it('验证属性[responseHandler]返回值', () => {
        expect(settings.responseHandler({'name': 'baukh'})).toEqual({'name': 'baukh'});
    });

    it('验证属性[rowRenderHandler]初始值', () => {
        expect(typeof settings.rowRenderHandler).toBe('function');
    });

    it('验证属性[rowRenderHandler]返回值', () => {
        expect(settings.rowRenderHandler({'name': 'baukh'}, 1)).toEqual({'name': 'baukh'});
    });

    it('验证属性[dataKey]初始值', () => {
		expect(settings.dataKey).toBe('data');
	});

	it('验证属性[totalsKey]初始值', () => {
		expect(settings.totalsKey).toBe('totals');
	});

	it('验证属性[currentPageKey]初始值', () => {
		expect(settings.currentPageKey).toBe('cPage');
	});

	it('验证属性[pageSizeKey]初始值', () => {
		expect(settings.pageSizeKey).toBe('pSize');
	});

	it('验证属性[emptyTemplate]初始值', () => {
		expect(settings.emptyTemplate()).toBe('<div class="gm-empty-template">暂无数据</div>');
	});

    it('验证属性[supportExport]初始值', () => {
        expect(settings.supportExport).toBe(true);
    });

    it('验证属性[supportPrint]初始值', () => {
        expect(settings.supportPrint).toBe(true);
    });

    it('验证属性[exportConfig]初始值', () => {
        expect(typeof settings.exportConfig).toBe('object');
        expect(settings.exportConfig.mode).toBe('static');
        expect(settings.exportConfig.fileName).toBeUndefined();
        expect(settings.exportConfig.suffix).toBe('xls');
        expect(typeof settings.exportConfig.handler).toBe('function');
    });
});
