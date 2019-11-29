import { treeKey, getTreeCache, addTreeCache, clearTreeCache, getIconClass } from '@module/tree/tool';

describe('tree tool', () => {
    describe('treeKey', () => {
        it('基础验证', () => {
            expect(treeKey).toBe('tree-element');
        });
    });

    describe('treeCache', () => {
        let gridManagerName = null;
        beforeEach(() => {
            gridManagerName = 'test';
        });
        afterEach(() => {
            gridManagerName = null;
        });

        it('基础验证', () => {
            expect(getTreeCache).toBeDefined();
            expect(getTreeCache.length).toBe(1);

            expect(addTreeCache).toBeDefined();
            expect(addTreeCache.length).toBe(2);

            expect(clearTreeCache).toBeDefined();
            expect(clearTreeCache.length).toBe(1);
        });

        it('执行验证', () => {
            expect(getTreeCache(gridManagerName)).toBeUndefined();

            addTreeCache(gridManagerName, { trNode: 1, level: 2, hasChildren: 3 });
            expect(getTreeCache(gridManagerName)).toEqual([{ trNode: 1, level: 2, hasChildren: 3 }]);

            addTreeCache(gridManagerName, { trNode: 1, level: 2, hasChildren: 3 });
            expect(getTreeCache(gridManagerName)).toEqual([{ trNode: 1, level: 2, hasChildren: 3 }, { trNode: 1, level: 2, hasChildren: 3 }]);

            clearTreeCache(gridManagerName);
            expect(getTreeCache(gridManagerName)).toBeUndefined();
        });
    });

    describe('getIconClass', () => {
        it('基础验证', () => {
            expect(getIconClass).toBeDefined();
            expect(getIconClass.length).toBe(1);
        });
        it('执行验证', () => {
            expect(getIconClass(true)).toBe('gm-icon-sub');
            expect(getIconClass(false)).toBe('gm-icon-add');
        });
    });

});
