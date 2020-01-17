import { CONSOLE_ERROR, CONSOLE_INFO, CONSOLE_STYLE, CONSOLE_WARN } from '@common/constants';
import { outInfo, outWarn, outError, equal, getObjectIndexToArray, cloneObject, isUndefined, isString, isFunction, isNumber, isBoolean, isObject, isEmptyObject, isArray, isElement, isNodeList } from '@common/utils';
import tableTpl from '@test/table-test.tpl.html';

describe('outInfo, outWarn, outError', () => {
    let table = null;
    beforeEach(() => {
        // 存储console, 用于在测方式完成后原还console对象
        console._log = console.log;
        console.log = jasmine.createSpy('log');

        table = document.createElement('table');
        document.body.appendChild(table);
    });

    afterEach(() => {
        // 还原console
        console.log = console._log;

        document.body.innerHTML = '';
        table = null;
    });

    it('基础验证', () => {
        expect(outInfo).toBeDefined();
        expect(outInfo.length).toBe(1);

        expect(outWarn).toBeDefined();
        expect(outWarn.length).toBe(1);

        expect(outError).toBeDefined();
        expect(outError.length).toBe(1);
    });

    it('info', () => {
        outInfo('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c hello GridManager ', ...CONSOLE_STYLE[CONSOLE_INFO]);
    });

    it('warn', () => {
        outWarn('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c hello GridManager ', ...CONSOLE_STYLE[CONSOLE_WARN]);
    });

    it('error', () => {
        outError('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c hello GridManager ', ...CONSOLE_STYLE[CONSOLE_ERROR]);
    });
});

describe('equal(o1, o2)', () => {
    it('基础验证', () => {
        expect(equal).toBeDefined();
        expect(equal.length).toBe(2);
    });

    it('返回值验证', () => {
        let obj1 = {a: 1, b: 2};
        let obj2 = {a: 1, b: 2};
        let obj3 = {a: 11, b: 22};
        let obj4 = {b: 2, a: 1};
        let obj5 = {'a': 1, 'b': 2};
        let obj6 = {a: 11};
        expect(equal(obj1, obj2)).toBe(true);
        expect(equal(obj1, obj3)).toBe(false);
        expect(equal(obj1, obj4)).toBe(true);
        expect(equal(obj1, obj5)).toBe(true);
        expect(equal(obj1, obj6)).toBe(false);

        obj1 = null;
        obj2 = null;
        obj3 = null;
        obj4 = null;
        obj5 = null;
        obj6 = null;
    });
});

describe('getObjectIndexToArray(arr, obj)', () => {
    it('基础验证', () => {
        expect(getObjectIndexToArray).toBeDefined();
        expect(getObjectIndexToArray.length).toBe(2);
    });

    it('返回值验证', () => {
        let arr = [{a: 1, b: 2}, {name: 'baukh', age: 31}, {name: 'kouzi', age: 28}];
        let obj = {name: 'baukh', age: 31};
        expect(getObjectIndexToArray(arr, obj)).toBe(1);
    });
});

describe('cloneObject(object)', () => {
    it('基础验证', () => {
        expect(cloneObject).toBeDefined();
        expect(cloneObject.length).toBe(1);
    });

    it('执行结果', () => {
        let o1 = {name: 'cc', ename: 'baukh'};
        let o2 = o1;
        expect(o2 === o1).toBe(true);
        expect(cloneObject(o2).name === o1.name).toBe(true);
        expect(cloneObject(o2) === o1).toBe(false);

        o1 = null;
        o2 = null;
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
