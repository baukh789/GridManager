/**
 * Created by baukh on 17/3/12.
 */
'use strict';
var Checkbox = require('../src/js/Checkbox').default;
describe('Checkbox', function() {
	var table = null;
	beforeEach(function(){
		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test');
		document.querySelector('body').appendChild(table);
	});
	afterEach(function () {
		document.querySelector('body').removeChild(table);
		table = null;
	});
	it('getCheckedTr', function() {
		expect(Checkbox.getCheckedTr(table).length).toBe(0);
	});
});
