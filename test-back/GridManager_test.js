/**
 * Created by baukh on 17/10/26.
 */
// 本文件仅提供基本验证, 详细的测试在Publish_test.js内.

'use strict';
import GridManager from '../src/js/GridManager';
import { GM_VERSION } from '../src/common/constants';
import Core from "../src/js/Core";
/**
 * 验证类的属性及方法总量
 */
describe('new GridManager() 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(new GridManager())))).toBe(2 + 1);
	});
});

/**
 * 实例化方法验证
 */
describe('new GridManager().init(table, arg, callback)', function() {
	it('基础验证', function() {
		expect(new GridManager().init).toBeDefined();
		expect(new GridManager().init.length).toBe(3);
	});
});

describe('new GridManager().initTable($table, settings)', function() {
	it('基础验证', function() {
		expect(new GridManager().initTable).toBeDefined();
		expect(new GridManager().initTable.length).toBe(2);
	});
});

/**
 * 静态方法验证
 */
describe('GridManager.version', function() {
	it('基础验证', function() {
		expect(GridManager.version).toBeDefined();
		expect(GridManager.version).toBe(GM_VERSION);
	});
});

describe('GridManager.defaultOption', function() {
    it('基础验证', function() {
        expect(GridManager.defaultOption).toEqual({});
        GridManager.defaultOption = {currentPageKey: 'cPage'};
        expect(GridManager.defaultOption).toEqual({currentPageKey: 'cPage'});

        GridManager.defaultOption = {};
    });
});

describe('GridManager.mergeDefaultOption', function() {
    it('基础验证', function() {
        expect(GridManager.defaultOption).toEqual({});
        GridManager.defaultOption = {currentPageKey: 'cPage'};
        expect(GridManager.defaultOption).toEqual({currentPageKey: 'cPage'});

        GridManager.mergeDefaultOption({disableCache: true});
        expect(GridManager.defaultOption).toEqual({currentPageKey: 'cPage', disableCache: true});


        GridManager.mergeDefaultOption({currentPageKey: 'currentPage'});
        expect(GridManager.defaultOption).toEqual({currentPageKey: 'currentPage', disableCache: true});

        GridManager.defaultOption = {};
    });
});

describe('GridManager.get(table)', function() {
	it('基础验证', function() {
		expect(GridManager.get).toBeDefined();
		expect(GridManager.get.length).toBe(1);
	});
});

describe('GridManager.getLocalStorage(table)', function() {
	it('基础验证', function() {
		expect(GridManager.getLocalStorage).toBeDefined();
		expect(GridManager.getLocalStorage.length).toBe(1);
	});
});

describe('GridManager.resetLayout(table, width, height)', function() {
    it('基础验证', function() {
        expect(GridManager.resetLayout).toBeDefined();
        expect(GridManager.resetLayout.length).toBe(3);
    });
});

describe('GridManager.clear(table)', function() {
	it('基础验证', function() {
		expect(GridManager.clear).toBeDefined();
		expect(GridManager.clear.length).toBe(1);
	});
});

describe('GridManager.getRowData(table, target)', function() {
	it('基础验证', function() {
		expect(GridManager.getRowData).toBeDefined();
		expect(GridManager.getRowData.length).toBe(2);
	});
});

describe('GridManager.setSort(table, sortJson, callback, refresh)', function() {
	it('基础验证', function() {
		expect(GridManager.setSort).toBeDefined();
		expect(GridManager.setSort.length).toBe(4);
	});
});

describe('GridManager.setConfigVisible(table, visible)', function() {
    it('基础验证', function() {
        expect(GridManager.setConfigVisible).toBeDefined();
        expect(GridManager.setConfigVisible.length).toBe(2);
    });
});

describe('GridManager.showTh(table, target)', function() {
	it('基础验证', function() {
		expect(GridManager.showTh).toBeDefined();
		expect(GridManager.showTh.length).toBe(2);
	});
});

describe('GridManager.hideTh(table, target)', function() {
	it('基础验证', function() {
		expect(GridManager.hideTh).toBeDefined();
		expect(GridManager.hideTh.length).toBe(2);
	});
});

describe('GridManager.exportGridToXls(table, fileName, onlyChecked)', function() {
	it('基础验证', function() {
		expect(GridManager.exportGridToXls).toBeDefined();
		expect(GridManager.exportGridToXls.length).toBe(3);
	});
});

describe('GridManager.setQuery(table, query, isGotoFirstPage, callback)', function() {
	it('基础验证', function() {
		expect(GridManager.setQuery).toBeDefined();
		expect(GridManager.setQuery.length).toBe(4);
	});
});

describe('GridManager.setAjaxData(table, ajaxData, callback)', function() {
	it('基础验证', function() {
		expect(GridManager.setAjaxData).toBeDefined();
		expect(GridManager.setAjaxData.length).toBe(3);
	});
});

describe('GridManager.refreshGrid(table, isGotoFirstPage, callback)', function() {
	it('基础验证', function() {
		expect(GridManager.refreshGrid).toBeDefined();
		expect(GridManager.refreshGrid.length).toBe(3);
	});
});

describe('GridManager.getCheckedTr(table)', function() {
	it('基础验证', function() {
		expect(GridManager.getCheckedTr).toBeDefined();
		expect(GridManager.getCheckedTr.length).toBe(1);
	});
});

describe('GridManager.getCheckedData(table)', function() {
	it('基础验证', function() {
		expect(GridManager.getCheckedData).toBeDefined();
		expect(GridManager.getCheckedData.length).toBe(1);
	});
});

describe('GridManager.setCheckedData(table, checkedList)', function() {
    it('基础验证', function() {
        expect(GridManager.setCheckedData).toBeDefined();
        expect(GridManager.setCheckedData.length).toBe(2);
    });
});


describe('GridManager.updateRowData(table, key, rowData)', function() {
    it('基础验证', function() {
        expect(GridManager.updateRowData).toBeDefined();
        expect(GridManager.updateRowData.length).toBe(3);
    });
});

describe('GridManager.cleanData(table)', function() {
	it('基础验证', function() {
		expect(GridManager.cleanData).toBeDefined();
		expect(GridManager.cleanData.length).toBe(1);
	});
});

describe('GridManager.destroy(table)', function() {
	it('基础验证', function() {
		expect(GridManager.destroy).toBeDefined();
		expect(GridManager.destroy.length).toBe(1);
	});
});




