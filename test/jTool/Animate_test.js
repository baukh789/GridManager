import _Animate from '@jTool/Animate';
import Sizzle from '@jTool/Sizzle';
import { extend } from '@jTool/utils';
describe('Animate', () => {

    let jTool = null;
	beforeEach(() => {
        document.body.innerHTML = '';
		jTool = function (selector, context) {
			return new Sizzle(selector, context);
		};
        document.body.innerHTML = '<div id="div1" style="height: 50px; width:50px;"></div>';

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;
		jTool.prototype.extend(_Animate);

	});

	afterEach(() => {
        document.body.innerHTML = '';
		jTool = null;
	});

	it('animate', () => {
        let divEle = document.getElementById('div1');
        jasmine.clock().install();
		jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
        jasmine.clock().tick(1000);
        expect(divEle.style.height).toBe('100px');
        expect(divEle.style.width).toBe('200px');
        jasmine.clock().uninstall();
        divEle = null;
	});

	it('animate回调函数', () => {
        let animateCallbackHandler = jasmine.createSpy('callback');
        jasmine.clock().install();
		jTool('#div1').animate({height: '100px', width: '200px'}, 1000, animateCallbackHandler);
        jasmine.clock().tick(1000);

        expect(animateCallbackHandler).toHaveBeenCalled();
        animateCallbackHandler = null;
        jasmine.clock().uninstall();
	});

	it('show', () => {
		jTool('#div1').show();
		expect(window.getComputedStyle(document.getElementById('div1')).display).toBe('block');
	});

	it('hide', () => {
		jTool('#div1').hide();
		expect(window.getComputedStyle(document.getElementById('div1')).display).toBe('none');
	});
});
