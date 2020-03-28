import _Data from '@jTool/Data';
import Sizzle from '@jTool/Sizzle';
import { extend } from '@jTool/utils';

describe('Data', () => {

	let divEle = null;
    let jTool = null;

	beforeEach(() => {
		jTool = function (selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;
		jTool.prototype.extend(_Data);

		divEle = document.createElement('div');
		divEle.id = 'div1';
		document.body.appendChild(divEle);
	});

	afterEach(() => {
		document.body.removeChild(divEle);
		divEle = null;
		jTool = null;
	});

	it('attr', () => {
        expect(jTool('#div1').attr()).toBeUndefined();

        expect(jTool('#div1').attr('jtool')).toBeUndefined();

        jTool('#div1').attr('jtool', 'baukh');
		expect(jTool('#div1').attr('jtool')).toBe('baukh');

		jTool('#div1').removeAttr('jtool');
		expect(jTool('#div1').attr('jtool')).toBeUndefined();
	});

	it('prop', () => {
        expect(jTool('#div1').prop('class')).toBeUndefined();
		jTool('#div1').prop('class', 'baukh');
		expect(jTool('#div1').prop('class')).toBe('baukh');
		// jTool('#div1').removeProp('class');
		// expect(jTool('#div1').prop('class')).toBe(undefined);
	});

	it('val', () => {
		jTool('#div1').val('baukh');
		expect(jTool('#div1').val()).toBe('baukh');
		jTool('#div1').val('');
		expect(jTool('#div1').val()).toBe('');
	});
});
