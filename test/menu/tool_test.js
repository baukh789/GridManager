import jTool from '../../src/jTool';
import { getMenuQuerySelector, createMenuDom, clearMenuDOM, getMenuPosition } from '../../src/module/menu/tool';
import { eventMap, getEvent } from '../../src/module/menu/event';
import { MENU_KEY } from '../../src/common/constants';
import Store from '../../src/common/Store';
import TextConfig from '../../src/module/i18n/config';

describe('menu tool', () => {
    describe('getMenuQuerySelector', () => {
        it('基础验证', () => {
            expect(getMenuQuerySelector).toBeDefined();
            expect(getMenuQuerySelector.length).toBe(1);
        });

        it('执行验证', () => {
            expect(getMenuQuerySelector('test')).toBe(`[${MENU_KEY}="test"]`);
        });
    });

    describe('createMenuDom and clearMenuDOM', () => {
        let $menu = null;
        beforeEach(() => {
            document.body.innerHTML = '';
        });
        afterEach(() => {
            delete eventMap.test;
            delete Store.settings.test;
            $menu = null;
            document.body.innerHTML = '';
        });
        it('基础验证', () => {
            expect(createMenuDom).toBeDefined();
            expect(createMenuDom.length).toBe(2);
            expect(clearMenuDOM).toBeDefined();
            expect(clearMenuDOM.length).toBe(1);
        });

        it('执行验证: 仅有重新加载项', () => {
            Store.settings.test = {
                textConfig: new TextConfig(),
                menuHandler: list => list
            };
            eventMap.test = getEvent('test', '#baukh');
            $menu = createMenuDom('test');
            expect($menu.length).toBe(1);
            expect($menu.attr('grid-master')).toBe('test');

            expect($menu.find('[menu-action]').length).toBe(1);

            expect(jTool(getMenuQuerySelector('test')).length).toBe(1);
            clearMenuDOM('test');
            expect(jTool(getMenuQuerySelector('test')).length).toBe(0);
        });

        it('执行验证: 所有项开启', () => {
            Store.settings.test = {
                supportAjaxPage: true,
                supportExport: true,
                supportConfig: true,
                supportPrint: true,
                useCellFocus: true,
                useHideRow: true,
                textConfig: new TextConfig(),
                pageData: {
                    pSize: 20,
                    cPage: 1,
                    tPage: 3,
                    tSize: 54
                },
                menuHandler: list => {
                    return list;
                }
            };
            eventMap.test = getEvent('test', '#baukh');
            $menu = createMenuDom('test');
            expect($menu.length).toBe(1);
            expect($menu.attr('grid-master')).toBe('test');

            expect($menu.find('[menu-action]').length).toBe(9);
            expect($menu.find('.menu-line').length).toBe(1);

            expect(jTool(getMenuQuerySelector('test')).length).toBe(1);
            clearMenuDOM('test');
            expect(jTool(getMenuQuerySelector('test')).length).toBe(0);
        });

        it('执行验证: 通过menuHandler修改渲染数据', () => {
            Store.settings.test = {
                supportAjaxPage: true,
                supportExport: true,
                supportConfig: true,
                supportPrint: true,
                useCellFocus: true,
                useHideRow: true,
                textConfig: new TextConfig(),
                pageData: {
                    pSize: 20,
                    cPage: 1,
                    tPage: 3,
                    tSize: 54
                },
                menuHandler: list => {
                    list[3].line = true;
                    list.pop();
                    return list;
                }
            };
            eventMap.test = getEvent('test', '#baukh');
            $menu = createMenuDom('test', window.event);
            expect($menu.length).toBe(1);
            expect($menu.attr('grid-master')).toBe('test');

            expect($menu.find('[menu-action]').length).toBe(8);
            expect($menu.find('.menu-line').length).toBe(2);

            expect(jTool(getMenuQuerySelector('test')).length).toBe(1);
            clearMenuDOM('test');
            expect(jTool(getMenuQuerySelector('test')).length).toBe(0);
        });
    });

    describe('getMenuPosition', () => {
        let position = null;
        beforeEach(() => {

            document.head.innerHTML = `
                <style type="text/css">
                    html, body{
                        width: 600px;
                        height: 400px;
                        margin: 0;
                        padding: 0;
                    }
                    body{
                        width: 100%;
                        height: 100%;
                    }
                </style>
            `;
            document.body.innerHTML = '';
        });
        afterEach(() => {
            document.head.innerHTML = '';
            document.body.innerHTML = '';
            position = null;
        });
        it('基础验证', () => {
            expect(getMenuPosition).toBeDefined();
            expect(getMenuPosition.length).toBe(4);
        });

        it('执行验证: 右下侧宽高允许', () => {
            position = getMenuPosition(100, 100, 200, 200);
            expect(position.left).toBe(200);
            expect(position.top).toBe(200);
        });

        it('执行验证: 右下侧宽高不足', () => {
            // 高度不足
            position = getMenuPosition(100, 100, 200, 400);
            expect(position.left).toBe(200);
            expect(position.top).toBe(300);

            // 宽度不足
            position = getMenuPosition(100, 100, 550, 200);
            expect(position.left).toBe(450);
            expect(position.top).toBe(200);
        });

        it('执行验证: 存在滚动轴的情况', () => {
            document.documentElement.style.width = '600px';
            document.documentElement.style.height = '400px';
            document.body.innerHTML = '<div style="width: 800px;height: 800px"></div>';

            // 当前滚轴为0
            document.body.scrollTop = 0;
            document.body.scrollLeft = 0;
            position = getMenuPosition(100, 100, 200, 200);
            expect(position.left).toBe(200);
            expect(position.top).toBe(200);

            // 当前滚动不为0但可以容纳下dom
            document.body.scrollTop = 300;
            document.body.scrollLeft = 200;
            position = getMenuPosition(100, 100, 200, 200);
            expect(position.left).toBe(200);
            expect(position.top).toBe(200);

            // 当前滚动不为0 且不能容纳dom
            position = getMenuPosition(100, 100, 550, 350);
            expect(position.left).toBe(450);
            expect(position.top).toBe(250);

            document.body.scrollTop = 0;
            document.body.scrollLeft = 0;
        });
    });
});
