'use strict';
import Order from '../src/js/Order';
import { jTool } from '../src/js/Base';
import { Settings, TextSettings} from '../src/js/Settings';
/**
 * 验证类的属性及方法总量
 */
describe('Order 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Order)))).toBe(3 + 1);
	});
});

describe('Order.key', function() {
	it('基础验证', function() {
		expect(Order.key).toBeDefined();
		expect(Order.key).toBe('gm_order');
	});
});

describe('Order.getThString(settings)', function() {
	let settings = null;
	beforeEach(() => {
		settings = new Settings();
		settings.textConfig = new TextSettings();
		settings.gridManagerName = 'order-getThString';
		settings.pageDate = {
			cPage: 1,
			pSize: 10,
			tPage: 3
		};
	});

	afterEach(() => {
		settings = null;
	});
	it('基础验证', function() {
		expect(Order.getThString).toBeDefined();
		expect(Order.getThString.length).toBe(1);
	});

	it('返回值', function() {
		expect(Order.getThString(settings)).toBe('序号');
	});
});

describe('Order.getColumn(settings)', function() {
	let settings = null;
	beforeEach(() => {
		settings = new Settings();
		settings.textConfig = new TextSettings();
		settings.gridManagerName = 'order-getColumn';
		settings.pageDate = {
			cPage: 1,
			pSize: 10,
			tPage: 3
		};
	});

	afterEach(() => {
		settings = null;
	});
	it('基础验证', function() {
		expect(Order.getColumn).toBeDefined();
		expect(Order.getColumn.length).toBe(1);
	});

	it('返回值', function() {
		expect(Order.getColumn(settings).key).toBe('gm_order');
		expect(Order.getColumn(settings).text).toBe('序号');
		expect(Order.getColumn(settings).isAutoCreate).toBe(true);
		expect(Order.getColumn(settings).isShow).toBe(true);
		expect(Order.getColumn(settings).width).toBe('50px');
		expect(Order.getColumn(settings).align).toBe('center');
		expect(Order.getColumn(settings).template(1)).toBe('<td gm-order="true" gm-create="true">1</td>');
	});
});
