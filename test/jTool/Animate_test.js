import _Animate from '@jTool/Animate';
import Sizzle from '@jTool/Sizzle';
import { extend } from '@jTool/utils';
describe('Animate', () => {

	let divEle = null;
    let jTool = null;
    let animateCallbackHandler = null;
	beforeEach(() => {
		jTool = function (selector, context) {
			return new Sizzle(selector, context);
		};

        animateCallbackHandler = jasmine.createSpy('callback');
		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;
		jTool.prototype.extend(_Animate);

		divEle = document.createElement('div');
		divEle.id = 'div1';
		divEle.style.height = '50px';
		divEle.style.width = '50px';
		document.body.appendChild(divEle);
	});

	afterEach(() => {
		document.body.removeChild(divEle);
		divEle = null;
		jTool = null;
        animateCallbackHandler = null;
	});

	it('animate', () => {
		jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
		setTimeout(() => {
			expect(divEle.style.height).toBe('100px');
			expect(divEle.style.width).toBe('200px');
		}, 1000);
	});

	it('animate回调函数', () => {
		jTool('#div1').animate({height: '100px', width: '200px'}, 1000, animateCallbackHandler);
		setTimeout(() => {
			expect(animateCallbackHandler.calls.count()).toBe(1);
		}, 1000);
	});

	it('show', () => {
		jTool('#div1').show();
		expect(divEle.style.display).toBe('block');
	});

	it('hide', () => {
		jTool('#div1').hide();
		expect(divEle.style.display).toBe('none');
	});
});
