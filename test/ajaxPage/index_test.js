import jTool from '@jTool';
import ajaxPage from '@module/ajaxPage';
import i18n from '@module/i18n';
import TextConfig from '@module/i18n/config';
import {DISABLED_CLASS_NAME, TOOLBAR_KEY} from '@common/constants';
import tableTestTpl from '@test/table-test.tpl.html';
import {getQuerySelector} from '@module/ajaxPage/tool';

describe('ajaxPage', () => {
    describe('createHtml', () => {
        let settings = null;
        let str = null;
        beforeEach(() => {
        });
        afterEach(() => {
            settings = null;
            str = null;
        });

        it('基础验证', () => {
            expect(ajaxPage.createHtml).toBeDefined();
            expect(ajaxPage.createHtml.length).toBe(1);
        });

        it('执行验证', () => {
            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig(),
                sizeData: [10, 20, 50],
                pageData: {
                    pSize: 20,
                    cPage: 1,
                    tPage: 3,
                    tSize: 54
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            str = `
            <div class="gm-toolbar" ${TOOLBAR_KEY}="test">
                <span class="refresh-action"><i class="gm-icon gm-icon-refresh"></i></span>
                <div class="goto-page">
                    ${i18n(settings, 'goto-first-text')}
                    <input type="text" class="gp-input" current-page-info/>
                    ${i18n(settings, 'goto-last-text')}
                </div>
                <div class="change-size">
                    <div class="gm-dropdown">
                        <span class="gm-dropdown-text"></span>
                        <span class="gm-dropdown-icon"></span>
                        <ul class="gm-dropdown-list">
                            <li value="10">10</li>
                            <li value="20">20</li>
                            <li value="50">50</li>
                        </ul>
                    </div>
                </div>
                <div class="toolbar-info checked-info"></div>
                <div class="toolbar-info page-info"></div>
                <div class="pagination">
                    <ul pagination-before>
                        <li class="first-page">
                            ${i18n(settings, 'first-page')}
                        </li>
                        <li class="previous-page">
                            ${i18n(settings, 'previous-page')}
                        </li>
                    </ul>
                    <ul pagination-number></ul>
                    <ul pagination-after>
                        <li class="next-page">
                            ${i18n(settings, 'next-page')}
                        </li>
                        <li class="last-page">
                            ${i18n(settings, 'last-page')}
                        </li>
                    </ul>
                </div>
            </div>
            `;
            expect(ajaxPage.createHtml({settings}).replace(/\s/g, '')).toBe(str.replace(/\s/g, ''));
        });
    });
    describe('resetPageData', () => {
        let settings;
        let $footerToolbar;
        let $firstPage;
        let $previousPage;
        let $nextPage;
        let $lastPage;
        let $pageInfo;
        let $beginNumber;
        let $endNumber;
        let $currentPage;
        let $totalsNumber;
        let $totalsPage;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            $footerToolbar = jTool(getQuerySelector('test'));
            $firstPage = jTool('[pagination-before] .first-page', $footerToolbar);
            $previousPage = jTool('[pagination-before] .previous-page', $footerToolbar);
            $nextPage = jTool('[pagination-after] .next-page', $footerToolbar);
            $lastPage = jTool('[pagination-after] .last-page', $footerToolbar);
            $pageInfo = jTool('.page-info', $footerToolbar);

        });
        afterEach(() => {
            settings = null;
            $footerToolbar = null;
            $firstPage = null;
            $previousPage = null;
            $nextPage = null;
            $lastPage = null;
            $pageInfo = null;
            $beginNumber = null;
            $endNumber = null;
            $currentPage = null;
            $totalsNumber = null;
            $totalsPage = null;
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(ajaxPage.resetPageData).toBeDefined();
            expect(ajaxPage.resetPageData.length).toBe(3);
        });

        it('执行验证', () => {
            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig(),
                sizeData: [10, 20, 50],
                pageData: {
                    pSize: 20,
                    cPage: 3
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };

            // 使用table-test.tpl.html中的数据
            expect($firstPage.hasClass(DISABLED_CLASS_NAME)).toBe(true);
            expect($previousPage.hasClass(DISABLED_CLASS_NAME)).toBe(true);
            expect($nextPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($lastPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($pageInfo.html().replace(/\s/g, '')).toBe('此页显示 1-10<span class="page-info-totals">共54条</span>'.replace(/\s/g, ''));

            // 当前页为首页
            ajaxPage.resetPageData(settings, 100);
            expect($firstPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($previousPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($nextPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($lastPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($pageInfo.html().replace(/\s/g, '')).toBe('此页显示 41-60<span class="page-info-totals">共100条</span>'.replace(/\s/g, ''));

            // 当前页为尾页
            ajaxPage.resetPageData(settings, 50);
            expect($firstPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($previousPage.hasClass(DISABLED_CLASS_NAME)).toBe(false);
            expect($nextPage.hasClass(DISABLED_CLASS_NAME)).toBe(true);
            expect($lastPage.hasClass(DISABLED_CLASS_NAME)).toBe(true);
            expect($pageInfo.html().replace(/\s/g, '')).toBe('此页显示 41-60<span class="page-info-totals">共50条</span>'.replace(/\s/g, ''));

        });

        it('验证实时更新', () => {
            $beginNumber = jTool('[begin-number-info]', $footerToolbar);
            $endNumber = jTool('[end-number-info]', $footerToolbar);
            $currentPage = jTool('[current-page-info]', $footerToolbar);
            $totalsNumber = jTool('[totals-number-info]', $footerToolbar);
            $totalsPage = jTool('[totals-page-info]', $footerToolbar);

            // 由于gm自身并未全部用到，所以有些在dom节点中并不存在
            expect($beginNumber.length).toBe(0);
            expect($endNumber.length).toBe(0);
            expect($currentPage.length).toBe(1);
            expect($totalsNumber.length).toBe(0);
            expect($totalsPage.length).toBe(0);

            // 模拟以html形式植入有效区域
            $footerToolbar.html(`
                <span begin-number-info></span>
                <span end-number-info></span>
                <span current-page-info></span>
                <span totals-number-info></span>
                <span totals-page-info></span>
            `);
            $beginNumber = jTool('[begin-number-info]', $footerToolbar);
            $endNumber = jTool('[end-number-info]', $footerToolbar);
            $currentPage = jTool('[current-page-info]', $footerToolbar);
            $totalsNumber = jTool('[totals-number-info]', $footerToolbar);
            $totalsPage = jTool('[totals-page-info]', $footerToolbar);

            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig(),
                sizeData: [10, 20, 50],
                pageData: {
                    pSize: 20,
                    cPage: 3
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            ajaxPage.resetPageData(settings, 100);
            expect($beginNumber.html()).toBe('41');
            expect($beginNumber.val()).toBe(41);
            expect($endNumber.html()).toBe('60');
            expect($endNumber.val()).toBe(60);
            expect($currentPage.html()).toBe('3');
            expect($currentPage.val()).toBe(3);
            expect($totalsNumber.html()).toBe('100');
            expect($totalsNumber.val()).toBe(100);
            expect($totalsPage.html()).toBe('5');
            expect($totalsPage.val()).toBe(5);

            // 以value形式植入html
            $footerToolbar.html(`
                <input begin-number-info/>
                <input end-number-info/>
                <input current-page-info/>
                <input totals-number-info/>
                <input totals-page-info/>
            `);
            $beginNumber = jTool('[begin-number-info]', $footerToolbar);
            $endNumber = jTool('[end-number-info]', $footerToolbar);
            $currentPage = jTool('[current-page-info]', $footerToolbar);
            $totalsNumber = jTool('[totals-number-info]', $footerToolbar);
            $totalsPage = jTool('[totals-page-info]', $footerToolbar);

            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig(),
                sizeData: [10, 20, 50],
                pageData: {
                    pSize: 20,
                    cPage: 2
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            ajaxPage.resetPageData(settings, 50);
            expect($beginNumber.html()).toBe('');
            expect($beginNumber.val()).toBe('21');
            expect($endNumber.html()).toBe('');
            expect($endNumber.val()).toBe('40');
            expect($currentPage.html()).toBe('');
            expect($currentPage.val()).toBe('2');
            expect($totalsNumber.html()).toBe('');
            expect($totalsNumber.val()).toBe('50');
            expect($totalsPage.html()).toBe('');
            expect($totalsPage.val()).toBe('3');
        });
    });
});
