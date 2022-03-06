import filter from '../../src/module/filter';
import TextConfig from '../../src/module/i18n/config';
import { clearCacheDOM } from '../../src/common/domCache';

describe('filter', () => {
    describe('createHtml', () => {
        let settings = null;
        let columnFilter = null;
        let htmlStr = null;
        beforeEach(() => {
            document.body.innerHTML = '<div class="table-wrap" grid-manager-wrap="test" style="height: 500px"></div>';
            clearCacheDOM('test');
        });
        afterEach(() => {
            settings = null;
            columnFilter = null;
            htmlStr = null;
            document.body.innerHTML = '';
            clearCacheDOM('test');
        });

        it('执行验证: 单选', () => {
            htmlStr = `
            <div class="gm-filter-area">
                <i class="fa-icon gm-icon gm-icon-filter filter-selected"></i>
                <div class="fa-con">
                    <ul class="filter-list">
                        <li class="filter-radio">
                            <label class="gm-radio-wrapper">
                                <span class="gm-radio-checkbox gm-radio">
                                    <input type="radio" class="gm-radio-checkbox-input gm-radio-input" value="1"/>
                                    <span class="gm-radio-checkbox-inner gm-radio-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">HTML</span>
                            </label>
                        </li>
                        <li class="filter-radio">
                            <label class="gm-radio-wrapper">
                                <span class="gm-radio-checkbox gm-radio">
                                    <input type="radio" class="gm-radio-checkbox-input gm-radio-input" value="2"/>
                                    <span class="gm-radio-checkbox-inner gm-radio-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">CSS</span>
                            </label>
                        </li>
                        <li class="filter-radio">
                            <label class="gm-radio-wrapper">
                                <span class="gm-radio-checkbox gm-radio gm-radio-checked">
                                    <input type="radio" class="gm-radio-checkbox-input gm-radio-input" value="3" checked="true"/>
                                    <span class="gm-radio-checkbox-inner gm-radio-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">javaScript</span>
                            </label>
                        </li>
                    </ul>
                    <div class="filter-bottom">
                        <span class="filter-button filter-submit">确定</span>
                        <span class="filter-button filter-reset">重置</span>
                    </div>
                </div>
            </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig()
            };
            columnFilter = {
                option: [
                    {value: '1', text: 'HTML'},
                    {value: '2', text: 'CSS'},
                    {value: '3', text: 'javaScript'}
                ],
                selected: '3',
                isMultiple: false
            };
            expect(filter.createHtml({ settings, columnFilter }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 复选', () => {
            htmlStr = `
            <div class="gm-filter-area">
                <i class="fa-icon gm-icon gm-icon-filter filter-selected"></i>
                <div class="fa-con">
                    <ul class="filter-list">
                        <li class="filter-checkbox">
                            <label class="gm-checkbox-wrapper">
                                <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="1" checked="true"/>
                                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">HTML</span>
                            </label>
                        </li>
                        <li class="filter-checkbox">
                            <label class="gm-checkbox-wrapper">
                                <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="2" checked="true"/>
                                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">CSS</span>
                            </label>
                        </li>
                        <li class="filter-checkbox">
                            <label class="gm-checkbox-wrapper">
                                <span class="gm-radio-checkbox gm-checkbox">
                                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="3"/>
                                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">javaScript</span>
                            </label>
                        </li>
                    </ul>
                    <div class="filter-bottom">
                        <span class="filter-button filter-submit">确定</span>
                        <span class="filter-button filter-reset">重置</span>
                    </div>
                </div>
            </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig()
            };
            columnFilter = {
                option: [
                    {value: '1', text: 'HTML'},
                    {value: '2', text: 'CSS'},
                    {value: '3', text: 'javaScript'}
                ],
                selected: '1,2',
                isMultiple: true
            };
            expect(filter.createHtml({ settings, columnFilter }).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('执行验证: 复选无选中', () => {
            htmlStr = `
            <div class="gm-filter-area">
                <i class="fa-icon gm-icon gm-icon-filter"></i>
                <div class="fa-con">
                    <ul class="filter-list">
                        <li class="filter-checkbox">
                            <label class="gm-checkbox-wrapper">
                                <span class="gm-radio-checkbox gm-checkbox">
                                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="1"/>
                                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">HTML</span>
                            </label>
                        </li>
                        <li class="filter-checkbox">
                            <label class="gm-checkbox-wrapper">
                                <span class="gm-radio-checkbox gm-checkbox">
                                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="2"/>
                                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">CSS</span>
                            </label>
                        </li>
                        <li class="filter-checkbox">
                            <label class="gm-checkbox-wrapper">
                                <span class="gm-radio-checkbox gm-checkbox">
                                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="3"/>
                                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                                </span>
                                <span class="gm-radio-checkbox-label">javaScript</span>
                            </label>
                        </li>
                    </ul>
                    <div class="filter-bottom">
                        <span class="filter-button filter-submit">确定</span>
                        <span class="filter-button filter-reset">重置</span>
                    </div>
                </div>
            </div>
            `.replace(/\s/g, '');
            settings = {
                _: 'test',
                i18n: 'zh-cn',
                textConfig: new TextConfig()
            };
            columnFilter = {
                option: [
                    {value: '1', text: 'HTML'},
                    {value: '2', text: 'CSS'},
                    {value: '3', text: 'javaScript'}
                ],
                selected: '',
                isMultiple: true
            };
            expect(filter.createHtml({ settings, columnFilter }).replace(/\s/g, '')).toBe(htmlStr);
        });
    });

});
