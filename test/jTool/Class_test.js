import _Class from '@jTool/Class';
import Sizzle from '@jTool/Sizzle';
import { extend } from '@jTool/utils';
describe('Class', () => {

	var divEle = null;
	var divEle2 = null;
	var jTool = null;

	beforeEach(() => {
		jTool = function (selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Class);


		divEle = document.createElement('div');
		divEle.id = 'div1';
		divEle.classList.add('class1');
		document.body.appendChild(divEle);

		divEle2 = document.createElement('div');
		divEle2.id = 'div2';
		divEle2.classList.add('class21', 'class22');
		document.body.appendChild(divEle2);
	});

	afterEach(() => {
		document.body.removeChild(divEle);
		document.body.removeChild(divEle2);
		divEle = null;
		divEle2 = null;
		jTool = null;
	});

	it('addClass', () => {
		jTool('#div1').addClass('class2');
		expect(divEle.classList.contains('class2')).toBe(true);

		jTool('#div2').addClass('class23 class24');
		expect(divEle2.classList.toString()).toEqual('class21 class22 class23 class24');
	});

	it('removeClass', () => {
		jTool('#div1').removeClass('class1');
		expect(divEle.classList.contains('class1')).toBe(false);
		jTool('#div2').removeClass('class22 class24');
		expect(divEle2.classList.toString()).toEqual('class21');
	});

	it('hasClass', () => {
		expect(jTool('#div1').hasClass('class1')).toBe(true);
		expect(jTool('#div2').hasClass('class24')).toBe(false);
	});
});
