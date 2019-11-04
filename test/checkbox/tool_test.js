import { resetData } from '@module/checkbox/tool';
import store from '@common/Store';
import getTableTestData from '@test/table-test.data.js';
import { getColumnMap } from '@test/table-config';

const gridManagerName = 'test';
describe('checkbox tool', () => {
    describe('resetData', () => {
        let tableData = null;
        beforeEach(() => {
            tableData = getTableTestData();
            store.checkedData = {
                [gridManagerName]: []
            };
            store.responseData = {
                [gridManagerName]: tableData.data
            };
            store.settings = {
                [gridManagerName]: {
                    gridManagerName,
                    columnMap: getColumnMap()
                }
            };
        });
        afterEach(() => {
            tableData = null;
            store.responseData = {};
            store.checkedData = {};
            store.settings = {};
        });

        it('基础验证', () => {
            expect(resetData).toBeDefined();
            expect(resetData.length).toBe(5);
        });

        it('执行验证: 复选-全选', () => {
            expect(store.checkedData.test.length).toBe(0);

            // 全选
            resetData(gridManagerName, true, true);
            expect(store.checkedData.test.length).toBe(10);

            // 取消全选
            resetData(gridManagerName, false, true);
            expect(store.checkedData.test.length).toBe(0);
        });

        it('执行验证: 复选-单个操作', () => {
            expect(store.checkedData.test.length).toBe(0);

            // 选中一项
            resetData(gridManagerName, true, false, 3);
            expect(store.checkedData.test.length).toBe(1);

            // 再选中一项
            resetData(gridManagerName, true, false, 4);
            expect(store.checkedData.test.length).toBe(2);

            // 再选中一项
            resetData(gridManagerName, true, false, 5);
            expect(store.checkedData.test.length).toBe(3);

            // 取消一项
            resetData(gridManagerName, false, false, 5);
            expect(store.checkedData.test.length).toBe(2);
        });

        it('执行验证: 单选', () => {
            expect(store.checkedData.test.length).toBe(0);

            // 选中一项
            resetData(gridManagerName, undefined, true, 3, true);
            expect(store.checkedData.test.length).toBe(1);

            // 再选中一项
            resetData(gridManagerName, undefined, true, 4, true);
            expect(store.checkedData.test.length).toBe(1);
        });
    });
});
