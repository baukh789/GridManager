import config from '../../src/module/config';
import { CONFIG_KEY } from '../../src/common/constants';
import tpl from '../table-test.tpl.html';

describe('config', () => {
    describe('createHtml', () => {
        let params = null;
        let htmlStr = null;
        beforeEach(() => {
        });
        afterEach(() => {
            params = null;
            htmlStr = null;
        });

        it('返回值验证', () => {
            htmlStr = `
            <div class="gm-config-area" ${CONFIG_KEY}="test">
                <span class="config-action">
                    <i class="gm-icon gm-icon-close"></i>
                </span>
                <div class="config-info">we are team</div>
                <ul class="config-list"></ul>
            </div>
            `.replace(/\s/g, '');
            params = {
                _: 'test',
                configInfo: 'we are team'
            };
            expect(config.createHtml(params).replace(/\s/g, '')).toBe(htmlStr);
        });
    });

    describe('createColumn', () => {
        let params = null;
        let htmlStr = null;
        beforeEach(() => {
        });
        afterEach(() => {
            params = null;
            htmlStr = null;
        });

        it('isShow: true', () => {
            htmlStr = `
            <li th-name="title" class="checked-li">
                <label class="gm-checkbox-wrapper">
                    <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                        <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" checked="true"/>
                        <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                    </span>
                    <span class="gm-radio-checkbox-label">we are team</span>
                </label>
            </li>
            `.replace(/\s/g, '');
            params = {
                label: 'we are team',
                key: 'title',
                isShow: true
            };
            expect(config.createColumn(params).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('isShow: false', () => {
            htmlStr = `
            <li th-name="title">
                <label class="gm-checkbox-wrapper">
                    <span class="gm-radio-checkbox gm-checkbox">
                        <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/>
                        <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                    </span>
                    <span class="gm-radio-checkbox-label">we are team</span>
                </label>
            </li>
            `.replace(/\s/g, '');
            params = {
                label: 'we are team',
                key: 'title',
                isShow: false
            };
            expect(config.createColumn(params).replace(/\s/g, '')).toBe(htmlStr);
        });
    });

    describe('hide', () => {
        let dom = null;
        beforeEach(() => {
            document.body.innerHTML = tpl;
            document.head.innerHTML = `
                <style type="text/css">
                    .gm-config-area{
                        display: none;
                    }
                </style>
            `;
            dom = document.querySelector(`[${CONFIG_KEY}="test"]`);
        });
        afterEach(() => {
            dom = null;
            document.body.innerHTML = '';
            document.head.innerHTML = '';
        });

        it('执行验证', () => {
            dom.style.display = 'block';
            expect(getComputedStyle(dom).display).toBe('block');

            config.hide('test');
            expect(getComputedStyle(dom).display).toBe('none');
        });
    });
});
