import { isUndefined, isString, isFunction, isNumber, isBoolean, isObject, isEmptyObject, isArray, isElement, isNodeList } from '@jTool/utils';
import tableTpl from '@test/table-test.tpl.html';

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
