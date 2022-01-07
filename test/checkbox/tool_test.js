import { resetData } from '../../src/module/checkbox/tool';
import store from '../../src/common/Store';
import getTableTestData from '../table-test.data.js';
import { getColumnMap } from '../table-config';
import {TR_CACHE_KEY} from '@common/constants';

const _ = 'test';
describe('checkbox tool', () => {
    describe('resetData', () => {
        let tableData = null;
        beforeEach(() => {
            tableData = getTableTestData().data;
            // 模拟gm-cache-key
			tableData.forEach((item, index) => {
				item[TR_CACHE_KEY] = `${index}`;
			});
            store.checkedData = {
                [_]: []
            };
            store.responseData = {
                [_]: tableData
            };
            store.settings = {
                [_]: {
                    _,
                    checkboxConfig: {
                        useRowCheck: false,
                        useRadio: false
                    },
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
            resetData(_, true, true);
            expect(store.checkedData.test.length).toBe(10);

            // 取消全选
            resetData(_, false, true);
            expect(store.checkedData.test.length).toBe(0);
        });

        it('执行验证: 复选-单个操作', () => {
            expect(store.checkedData.test.length).toBe(0);

            // 选中一项
            resetData(_, true, false, 3);
            expect(store.checkedData.test.length).toBe(1);

            // 再选中一项
            resetData(_, true, false, 4);
            expect(store.checkedData.test.length).toBe(2);

            // 再选中一项
            resetData(_, true, false, 5);
            expect(store.checkedData.test.length).toBe(3);

            // 取消一项
            resetData(_, false, false, 5);
            expect(store.checkedData.test.length).toBe(2);
        });

        it('执行验证: 单选', () => {
            expect(store.checkedData.test.length).toBe(0);

            // 选中一项
            resetData(_, undefined, true, '3', true);
            expect(store.checkedData.test.length).toBe(1);

            // 再选中一项
            resetData(_, undefined, true, '4', true);
            expect(store.checkedData.test.length).toBe(1);
        });
    });
});
