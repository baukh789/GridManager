import _Element from '@jTool/Element';
import Sizzle from '@jTool/Sizzle';
import { extend } from '@jTool/utils';

describe('Element', () => {
	let divEle = null;
    let divEle2 = null;
    let divEle3 = null;
    let pEle1 = null;
    let jTool = null;

	beforeEach(() => {
        document.body.innerHTML = '';
		jTool = function (selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Element);


		divEle = document.createElement('div');
		divEle.id = 'div1';
		document.body.appendChild(divEle);

		divEle2 = document.createElement('div');
		divEle2.id = 'div2';
		document.body.appendChild(divEle2);

		divEle3 = document.createElement('div');
		divEle3.id = 'div3';
		document.body.appendChild(divEle3);

		pEle1 = document.createElement('p');
		pEle1.id = 'p1';
		pEle1.innerHTML = '<span class="span1"></span><span class="span2"></span><span class="span3"></span>';
		document.body.appendChild(pEle1);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		divEle = null;
		divEle2 = null;
		divEle3 = null;
		jTool = null;
	});

	it('get', () => {
		expect(jTool('div').get(0).id).toBe('div1');
		expect(jTool('div').get(1).id).toBe('div2');
		expect(jTool('div').get(3)).toBe(undefined);
	});

	it('eq', () => {
		expect(jTool('div').eq(0).DOMList[0].id).toBe('div1');
		expect(jTool('div').eq(1).DOMList[0].id).toBe('div2');
		expect(jTool('div').eq(3).DOMList).toBe(undefined);
	});

	it('find', () => {
		expect(jTool('body').find('#div1').DOMList[0].id).toBe('div1');
		expect(jTool('body').find('#div2').DOMList[0].id).toBe('div2');
		expect(jTool('body').find('#div11').DOMList).toBe(undefined);
	});

	it('index', () => {
		expect(jTool('#p1 .span1').index()).toBe(0);
		expect(jTool('#p1 .span2').index()).toBe(1);
		expect(jTool('#p1 .span1').index(jTool('#p1 span'))).toBe(0);
		expect(jTool('#p1 .span3').index(jTool('#p1 span'))).toBe(2);
	});
});
