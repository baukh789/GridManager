/**
 * Created by baukh on 17/6/19.
 */
'use strict';
import Export from '../src/js/Export';
/**
 * 验证类的属性及方法总量
 */
describe('Export 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Export)))).toBe(10 + 1);
	});
});

describe('Export.URI', function() {
	it('基础验证', function() {
		expect(Export.URI).toBeDefined();
		expect(Export.URI).toBe('data:application/vnd.ms-excel;base64,');
	});
});

describe('Export.getHref(exportHTML)', function() {
	var exportHTML = null;
	beforeEach(function() {
		exportHTML = 'test exportHTML. 这里有一条测试用例';
	});
	afterEach(function(){
		exportHTML = null;
	});
	it('基础验证', function() {
		expect(Export.getHref).toBeDefined();
		expect(Export.getHref.length).toBe(1);
		expect(Export.getHref(exportHTML)).toBe(Export.URI + window.btoa(unescape(encodeURIComponent(exportHTML || ''))));
	});
});

describe('Export.dispatchDownload(fileName, href)', function() {
	it('基础验证', function() {
		expect(Export.dispatchDownload).toBeDefined();
		expect(Export.dispatchDownload.length).toBe(2);
	});
});

describe('Export.addSuffix(gridManagerName, fileName, suffix)', function() {
    it('基础验证', function() {
        expect(Export.addSuffix).toBeDefined();
        expect(Export.addSuffix.length).toBe(3);
    });

    it('执行验证', function() {
        expect(Export.addSuffix('test-table', undefined, 'xls')).toBe('test-table.xls');
        expect(Export.addSuffix('test-table', 'fileName', 'xls')).toBe('fileName.xls');
        expect(Export.addSuffix('test-table', 'fileName', 'xls')).toBe('fileName.xls');
        expect(Export.addSuffix('test-table', 'fileName', 'xlsx')).toBe('fileName.xlsx');
    });
});

describe('Export.createExportHTML(theadHTML, tbodyHTML)', function() {
	var exportHTML = null;
	var theadHTML = '<tr><th>test</th></tr>';
	var tbodyHTML = '<tr><td>test</td></tr>';
	beforeEach(function() {
		exportHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
						<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
						<body>
							<table>
								<thead>
									${theadHTML}
								</thead>
								<tbody>
									${tbodyHTML}
								</tbody>
							</table>
						</body>
					</html>`;
	});

	afterEach(function(){
		exportHTML = null;
		theadHTML = null;
		tbodyHTML = null;
	});

	it('基础验证', function() {
		expect(Export.createExportHTML).toBeDefined();
		expect(Export.createExportHTML.length).toBe(2);
	});

	it('返回值', function() {
		expect(Export.createExportHTML(theadHTML, tbodyHTML).replace(/\s/g, '')).toBe(exportHTML.replace(/\s/g, ''));
	});
});

describe('Export.__exportGridToXls($table, fileName, onlyChecked)', function() {
	it('基础验证', function() {
		expect(Export.__exportGridToXls).toBeDefined();
		expect(Export.__exportGridToXls.length).toBe(3);
	});
});
