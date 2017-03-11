'use strict';
var Base = require('../src/js/Base').default;
describe('Base: 验证方法总数', function() {
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
	it('outLog', function() {
		expect(getPropertyCount(Base)).toBe(9);
	});
});
describe('Base: 验证方法是否存在', function() {
	it('outLog', function() {
		expect(Base.outLog).toBeDefined();
	});
	it('showTh', function() {
		expect(Base.showTh).toBeDefined();
	});
	it('hideTh', function() {
		expect(Base.hideTh).toBeDefined();
	});
	it('getColTd', function() {
		expect(Base.getColTd).toBeDefined();
	});
	it('initVisible', function() {
		expect(Base.initVisible).toBeDefined();
	});
	it('setAreVisible', function() {
		expect(Base.setAreVisible).toBeDefined();
	});
	it('getTextWidth', function() {
		expect(Base.getTextWidth).toBeDefined();
	});
	it('showLoading', function() {
		expect(Base.showLoading).toBeDefined();
	});
	it('hideLoading', function() {
		expect(Base.hideLoading).toBeDefined();
	});
});
