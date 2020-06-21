import tableTpl from '@test/table-test.tpl.html';
import { getCacheDOM, clearCacheDOM } from '@common/domCache';
import { TABLE_KEY } from '@common/constants';
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
