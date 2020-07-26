import jTool from '../../src/jTool';
import remind, { removeTooltip, tooltip } from '../../src/module/remind';
import tpl from '../table-test.tpl.html';
import { clearCacheDOM } from '../../src/common/domCache';

describe('remind', () => {
    describe('removeTooltip', () => {
        beforeEach(() => {
            clearCacheDOM('test');
            document.body.innerHTML = '<div class="table-div" grid-manager-div="test"><div class="gm-tooltip"></div></div>';
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
        it('执行验证', () => {
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(1);
            removeTooltip('test');
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);
        });
    });
    describe('tooltip', () => {
        let conf;
        let dom;
        let callback;
        beforeEach(() => {
            clearCacheDOM('test');
            document.head.innerHTML = `
                <style type="text/css">
                    .gm-tooltip{
                        display: block;
                        width: auto;
                    }
                </style>
            `;
            document.body.innerHTML = tpl;
        });
        afterEach(() => {
            document.body.innerHTML = '';
            conf = null;
            dom = null;
            callback = null;
        });
        it('conf === undefined', () => {
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);

            tooltip('test', document.querySelector('tbody tr'), conf);
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);
        });

        it('dom === tr', () => {
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);

            dom = document.querySelector('tbody tr');
            conf = {
                text: 'hi tooltip',
                position: 'left'
            };
            tooltip('test', dom, conf);
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(1);
            expect(document.querySelectorAll('.gm-tooltip.right-model').length).toBe(0);
            expect(document.querySelector('.gm-tooltip').innerHTML).toBe('hi tooltip');
            expect(getComputedStyle(document.querySelector('.gm-tooltip')).height).toBe('30px');

            // 再次用不同的参数重复执行
            conf = {
                text: 'hi tooltip',
                position: 'right'
            };
            tooltip('test', dom, conf);
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(1);
            expect(document.querySelectorAll('.gm-tooltip.right-model').length).toBe(1);
            expect(document.querySelector('.gm-tooltip').innerHTML).toBe('hi tooltip');

            // 触发鼠标移出
            dom.dispatchEvent(new Event('mouseleave'));
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);
        });

        it('dom === td', () => {
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);

            dom = document.querySelector('tbody td');
            conf = {
                text: 'hi tooltip',
                position: 'left'
            };
            tooltip('test', dom, conf);
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(1);

            // 触发鼠标移出
            dom.dispatchEvent(new Event('mouseleave'));
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);
        });


        it('callback 存在', () => {
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);

            dom = document.querySelector('tbody td');
            conf = {
                text: 'hi tooltip',
                position: 'left'
            };
            callback = jasmine.createSpy('callback');
            tooltip('test', dom, conf, callback);
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(1);

            // 触发鼠标移出
            dom.dispatchEvent(new Event('mouseleave'));
            expect(callback.calls.count()).toBe(1);
            expect(document.querySelectorAll('.gm-tooltip').length).toBe(0);
        });
    });

    describe('createHtml', () => {
        let params;
        let htmlStr;
        beforeEach(() => {
        });
        afterEach(() => {
            params = null;
            htmlStr = null;
        });
        it('remind === string', () => {
            params = {
                remind: 'hi, remind'
            };
            htmlStr = `
                <div class="gm-remind-action">
                    <i class="ra-icon gm-icon gm-icon-help"></i>
                    <div class="ra-area" >hi, remind</div>
                </div>`.replace(/\s/g, '');
            expect(remind.createHtml(params).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('remind === object', () => {
            params = {
                remind: {
                    text: 'hi, remind'
                }
            };
            htmlStr = `
                <div class="gm-remind-action">
                    <i class="ra-icon gm-icon gm-icon-help"></i>
                    <div class="ra-area" >hi, remind</div>
                </div>`.replace(/\s/g, '');
            expect(remind.createHtml(params).replace(/\s/g, '')).toBe(htmlStr);

            // 包含style
            params = {
                remind: {
                    text: 'hi, remind',
                    style: {
                        height: '100px',
                        color: 'red'
                    }
                }
            };
            htmlStr = `
                <div class="gm-remind-action">
                    <i class="ra-icon gm-icon gm-icon-help"></i>
                    <div class="ra-area" style="height:100px;color:red;">hi, remind</div>
                </div>`.replace(/\s/g, '');
            expect(remind.createHtml(params).replace(/\s/g, '')).toBe(htmlStr);
        });
    });
});
