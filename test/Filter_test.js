import Filter from '../src/js/Filter';
import { Settings, TextSettings} from '../src/js/Settings';
import I18n from "../src/js/I18n";

/**
 * 验证类的属性及方法总量
 */
describe('Filter 验证类的属性及方法总量', function() {
    var getPropertyCount = null;
    beforeEach(function() {
        getPropertyCount = function(o){
            var n, count = 0;
            for(n in o){
                if(o.hasOwnProperty(n)){
                    count++;
                }
            }
            return count;
        }
    });
    afterEach(function(){
        getPropertyCount = null;
    });
    it('Function count', function() {
        // es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Filter)))).toBe(4 + 1);
    });
});

describe('Filter.enable', function() {
    it('初始值验证', function() {
        expect(Filter.enable).toBeDefined();
        expect(Filter.enable).toBe(false);
    });
});

describe('Filter.init($table)', function() {
    it('基础验证', function() {
        expect(Filter.init).toBeDefined();
        expect(Filter.init.length).toBe(1);
    });
});

describe('Filter.createHtml(settings, filter)', function() {
    it('基础验证', function() {
        expect(Filter.createHtml).toBeDefined();
        expect(Filter.createHtml.length).toBe(2);
    });

    it('返回值验证', function() {
        let settings = new Settings();
        settings.textConfig = new TextSettings();
        settings.gridManagerName = 'test-filter';
        let filter = {
            option: [
                {value: '1', text: 'HTML/CSS'},
                {value: '2', text: 'nodeJS'}
            ],
            // 选中的过滤条件将会覆盖query
            selected: '1',
            isMultiple: true
        };
        let FilterHtml = `<div class="filter-action">
                    <i class="fa-icon iconfont icon-filter"></i>
                    <div class="fa-con">
                        <ul class="filter-list">
                            <li>
                                <label>
                                    <input class="filter-value" name="filter-value" type="checkbox" checked="true" value="1"/>
                                    <span class="filter-text">HTML/CSS</span>
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input class="filter-value" name="filter-value" type="checkbox" value="2"/>
                                    <span class="filter-text">nodeJS</span>
                                </label>
                            </li>
                        </ul>
                        <div class="filter-bottom">
                            <span class="filter-button filter-submit">${I18n.i18nText(settings, 'filter-ok')}</span>
                            <span class="filter-button filter-reset">${I18n.i18nText(settings, 'filter-reset')}</span>
                        </div>
                    </div>
                </div>`;

        expect(Filter.createHtml(settings, filter).replace(/\s/g, '')).toBe(FilterHtml.replace(/\s/g, ''));
        settings = null;
        filter = null;
        FilterHtml = null;
    });
});

describe('Filter.__bindFilterEvent($table)', function() {
    it('基础验证', function() {
        expect(Filter.__bindFilterEvent).toBeDefined();
        expect(Filter.__bindFilterEvent.length).toBe(1);
    });
});

describe('Filter.destroy($table)', function() {
    it('基础验证', function() {
        expect(Filter.destroy).toBeDefined();
        expect(Filter.destroy.length).toBe(1);
    });
});
