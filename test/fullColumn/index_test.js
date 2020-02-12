import { getTopFull } from '@module/fullColumn';
import { getColumnData } from '@test/table-config';

describe('fullColumn', () => {
    describe('getTopFull', () => {
        let settings = null;
        let callback = null;
        let list = null;
        let intervalTrObject = null;
        let topTrObject = null;

        beforeEach(() => {
            document.body.innerHTML = '<table><tbody></tbody></table>';
            callback = jasmine.createSpy('callback');
        });

        afterEach(() => {
            document.body.innerHTML = '';
            settings = null;
            callback = null;
            list = null;
            intervalTrObject = null;
            topTrObject = null;
        });
        it('基础验证', () => {
            expect(getTopFull.length).toBe(4);
        });

        it('执行验证: 未存在有效的通栏模板', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnData: getColumnData(),
                topFullColumn: {}
            };
            expect(getTopFull(settings, {id: 1}, 1, callback)).toEqual([]);
            expect(callback).toHaveBeenCalledTimes(0);
        });

        it('执行验证: 存在通栏模板', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnData: getColumnData(),
                topFullColumn: {
                    template: (row, index) => {
                        return '<div>我是通栏，哈哈</div>';
                    }
                }
            };

            list = getTopFull(settings, {id: 1}, 1, callback);
            expect(list.length).toBe(2);
            expect(callback).toHaveBeenCalled();

            intervalTrObject = list[0];
            expect(intervalTrObject.className.length).toBe(0);
            expect(intervalTrObject.attribute.length).toBe(1);
            expect(intervalTrObject.attribute[0]).toBe('top-full-column-interval="true"');
            expect(intervalTrObject.tdList.length).toBe(1);
            expect(intervalTrObject.tdList[0]).toBe(`<td colspan="${settings.columnData.length}"><div></div></td>`);

            topTrObject = list[1];
            expect(topTrObject.className.length).toBe(0);
            expect(topTrObject.attribute.length).toBe(1);
            expect(topTrObject.attribute[0]).toBe('top-full-column="true"');
            expect(topTrObject.tdList.length).toBe(1);
            expect(topTrObject.tdList[0]).toBe(`<td colspan="${settings.columnData.length}"><div class="full-column-td" ><div>我是通栏，哈哈</div></div></td>`);
        });
    });
});
