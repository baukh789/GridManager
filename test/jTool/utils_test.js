import { isWindow, type, noop, each, getStyle, createDOM, extend, isUndefined, isString, isFunction, isNumber, isBoolean, isObject, isEmptyObject, isArray, isElement, isNodeList } from '@jTool/utils';
import tableTpl from '@test/table-test.tpl.html';

describe('isWindow(o)', () => {
    it('基础验证', () => {
        expect(isWindow).toBeDefined();
        expect(isWindow.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isWindow(window)).toBe(true);
        expect(isWindow(document)).toBe(false);
    });
});

describe('type(o)', () => {
    let nodeList = null;
    let divEle = null;

    beforeEach(function () {
        divEle = document.createElement('div');
        document.body.appendChild(divEle);
        nodeList = document.querySelectorAll('div');
    });

    afterEach(function () {
        document.body.removeChild(divEle);
        nodeList = null;
        divEle = null;
    });
    it('基础验证', () => {
        expect(type).toBeDefined();
        expect(type.length).toBe(1);
    });

    it('执行结果', () => {
        expect(type(undefined)).toBe('undefined');
        expect(type(null)).toBe('null');
        expect(type(true)).toBe('boolean');
        expect(type(Boolean())).toBe('boolean');
        expect(type(123)).toBe('number');
        expect(type(Number(123))).toBe('number');
        expect(type('123')).toBe('string');
        expect(type(String('123'))).toBe('string');
        expect(type(function () {})).toBe('function');
        expect(type([])).toBe('array');
        expect(type(new Array(1))).toBe('array');
        expect(type(new Date())).toBe('date');
        expect(type(Error())).toBe('error');
        expect(type(/test/)).toBe('regexp');
        expect(type(document.body)).toBe('element');
        expect(type(nodeList)).toBe('nodeList');
        expect(type(divEle)).toBe('element');
    });
});

describe('noop', () => {
    it('基础验证', () => {
        expect(noop).toBeDefined();
        expect(typeof noop).toBe('function');
        expect(noop()).toBeUndefined();
    });
});

describe('each', () => {
    let callback = null;
    let nodeList = null;
    let divEle = null;

    beforeEach(() => {
        callback = jasmine.createSpy('callback');
        divEle = document.createElement('div');
        document.body.appendChild(divEle);
        nodeList = document.querySelectorAll('div');
    });

    afterEach(() => {
        callback = null;
        document.body.removeChild(divEle);
        nodeList = null;
        divEle = null;
    });

    it('基础验证', () => {
        expect(each).toBeDefined();
        expect(each.length).toBe(2);
    });

    it('遍历数组', () => {
        const arr = [1, 2, 3];
        each(arr, callback);
        expect(callback.calls.count()).toBe(3);
        expect(callback.calls.argsFor(0)).toEqual([0, 1]);

        let sum = 0;
        each(arr, (i, v) => {
            sum += v;
        });
        expect(sum).toBe(6);
    });

    it('遍历类数组 arguments', () => {
        function test() {
            each(arguments, callback);
            expect(callback.calls.count()).toBe(4);
        }

        test(1, 2, 3, 4);
    });

    it('遍历类数组 nodeList', () => {
        each(nodeList, callback);
        expect(callback.calls.count()).toBe(1);
    });

    it('遍历对象', () => {
        const obj = {
            'a': 1,
            'b': 2,
            'c': 3
        };
        each(obj, callback);
        expect(callback.calls.count()).toBe(3);
        expect(callback.calls.argsFor(0)).toEqual(['a', 1]);
    });

    it('遍历 JTool 对象', () => {
        const obj = {
            'a': 1,
            'b': 2,
            'c': 3
        };

        obj.jTool = 'jTool';
        obj.DOMList = nodeList;
        each(obj, callback);
        expect(callback.calls.count()).toBe(1);
    });
});

describe('getStyle(dom, key)', () => {
    let divEle = null;

    beforeEach(() => {
        divEle = document.createElement('div');
        document.body.appendChild(divEle);
    });

    afterEach(() => {
        document.body.removeChild(divEle);
        divEle = null;
    });

    it('基础验证', () => {
        expect(getStyle).toBeDefined();
        expect(getStyle.length).toBe(2);
    });

    it('执行结果', () => {
        expect(getStyle(divEle)).toEqual(jasmine.any(Object));
        divEle.style.fontSize = '12px';
        expect(getStyle(divEle, 'font-size')).toBe('12px');
    });
});

describe('createDOM(htmlString)', () => {
    let divEle = null;

    beforeEach(() => {
        divEle = document.createElement('div');
        document.body.appendChild(divEle);
    });

    afterEach(() => {
        document.body.removeChild(divEle);
        divEle = null;
    });

    it('基础验证', () => {
        expect(createDOM).toBeDefined();
        expect(createDOM.length).toBe(1);
    });

    it('执行结果', () => {
        expect(createDOM('<div id="haha">hahaha</div>')[0].id).toBe('haha');
        expect(document.getElementById('jTool-create-dom')).toBe(null);
    });
});

describe('isUndefined(o)', () => {
    it('基础验证', () => {
        expect(isUndefined).toBeDefined();
        expect(isUndefined.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isUndefined(undefined)).toBe(true);
        expect(isUndefined('')).toBe(false);
    });
});

describe('isString(o)', () => {
    it('基础验证', () => {
        expect(isString).toBeDefined();
        expect(isString.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isString('')).toBe(true);
        expect(isString({})).toBe(false);
    });
});

describe('isFunction(o)', () => {
    it('基础验证', () => {
        expect(isFunction).toBeDefined();
        expect(isFunction.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isFunction(() => {})).toBe(true);
        expect(isFunction({})).toBe(false);
    });
});

describe('isNumber(o)', () => {
    it('基础验证', () => {
        expect(isNumber).toBeDefined();
        expect(isNumber.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isNumber(123)).toBe(true);
        expect(isNumber({})).toBe(false);
    });
});

describe('isBoolean(o)', () => {
    it('基础验证', () => {
        expect(isBoolean).toBeDefined();
        expect(isBoolean.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean({})).toBe(false);
    });
});

describe('isObject(o)', () => {
    it('基础验证', () => {
        expect(isObject).toBeDefined();
        expect(isObject.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isObject({})).toBe(true);
        expect(isObject('baukh')).toBe(false);
    });
});

describe('isEmptyObject(o)', () => {
    it('基础验证', () => {
        expect(isEmptyObject).toBeDefined();
        expect(isEmptyObject.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isEmptyObject({})).toBe(true);
        expect(isEmptyObject({name: 'baukh'})).toBe(false);
    });
});

describe('isArray(o)', () => {
    it('基础验证', () => {
        expect(isArray).toBeDefined();
        expect(isArray.length).toBe(1);
    });

    it('执行结果', () => {
        expect(isArray([])).toBe(true);
        expect(isArray({name: 'baukh'})).toBe(false);
    });
});

describe('isElement(o)', () => {
    it('基础验证', () => {
        expect(isElement).toBeDefined();
        expect(isElement.length).toBe(1);
    });

    it('执行结果', () => {
        document.body.innerHTML = tableTpl;
        expect(isElement(document.querySelector('div'))).toBe(true);
        expect(isElement({name: 'baukh'})).toBe(false);
        document.body.innerHTML = '';
    });
});

describe('isNodeList(o)', () => {
    it('基础验证', () => {
        expect(isNodeList).toBeDefined();
        expect(isNodeList.length).toBe(1);
    });

    it('执行结果', () => {
        document.body.innerHTML = tableTpl;
        expect(isNodeList(document.querySelectorAll('div'))).toBe(true);
        expect(isNodeList({name: 'baukh'})).toBe(false);
        document.body.innerHTML = '';
    });
});

describe('extend', () => {

    let obj1 = null;
    let obj2 = null;
    let obj3 = null;
    let obj4 = null;
    let obj5 = null;

    beforeEach(() => {
        obj1 = {
            prop: 0,
            prop1: 1,
            fun1: () => {

            }
        };

        obj2 = 	{
            prop: 11,
            prop2: 2,
            fun: () => {

            }
        };

        obj3 = {
            prop3: 3,
            fun: () => {

            }
        };

        obj4 = Object.create(obj2);

        obj4.prop4 = 4;

        obj5 = {};

        Object.defineProperty(obj5, 'prop', {
            enumerable: true,
            configurable: false,
            writable: false,
            value: 'enumerable'
        });

        Object.defineProperty(obj5, 'anotherProp', {
            enumerable: false,
            value: 'noEnumerable'
        });
    });

    afterEach(() => {
        obj1 = null;
        obj2 = null;
        obj3 = null;
        obj4 = null;
        obj5 = null;
    });

    it('两个对象之间的 extend', () => {
        expect(extend(obj1, obj2)).toEqual({prop: 11, prop1: 1, prop2: 2, fun1: obj1.fun1, fun: obj2.fun});
    });

    it('多个对象之间的 extend', () => {
        expect(extend(obj1, obj2, obj3)).toEqual({prop: 11, prop1: 1, prop2: 2, prop3: 3, fun1: obj1.fun1, fun: obj3.fun});
    });

    it('extend 对象自身的属性和方法', () => {
        expect(extend(obj1, obj4)).toEqual({prop: 0, prop1: 1, fun1: obj1.fun1, prop4: 4});
    });

    it('extend 可枚举的属性和方法', () => {
        expect(extend(obj1, obj5)).toEqual({prop: 'enumerable', prop1: 1, fun1: obj1.fun1});
    });

    it('extend 可枚举的属性和方法2', () => {
        let o = {name: 'baukh', love: {a: 1, b: 2}};
        let o2 = extend(true, {}, o);
        o2.love.a = 2;
        expect(o.love.a).toBe(1);
        expect(o2.love.a).toBe(2);
        o = null;
        o2 = null;
    });


    it('对 JTool 对象进行扩展', () => {
        let JTool = {};
        JTool.extend = extend;
        JTool.extend(obj1);

        expect(JTool.fun1).toEqual(obj1.fun1);
        expect(JTool.prop).toEqual(obj1.prop);
        expect(JTool.prop1).toEqual(obj1.prop1);
        JTool = null;
    });
});
