import { GM_VERSION, TABLE_KEY, WRAP_KEY, DIV_KEY, CONFIG_KEY,
    TOOLBAR_KEY, TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY, ORDER_WIDTH,
    CHECKBOX_WIDTH, GM_PUBLISH_METHOD_LIST, TR_CACHE_KEY, COL_PROP_DISABLED,
    NO_SELECT_CLASS_NAME, EMPTY_DATA_CLASS_NAME, READY_CLASS_NAME, TABLE_PURE_LIST } from '@common/constants';

describe('常量验证', () => {
    it('GM_VERSION', () => {
        expect(GM_VERSION).toBe(process.env.VERSION);
    });

    it('TABLE_KEY', () => {
        expect(TABLE_KEY).toBe('grid-manager');
    });

    it('WRAP_KEY', () => {
        expect(WRAP_KEY).toBe('grid-manager-wrap');
    });

    it('DIV_KEY', () => {
        expect(DIV_KEY).toBe('grid-manager-div');
    });

    it('CONFIG_KEY', () => {
        expect(CONFIG_KEY).toBe('grid-manager-config');
    });

    it('TOOLBAR_KEY', () => {
        expect(TOOLBAR_KEY).toBe('grid-manager-toolbar');
    });

    it('TABLE_HEAD_KEY', () => {
        expect(TABLE_HEAD_KEY).toBe('grid-manager-thead');
    });

    it('FAKE_TABLE_HEAD_KEY', () => {
        expect(FAKE_TABLE_HEAD_KEY).toBe('grid-manager-mock-thead');
    });

    it('TR_CACHE_KEY', () => {
        expect(TR_CACHE_KEY).toBe('cache-key');
    });

    it('TR_CACHE_KEY', () => {
        expect(COL_PROP_DISABLED).toBe('gm_checkbox_disabled');
    });

    it('ORDER_WIDTH', () => {
        expect(ORDER_WIDTH).toBe('50px');
    });

    it('CHECKBOX_WIDTH', () => {
        expect(CHECKBOX_WIDTH).toBe('40px');
    });

    it('NO_SELECT_CLASS_NAME', () => {
        expect(NO_SELECT_CLASS_NAME).toBe('no-select-text');
    });

    it('EMPTY_DATA_CLASS_NAME', () => {
        expect(EMPTY_DATA_CLASS_NAME).toBe('empty-data');
    });

    it('READY_CLASS_NAME', () => {
        expect(READY_CLASS_NAME).toBe('GridManager-ready');
    });

    it('TABLE_PURE_LIST', () => {
        expect(TABLE_PURE_LIST).toEqual(['class', 'style']);
    });


    it('GM_PUBLISH_METHOD_LIST', () => {
        let list = [
            'init',
            'get',
            'version',
            'getLocalStorage',
            'resetLayout',
            'clear',
            'getRowData',
            'updateRowData',
            'setSort',
            'setConfigVisible',
            'showTh',
            'hideTh',
            'exportGridToXls',
            'setQuery',
            'setAjaxData',
            'refreshGrid',
            'getCheckedTr',
            'getCheckedData',
            'setCheckedData',
            'cleanData',
            'destroy'
        ];
        expect(GM_PUBLISH_METHOD_LIST).toEqual(list);
        list = null;
    });
});
