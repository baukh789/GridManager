import fullColumn from '@module/fullColumn';
import { getColumnMap } from '@test/table-config';

describe('fullColumn', () => {
    describe('add', () => {
        let settings = null;
        let trObjectList = null;
        let intervalTrObject = null;
        let topTrObject = null;

        beforeEach(() => {
            document.body.innerHTML = '<table><tbody></tbody></table>';
            trObjectList = [];
        });

        afterEach(() => {
            document.body.innerHTML = '';
            settings = null;
            trObjectList = null;
            intervalTrObject = null;
            topTrObject = null;
        });
        it('基础验证', () => {
            expect(fullColumn.add.length).toBe(5);
        });

        it('执行验证: 未存在有效的通栏模板', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {}
            };
            fullColumn.add(settings, {id: 1}, 1, trObjectList, 'top');
            expect(trObjectList).toEqual([]);
        });

        it('执行验证: 存在顶部通栏模板', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {
                    topTemplate: (row, index) => {
                        return '<div>我是通栏，哈哈</div>';
                    }
                }
            };

            fullColumn.add(settings, {id: 1}, 1, trObjectList, 'top');
            expect(trObjectList.length).toBe(1);

            topTrObject = trObjectList[0];
            expect(topTrObject.className.length).toBe(0);
            expect(topTrObject.attribute.length).toBe(1);
            expect(topTrObject.attribute[0]).toBe('full-column="top"');
            expect(topTrObject.tdList.length).toBe(1);
            expect(topTrObject.tdList[0]).toBe(`<td colspan="${Object.keys(settings.columnMap).length}"><div class="full-column-div" ><div>我是通栏，哈哈</div></div></td>`);
        });
    });
});
