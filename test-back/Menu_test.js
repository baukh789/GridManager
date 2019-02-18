/**
 * Created by baukh on 17/9/30.
 */
'use strict';
import { jTool } from '../src/js/Base';
import { Settings, TextSettings} from '../src/js/Settings';
import Menu from '../src/js/Menu';
/**
 * 验证类的属性及方法总量
 */
describe('Menu 验证类的属性及方法总量', () => {
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
	afterEach(() => {
		getPropertyCount = null;
	});
	it('Function count', () => {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Menu)))).toBe(7 + 1);
	});
});

describe('Menu.keyName', () => {
	it('基础验证', () => {
		expect(Menu.keyName).toBeDefined();
		expect(Menu.keyName).toBe('grid-master');
	});
});

describe('Menu.init($table)', () => {
	it('基础验证', () => {
		expect(Menu.init).toBeDefined();
		expect(Menu.init.length).toBe(1);
	});
});

describe('Menu.createMenuDOM(settings)', () => {
	let settings = null;
	beforeEach(() => {
		settings = new Settings();
		settings.textConfig = new TextSettings();
		settings.gridManagerName = 'test-createMenuDOM';
		settings.pageDate = {
			cPage: 1,
			pSize: 10,
			tPage: 3
		};
	});

	afterEach(() => {
		document.body.innerHTML = '';
		settings = null;
	});
	it('基础验证', () => {
		expect(Menu.createMenuDOM).toBeDefined();
		expect(Menu.createMenuDOM.length).toBe(1);
	});

	it('使用默认配置', () => {
		Menu.createMenuDOM(settings);

		// 菜单区域
		expect(jTool(`.grid-menu[${Menu.keyName}="test-createMenuDOM"]`).length).toBe(1);

		// 上一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="previous"]`).length).toBe(0);

		// 重新加载
		expect(jTool(`[grid-action="refresh-page"][refresh-type="refresh"]`).length).toBe(1);

		// 下一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="next"]`).length).toBe(0);

		// 另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="false"]`).length).toBe(1);

		//  已选中项另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="true"]`).length).toBe(1);

		//  配置表
		expect(jTool(`[grid-action="config-grid"]`).length).toBe(1);
	});

	it('开启分页功能', () => {
		settings.supportAjaxPage = true;
		Menu.createMenuDOM(settings);

		// 菜单区域
		expect(jTool(`.grid-menu[${Menu.keyName}="test-createMenuDOM"]`).length).toBe(1);

		// 上一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="previous"]`).length).toBe(1);

		// 重新加载
		expect(jTool(`[grid-action="refresh-page"][refresh-type="refresh"]`).length).toBe(1);

		// 下一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="next"]`).length).toBe(1);

		// 另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="false"]`).length).toBe(1);

		//  已选中项另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="true"]`).length).toBe(1);

		//  配置表
		expect(jTool(`[grid-action="config-grid"]`).length).toBe(1);
	});

	it('禁用导出功能', () => {
		settings.supportExport = false;
		Menu.createMenuDOM(settings);

		// 菜单区域
		expect(jTool(`.grid-menu[${Menu.keyName}="test-createMenuDOM"]`).length).toBe(1);

		// 上一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="previous"]`).length).toBe(0);

		// 重新加载
		expect(jTool(`[grid-action="refresh-page"][refresh-type="refresh"]`).length).toBe(1);

		// 下一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="next"]`).length).toBe(0);

		// 另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="false"]`).length).toBe(0);

		//  已选中项另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="true"]`).length).toBe(0);

		//  配置表
		expect(jTool(`[grid-action="config-grid"]`).length).toBe(1);
	});

	it('禁止操作功能', () => {
		settings.supportConfig = false;
		Menu.createMenuDOM(settings);

		// 菜单区域
		expect(jTool(`.grid-menu[${Menu.keyName}="test-createMenuDOM"]`).length).toBe(1);

		// 上一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="previous"]`).length).toBe(0);

		// 重新加载
		expect(jTool(`[grid-action="refresh-page"][refresh-type="refresh"]`).length).toBe(1);

		// 下一页
		expect(jTool(`[grid-action="refresh-page"][refresh-type="next"]`).length).toBe(0);

		// 另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="false"]`).length).toBe(1);

		//  已选中项另存为Excel
		expect(jTool(`[grid-action="export-excel"][only-checked="true"]`).length).toBe(1);

		//  配置表
		expect(jTool(`[grid-action="config-grid"]`).length).toBe(0);
	});
});

describe('Menu.bindRightMenuEvent($table, settings)', () => {
	it('基础验证', () => {
		expect(Menu.bindRightMenuEvent).toBeDefined();
		expect(Menu.bindRightMenuEvent.length).toBe(2);
	});
});

describe('Menu.updateMenuPageStatus(gridManagerName, settings)', () => {
	let menuHtml = null;
	let settings = null;
	beforeEach(() => {
		menuHtml = `<div class="grid-menu" ${Menu.keyName}="test-updateMenuPageStatus">
						<span grid-action="refresh-page" refresh-type="previous">
							上一页
							<i class="iconfont icon-up"></i>
						</span>
						<span grid-action="refresh-page" refresh-type="next">
							下一页
							<i class="iconfont icon-down"></i>
						</span>;
					</div>`;
		settings = new Settings();
		settings.textConfig = new TextSettings();
		settings.gridManagerName = 'test-createMenuDOM';
	});

	afterEach(() => {
		document.body.innerHTML = '';
		menuHtml = null;
		settings = null;
	});
	it('基础验证', () => {
		expect(Menu.updateMenuPageStatus).toBeDefined();
		expect(Menu.updateMenuPageStatus.length).toBe(2);
	});

	it('不存在DOM节点', () => {
		expect(Menu.updateMenuPageStatus()).toBeUndefined();
	});

	it('当前处于第一页', () => {
		document.body.innerHTML = menuHtml;
		settings.pageData = {
					cPage: 1,
					tPage: 3
				};
		Menu.updateMenuPageStatus('test-updateMenuPageStatus', settings);
		expect(jTool('[refresh-type="previous"]').hasClass('disabled')).toBe(true);
		expect(jTool('[refresh-type="next"]').hasClass('disabled')).toBe(false);
	});

	it('当前处于最后一页', () => {
		document.body.innerHTML = menuHtml;
		settings.pageData = {
			cPage: 3,
			tPage: 3
		};
		Menu.updateMenuPageStatus('test-updateMenuPageStatus', settings);
		expect(jTool('[refresh-type="previous"]').hasClass('disabled')).toBe(false);
		expect(jTool('[refresh-type="next"]').hasClass('disabled')).toBe(true);
	});
});

describe('Menu.isDisabled(dom, events)', () => {
	let event = null;
	beforeEach(() => {
		// event mock
		event = {
			stopPropagation: ()=>{},
			preventDefault: () => {}
		};
		document.body.innerHTML = '<div id="test1" class="disabled"></div><div id="test2"></div>';
	});

	afterEach(() => {
		event = null;
		document.body.innerHTML = '';
	});
	it('基础验证', () => {
		expect(Menu.isDisabled).toBeDefined();
		expect(Menu.isDisabled.length).toBe(2);
	});

	it('返回值', () => {
		expect(Menu.isDisabled(document.querySelector('#test1'), event)).toBe(true);
		expect(Menu.isDisabled(document.querySelector('#test2'), event)).toBe(false);
	});
});

describe('Menu.destroy($table)', () => {
	it('基础验证', () => {
		expect(Menu.destroy).toBeDefined();
		expect(Menu.destroy.length).toBe(1);
	});
});
