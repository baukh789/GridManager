import { CONSOLE_ERROR, CONSOLE_INFO, CONSOLE_STYLE, CONSOLE_WARN } from '@common/constants';
import { outInfo, outWarn, outError, equal, getObjectIndexToArray, cloneObject, getVisibleState } from '@common/utils';
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

describe('getVisibleState(isShow)', () => {
    it('基础验证', () => {
        expect(getVisibleState).toBeDefined();
        expect(getVisibleState.length).toBe(1);
    });

    it('执行结果', () => {
        expect(getVisibleState(true)).toBe('visible');
        expect(getVisibleState(false)).toBe('none');
    });
});
