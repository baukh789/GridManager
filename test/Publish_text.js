/**
 * Created by baukh on 17/4/17.
 */

'use strict';
import Checkbox from '../src/js/Checkbox';
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
