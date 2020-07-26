import tableTpl from '../table-test.tpl.html';
import { getCacheDOM, clearCacheDOM } from '../../src/common/domCache';
import { TABLE_KEY } from '../../src/common/constants';
describe('domCache', () => {
    beforeEach(() => {
        clearCacheDOM('test');
        document.body.innerHTML = tableTpl;
    });

    it('基础验证', () => {
        expect(getCacheDOM).toBeDefined();
        expect(getCacheDOM.length).toBe(3);

        expect(clearCacheDOM).toBeDefined();
        expect(clearCacheDOM.length).toBe(1);
    });

    it('执行验证', () => {
        expect(getCacheDOM('test', TABLE_KEY).length).toBe(1);

        expect(getCacheDOM('test', TABLE_KEY, `[${TABLE_KEY}="test"]`).length).toBe(1);

        // 触发缓存
        expect(getCacheDOM('test', TABLE_KEY).length).toBe(1);

        // 清除缓存
        clearCacheDOM('test');
        expect(getCacheDOM('test', TABLE_KEY).length).toBe(1);
    });
});
